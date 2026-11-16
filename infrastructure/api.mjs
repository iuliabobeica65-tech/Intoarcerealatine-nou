import {HttpError,json,now,hash,keyedHash,email,name,origin,body,guard,sandbox,admin,limitedText} from './security.mjs';
import {requestDoi,DOI_CLAIM_SQL} from './brevo.mjs';
import {stripe,verifyStripe,reconcilePayment} from './payments.mjs';
import {enqueue,lifecycleTemplate,scheduleReminders,prepareReminders,cancelRegistration} from './operations.mjs';
import {readAdministration,validateEventChange} from './event-admin.mjs';
import {isolatedRecipient,doiList} from './test-isolation.mjs';
import {googleAppointmentUrl} from './appointments.mjs';
import {collectionOnly,assertCollectionConfiguration,collectionSourcePath,COLLECTION_CONSENT_VERSION,COLLECTION_CONSENT_TEXT} from './newsletter.mjs';
export const CONSENT_VERSION='community-2026-11-08-v1';
export const CONSENT_TEXT='Sunt de acord să primesc prin e-mail noutăți, invitații și oferte de la Iulia Bobeica – Echilibrarea Rădăcinilor. Îmi pot retrage acordul oricând prin linkul de dezabonare.';
function enabled(env,flag){if(env[flag]!=='true')throw new HttpError(503,'not_configured');if(!env.DB)throw new HttpError(503,'not_configured');}
const duplicateRegistration=()=>json({status:'already_requested',message:'Dacă ai o înscriere, folosește confirmarea primită sau contactează organizatoarea.'},202);
async function registration(env,token){
 if(typeof token!=='string'||token.length<32||token.length>100)throw new HttpError(403,'invalid_token');
 const row=await env.DB.prepare('SELECT r.*,o.title,o.kind,o.status AS offering_status,o.starts_at,o.ends_at,o.access_url,o.location,o.revision,o.price_test_id,o.amount,o.currency,p.status AS payment_status FROM registrations r JOIN offerings o ON o.id=r.offering_id LEFT JOIN orders p ON p.registration_id=r.id WHERE r.token_hash=?').bind(await hash(token)).first();
 if(!row)throw new HttpError(403,'invalid_token');return row;
}
export async function route(request,env) {
 const path=new URL(request.url).pathname.replace(/\/$/,'');
 if(path==='/api/config'&&request.method==='GET'){
  let whatsapp=null;try{const u=new URL(env.WHATSAPP_COMMUNITY_URL);if(u.protocol==='https:'&&u.hostname==='chat.whatsapp.com'&&!u.username&&!u.password)whatsapp=u.href;}catch{}
  let community=env.COMMUNITY_ENABLED==='true';if(collectionOnly(env)){try{assertCollectionConfiguration(env);}catch{community=false;}}
  return json({community,events:env.REGISTRATIONS_ENABLED==='true',turnstileSiteKey:env.TURNSTILE_SITE_KEY||null,whatsapp,googleAppointmentUrl:googleAppointmentUrl(env),consentVersion:collectionOnly(env)?COLLECTION_CONSENT_VERSION:CONSENT_VERSION,consentText:collectionOnly(env)?COLLECTION_CONSENT_TEXT:CONSENT_TEXT});
 }
 if(path==='/api/community'){
  enabled(env,'COMMUNITY_ENABLED');assertCollectionConfiguration(env);const input=await body(request,env);
  const address=email(input.email),firstName=collectionOnly(env)?'':name(input.name);
  const sourcePath=collectionOnly(env)?collectionSourcePath(input.formSource):undefined;
  isolatedRecipient(env,address);
  doiList(env); // Validate the isolated target before any database or network work.
  const consentVersion=collectionOnly(env)?COLLECTION_CONSENT_VERSION:CONSENT_VERSION;
  if(input.consent!==true||input.consentVersion!==consentVersion)throw new HttpError(400,'consent_required');
  await guard(request,env,input);
  const emailHash=await keyedHash(env.DATA_HMAC_KEY,address),time=now(),id=crypto.randomUUID();
  // Daily uniqueness plus atomic rolling 24h guard; no contact existence disclosure.
  const recent=await env.DB.prepare("SELECT id FROM consent_requests WHERE email_hash=? AND requested_at>? AND status IN ('pending','submitted')").bind(emailHash,time-86400).first();
  if(recent)return json({status:'check_email'},202);
  const claim=await env.DB.prepare(DOI_CLAIM_SQL).bind(id,emailHash,consentVersion,time,Math.floor(time/86400),emailHash,time-86400).first();
  if(!claim)return json({status:'check_email'},202);
  try{
   await requestDoi(env,{email:address,name:firstName,version:consentVersion,requestedAt:time,sourcePath},origin(env));
   await env.DB.prepare("UPDATE consent_requests SET status='submitted' WHERE id=?").bind(id).run();
  }catch(error){
   // A timeout/5xx/invalid acknowledgement can follow actual delivery. Retain the
   // unresolved claim to suppress a blind resend across the UTC day boundary.
   const status=!(error instanceof HttpError)||error.deliveryUncertain===true?'pending':'failed';
   await env.DB.prepare('UPDATE consent_requests SET status=? WHERE id=?').bind(status,id).run();throw error;
  }
  return json({status:'check_email'},202);
 }
 if(path==='/api/events'&&request.method==='GET'){
  enabled(env,'REGISTRATIONS_ENABLED');
  const result=await env.DB.prepare("SELECT id,kind,title,starts_at,ends_at,timezone,location,capacity,(SELECT count(*) FROM registrations r WHERE r.offering_id=o.id AND r.status IN ('reserved','confirmed')) AS occupied FROM offerings o WHERE status='open' AND starts_at>? ORDER BY starts_at LIMIT 100").bind(now()).all();
  return json({events:result.results.map(row=>({...row,available:Math.max(0,row.capacity-row.occupied)}))});
 }
 if(path==='/api/register'){
  enabled(env,'REGISTRATIONS_ENABLED');const input=await body(request,env);
  const address=email(input.email),firstName=name(input.name);
  isolatedRecipient(env,address);
  await guard(request,env,input);
  if(typeof input.offeringId!=='string'||input.offeringId.length>100||input.administrative!==true)throw new HttpError(400,'invalid_registration');
  const offering=await env.DB.prepare("SELECT * FROM offerings WHERE id=? AND status='open' AND starts_at>?").bind(input.offeringId,now()).first();
  if(!offering)throw new HttpError(409,'unavailable');
  const token=crypto.randomUUID()+crypto.randomUUID(),id=crypto.randomUUID();
  const existing=await env.DB.prepare('SELECT id FROM registrations WHERE offering_id=? AND email=?').bind(offering.id,address).first();
  if(existing)return duplicateRegistration();
  try{
   await env.DB.batch([
    env.DB.prepare('INSERT INTO registrations(id,offering_id,email,name,token_hash,status,created_at) VALUES(?,?,?,?,?,?,?)').bind(id,offering.id,address,firstName,await hash(token),offering.price_test_id?'reserved':'confirmed',now()),
    enqueue(env,id,lifecycleTemplate(offering.kind,'confirmation'),offering.revision)
   ]);
  }catch(error){
   if(/unavailable|UNIQUE/.test(error.message)){
    // A concurrent duplicate may lose the INSERT race after the first read.
    if(await env.DB.prepare('SELECT id FROM registrations WHERE offering_id=? AND email=?').bind(offering.id,address).first())return duplicateRegistration();
    throw new HttpError(409,'unavailable');
   }
   throw error;
  }
  // Capability token returned only to this browser, never in URL, logs or marketing data.
  return json({status:offering.price_test_id?'reserved':'confirmed',token},201);
 }
 if(['/api/registration','/api/cancel','/api/checkout'].includes(path)){
  enabled(env,'REGISTRATIONS_ENABLED');const input=await body(request,env);const row=await registration(env,input.token);
  if(path==='/api/registration')return json({title:row.title,status:row.status,payment:row.payment_status||null,startsAt:row.starts_at,accessUrl:row.status==='confirmed'&&['open','closed'].includes(row.offering_status)&&(!row.price_test_id||row.payment_status==='paid')?row.access_url:null});
  if(path==='/api/cancel'){
   if(row.status==='completed')throw new HttpError(409,'registration_completed');
   if(row.status==='cancelled')return json({status:'cancelled',refund:'Contactează organizatoarea pentru regulile de rambursare.'});
   await cancelRegistration(env,row);
   return json({status:'cancelled',refund:'Contactează organizatoarea pentru regulile de rambursare.'});
  }
  sandbox(env);
  if(row.status!=='reserved'||!['open','closed'].includes(row.offering_status)||row.starts_at<=now()||!row.price_test_id||!Number.isSafeInteger(row.amount)||row.amount<=0||! /^[a-z]{3}$/.test(row.currency||''))throw new HttpError(409,'checkout_unavailable');
  const orderId=crypto.randomUUID();
  await env.DB.prepare("INSERT OR IGNORE INTO orders(id,registration_id,amount,currency,status,updated_at) VALUES(?,?,?,?,'created',?)").bind(orderId,row.id,row.amount,row.currency,now()).run();
  const order=await env.DB.prepare('SELECT * FROM orders WHERE registration_id=?').bind(row.id).first();
  if(!['created','pending'].includes(order.status))throw new HttpError(409,'checkout_unavailable');
  const price=await stripe(env,`prices/${encodeURIComponent(row.price_test_id)}`);
  if(price.livemode!==false||!price.active||price.recurring||price.unit_amount!==order.amount||price.currency!==order.currency)throw new HttpError(409,'price_mismatch');
  const session=await stripe(env,'checkout/sessions',{
   mode:'payment',client_reference_id:order.id,customer_email:row.email,
   'line_items[0][price]':row.price_test_id,'line_items[0][quantity]':'1',
   success_url:origin(env)+'/evenimente?plata=verificare',cancel_url:origin(env)+'/evenimente?plata=intrerupta'
  },`checkout-${order.id}`);
  if(session.livemode!==false||!session.url?.startsWith('https://checkout.stripe.com/'))throw new HttpError(502,'invalid_checkout');
  await env.DB.prepare('UPDATE orders SET session_id=?,updated_at=? WHERE id=?').bind(session.id,now(),order.id).run();
  return json({url:session.url,mode:'test'});
 }
 if(path==='/api/stripe-webhook'){
  if(request.method!=='POST')throw new HttpError(405,'method');sandbox(env);
  const raw=await limitedText(request,262144);
  const event=await verifyStripe(raw,request.headers.get('stripe-signature'),env.STRIPE_WEBHOOK_SECRET);
  return json(await reconcilePayment(env,event));
 }
 if(path.startsWith('/api/admin/')){
  admin(request,env);enabled(env,'REGISTRATIONS_ENABLED');const input=await body(request,env);
  const section=path.slice('/api/admin/'.length);
  if(['events','participants','outbox','message-preview','payments'].includes(section))return json(await readAdministration(env,section,input));
  if(section==='prepare-reminders')return json(await prepareReminders(env));
  if(section==='cancel-registration'){
   if(typeof input.id!=='string'||!input.id||input.id.length>100||!['reserved','confirmed','cancelled'].includes(input.expectedStatus))throw new HttpError(400,'invalid_registration');
   const row=await env.DB.prepare('SELECT r.id,r.status,o.kind,o.revision FROM registrations r JOIN offerings o ON o.id=r.offering_id WHERE r.id=?').bind(input.id).first();
   if(!row)throw new HttpError(404,'not_found');
   if(row.status==='cancelled')return json({status:'cancelled',refundAutomatic:false});
   if(row.status!==input.expectedStatus||row.status==='completed')throw new HttpError(409,'registration_state_changed');
   return json(await cancelRegistration(env,row));
  }
  if(path==='/api/admin/dispatch')return json(await scheduleReminders(env));
  if(path==='/api/admin/offering'){
   if(input.kind==='session')throw new HttpError(409,'use_google_calendar');
   const kinds=['live','webinar','workshop','constellation','individual_program','group_program','session'];
   if(typeof input.id!=='string'||! /^[a-z0-9-]{1,100}$/.test(input.id)||!kinds.includes(input.kind)||typeof input.title!=='string'||!input.title.trim()||input.title.length>200||!Number.isSafeInteger(input.capacity)||input.capacity<1||!Number.isSafeInteger(input.startsAt)||!Number.isSafeInteger(input.endsAt)||input.startsAt<=now()||input.endsAt<=input.startsAt||typeof input.location!=='string'||input.location.length>300||!['draft','open','closed'].includes(input.status))throw new HttpError(400,'invalid_offering');
   if(input.accessUrl){const u=new URL(input.accessUrl);if(u.protocol!=='https:'||u.username||u.password)throw new HttpError(400,'invalid_access');}
   if(input.priceTestId){sandbox(env);if(! /^price_[a-zA-Z0-9]+$/.test(input.priceTestId)||!Number.isSafeInteger(input.amount)||input.amount<=0||! /^[a-z]{3}$/.test(input.currency||''))throw new HttpError(400,'invalid_price');}
   // Creation only. Revisioned updates use lifecycle endpoint, preventing silent schedule changes.
   await env.DB.prepare('INSERT INTO offerings(id,kind,title,status,starts_at,ends_at,capacity,location,access_url,price_test_id,amount,currency) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').bind(input.id,input.kind,input.title,input.status,input.startsAt,input.endsAt,input.capacity,input.location,input.accessUrl||null,input.priceTestId||null,input.amount||null,input.currency||null).run();
   return json({created:true},201);
  }
  if(path==='/api/admin/lifecycle'){
   const offering=await env.DB.prepare('SELECT * FROM offerings WHERE id=?').bind(String(input.id||'')).first();
   if(!offering||!['change','cancel','complete'].includes(input.action)||input.expectedRevision!==offering.revision)throw new HttpError(409,'revision_mismatch');
   if(['cancelled','completed'].includes(offering.status))throw new HttpError(409,'event_finished');
   const change=input.action==='change'?validateEventChange(input,offering):null;
   const revision=offering.revision+1,status=input.action==='cancel'?'cancelled':input.action==='complete'?'completed':offering.status;
   // Lifecycle trigger changes recipients and queues messages in this same transaction.
   let updated;
   try{updated=await env.DB.prepare('UPDATE offerings SET starts_at=?,ends_at=?,capacity=?,status=?,revision=? WHERE id=? AND revision=? RETURNING id').bind(change?change.starts:offering.starts_at,change?change.ends:offering.ends_at,change?change.capacity:offering.capacity,change?change.status:status,revision,offering.id,offering.revision).first();}
   catch(error){if(/capacity_below_occupied/.test(error.message))throw new HttpError(409,'capacity_below_occupied');throw error;}
   if(!updated)throw new HttpError(409,'revision_mismatch');
   return json({updated:true,revision});
  }
 }
 throw new HttpError(404,'not_found');
}
export async function handle(request,env) {
 try{return await route(request,env);}catch(error){return json({error:error instanceof HttpError?error.code:'service_error'},error instanceof HttpError?error.status:503);}
}
