import test from 'node:test';
import assert from 'node:assert/strict';
import {database} from './d1-local.mjs';
import {DOI_CLAIM_SQL,requestDoi} from '../infrastructure/brevo.mjs';
import {handle,CONSENT_VERSION} from '../infrastructure/api.mjs';
const origin='https://preview.example.invalid';
function fixture(){return {DB:database(),APP_ORIGIN:origin,DATA_HMAC_KEY:'synthetic-hmac-'.repeat(4),COMMUNITY_ENABLED:'true',TURNSTILE_SECRET:'fixture',BREVO_API_KEY:'fixture-only',BREVO_DOI_TEMPLATE_ID:'2',TEST_MODE:'true',TEST_BREVO_LIST_ID:'4',TEST_RECIPIENT_EMAIL:'owner@example.invalid'};}
const request=()=>new Request(origin+'/api/community',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({email:'owner@example.invalid',consent:true,consentVersion:CONSENT_VERSION,turnstile:'fixture'})});
test('Atomic claim suppresses stale-read contenders across the UTC day boundary',async()=>{
 const db=database();try{const claim=(id,t)=>db.prepare(DOI_CLAIM_SQL).bind(id,'synthetic-hash',CONSENT_VERSION,t,Math.floor(t/86400),'synthetic-hash',t-86400).first();
  assert.ok(await claim('first',86399));assert.equal(await claim('second',86400),null);assert.equal(await claim('third',90000),null);
  assert.ok(await claim('later-explicit-request',172800));
 }finally{db.close();}
});
test('Rolling DOI lookup reuses the existing email/time index',()=>{
 const db=database();try{const plan=db.sqlite.prepare('EXPLAIN QUERY PLAN '+DOI_CLAIM_SQL).all('fixture','hash',CONSENT_VERSION,86400,1,'hash',0);assert.ok(plan.some(row=>/SEARCH.*consent_recent/.test(row.detail)));}
 finally{db.close();}
});
test('Ambiguous DOI 5xx stays pending and is not resent after midnight',async()=>{
 const e=fixture(),oldFetch=globalThis.fetch,oldNow=Date.now;let time=86399000,sends=0;
 Date.now=()=>time;
 globalThis.fetch=async url=>{if(String(url).includes('turnstile'))return Response.json({success:true,hostname:'preview.example.invalid',action:'registration'});assert.equal(url,'https://api.brevo.com/v3/contacts/doubleOptinConfirmation');sends++;return new Response('{}',{status:503});};
 try{assert.equal((await handle(request(),e)).status,502);time=86400000;assert.equal((await handle(request(),e)).status,202);assert.equal(sends,1);assert.equal((await e.DB.prepare('SELECT status FROM consent_requests').first()).status,'pending');}
 finally{Date.now=oldNow;globalThis.fetch=oldFetch;e.DB.close();}
});
test('API test payload targets only list 4 without manufacturing DOI or subscription attributes',async()=>{
 const e=fixture(),old=globalThis.fetch;let calls=0;
 globalThis.fetch=async(url,options)=>{calls++;assert.equal(url,'https://api.brevo.com/v3/contacts/doubleOptinConfirmation');const p=JSON.parse(options.body);assert.deepEqual(p.includeListIds,[4]);assert.equal(p.templateId,2);assert.equal(p.attributes,undefined);assert.equal(p.contactPixelTrackingConsent,false);assert.equal(p.excludeListIds,undefined);return Response.json({});};
 try{await requestDoi(e,{email:'owner@example.invalid',name:'Fixture',version:CONSENT_VERSION,requestedAt:1000},origin);assert.equal(calls,1);}
 finally{globalThis.fetch=old;e.DB.close();}
});
test('Definitive rejection is failed, without a welcome or subscription update',async()=>{
 const e=fixture(),old=globalThis.fetch;
 globalThis.fetch=async url=>String(url).includes('turnstile')?Response.json({success:true,hostname:'preview.example.invalid',action:'registration'}):new Response('{}',{status:400});
 try{assert.equal((await handle(request(),e)).status,502);assert.equal((await e.DB.prepare('SELECT status FROM consent_requests').first()).status,'failed');assert.equal((await e.DB.prepare('SELECT count(*) n FROM outbox').first()).n,0);}
 finally{globalThis.fetch=old;e.DB.close();}
});
