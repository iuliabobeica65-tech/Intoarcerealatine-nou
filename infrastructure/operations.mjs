import {now,HttpError} from './security.mjs';
import {brevo} from './brevo.mjs';
import {renderTemplate} from './templates.mjs';
export const family=kind=>({live:'LIVE',webinar:'WEB',workshop:'WRK',constellation:'WRK',individual_program:'PRG',group_program:'PRG',session:'SES'}[kind]);
export function lifecycleTemplate(kind,action) {
 const group=family(kind);const positions={LIVE:{confirmation:1,reminder:3,change:5,cancel:6,complete:4},WEB:{confirmation:1,reminder:2,change:3,cancel:5,complete:4},WRK:{confirmation:1,reminder:4,change:7,cancel:5,complete:6},PRG:{confirmation:1,reminder:4,change:7,cancel:8,complete:6},SES:{confirmation:1,reminder:2,change:3,cancel:4,complete:4}};
 if(kind==='session'&&action==='complete')return null;
 return `${group}-${String(positions[group][action]).padStart(2,'0')}`;
}
export function enqueue(env,registration,id,revision,due=now()) {
 return env.DB.prepare('INSERT OR IGNORE INTO outbox(id,registration_id,template_id,revision,due_at) VALUES(?,?,?,?,?)').bind(crypto.randomUUID(),registration,id,revision,due);
}
// Safe outbox: uncertain delivery goes to manual review, never blind automatic resend.
export async function dispatch(env) {
 if(env.EMAIL_SEND_ENABLED!=='true')throw new HttpError(503,'email_disabled');
 let approved;try{approved=JSON.parse(env.APPROVED_TEMPLATE_IDS||'[]');}catch{throw new HttpError(503,'not_configured');}
 // Keep the combined scheduler + dispatch below the Free D1 per-invocation limit.
 const jobs=await env.DB.prepare("SELECT * FROM outbox WHERE status='pending' AND due_at<=? ORDER BY due_at LIMIT 10").bind(now()).all();
 let sent=0,review=0;
 for(const job of jobs.results){
  const row=await env.DB.prepare('SELECT r.*,o.title,o.kind,o.starts_at,o.ends_at,o.access_url,o.location,o.revision,o.status AS offering_status,p.status AS payment_status FROM registrations r JOIN offerings o ON o.id=r.offering_id LEFT JOIN orders p ON p.registration_id=r.id WHERE r.id=?').bind(job.registration_id).first();
  const cancellation=['LIVE-06','WEB-05','WRK-05','PRG-08','SES-04','PAY-04'].includes(job.template_id);
  const completion=['LIVE-04','WEB-04','WRK-06','PRG-06'].includes(job.template_id);
  const allowedStates=completion?['completed']:cancellation?['cancelled','reserved','confirmed']:['reserved','confirmed'];
  const paymentState={'PAY-01':'paid','PAY-02':'failed','PAY-03':'pending','PAY-04':'refunded'}[job.template_id];
  if(!row||row.revision!==job.revision||!allowedStates.includes(row.status)||(paymentState&&row.payment_status!==paymentState)||(!cancellation&&!completion&&['cancelled','completed'].includes(row.offering_status))){await env.DB.prepare("UPDATE outbox SET status='stopped' WHERE id=?").bind(job.id).run();continue;}
  if(!approved.includes(job.template_id))continue;
  const claimed=await env.DB.prepare("UPDATE outbox SET status='sending' WHERE id=? AND status='pending' RETURNING id").bind(job.id).first();if(!claimed)continue;
  try{
   // Never include an access link in a reserved/unpaid participant's message.
   const canAccess=row.status==='confirmed'&&(!row.payment_status||row.payment_status==='paid');
   const text=renderTemplate(job.template_id,{name:row.name||'Bună',title:row.title,details:`Data: ${new Date(row.starts_at*1000).toISOString()} (UTC). Locație: ${row.location}.`,cta_url:canAccess&&row.access_url?row.access_url:env.APP_ORIGIN+'/evenimente'});
   // Community needs verified DOI; invoices have a separate deduplicated channel.
   // Individual bookings belong to Google Calendar (issue #82), not this outbox.
   if(text.marketing||/^(COM|FIN|OPS|SES)-/.test(job.template_id))throw Error('template_not_in_event_outbox');
   const result=await brevo(env,'smtp/email',{sender:{name:'Iulia Bobeica – Echilibrarea Rădăcinilor',email:'contact@iuliabobeica.ro'},to:[{email:row.email}],subject:text.subject,textContent:text.text,headers:{'X-Operational-ID':job.id}});
   await env.DB.prepare("UPDATE outbox SET status='sent',message_id=? WHERE id=?").bind(result.messageId||null,job.id).run();sent++;
  }catch{
   await env.DB.prepare("UPDATE outbox SET status='review' WHERE id=?").bind(job.id).run();review++;
  }
 }
 return {sent,review};
}
export async function scheduleReminders(env) {
 const rows=await env.DB.prepare("SELECT r.id,o.kind,o.revision,o.starts_at FROM registrations r JOIN offerings o ON o.id=r.offering_id WHERE r.status='confirmed' AND o.kind<>'session' AND o.status IN ('open','closed') AND o.starts_at>? AND o.starts_at<=? AND NOT EXISTS (SELECT 1 FROM outbox b WHERE b.registration_id=r.id AND b.revision=o.revision AND b.template_id IN ('LIVE-03','WEB-02','WRK-04','PRG-04')) ORDER BY o.starts_at,r.id LIMIT 10").bind(now(),now()+86400).all();
 for(const r of rows.results)await enqueue(env,r.id,lifecycleTemplate(r.kind,'reminder'),r.revision).run();
 await env.DB.prepare('DELETE FROM rate_limits WHERE expires_at<?').bind(now()).run();
 return dispatch(env);
}
