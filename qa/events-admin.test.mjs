import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {database} from './d1-local.mjs';
import {handle} from '../infrastructure/api.mjs';
import {hash,now} from '../infrastructure/security.mjs';
import {prepareReminders,scheduleReminders,dispatch,cancelRegistration} from '../infrastructure/operations.mjs';

const origin='https://local-test.example.invalid',adminToken='fixture-admin-'.repeat(4);
const request=(path,data={},extra={})=>new Request(origin+'/api/'+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',Authorization:`Bearer ${adminToken}`,...extra},body:JSON.stringify(data)});
function environment(){return {DB:database(),APP_ORIGIN:origin,ADMIN_TOKEN:adminToken,REGISTRATIONS_ENABLED:'true',EMAIL_SEND_ENABLED:'false',DATA_HMAC_KEY:'fixture-hmac-'.repeat(4),TURNSTILE_SECRET:'fixture',PAYMENTS_TEST_ENABLED:'false',LIVE_PAYMENTS_ENABLED:'false',INVOICING_ENABLED:'false'};}
async function event(e,id='event',capacity=2,status='open'){
 await e.DB.prepare(`INSERT INTO offerings(id,kind,title,status,starts_at,ends_at,capacity,location,access_url) VALUES(?,'live','Eveniment local sintetic',?,?,?,?,?,?)`).bind(id,status,now()+7200,now()+10800,capacity,'Online','https://access.example.invalid/private').run();
}
async function participant(e,id='r1',status='confirmed',eventId='event'){
 await e.DB.prepare('INSERT INTO registrations(id,offering_id,email,name,token_hash,status,created_at) VALUES(?,?,?,?,?,?,?)').bind(id,eventId,id+'@example.invalid','Participantă sintetică',await hash('capability-'+id+'-'.repeat(40)),status,now()).run();
}
const call=async(e,path,input={})=>{const r=await handle(request(path,input),e);return {status:r.status,data:await r.json(),headers:r.headers};};
// No real providers are reachable from this suite, including unexpected calls.
test.beforeEach(t=>{const old=globalThis.fetch;globalThis.fetch=async()=>{throw Error('external_network_forbidden');};t.after(()=>{globalThis.fetch=old;});});

test('new administrative reads reject missing authorization, wrong origin and disabled runtime',async()=>{
 const e=environment();
 try{for(const path of ['events','participants','outbox','message-preview','payments','prepare-reminders','cancel-registration']){
  assert.equal((await handle(request('admin/'+path,{}, {Authorization:''}),e)).status,403);
  assert.equal((await handle(request('admin/'+path,{}, {Origin:'https://wrong.example.invalid'}),e)).status,403);
  assert.equal((await handle(request('admin/'+path),{...e,REGISTRATIONS_ENABLED:'false'})).status,503);
 }
 assert.equal(e.DB.sqlite.prepare('SELECT count(*) AS n FROM outbox').get().n,0);
 }finally{e.DB.close();}
});

test('operator cancellation needs state confirmation, frees a seat and queues exactly one notice',async()=>{
 const e=environment();try{await event(e);await participant(e);
  assert.equal((await call(e,'admin/cancel-registration',{id:'r1',expectedStatus:'reserved'})).status,409);
  assert.equal((await call(e,'admin/cancel-registration',{id:'r1',expectedStatus:'confirmed'})).status,200);
  assert.equal((await call(e,'admin/cancel-registration',{id:'r1',expectedStatus:'confirmed'})).status,200);
  assert.equal((await call(e,'admin/events')).data.items[0].available,2);
  assert.equal(e.DB.sqlite.prepare('SELECT count(*) AS n FROM outbox').get().n,1);
  assert.equal(e.DB.sqlite.prepare('SELECT template_id FROM outbox').get().template_id,'LIVE-06');
 }finally{e.DB.close();}
});

test('cancellation with a stale read uses the current revision and refuses a completed record',async()=>{
 const e=environment();try{await event(e);await participant(e);const stale={id:'r1',kind:'live',revision:1};
  await e.DB.prepare('UPDATE offerings SET revision=revision+1').run();await cancelRegistration(e,stale);
  assert.equal(e.DB.sqlite.prepare("SELECT revision FROM outbox WHERE template_id='LIVE-06'").get().revision,2);
  await participant(e,'done','completed');await assert.rejects(cancelRegistration(e,{id:'done',kind:'live',revision:1}),/registration_state_changed/);
  assert.equal(e.DB.sqlite.prepare("SELECT count(*) AS n FROM outbox WHERE registration_id='done'").get().n,0);
 }finally{e.DB.close();}
});

test('administrative event summary and pagination distinguish occupied, cancelled and available',async()=>{
 const e=environment();try{
  await event(e,'a',3);await event(e,'b',1);await participant(e,'r1','confirmed','a');await participant(e,'r2','reserved','a');await participant(e,'r3','cancelled','a');
  const first=await call(e,'admin/events',{limit:1});assert.equal(first.status,200);assert.equal(first.headers.get('Cache-Control'),'no-store');
  assert.equal(first.data.next,'a');assert.equal(first.data.items[0].occupied,2);assert.equal(first.data.items[0].cancelled,1);assert.equal(first.data.items[0].available,1);
  const second=await call(e,'admin/events',{limit:1,after:first.data.next});assert.equal(second.data.items[0].id,'b');assert.equal(second.data.next,null);
  assert(!JSON.stringify(first.data).includes('example.invalid'));
  for(const input of [{limit:101},{limit:0},{after:[] }])assert.equal((await call(e,'admin/events',input)).status,400);
 }finally{e.DB.close();}
});

test('participant roster filters cancellations, paginates and never returns capability hashes',async()=>{
 const e=environment();try{await event(e);await participant(e,'a');await participant(e,'b','cancelled');
  const a=await call(e,'admin/participants',{offeringId:'event',limit:1});assert.equal(a.status,200);assert.equal(a.data.next,'a');assert.equal(a.data.items[0].email,'a@example.invalid');
  assert(!JSON.stringify(a.data).includes('token_hash'));
  const b=await call(e,'admin/participants',{offeringId:'event',status:'cancelled'});assert.deepEqual(b.data.items.map(r=>r.id),['b']);
  assert.equal((await call(e,'admin/participants',{offeringId:'event',status:'anything'})).status,400);
  assert.equal((await call(e,'admin/participants',{})).status,400);
 }finally{e.DB.close();}
});

test('capacity migration prevents reduction below occupied seats and lifecycle remains atomic',async()=>{
 const e=environment();try{await event(e);await participant(e);await participant(e,'r2');
  const bad=await call(e,'admin/lifecycle',{id:'event',action:'change',expectedRevision:1,capacity:1});assert.equal(bad.status,409);assert.equal(bad.data.error,'capacity_below_occupied');
  let row=e.DB.sqlite.prepare('SELECT * FROM offerings').get();assert.equal(row.revision,1);assert.equal(row.capacity,2);assert.equal(e.DB.sqlite.prepare('SELECT count(*) AS n FROM outbox').get().n,0);
  assert.equal((await call(e,'admin/lifecycle',{id:'event',action:'change',expectedRevision:1,capacity:3,status:'closed'})).status,200);
  row=e.DB.sqlite.prepare('SELECT * FROM offerings').get();assert.equal(row.revision,2);assert.equal(row.capacity,3);assert.equal(row.status,'closed');
  assert.equal((await call(e,'admin/lifecycle',{id:'event',action:'change',expectedRevision:1,capacity:4})).status,409);
  assert.equal((await call(e,'admin/lifecycle',{id:'event',action:'cancel',expectedRevision:2})).status,200);
  assert.equal((await call(e,'admin/lifecycle',{id:'event',action:'change',expectedRevision:3,status:'open'})).data.error,'event_finished');
  assert.equal(e.DB.sqlite.prepare("SELECT count(*) AS n FROM registrations WHERE status='cancelled'").get().n,2);
 }finally{e.DB.close();}
});

test('draft opening is revisioned, and individual bookings cannot be created through event admin',async()=>{
 const e=environment();try{await event(e,'draft',2,'draft');assert.equal((await call(e,'admin/lifecycle',{id:'draft',action:'change',expectedRevision:1,status:'open'})).status,200);
  assert.equal((await call(e,'admin/lifecycle',{id:'draft',action:'change',expectedRevision:2,status:'draft'})).status,409);
  assert.equal((await call(e,'admin/offering',{kind:'session'})).data.error,'use_google_calendar');
 }finally{e.DB.close();}
});

test('reminder preparation is deduplicated and never sends with dispatch disabled',async()=>{
 const e=environment();try{await event(e);await participant(e);await participant(e,'cancelled','cancelled');
  await assert.rejects(scheduleReminders(e),/email_disabled/);assert.equal(e.DB.sqlite.prepare('SELECT count(*) AS n FROM outbox').get().n,0);
  assert.deepEqual(await prepareReminders(e),{prepared:1,sent:0});assert.deepEqual(await prepareReminders(e),{prepared:0,sent:0});
  const q=await call(e,'admin/outbox',{status:'pending'});assert.equal(q.data.sendingEnabled,false);assert.equal(q.data.items.length,1);assert.equal(q.data.items[0].template_id,'LIVE-03');
  assert.deepEqual((await call(e,'admin/prepare-reminders')).data,{prepared:0,sent:0});
 }finally{e.DB.close();}
});

test('message preview is read-only, marks stale jobs and hides access for unpaid participants',async()=>{
 const e=environment();try{await event(e);await participant(e);await e.DB.prepare("UPDATE offerings SET price_test_id='price_fixture',amount=100,currency='ron'").run();
  await e.DB.prepare("INSERT INTO orders(id,registration_id,amount,currency,status,updated_at) VALUES('order','r1',100,'ron','pending',?)").bind(now()).run();
  await prepareReminders(e);const id=e.DB.sqlite.prepare('SELECT id FROM outbox').get().id;
  let preview=await call(e,'admin/message-preview',{id});assert.equal(preview.status,200);assert.equal(preview.data.previewOnly,true);assert(!preview.data.text.includes('/private'));
  await e.DB.prepare("UPDATE orders SET status='paid'").run();preview=await call(e,'admin/message-preview',{id});assert(preview.data.text.includes('access.example.invalid/private'));
  await e.DB.prepare("UPDATE registrations SET status='cancelled'").run();preview=await call(e,'admin/message-preview',{id});assert(!preview.data.text.includes('/private'));
  assert.equal(e.DB.sqlite.prepare('SELECT status FROM outbox').get().status,'pending');
  await e.DB.prepare('UPDATE offerings SET revision=revision+1').run();
  preview=await call(e,'admin/message-preview',{id});assert.equal(preview.data.stale,true);assert.equal(preview.data.status,'stopped');
  assert.equal((await call(e,'admin/message-preview',{id:'missing'})).status,404);
 }finally{e.DB.close();}
});

test('migration 0005 upgrades an existing 0001-0004 database without data loss',()=>{
 const db=new DatabaseSync(':memory:');try{
  for(const file of ['0001.sql','0002-smartbill.sql','0003-lifecycle.sql','0004-invoice-refund.sql'])db.exec(readFileSync('infrastructure/migrations/'+file,'utf8'));
  db.prepare("INSERT INTO offerings(id,kind,title,status,starts_at,ends_at,capacity,location) VALUES('old','live','Existing fixture','open',?,?,2,'Online')").run(now()+7200,now()+10800);
  db.prepare("INSERT INTO registrations(id,offering_id,email,token_hash,status,created_at) VALUES('old-r','old','fixture@example.invalid','hash','confirmed',?)").run(now());
  db.exec(readFileSync('infrastructure/migrations/0005-event-admin.sql','utf8'));
  assert.equal(db.prepare('SELECT count(*) AS n FROM registrations').get().n,1);
  assert.throws(()=>db.prepare("UPDATE offerings SET capacity=0 WHERE id='old'").run(),/capacity_below_occupied/);
  assert.equal(db.prepare("SELECT capacity FROM offerings WHERE id='old'").get().capacity,2);
 }finally{db.close();}
});

test('completed registration cancellation is rejected without queue or state changes',async()=>{
 const e=environment();try{await event(e);await participant(e,'done','completed');
  const r=await call(e,'cancel',{token:'capability-done'+'-'.repeat(40)});assert.equal(r.status,409);assert.equal(r.data.error,'registration_completed');
  assert.equal(e.DB.sqlite.prepare('SELECT status FROM registrations').get().status,'completed');assert.equal(e.DB.sqlite.prepare('SELECT count(*) AS n FROM outbox').get().n,0);
 }finally{e.DB.close();}
});

test('outbox with a paid offering and missing payment record never includes the private access link',async()=>{
 const e={...environment(),EMAIL_SEND_ENABLED:'true',APPROVED_TEMPLATE_IDS:'["LIVE-03"]',BREVO_API_KEY:'fixture-not-a-key'};
 try{await event(e);await participant(e);await e.DB.prepare("UPDATE offerings SET price_test_id='price_fixture',amount=100,currency='ron'").run();await prepareReminders(e);
  let calls=0;globalThis.fetch=async(url,options)=>{assert.equal(String(url),'https://api.brevo.com/v3/smtp/email');const payload=JSON.parse(options.body);assert(!payload.textContent.includes('/private'));calls++;return new Response(JSON.stringify({messageId:'mock-only'}));};
  assert.deepEqual(await dispatch(e),{sent:1,review:0});assert.equal(calls,1);
 }finally{e.DB.close();}
});

test('financial administration shows refund review without fiscal client data or provider calls',async()=>{
 const e=environment();try{await event(e);await participant(e);
  await e.DB.prepare("INSERT INTO orders(id,registration_id,amount,currency,status,updated_at) VALUES('order','r1',100,'ron','paid',?)").bind(now()).run();
  await e.DB.prepare("INSERT INTO invoice_jobs(order_id) VALUES('order')").run();
  await e.DB.prepare("UPDATE registrations SET status='cancelled'").run();
  assert.equal((await call(e,'admin/payments')).data.items[0].manualPaymentReviewRequired,true);
  await e.DB.prepare("UPDATE orders SET status='refunded'").run();
  const r=await call(e,'admin/payments');assert.equal(r.status,200);assert.equal(r.data.items[0].accountantReviewRequired,true);assert.equal(r.data.items[0].invoice_job_status,'review');assert.equal(r.data.fiscalIssuanceSupported,false);
  const serialized=JSON.stringify(r.data);assert(!serialized.includes('billing_data'));assert(!serialized.includes('email'));assert(!serialized.includes('token_hash'));
 }finally{e.DB.close();}
});

test('normal, duplicate, full and cancellation flows agree with the new admin counts',async()=>{
 const e=environment();globalThis.fetch=async url=>{assert.equal(String(url),'https://challenges.cloudflare.com/turnstile/v0/siteverify');return new Response(JSON.stringify({success:true,hostname:new URL(origin).hostname,action:'registration'}));};
 try{await event(e,'event',1);const data={email:'synthetic@example.invalid',offeringId:'event',administrative:true,turnstile:'fixture'};
  const first=await call(e,'register',data);assert.equal(first.status,201);assert.equal((await call(e,'register',data)).status,202);assert.equal((await call(e,'register',{...data,email:'other@example.invalid'})).status,409);
  assert.equal((await call(e,'admin/events')).data.items[0].available,0);
  assert.equal((await call(e,'cancel',{token:first.data.token})).status,200);assert.equal((await call(e,'cancel',{token:first.data.token})).status,200);
  const summary=(await call(e,'admin/events')).data.items[0];assert.equal(summary.available,1);assert.equal(summary.cancelled,1);
  assert.equal((await call(e,'register',{...data,email:'other@example.invalid'})).status,201);
 }finally{e.DB.close();}
});
