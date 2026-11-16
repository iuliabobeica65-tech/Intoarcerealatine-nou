import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {verifyValidationAccess} from '../infrastructure/cloud-validation/access.mjs';import {validationFetch} from '../infrastructure/cloud-validation/worker.mjs';import {now} from '../infrastructure/security.mjs';
const origin='https://pregatire-infrastructura-ema.er-brevo-test-izolat.pages.dev';
const env={...JSON.parse(readFileSync('docs/cloud-validation/wrangler.preview.template.json')).env.preview.vars,VALIDATION_ACTIVE:'true',VALIDATION_ACCESS_DIAGNOSTICS:'true',VALIDATION_EXPIRES_AT:String(now()+600),ACCESS_PREVIEW_AUD:'fixture',ACCESS_OWNER_HMAC:'fixture',DATA_HMAC_KEY:'fixture-'.repeat(8)};
test('Diagnostic reveals only a constant failure stage and keeps Access refusal',async()=>{
 const response=await validationFetch(new Request(origin),env);assert.equal(response.status,403);assert.deepEqual(await response.json(),{error:'access_required',diagnosticStage:'assertion_missing'});
 const ordinary=await validationFetch(new Request(origin),{...env,VALIDATION_ACCESS_DIAGNOSTICS:'false'});assert.deepEqual(await ordinary.json(),{error:'access_required'});
});
test('Raw verifier errors and token contents never enter the diagnostic result',async()=>{
 const token=Buffer.from(JSON.stringify({alg:'RS256',kid:'fixture'})).toString('base64url')+'.'+Buffer.from(JSON.stringify({email:'private@example.invalid'})).toString('base64url')+'.ZmFrZQ';
 const req=new Request(origin,{headers:{'Cf-Access-Jwt-Assertion':token}});let caught;
 try{await verifyValidationAccess(req,env,{getKeys:async()=>{throw Error('sensitive-provider-response');}});}catch(error){caught=error;}
 assert.equal(caught.code,'access_required');assert.equal(caught.validationStage,'public_keys');assert.ok(!JSON.stringify(caught).includes('private@example.invalid'));assert.ok(!JSON.stringify(caught).includes('sensitive-provider-response'));
});
test('Diagnostic window expires within fifteen minutes without any application call',async()=>{
 for(const expiry of [String(now()-1),String(now()+901),'invalid']){const r=await validationFetch(new Request(origin),{...env,VALIDATION_EXPIRES_AT:expiry});assert.equal(r.status,503);assert.equal((await r.json()).error,'diagnostic_expired_or_unconfigured');}
});
