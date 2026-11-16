import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {database} from './d1-local.mjs';
import {handle} from '../infrastructure/api.mjs';
import {checkIsolatedConfig} from '../scripts/check-isolated-config.mjs';

const origin='https://fixture.er-brevo-test-izolat.pages.dev';
const vars=JSON.parse(readFileSync('docs/cloud-validation/isolated-current-off.json')).vars;
const fixture={...vars,APP_ORIGIN:origin,TEST_RECIPIENT_EMAIL:'owner@example.invalid',BREVO_API_KEY:'fixture-only',TURNSTILE_SECRET:'fixture-only',TURNSTILE_SITE_KEY:'fixture',DATA_HMAC_KEY:'fixture-'.repeat(8),ADMIN_TOKEN:'fixture-'.repeat(8)};
const target={expectedListId:'7',expectedDoiTemplateId:'12'};

test('Current isolated OFF profile checks exact list/template and public redirect without revealing secrets',()=>{
 assert.equal(checkIsolatedConfig(fixture,target).configurationPass,true);
 for(const patch of [{TEST_BREVO_LIST_ID:'4'},{BREVO_DOI_TEMPLATE_ID:'2'},{TEST_DOI_REDIRECTION_URL:origin}])assert.equal(checkIsolatedConfig({...fixture,...patch},target).configurationPass,false);
 const output=JSON.stringify(checkIsolatedConfig(fixture,target));assert.ok(!output.includes('owner@'));assert.ok(!output.includes('fixture-only'));
});

test('Newsletter page script integrates with the real API and consent ledger in a synthetic DOM',async()=>{
 const DB=database(),env={...fixture,COMMUNITY_ENABLED:'true',DB};const previousFetch=globalThis.fetch;
 let providerCalls=0,challengeCalls=0,payload;const handlers={};
 const status={textContent:''},button={disabled:true};
 const form={id:'community-form',elements:{consent:{checked:true}},querySelector:()=>button,reportValidity:()=>true,addEventListener:(event,handler)=>{handlers[event]=handler;}};
 const html=readFileSync('comunitate.html','utf8');for(const required of ['id="community-form"','id="email"','name="consent"','required','/assets/infrastructure.js'])assert.ok(html.includes(required));
 const context={console,FormData:class{*[Symbol.iterator](){yield ['email','owner@example.invalid'];yield ['name','Fixture'];yield ['consent','on'];yield ['website',''];}},window:{turnstile:{render:(_selector,options)=>{options.callback('synthetic-token');return 1;},reset:()=>{}}},document:{querySelector:selector=>selector.includes('#community-form')?form:selector==='#form-status'?status:{hidden:true},createElement:()=>({}),head:{append:()=>context.window.erTurnstileReady()}},fetch:async(path,options={})=>handle(new Request(origin+path,{method:options.method||'GET',headers:{...options.headers,Origin:origin},body:options.body}),env)};
 try{
  globalThis.fetch=async(url,options)=>{if(url==='https://challenges.cloudflare.com/turnstile/v0/siteverify'){challengeCalls++;return Response.json({success:true,hostname:new URL(origin).hostname,action:'registration'});}assert.equal(url,'https://api.brevo.com/v3/contacts/doubleOptinConfirmation');providerCalls++;payload=JSON.parse(options.body);return Response.json({});};
  vm.runInNewContext(readFileSync('assets/infrastructure.js','utf8'),context);
  for(let i=0;i<20&&button.disabled;i++)await new Promise(resolve=>setImmediate(resolve));assert.equal(button.disabled,false,'Config and synthetic Turnstile enable the existing form');
  await handlers.submit({preventDefault(){}});assert.match(status.textContent,/Verifică e-mailul/);
  assert.equal(providerCalls,1);assert.equal(challengeCalls,1);assert.deepEqual(payload.includeListIds,[7]);assert.equal(payload.templateId,12);assert.equal(payload.redirectionUrl,'https://iuliabobeica.ro/live');assert.equal(payload.attributes,undefined);
  const rows=DB.sqlite.prepare('SELECT email_hash,version,status FROM consent_requests').all();assert.equal(rows.length,1);assert.equal(rows[0].status,'submitted');assert.match(rows[0].email_hash,/^[a-f0-9]{64}$/);assert.equal(DB.sqlite.prepare('SELECT count(*) n FROM outbox').get().n,0);
 }finally{globalThis.fetch=previousFetch;DB.close();}
});
