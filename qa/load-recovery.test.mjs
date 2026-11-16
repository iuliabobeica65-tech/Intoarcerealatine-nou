import test from 'node:test';
import assert from 'node:assert/strict';
import {database} from './d1-local.mjs';
import {handle} from '../infrastructure/api.mjs';
import {hash,keyedHash,now} from '../infrastructure/security.mjs';
import {reconcilePayment} from '../infrastructure/payments.mjs';
import {dispatch,prepareReminders} from '../infrastructure/operations.mjs';
const origin='https://load.example.invalid',secret='whsec_'+'fixture'.repeat(8);
function env(){return {DB:database(),APP_ORIGIN:origin,REGISTRATIONS_ENABLED:'true',DATA_HMAC_KEY:'fixture-hmac-'.repeat(4),TURNSTILE_SECRET:'fixture',EMAIL_SEND_ENABLED:'false',PAYMENTS_TEST_ENABLED:'true',LIVE_PAYMENTS_ENABLED:'false',STRIPE_SECRET_KEY:'sk_test_fixture',STRIPE_WEBHOOK_SECRET:secret};}
async function offering(e,capacity=25,paid=false){await e.DB.prepare("INSERT INTO offerings(id,kind,title,status,starts_at,ends_at,capacity,location,price_test_id,amount,currency) VALUES('event','live','Fixture local','open',?,?,?,'Online',?,?,?)").bind(now()+7200,now()+10800,capacity,paid?'price_fixture':null,paid?100:null,paid?'ron':null).run();}
function reg(i,email='fixture'+i+'@example.invalid'){return new Request(origin+'/api/register',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':'198.51.100.'+i},body:JSON.stringify({email,offeringId:'event',administrative:true,turnstile:'fixture'})});}
const count=(e,table)=>e.DB.sqlite.prepare('SELECT count(*) AS n FROM '+table).get().n;
test.beforeEach(t=>{const old=globalThis.fetch;globalThis.fetch=async url=>{assert.equal(String(url),'https://challenges.cloudflare.com/turnstile/v0/siteverify');return new Response(JSON.stringify({success:true,hostname:new URL(origin).hostname,action:'registration'}));};t.after(()=>{globalThis.fetch=old;});});

test('200 simultaneous unique requests cannot oversell 25 places',async()=>{
 const e=env();try{await offering(e);const responses=await Promise.all(Array.from({length:200},(_,i)=>handle(reg(i+1),e)));assert.equal(responses.filter(r=>r.status===201).length,25);assert.equal(responses.filter(r=>r.status===409).length,175);assert.equal(count(e,'registrations'),25);assert.equal(count(e,'outbox'),25);assert.equal(responses.filter(r=>r.status===503).length,0);}finally{e.DB.close();}
});
test('large-read paths use indexed event ranges and have cleanup indexes',async()=>{
 const e=env();try{await offering(e);const plan=e.DB.sqlite.prepare("EXPLAIN QUERY PLAN SELECT id FROM offerings WHERE status='open' AND starts_at>? ORDER BY starts_at LIMIT 100").all(now());assert(plan.some(r=>r.detail.includes('offerings_status_starts')));for(const name of ['registrations_status_offering','rate_limits_expiry'])assert(e.DB.sqlite.prepare("SELECT name FROM sqlite_master WHERE type='index' AND name=?").get(name));}finally{e.DB.close();}
});
test('80 simultaneous duplicates produce one registration, one notice and idempotent replies',async()=>{
 const e=env();try{await offering(e);const responses=await Promise.all(Array.from({length:80},(_,i)=>handle(reg(i+1,'same@example.invalid'),e)));assert.equal(responses.filter(r=>r.status===201).length,1);assert.equal(responses.filter(r=>r.status===202).length,79);assert.equal(count(e,'registrations'),1);assert.equal(count(e,'outbox'),1);}finally{e.DB.close();}
});
test('pending paid reservations occupy all places without treating them as paid confirmations',async()=>{
 const e=env();try{await offering(e,10,true);const responses=await Promise.all(Array.from({length:50},(_,i)=>handle(reg(i+1),e)));assert.equal(responses.filter(r=>r.status===201).length,10);assert.equal(e.DB.sqlite.prepare("SELECT count(*) AS n FROM registrations WHERE status='reserved'").get().n,10);assert.equal(count(e,'orders'),0);assert.equal(responses.filter(r=>r.status===409).length,40);}finally{e.DB.close();}
});
test('a burst from one IP is throttled before it creates more than ten registrations',async()=>{
 const e=env();try{await offering(e,100);const requests=Array.from({length:25},(_,i)=>{const r=reg(i+1);r.headers.set('CF-Connecting-IP','198.51.100.250');return handle(r,e);});const responses=await Promise.all(requests);assert.equal(responses.filter(r=>r.status===201).length,10);assert.equal(responses.filter(r=>r.status===429).length,15);assert.equal(count(e,'registrations'),10);}finally{e.DB.close();}
});
test('a queue insertion failure rolls back the registration, then a retry can claim the place',async()=>{
 const e=env();try{await offering(e,1);e.DB.sqlite.exec("CREATE TRIGGER fixture_fail BEFORE INSERT ON outbox BEGIN SELECT RAISE(ABORT,'fixture_queue_failure'); END;");assert.equal((await handle(reg(1),e)).status,503);assert.equal(count(e,'registrations'),0);assert.equal(count(e,'outbox'),0);e.DB.sqlite.exec('DROP TRIGGER fixture_fail');assert.equal((await handle(reg(2),e)).status,201);assert.equal(count(e,'registrations'),1);}finally{e.DB.close();}
});
async function paidFixture(e){await offering(e,2,true);await e.DB.prepare("INSERT INTO registrations(id,offering_id,email,token_hash,status,created_at) VALUES('r','event','fixture@example.invalid',?,'reserved',?)").bind(await hash('fixture-token'),now()).run();await e.DB.prepare("INSERT INTO orders(id,registration_id,session_id,amount,currency,status,updated_at) VALUES('order','r','cs_fixture',100,'ron','pending',?)").bind(now()).run();}
function paymentProvider({refund=()=>0,fail=()=>false}={}){return async url=>{if(fail())throw Error('simulated-provider-failure');if(String(url).includes('/checkout/sessions/'))return new Response(JSON.stringify({id:'cs_fixture',livemode:false,client_reference_id:'order',amount_total:100,currency:'ron',payment_status:'paid',status:'complete',payment_intent:'pi_fixture'}));if(String(url).includes('/payment_intents/'))return new Response(JSON.stringify({livemode:false,latest_charge:{amount_refunded:refund()}}));throw Error('unexpected-provider');};}
const event=id=>({id,type:'checkout.session.completed',livemode:false,data:{object:{id:'cs_fixture',object:'checkout.session',client_reference_id:'order'}}});
test('30 repeated signed webhooks confirm one order and queue one payment notification',async()=>{
 const e=env();try{await paidFixture(e);globalThis.fetch=paymentProvider();const raw=JSON.stringify(event('evt_same')),stamp=now(),signature=await keyedHash(secret,stamp+'.'+raw);
 const responses=await Promise.all(Array.from({length:30},()=>handle(new Request(origin+'/api/stripe-webhook',{method:'POST',headers:{'stripe-signature':`t=${stamp},v1=${signature}`},body:raw}),e)));
 assert(responses.every(r=>r.status===200));assert.equal(count(e,'payment_events'),1);assert.equal(count(e,'invoice_jobs'),1);assert.equal(count(e,'outbox'),1);assert.equal(e.DB.sqlite.prepare('SELECT status FROM registrations').get().status,'confirmed');
 }finally{e.DB.close();}
});
test('provider failure is retryable and a late payment after cancellation cannot restore access',async()=>{
 const e=env();try{await paidFixture(e);globalThis.fetch=paymentProvider({fail:()=>true});await assert.rejects(reconcilePayment(e,event('evt_retry')));assert.equal(count(e,'payment_events'),0);assert.equal(e.DB.sqlite.prepare('SELECT status FROM orders').get().status,'pending');
 await e.DB.prepare("UPDATE registrations SET status='cancelled'").run();globalThis.fetch=paymentProvider();await reconcilePayment(e,event('evt_retry'));assert.equal(e.DB.sqlite.prepare('SELECT status FROM registrations').get().status,'cancelled');assert.equal(e.DB.sqlite.prepare('SELECT status FROM orders').get().status,'paid');
 }finally{e.DB.close();}
});
test('a concurrent refund wins over stale paid work without creating a fresh invoice job',async()=>{
 const e=env();try{await paidFixture(e);const originalBatch=e.DB.batch.bind(e.DB);let injected=false;
 e.DB.batch=async statements=>{if(!injected){injected=true;await e.DB.prepare("UPDATE orders SET status='refunded'").run();await e.DB.prepare("UPDATE registrations SET status='cancelled'").run();}return originalBatch(statements);};
 globalThis.fetch=paymentProvider();await reconcilePayment(e,event('evt_stale'));assert.equal(e.DB.sqlite.prepare('SELECT status FROM orders').get().status,'refunded');assert.equal(count(e,'invoice_jobs'),0);assert.equal(e.DB.sqlite.prepare('SELECT template_id FROM outbox').get().template_id,'PAY-04');
 }finally{e.DB.close();}
});
test('partial refund plus repeated deliveries preserves refunded state and one refund notice',async()=>{
 const e=env();try{await paidFixture(e);globalThis.fetch=paymentProvider();await reconcilePayment(e,event('evt_paid'));globalThis.fetch=paymentProvider({refund:()=>25});const refund={id:'evt_refund',type:'charge.refunded',livemode:false,data:{object:{payment_intent:'pi_fixture'}}};await reconcilePayment(e,refund);await reconcilePayment(e,refund);await reconcilePayment(e,event('evt_delayed'));
 assert.equal(e.DB.sqlite.prepare('SELECT status FROM orders').get().status,'refunded');assert.equal(e.DB.sqlite.prepare('SELECT status FROM registrations').get().status,'cancelled');assert.equal(e.DB.sqlite.prepare('SELECT status FROM invoice_jobs').get().status,'review');assert.equal(e.DB.sqlite.prepare("SELECT count(*) AS n FROM outbox WHERE template_id='PAY-04'").get().n,1);
 }finally{e.DB.close();}
});
test('concurrent notification dispatch claims one send; uncertain delivery is never retried automatically',async()=>{
 const e={...env(),EMAIL_SEND_ENABLED:'true',APPROVED_TEMPLATE_IDS:'["LIVE-03"]',BREVO_API_KEY:'fixture-not-a-key'};try{await offering(e);await e.DB.prepare("INSERT INTO registrations(id,offering_id,email,name,token_hash,status,created_at) VALUES('r','event','fixture@example.invalid','Fixture',?,'confirmed',?)").bind(await hash('fixture'),now()).run();await prepareReminders(e);let sends=0;globalThis.fetch=async()=>{sends++;throw Error('delivery-uncertain');};await Promise.all(Array.from({length:20},()=>dispatch(e)));assert.equal(sends,1);assert.equal(e.DB.sqlite.prepare('SELECT status FROM outbox').get().status,'review');await dispatch(e);assert.equal(sends,1);}finally{e.DB.close();}
});
