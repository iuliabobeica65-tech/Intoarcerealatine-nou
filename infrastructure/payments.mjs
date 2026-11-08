import { sandbox, HttpError, keyedHash, equal, now } from './security.mjs';
export async function stripe(env,path,params,idempotency) {
 sandbox(env);
 const response=await fetch(`https://api.stripe.com/v1/${path}`,{method:params?'POST':'GET',headers:{Authorization:`Bearer ${env.STRIPE_SECRET_KEY}`,...(params?{'Content-Type':'application/x-www-form-urlencoded'}:{}),...(idempotency?{'Idempotency-Key':idempotency}:{})},...(params?{body:new URLSearchParams(params)}:{}),signal:AbortSignal.timeout(15000)});
 if(!response.ok)throw new HttpError(502,'payment_provider');return response.json();
}
export async function verifyStripe(raw,header,secret,time=now()) {
 if(!secret?.startsWith('whsec_'))throw new HttpError(503,'not_configured');
 const parts=(header||'').split(',').map(p=>p.split('='));
 const timestamps=parts.filter(p=>p[0]==='t');
 const t=Number(timestamps[0]?.[1]);
 if(timestamps.length!==1||!Number.isSafeInteger(t)||Math.abs(time-t)>300)throw new HttpError(400,'signature');
 const signature=await keyedHash(secret,`${t}.${raw}`);
 if(!parts.some(([k,v])=>k==='v1'&&equal(v,signature)))throw new HttpError(400,'signature');
 let event;try{event=JSON.parse(raw);}catch{throw new HttpError(400,'invalid_json');}
 if(event.livemode!==false||!event.id||!event.type||!event.data?.object)throw new HttpError(400,'test_events_only');return event;
}
// Fetch canonical state, rather than trusting delivery order of webhook events.
export async function reconcilePayment(env,event) {
 sandbox(env);
 if(await env.DB.prepare('SELECT id FROM payment_events WHERE id=?').bind(event.id).first())return {duplicate:true};
 const accepted=['checkout.session.completed','checkout.session.async_payment_succeeded','checkout.session.async_payment_failed','checkout.session.expired','charge.refunded'];
 if(!accepted.includes(event.type))return {ignored:true};
 const obj=event.data.object;
 const order=event.type==='charge.refunded'
  ?await env.DB.prepare('SELECT * FROM orders WHERE payment_intent=?').bind(typeof obj.payment_intent==='string'?obj.payment_intent:obj.payment_intent?.id||'').first()
  :await env.DB.prepare('SELECT * FROM orders WHERE id=?').bind(obj.client_reference_id||'').first();
 // A session can arrive before checkout's response was persisted. Retry unbound events.
 if(!order)throw new HttpError(503,'order_not_ready');
 const sessionId=order.session_id || (obj.object==='checkout.session'?obj.id:null);
 if(!sessionId)throw new HttpError(503,'order_not_ready');
 const session=await stripe(env,`checkout/sessions/${encodeURIComponent(sessionId)}`);
 if(session.livemode!==false||session.client_reference_id!==order.id||session.amount_total!==order.amount||session.currency!==order.currency)throw new HttpError(400,'payment_mismatch');
 const pi=typeof session.payment_intent==='string'?session.payment_intent:session.payment_intent?.id;
 let refunded=false;
 if(pi){
  const intent=await stripe(env,`payment_intents/${encodeURIComponent(pi)}?expand[]=latest_charge`);
  if(intent.livemode!==false)throw new HttpError(400,'test_events_only');
  const charge=intent.latest_charge;
  // Partial refunds also suspend access for manual review.
  refunded=!!(charge&&typeof charge==='object'&&charge.amount_refunded>0);
 }
 const next=refunded?'refunded':session.payment_status==='paid'?'paid':session.status==='expired'?'failed':event.type==='checkout.session.async_payment_failed'?'failed':'pending';
 // A refund/paid state must never be undone by a stale delivery.
 const state=order.status==='refunded'?'refunded':order.status==='paid'&&next!=='refunded'?'paid':next;
 const registration=await env.DB.prepare('SELECT r.*,o.status AS offering_status FROM registrations r JOIN offerings o ON o.id=r.offering_id WHERE r.id=?').bind(order.registration_id).first();
 const validAccess=state==='paid'&&registration.status!=='cancelled'&&['open','closed'].includes(registration.offering_status);
 const statements=[
  env.DB.prepare('INSERT OR IGNORE INTO payment_events(id,type,processed_at) VALUES(?,?,?)').bind(event.id,event.type,now()),
  env.DB.prepare("UPDATE orders SET status=CASE WHEN status='refunded' THEN 'refunded' WHEN status='paid' AND ?!='refunded' THEN 'paid' ELSE ? END,session_id=?,payment_intent=?,updated_at=? WHERE id=?").bind(state,state,sessionId,pi||null,now(),order.id),
  env.DB.prepare("UPDATE registrations SET status=CASE WHEN (SELECT status FROM orders WHERE id=?)='refunded' THEN 'cancelled' WHEN (SELECT status FROM orders WHERE id=?)='paid' AND ? THEN 'confirmed' ELSE status END WHERE id=? AND status NOT IN ('cancelled','completed')").bind(order.id,order.id,validAccess?1:0,order.registration_id)
 ];
 if(state==='paid')statements.push(env.DB.prepare('INSERT OR IGNORE INTO invoice_jobs(order_id) VALUES(?)').bind(order.id));
 statements.push(env.DB.prepare('INSERT OR IGNORE INTO outbox(id,registration_id,template_id,revision,due_at) SELECT ?,r.id,?,o.revision,? FROM registrations r JOIN offerings o ON o.id=r.offering_id WHERE r.id=?').bind(crypto.randomUUID(),state==='paid'?'PAY-01':state==='refunded'?'PAY-04':state==='failed'?'PAY-02':'PAY-03',now(),order.registration_id));
 await env.DB.batch(statements);
 return {processed:true};
}
