import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {verifyValidationAccess} from '../infrastructure/cloud-validation/access.mjs';
import {validationFetch} from '../infrastructure/cloud-validation/worker.mjs';
import {keyedHash} from '../infrastructure/security.mjs';
import {database} from './d1-local.mjs';
import {checkCloudContract} from '../scripts/check-cloud-validation.mjs';
import {d1Cases} from '../scripts/cloud-d1-cases.mjs';
const origin='https://pregatire-infrastructura-ema.er-brevo-test-izolat.pages.dev';
const marker='12345678-1234-4234-8234-123456789abc';
const config=JSON.parse(readFileSync('docs/cloud-validation/wrangler.preview.template.json'));
const contract=JSON.parse(readFileSync('docs/cloud-validation/contract.json'));
const base={...config.env.preview.vars,VALIDATION_ACTIVE:'true',VALIDATION_DATABASE_MARKER:marker,ADMIN_TOKEN:'synthetic-admin-'.repeat(4),DATA_HMAC_KEY:'synthetic-hmac-'.repeat(4)};
const request=(path='/api/admin/events',token=base.ADMIN_TOKEN)=>new Request(origin+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',Authorization:'Bearer '+token},body:'{}'});
const allow={verifyAccess:async()=>true};
test('Access: signed RSA identity accepted; altered signature and claims rejected',async()=>{
 const pair=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);
 const key={...await crypto.subtle.exportKey('jwk',pair.publicKey),kid:'fixture',use:'sig'};
 const env={...base,ACCESS_PREVIEW_AUD:'fixture-aud',ACCESS_OWNER_HMAC:await keyedHash(base.DATA_HMAC_KEY,'owner@example.invalid')};
 const claims={iss:base.ACCESS_TEAM_ORIGIN,aud:['fixture-aud'],email:'owner@example.invalid',exp:2000,iat:900};
 const encode=value=>Buffer.from(JSON.stringify(value)).toString('base64url');
 async function token(overrides={},header={alg:'RS256',kid:'fixture'}){const text=encode(header)+'.'+encode({...claims,...overrides});return text+'.'+Buffer.from(await crypto.subtle.sign('RSASSA-PKCS1-v1_5',pair.privateKey,new TextEncoder().encode(text))).toString('base64url');}
 const verify=t=>verifyValidationAccess(new Request(origin,{headers:{'Cf-Access-Jwt-Assertion':t}}),env,{time:1000,getKeys:async()=>[key]});
 assert.equal(await verify(await token()),true);
 for(const change of [{aud:['other']},{iss:'https://other.cloudflareaccess.com'},{email:'other@example.invalid'},{exp:999},{nbf:1001},{iat:1031}])await assert.rejects(verify(await token(change)),/access_required/);
 await assert.rejects(verify(await token({},{alg:'none',kid:'fixture'})),/access_required/);
 const valid=await token(),parts=valid.split('.');parts[1]=encode({...claims,email:'forged@example.invalid'});await assert.rejects(verify(parts.join('.')),/access_required/);
});
test('Access: missing assertion and untrusted key origin fail closed',async()=>{
 await assert.rejects(verifyValidationAccess(new Request(origin),{...base,ACCESS_TEAM_ORIGIN:'https://untrusted.example'},{}),/validation_configuration/);
 await assert.rejects(verifyValidationAccess(new Request(origin),{...base,ACCESS_PREVIEW_AUD:'x',ACCESS_OWNER_HMAC:'x'}),/access_required/);
});
test('Worker: disabled stage, wrong target and provider configuration cannot reach API',async()=>{
 for(const change of [{VALIDATION_ACTIVE:'false'},{TEST_PROJECT:'intoarcerealatine-nou'},{EMAIL_SEND_ENABLED:'true'},{BREVO_API_KEY:'synthetic-forbidden'},{PAYMENTS_TEST_ENABLED:'true'}]){
  const response=await validationFetch(request(),{...base,...change},allow);assert.ok([403,503].includes(response.status));assert.equal(response.headers.get('X-Robots-Tag'),'noindex, nofollow, noarchive');
 }
 assert.equal((await validationFetch(new Request('https://er-brevo-test-izolat.pages.dev/'),base,allow)).status,403);
});
test('Worker: Access, admin authorization and database marker are independent gates',async()=>{
 const db=database();try{
  assert.equal((await validationFetch(request(),{...base,DB:db},{verifyAccess:async()=>{throw Error('denied');}})).status,503);
  assert.equal((await validationFetch(request(undefined,'invalid'),{...base,DB:db},allow)).status,403);
  assert.equal((await validationFetch(request(),{...base,DB:db},allow)).status,503);
  db.sqlite.exec(readFileSync('docs/cloud-validation/bootstrap.sql.template','utf8').replaceAll('NOT_CREATED',marker));
  const response=await validationFetch(request(),{...base,DB:db},allow);assert.equal(response.status,200);assert.equal(response.headers.get('Cache-Control'),'no-store');
  assert.equal((await validationFetch(request(),{...base,DB:db,VALIDATION_DATABASE_MARKER:marker.replace('abc','def')},allow)).status,503);
 }finally{db.close();}
});
test('Worker: signup, payment webhook and dispatch remain inaccessible',async()=>{
 for(const path of ['/api/register','/api/community','/api/stripe/webhook','/api/admin/dispatch'])assert.equal((await validationFetch(request(path),base,allow)).status,403);
});
test('Synthetic migration fixture and refund simulation preserve isolation and review',()=>{
 const db=database();try{
  db.sqlite.exec(readFileSync('docs/cloud-validation/bootstrap.sql.template','utf8').replaceAll('NOT_CREATED',marker));
  assert.equal(db.sqlite.prepare("SELECT count(*) n FROM registrations WHERE email NOT LIKE '%@example.invalid'").get().n,0);
  db.sqlite.exec(readFileSync('docs/cloud-validation/refund-simulation.sql','utf8'));
  assert.equal(db.sqlite.prepare("SELECT status FROM invoice_jobs WHERE order_id='validation-order'").get().status,'review');
  assert.deepEqual(db.sqlite.prepare('PRAGMA foreign_key_check').all(),[]);
 }finally{db.close();}
});
test('Cloud contract rejects a production binding and live financial flag',()=>{
 assert.equal(checkCloudContract(contract,config).preparationPass,true);
 const changed=structuredClone(config);changed.d1_databases=[{database_id:'production'}];assert.equal(checkCloudContract(contract,changed).preparationPass,false);
 changed.d1_databases=[];changed.env.preview.vars.LIVE_PAYMENTS_ENABLED='true';assert.equal(checkCloudContract(contract,changed).preparationPass,false);
 assert.equal(checkCloudContract(contract,config).readyForDeployment,false);
});
test('Prepared D1 capacity/duplicate cases use valid schema and expected constraints',()=>{
 const db=database(),plan=d1Cases();try{
  for(const sql of plan.setup)db.sqlite.exec(sql);
  for(const [name,expected] of [['capacity',3],['duplicates',1]]){let accepted=0;for(const sql of plan[name]){try{db.sqlite.exec(sql);accepted++;}catch(error){assert.match(error.message,/unavailable|UNIQUE/);}}assert.equal(accepted,expected);}
  assert.deepEqual(db.sqlite.prepare('PRAGMA foreign_key_check').all(),[]);
 }finally{db.close();}
});
