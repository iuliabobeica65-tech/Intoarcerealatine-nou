import test from 'node:test';import assert from 'node:assert/strict';
import {database} from './d1-local.mjs';import {validationFetch} from '../infrastructure/cloud-validation/worker.mjs';import {HttpError,now} from '../infrastructure/security.mjs';
const origin='https://pregatire-infrastructura-ema.er-brevo-test-izolat.pages.dev',marker='12345678-1234-4234-8234-123456789abc';
function fixture(capacity=1){const DB=database();DB.sqlite.exec("CREATE TABLE _validation_identity(marker TEXT PRIMARY KEY,purpose TEXT); INSERT INTO _validation_identity VALUES('"+marker+"','er-brevo-test-izolat-events-validation');");DB.sqlite.prepare("INSERT INTO offerings(id,kind,title,status,starts_at,ends_at,capacity,location) VALUES('validation-http','live','Fixture','open',?,?,?,'Sintetic')").run(now()+7200,now()+10800,capacity);return {DB,TEST_PROJECT:'er-brevo-test-izolat',VALIDATION_STAGE:'preview',VALIDATION_ACTIVE:'true',VALIDATION_HTTP_REGISTRATIONS:'true',VALIDATION_EXPIRES_AT:String(now()+1800),VALIDATION_DATABASE_ID:'d630add8-e006-4379-b3ee-0b16307afdcb',VALIDATION_DATABASE_MARKER:marker,APP_ORIGIN:origin,TEST_MODE:'true',TEST_RECIPIENT_EMAIL:'owner@example.invalid',TEST_BREVO_LIST_ID:'4',COMMUNITY_ENABLED:'false',EMAIL_SEND_ENABLED:'false',PAYMENTS_TEST_ENABLED:'false',LIVE_PAYMENTS_ENABLED:'false',INVOICING_ENABLED:'false',REGISTRATIONS_ENABLED:'true',BILLING_PROVIDER:'mock',INVOICE_EMAIL_SENDER:'none',APPROVED_TEMPLATE_IDS:'[]',ADMIN_TOKEN:'synthetic-admin-'.repeat(4),DATA_HMAC_KEY:'synthetic-hmac-'.repeat(4),TURNSTILE_SECRET:'fixture-secret',TURNSTILE_SITE_KEY:'fixture-sitekey'};}
const allow={verifyAccess:async()=>true};
function request(path='/api/register',input={},token='synthetic-admin-'.repeat(4),source=origin){return new Request(origin+path,{method:'POST',headers:{Origin:source,Authorization:'Bearer '+token,'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1'},body:JSON.stringify({email:'one@example.invalid',name:'Fixture',offeringId:'validation-http',administrative:true,turnstile:'fixture',...input})});}
function mockChallenge(fn){const old=globalThis.fetch;let calls=0;globalThis.fetch=async url=>{assert.equal(url,'https://challenges.cloudflare.com/turnstile/v0/siteverify');calls++;return fn?fn():Response.json({success:true,hostname:new URL(origin).hostname,action:'registration'});};return {restore:()=>globalThis.fetch=old,calls:()=>calls};}
test('HTTP profile denies Access, bearer, Origin, wrong DB, expiry and non-synthetic inputs before Turnstile',async()=>{
 const e=fixture(),mock=mockChallenge();try{
  assert.equal((await validationFetch(request(),e,{verifyAccess:async()=>{throw new HttpError(403,'access_required');}})).status,403);
  assert.equal((await validationFetch(request('/api/register',{},'bad'),e,allow)).status,403);
  assert.equal((await validationFetch(request('/api/register',{},e.ADMIN_TOKEN,'https://other.invalid'),e,allow)).status,403);
  for(const patch of [{VALIDATION_ACTIVE:'false'},{VALIDATION_EXPIRES_AT:String(now()-1)},{VALIDATION_DATABASE_ID:'wrong'},{TURNSTILE_SECRET:undefined},{BREVO_API_KEY:'forbidden-fixture'},{TEST_MODE:'false'}])assert.equal((await validationFetch(request(),{...e,...patch},allow)).status,503);
  assert.equal((await validationFetch(request('/api/register',{email:'person@example.com'}),e,allow)).status,403);
  assert.equal((await validationFetch(request('/api/register',{offeringId:'production-event'}),e,allow)).status,403);
  assert.equal((await validationFetch(request(),{...e,VALIDATION_DATABASE_MARKER:marker.replace('abc','def')},allow)).status,503);
  assert.equal(mock.calls(),0);assert.equal(e.DB.sqlite.prepare('SELECT count(*) n FROM registrations').get().n,0);
 }finally{mock.restore();e.DB.close();}
});
test('Private HTTP API enrolls, refuses full capacity, deduplicates and cancels idempotently',async()=>{
 const e=fixture(),mock=mockChallenge();try{
  assert.equal((await validationFetch(request(),e,allow)).status,201);
  assert.equal((await validationFetch(request(),e,allow)).status,202);
  assert.equal((await validationFetch(request('/api/register',{email:'two@example.invalid'}),e,allow)).status,409);
  const roster=await validationFetch(request('/api/admin/participants',{offeringId:'validation-http'}),e,allow);assert.equal(roster.status,200);const row=(await roster.json()).items[0];assert.equal(row.token_hash,undefined);
  const cancel=()=>validationFetch(request('/api/admin/cancel-registration',{id:row.id,expectedStatus:'confirmed'}),e,allow);
  assert.equal((await cancel()).status,200);assert.equal((await cancel()).status,200);
  const fresh=await validationFetch(request('/api/register',{email:'two@example.invalid'}),e,allow);assert.equal(fresh.status,201);assert.match(fresh.headers.get('X-Robots-Tag'),/noindex/);assert.match(fresh.headers.get('Content-Security-Policy'),/challenges.cloudflare.com/);
  assert.equal(e.DB.sqlite.prepare("SELECT count(*) n FROM outbox WHERE status='sent'").get().n,0);
 }finally{mock.restore();e.DB.close();}
});
test('Challenge failure, wrong action and network uncertainty never create a registration',async()=>{
 for(const response of [()=>Response.json({success:false}),()=>Response.json({success:true,hostname:new URL(origin).hostname,action:'wrong'}),()=>{throw Error('network');}]){const e=fixture(),mock=mockChallenge(response);try{const r=await validationFetch(request(),e,allow);assert.ok([400,503].includes(r.status));assert.equal(e.DB.sqlite.prepare('SELECT count(*) n FROM registrations').get().n,0);}finally{mock.restore();e.DB.close();}}
});
test('Concurrent HTTP requests preserve capacity through the existing registration API',async()=>{
 const e=fixture(2),mock=mockChallenge();try{const responses=await Promise.all(Array.from({length:4},(_,i)=>validationFetch(request('/api/register',{email:'fixture-'+i+'@example.invalid'}),e,allow)));assert.deepEqual(responses.map(r=>r.status).sort(),[201,201,409,409]);assert.equal(e.DB.sqlite.prepare("SELECT count(*) n FROM registrations WHERE status='confirmed'").get().n,2);}finally{mock.restore();e.DB.close();}
});
test('HTTP rate limit is enforced rather than bypassed by the private profile',async()=>{
 const e=fixture(),mock=mockChallenge();try{for(let i=0;i<10;i++)assert.ok([201,202].includes((await validationFetch(request(),e,allow)).status));assert.equal((await validationFetch(request(),e,allow)).status,429);assert.equal(mock.calls(),10);}finally{mock.restore();e.DB.close();}
});
test('Paid fixtures, marketing, dispatch and unapproved operations remain prohibited',async()=>{
 const e=fixture(),mock=mockChallenge();try{e.DB.sqlite.prepare("UPDATE offerings SET price_test_id='fixture-price',amount=100,currency='ron' WHERE id='validation-http'").run();assert.equal((await validationFetch(request(),e,allow)).status,403);
  for(const path of ['/api/community','/api/checkout','/api/stripe/webhook','/api/admin/dispatch','/api/admin/offering','/api/admin/lifecycle'])assert.equal((await validationFetch(request(path),e,allow)).status,403);
  assert.equal(mock.calls(),0);
 }finally{mock.restore();e.DB.close();}
});
test('Configuration requires authenticated POST and an OFF/expired profile fails closed',async()=>{
 const e=fixture();try{const r=await validationFetch(request('/api/validation/config'),e,allow);assert.equal(r.status,200);const value=await r.json();assert.equal(value.syntheticOnly,true);assert.equal(value.emailSending,false);assert.equal(value.TURNSTILE_SECRET,undefined);
 assert.equal((await validationFetch(new Request(origin+'/api/validation/config',{headers:{Authorization:'Bearer '+e.ADMIN_TOKEN}}),e,allow)).status,405);
 assert.equal((await validationFetch(request('/api/validation/config'),{...e,VALIDATION_ACTIVE:'false'},allow)).status,503);
 }finally{e.DB.close();}
});
