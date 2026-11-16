import {HttpError,now} from './security.mjs';
import {renderTemplate} from './templates.mjs';

// Called only after the shared admin bearer + Origin + JSON checks.
function page(input) {
 const limit=input.limit??25,after=input.after??'';
 if(!Number.isSafeInteger(limit)||limit<1||limit>100||typeof after!=='string'||after.length>100)throw new HttpError(400,'invalid_page');
 return {limit,after};
}
function result(rows,limit){const more=rows.length>limit,items=rows.slice(0,limit);return {items,next:more?items.at(-1).id:null};}
export async function readAdministration(env,section,input) {
 const {limit,after}=page(input);
 if(section==='events'){
  const rows=await env.DB.prepare(`SELECT o.id,o.kind,o.title,o.status,o.starts_at,o.ends_at,o.timezone,o.capacity,o.revision,
   COALESCE(sum(r.status IN ('reserved','confirmed')),0) AS occupied,
   COALESCE(sum(r.status='cancelled'),0) AS cancelled,
   o.capacity-COALESCE(sum(r.status IN ('reserved','confirmed')),0) AS available
   FROM offerings o LEFT JOIN registrations r ON r.offering_id=o.id WHERE o.id>? GROUP BY o.id ORDER BY o.id LIMIT ?`).bind(after,limit+1).all();
  return result(rows.results,limit);
 }
 if(section==='participants'){
  if(typeof input.offeringId!=='string'||!input.offeringId||input.offeringId.length>100)throw new HttpError(400,'invalid_offering');
  const status=input.status??null;
  if(status!==null&&!['reserved','confirmed','cancelled','completed'].includes(status))throw new HttpError(400,'invalid_status');
  const rows=await env.DB.prepare(`SELECT r.id,r.offering_id,r.name,r.email,r.status,r.created_at,
   p.id AS order_id,p.status AS payment_status,p.amount,p.currency
   FROM registrations r LEFT JOIN orders p ON p.registration_id=r.id
   WHERE r.offering_id=? AND r.id>? AND (? IS NULL OR r.status=?) ORDER BY r.id LIMIT ?`).bind(input.offeringId,after,status,status,limit+1).all();
  return result(rows.results,limit);
 }
 if(section==='outbox'){
  const status=input.status??null;
  if(status!==null&&!['pending','sending','sent','stopped','review'].includes(status))throw new HttpError(400,'invalid_status');
  const rows=await env.DB.prepare(`SELECT b.id,b.registration_id,r.offering_id,b.template_id,b.revision,b.due_at,b.status
   FROM outbox b JOIN registrations r ON r.id=b.registration_id WHERE b.id>? AND (? IS NULL OR b.status=?)
   ORDER BY b.id LIMIT ?`).bind(after,status,status,limit+1).all();
  return {...result(rows.results,limit),sendingEnabled:env.EMAIL_SEND_ENABLED==='true'};
 }
 if(section==='message-preview'){
  if(typeof input.id!=='string'||!input.id||input.id.length>100)throw new HttpError(400,'invalid_message');
  const row=await env.DB.prepare(`SELECT b.template_id,b.revision,b.status,r.name,r.status AS registration_status,
   o.title,o.location,o.starts_at,o.access_url,o.price_test_id,o.revision AS current_revision,p.status AS payment_status
   FROM outbox b JOIN registrations r ON r.id=b.registration_id JOIN offerings o ON o.id=r.offering_id
   LEFT JOIN orders p ON p.registration_id=r.id WHERE b.id=?`).bind(input.id).first();
  if(!row)throw new HttpError(404,'not_found');
  if(/^(COM|FIN|OPS|SES)-/.test(row.template_id))throw new HttpError(409,'not_event_message');
  const access=row.registration_status==='confirmed'&&(!row.price_test_id||row.payment_status==='paid');
  const message=renderTemplate(row.template_id,{name:row.name||'Bună',title:row.title,details:`Data: ${new Date(row.starts_at*1000).toISOString()} (UTC). Locație: ${row.location}.`,cta_url:access&&row.access_url?row.access_url:env.APP_ORIGIN+'/evenimente'});
  return {previewOnly:true,stale:row.revision!==row.current_revision,status:row.status,subject:message.subject,text:message.text};
 }
 if(section==='payments'){
  const rows=await env.DB.prepare(`SELECT p.id,p.registration_id,r.offering_id,r.status AS registration_status,p.status,p.amount,p.currency,p.updated_at,
   j.status AS invoice_job_status,(SELECT count(*) FROM billing_documents d WHERE d.order_id=p.id) AS billing_documents
   FROM orders p JOIN registrations r ON r.id=p.registration_id LEFT JOIN invoice_jobs j ON j.order_id=p.id
   WHERE p.id>? ORDER BY p.id LIMIT ?`).bind(after,limit+1).all();
  const summary=result(rows.results,limit);
  summary.items=summary.items.map(row=>({...row,accountantReviewRequired:row.status==='refunded'||row.status==='review'||row.invoice_job_status==='review',
   manualPaymentReviewRequired:row.status==='review'||(row.status==='paid'&&row.registration_status==='cancelled')||(row.status==='failed'&&row.registration_status==='reserved')}));
  return {...summary,livePaymentsSupported:false,fiscalIssuanceSupported:false};
 }
 throw new HttpError(404,'not_found');
}

export function validateEventChange(input,offering) {
 if(['cancelled','completed'].includes(offering.status))throw new HttpError(409,'event_finished');
 const starts=input.startsAt??offering.starts_at,ends=input.endsAt??offering.ends_at;
 const capacity=input.capacity??offering.capacity,status=input.status??offering.status;
 if(!Number.isSafeInteger(starts)||!Number.isSafeInteger(ends)||starts<=now()||ends<=starts||!Number.isSafeInteger(capacity)||capacity<1||!['draft','open','closed'].includes(status))throw new HttpError(400,'invalid_offering');
 // Existing participants cannot be returned to an unpublished draft.
 if(status==='draft'&&offering.status!=='draft')throw new HttpError(409,'cannot_unpublish_event');
 return {starts,ends,capacity,status};
}
