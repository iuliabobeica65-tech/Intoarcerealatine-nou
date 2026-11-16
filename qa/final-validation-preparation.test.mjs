import test from 'node:test';
import assert from 'node:assert/strict';
import {controlledDoi} from '../tools/validation/controlled-doi.mjs';
import {measureBatch} from '../tools/validation/performance.mjs';
import {createHash} from 'node:crypto';
const authorizedHash=()=>createHash('sha256').update('owner@example.invalid').digest('hex');
const fixture={BREVO_CONTROLLED_TEST_APPROVED:'true',TEST_MODE:'true',TEST_BREVO_LIST_ID:'4',BREVO_DOI_TEMPLATE_ID:'2',EMAIL_SEND_ENABLED:'false',LIVE_PAYMENTS_ENABLED:'false',APP_ORIGIN:'https://fixture.er-brevo-test-izolat.pages.dev',TEST_RECIPIENT_EMAIL:'owner@example.invalid',BREVO_API_KEY:'fixture-only'};
function ledger(){let claimed=false;return {exists:()=>claimed,claim:()=>{if(claimed)throw Error('already');claimed=true;}};}
test('Provider preparation defaults to no email and no ledger changes',async()=>{
 let calls=0;const result=await controlledDoi({env:fixture,store:{exists(){throw Error('unexpected');},claim(){throw Error('unexpected');}},deliver:async()=>calls++});assert.equal(calls,0);assert.equal(result.realEmailRequested,false);
});
test('Live, wrong-list and unapproved test plans fail before a provider call',async()=>{
 let calls=0;for(const patch of [{BREVO_CONTROLLED_TEST_APPROVED:'false'},{TEST_MODE:'false'},{TEST_BREVO_LIST_ID:'3'},{APP_ORIGIN:'https://iuliabobeica.ro'},{EMAIL_SEND_ENABLED:'true'},{TEST_RECIPIENT_EMAIL:'other@example.invalid'}])await assert.rejects(controlledDoi({send:true,env:{...fixture,...patch},authorizedHash,store:ledger(),deliver:async()=>calls++}));assert.equal(calls,0);
});
test('One claimed DOI attempt cannot be resent, including after uncertain delivery',async()=>{
 const store=ledger();let calls=0;const deliver=async()=>{calls++;throw Error('uncertain');};await assert.rejects(controlledDoi({send:true,env:fixture,store,deliver,authorizedHash}),/unresolved/);await assert.rejects(controlledDoi({send:true,env:fixture,store,deliver,authorizedHash}),/already_claimed/);assert.equal(calls,1);
});
test('Successful controlled request remains unconfirmed and cannot trigger a second attempt',async()=>{
 const store=ledger();let calls=0;
 const options={send:true,env:fixture,store,authorizedHash,deliver:async(env,input,origin)=>{calls++;assert.equal(input.email,'owner@example.invalid');assert.equal(input.name,'');assert.equal(origin,fixture.APP_ORIGIN);}};
 const result=await controlledDoi(options);assert.equal(result.realEmailRequested,true);assert.equal(result.confirmationVerified,false);assert.equal(result.welcomeVerified,false);
 await assert.rejects(controlledDoi(options),/already_claimed/);assert.equal(calls,1);
});
test('Performance runner limits concurrency and emits only aggregate metrics',async()=>{
 let active=0,max=0;const result=await measureBatch({requests:12,concurrency:3,invoke:async()=>{active++;max=Math.max(max,active);await Promise.resolve();active--;return {status:200,body:{private:'must_not_escape'}};}});assert.equal(max,3);assert.equal(result.completed,12);assert.equal(result.stopped,false);assert.ok(!JSON.stringify(result).includes('private'));assert.ok(result.p99Ms>=result.p50Ms);
});
test('Unexpected errors stop new work without retry or an excessive batch',async()=>{
 let calls=0;const result=await measureBatch({requests:120,concurrency:6,invoke:async()=>{calls++;return {status:503};}});assert.ok(calls<=6);assert.equal(result.stopped,true);await assert.rejects(measureBatch({requests:121,concurrency:6,invoke:async()=>({status:200})}));
});
