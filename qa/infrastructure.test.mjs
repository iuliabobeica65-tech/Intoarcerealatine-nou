import test from 'node:test';
import assert from 'node:assert/strict';
import {database} from './d1-local.mjs';
import {handle,CONSENT_VERSION} from '../infrastructure/api.mjs';
import {hash,keyedHash,now,sandbox} from '../infrastructure/security.mjs';
import {verifyStripe,reconcilePayment} from '../infrastructure/payments.mjs';
import {prepareInvoice,prepareCredit,claimInvoiceNotification,smartbillPayload,billingMode} from '../infrastructure/invoicing.mjs';
import {templates,renderTemplate} from '../infrastructure/templates.mjs';
import {scheduleReminders,dispatch} from '../infrastructure/operations.mjs';
const origin='https://preview.example.invalid';
const secret='whsec_'+ 'a'.repeat(40);
function env(){return {DB:database(),APP_ORIGIN:origin,DATA_HMAC_KEY:'h'.repeat(40),COMMUNITY_ENABLED:'true',REGISTRATIONS_ENABLED:'true',TURNSTILE_SECRET:'test',BREVO_API_KEY:'fixture-not-a-key',BREVO_DOI_TEMPLATE_ID:'1',STRIPE_SECRET_KEY:'sk_test_fixture',STRIPE_WEBHOOK_SECRET:secret,PAYMENTS_TEST_ENABLED:'true',LIVE_PAYMENTS_ENABLED:'false',ADMIN_TOKEN:'a'.repeat(40)};}
function req(path,data,headers={}){return new Request(origin+'/api/'+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...headers},body:JSON.stringify(data)});}
function mock(fn){const old=globalThis.fetch;globalThis.fetch=fn;return ()=>{globalThis.fetch=old;};}
const response=data=>new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json'}});
async function offering(e,{id='event',capacity=1,paid=false,kind='live'}={}){
 await e.DB.prepare("INSERT INTO offerings(id,kind,title,status,starts_at,ends_at,capacity,location,access_url,price_test_id,amount,currency) VALUES(?,?,?,'open',?,?,?,?,?,?,?,?)").bind(id,kind,'Fixture fără ofertă comercială',now()+7200,now()+10800,capacity,'Online','https://meet.example.invalid/private',paid?'price_testFixture':null,paid?100:null,paid?'ron':null).run();
}
async function participant(e,{id='r1',offeringId='event',status='confirmed',address='test@example.invalid'}={}){
 await e.DB.prepare('INSERT INTO registrations(id,offering_id,email,token_hash,status,created_at) VALUES(?,?,?,?,?,?)').bind(id,offeringId,address,await hash('t'.repeat(40)+id),status,now()).run();
}
test('flags default closed, rejects cross-origin, malformed and oversized requests',async()=>{
 const e=env();assert.equal((await handle(req('community',{}),{})).status,503);
 assert.equal((await handle(req('community',{}, {Origin:'https://evil.invalid'}),e)).status,403);
 assert.equal((await handle(req('community',{}, {'Content-Type':'text/plain'}),e)).status,415);
 assert.equal((await handle(req('community',{padding:'x'.repeat(9000)}),e)).status,413);
 assert.equal((await handle(req('community',{email:'bad'}),e)).status,400);e.DB.close();
});
test('DOI only, list 3, no immediate marketing membership, duplicate suppressed, hashed consent',async()=>{
 const e=env();let sends=0,payload;const restore=mock(async(url,options)=>{
  if(url.includes('turnstile'))return response({success:true,hostname:'preview.example.invalid',action:'registration'});
  assert.equal(url,'https://api.brevo.com/v3/contacts/doubleOptinConfirmation');sends++;payload=JSON.parse(options.body);return response({});
 });
 try{
  const input={email:' TEST@example.invalid ',name:'Ana',consent:true,consentVersion:CONSENT_VERSION,turnstile:'fixture'};
  assert.equal((await handle(req('community',input),e)).status,202);
  assert.equal((await handle(req('community',input),e)).status,202);assert.equal(sends,1);assert.deepEqual(payload.includeListIds,[3]);
  const row=await e.DB.prepare('SELECT * FROM consent_requests').first();assert.equal(row.status,'submitted');assert.equal(row.email_hash.length,64);assert(!JSON.stringify(row).includes('test@example.invalid'));
  assert.equal((await handle(req('community',{...input,consent:false}),e)).status,400);
 }finally{restore();e.DB.close();}
});
test('Turnstile wrong hostname/action and honeypot rejected; throttle persistent',async()=>{
 const e=env();const restore=mock(async()=>response({success:true,hostname:'wrong.invalid',action:'registration'}));
 try{const input={email:'t@example.invalid',consent:true,consentVersion:CONSENT_VERSION,turnstile:'x'};assert.equal((await handle(req('community',input),e)).status,400);assert.equal((await handle(req('community',{...input,website:'spam'}),e)).status,400);
 for(let i=0;i<10;i++)await handle(req('community',input),e);assert.equal((await handle(req('community',input),e)).status,429);
 }finally{restore();e.DB.close();}
});
test('capacity enforced by SQL, duplicate and cancelled reactivation blocked',async()=>{
 const e=env();await offering(e);await participant(e);
 await assert.rejects(participant(e,{id:'r2',address:'two@example.invalid'}),/unavailable/);
 await e.DB.prepare("UPDATE registrations SET status='cancelled' WHERE id='r1'").run();await participant(e,{id:'r2',address:'two@example.invalid'});
 await assert.rejects(e.DB.prepare("UPDATE registrations SET status='confirmed' WHERE id='r1'").run(),/unavailable/);e.DB.close();
});
test('registration without marketing, bearer access and cancellation',async()=>{
 const e=env();await offering(e);const restore=mock(async()=>response({success:true,hostname:'preview.example.invalid',action:'registration'}));
 try{const result=await handle(req('register',{email:'test@example.invalid',offeringId:'event',administrative:true,turnstile:'x'}),e);assert.equal(result.status,201);const {token}=await result.json();
 assert.equal((await e.DB.prepare('SELECT count(*) AS n FROM consent_requests').first()).n,0);
 let r=await (await handle(req('registration',{token}),e)).json();assert.equal(r.accessUrl,'https://meet.example.invalid/private');
 assert.equal((await handle(req('registration',{token:'wrong'}),e)).status,403);
 await handle(req('cancel',{token}),e);r=await (await handle(req('registration',{token}),e)).json();assert.equal(r.accessUrl,null);assert.equal(r.status,'cancelled');
 }finally{restore();e.DB.close();}
});
test('sandbox gate rejects live keys and missing explicit OFF',()=>{
 assert.throws(()=>sandbox({}));assert.throws(()=>sandbox({PAYMENTS_TEST_ENABLED:'true',LIVE_PAYMENTS_ENABLED:'false',STRIPE_SECRET_KEY:'sk_live_fake',STRIPE_WEBHOOK_SECRET:secret}));
 assert.throws(()=>sandbox({PAYMENTS_TEST_ENABLED:'true',STRIPE_SECRET_KEY:'sk_test_fake',STRIPE_WEBHOOK_SECRET:secret}));
});
test('Stripe raw-body signature, tampering, stale and live event rejected',async()=>{
 const t=now(),raw=JSON.stringify({id:'evt_1',type:'test',livemode:false,data:{object:{}}});const sig=await keyedHash(secret,`${t}.${raw}`);
 assert.equal((await verifyStripe(raw,`t=${t},v1=${sig}`,secret)).id,'evt_1');
 await assert.rejects(verifyStripe(raw+' ',`t=${t},v1=${sig}`,secret));await assert.rejects(verifyStripe(raw,`t=${t},v1=${sig}`,secret,t+301));
 const live=raw.replace('false','true'),ls=await keyedHash(secret,`${t}.${live}`);await assert.rejects(verifyStripe(live,`t=${t},v1=${ls}`,secret));
});
test('checkout test price validation and idempotent order; success URL cannot grant access',async()=>{
 const e=env();await offering(e,{paid:true});await participant(e,{status:'reserved'});let sessions=0;const restore=mock(async(url,options)=>{
  if(url.includes('/prices/'))return response({livemode:false,active:true,unit_amount:100,currency:'ron'});
  sessions++;assert(options.headers['Idempotency-Key']);return response({id:'cs_test_1',livemode:false,url:'https://checkout.stripe.com/c/pay/test_fixture'});
 });
 try{const token='t'.repeat(40)+'r1';assert.equal((await handle(req('checkout',{token}),e)).status,200);assert.equal((await handle(req('checkout',{token}),e)).status,200);assert.equal(sessions,2);
 assert.equal((await e.DB.prepare('SELECT count(*) AS n FROM orders').first()).n,1);
 const state=await (await handle(req('registration',{token}),e)).json();assert.equal(state.accessUrl,null);assert.equal(state.status,'reserved');
 }finally{restore();e.DB.close();}
});
test('payment pending, failed, paid, duplicate, delayed delivery and refund revoke access',async()=>{
 const e=env();await offering(e,{paid:true});await participant(e,{status:'reserved'});
 await e.DB.prepare("INSERT INTO orders VALUES('order','r1','cs_test_1','pi_test_1',100,'ron','created',?)").bind(now()).run();
 let payment='unpaid',expired=false,refund=0;const restore=mock(async url=>url.includes('payment_intents')?response({livemode:false,latest_charge:{amount_refunded:refund}}):response({id:'cs_test_1',livemode:false,client_reference_id:'order',amount_total:100,currency:'ron',payment_status:payment,status:expired?'expired':'complete',payment_intent:'pi_test_1'}));
 const event=(id,type)=>({id,type,livemode:false,data:{object:{id:'cs_test_1',object:'checkout.session',client_reference_id:'order'}}});
 try{
  await reconcilePayment(e,event('evt_pending','checkout.session.completed'));assert.equal((await e.DB.prepare('SELECT status FROM orders').first()).status,'pending');
  await reconcilePayment(e,event('evt_fail','checkout.session.async_payment_failed'));assert.equal((await e.DB.prepare('SELECT status FROM orders').first()).status,'failed');
  payment='paid';await reconcilePayment(e,event('evt_paid','checkout.session.async_payment_succeeded'));assert.equal((await e.DB.prepare('SELECT status FROM registrations').first()).status,'confirmed');
  assert.deepEqual(await reconcilePayment(e,event('evt_paid','checkout.session.async_payment_succeeded')),{duplicate:true});
  expired=true;payment='unpaid';await reconcilePayment(e,event('evt_old','checkout.session.expired'));assert.equal((await e.DB.prepare('SELECT status FROM orders').first()).status,'paid');
  refund=100;payment='paid';await reconcilePayment(e,{id:'evt_refund',type:'charge.refunded',livemode:false,data:{object:{payment_intent:'pi_test_1'}}});assert.equal((await e.DB.prepare('SELECT status FROM orders').first()).status,'refunded');assert.equal((await e.DB.prepare('SELECT status FROM registrations').first()).status,'cancelled');
  await reconcilePayment(e,event('evt_late','checkout.session.completed'));assert.equal((await e.DB.prepare('SELECT status FROM orders').first()).status,'refunded');
 }finally{restore();e.DB.close();}
});
test('offering lifecycle transactional revision, change notifications and cancellation',async()=>{
 const e=env();await offering(e);await participant(e);const headers={Authorization:`Bearer ${e.ADMIN_TOKEN}`};
 assert.equal((await handle(req('admin/lifecycle',{id:'event',action:'change',expectedRevision:1,startsAt:now()+9000,endsAt:now()+10000},headers),e)).status,200);
 assert.equal((await e.DB.prepare('SELECT template_id FROM outbox').first()).template_id,'LIVE-05');
 assert.equal((await handle(req('admin/lifecycle',{id:'event',action:'cancel',expectedRevision:1},headers),e)).status,409);
 assert.equal((await handle(req('admin/lifecycle',{id:'event',action:'cancel',expectedRevision:2},headers),e)).status,200);
 assert.equal((await e.DB.prepare('SELECT status FROM registrations').first()).status,'cancelled');assert.equal((await e.DB.prepare("SELECT count(*) AS n FROM outbox WHERE status='pending'").first()).n,1);e.DB.close();
});
test('outbox approved only, reminders deduplicated and send errors not automatically retried',async()=>{
 const e=env();await offering(e);await participant(e);e.EMAIL_SEND_ENABLED='true';
 const restore=mock(async()=>{throw Error('network uncertain');});
 try{await scheduleReminders(e);await scheduleReminders(e);assert.equal((await e.DB.prepare('SELECT count(*) AS n FROM outbox').first()).n,1);
 e.APPROVED_TEMPLATE_IDS='["LIVE-03"]';await dispatch(e);assert.equal((await e.DB.prepare('SELECT status FROM outbox').first()).status,'review');await dispatch(e);assert.equal((await e.DB.prepare('SELECT count(*) AS n FROM outbox').first()).n,1);
 }finally{restore();e.DB.close();}
});
test('template catalogue identifiers, variables and unsafe CTA',()=>{
 assert.equal(new Set(templates.map(t=>t.id)).size,templates.length);assert(templates.every(t=>t.approved===false));
 assert.throws(()=>renderTemplate('PAY-01',{}));assert.throws(()=>renderTemplate('COM-01',{cta_url:'javascript:alert(1)'}));assert(renderTemplate('COM-02',{cta_url:'https://example.invalid/preferences'}).text.includes('Bun venit'));
});
test('SmartBill mock invoice linkage, dedup, credit review, no fiscal requests and no duplicate emails',async()=>{
 const e=env();await offering(e,{paid:true});await participant(e);await e.DB.prepare("INSERT INTO orders VALUES('order','r1','cs_test_1','pi_test_1',100,'ron','paid',?)").bind(now()).run();
 let calls=0;const restore=mock(async()=>{calls++;throw Error('network forbidden in billing test');});
 try{const client={type:'person',name:'Fixture test',country:'România',city:'Test',address:'Adresă fictivă',cnp:'do not persist'};
 const result=await prepareInvoice(e,{orderId:'order',client});assert.equal(result.fiscalDocumentIssued,false);assert.equal(result.status,'issued_mock');assert.equal((await prepareInvoice(e,{orderId:'order',client})).duplicate,true);assert.equal(calls,0);
 assert(!(await e.DB.prepare('SELECT billing_data FROM billing_clients').first()).billing_data.includes('cnp'));
 await assert.rejects(claimInvoiceNotification(e,result.id));
 await e.DB.prepare("UPDATE orders SET status='refunded'").run();await prepareCredit(e,{orderId:'order',refundId:'re_fixture',originalDocumentId:result.id});await prepareCredit(e,{orderId:'order',refundId:'re_fixture',originalDocumentId:result.id});assert.equal((await e.DB.prepare('SELECT count(*) AS n FROM billing_documents').first()).n,2);
 await e.DB.prepare("UPDATE billing_documents SET status='external_recorded',series='EXTERNAL',number='fixture' WHERE id=?").bind(result.id).run();e.INVOICE_EMAIL_SENDER='brevo';assert.equal((await claimInvoiceNotification(e,result.id)).send,true);assert.equal((await claimInvoiceNotification(e,result.id)).send,false);
 assert.throws(()=>billingMode({INVOICING_ENABLED:'true'}));assert.throws(()=>smartbillPayload({},client,{amount:100,currency:'ron'}));
 }finally{restore();e.DB.close();}
});
