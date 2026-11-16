import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {readFileSync} from 'node:fs';
import {database} from './d1-local.mjs';import {handle} from '../infrastructure/api.mjs';import {assertCollectionConfiguration,COLLECTION_DOI_TEMPLATE_ID} from '../infrastructure/newsletter.mjs';
const origin='https://fixture.example.invalid';
function environment(DB){return {DB,APP_ORIGIN:origin,NEWSLETTER_COLLECTION_ONLY:'true',NEWSLETTER_AUTOMATIONS_REVIEWED:'true',NEWSLETTER_PRIVACY_APPROVED:'true',COMMUNITY_ENABLED:'true',REGISTRATIONS_ENABLED:'false',EMAIL_SEND_ENABLED:'false',PAYMENTS_TEST_ENABLED:'false',LIVE_PAYMENTS_ENABLED:'false',INVOICING_ENABLED:'false',BREVO_DOI_TEMPLATE_ID:String(COLLECTION_DOI_TEMPLATE_ID),BREVO_API_KEY:'synthetic-only',TURNSTILE_SECRET:'synthetic-only',TURNSTILE_SITE_KEY:'fixture',DATA_HMAC_KEY:'synthetic-'.repeat(5)};}
test('Both prepared form locations preserve accurate source and return DOI to /newsletter using only template15',async()=>{
 const oldFetch=globalThis.fetch;
 try{for(const source of ['home','newsletter']){
  const DB=database(),env=environment(DB),handlers={},button={disabled:true},status={textContent:''};let payload,calls=0;
  const form={id:'community-form',dataset:{newsletterSource:source},elements:{consent:{checked:true}},querySelector:()=>button,reportValidity:()=>true,addEventListener:(event,handler)=>handlers[event]=handler};
  const context={FormData:class{*[Symbol.iterator](){yield ['email','fixture@example.invalid'];yield ['consent','on'];}},window:{turnstile:{render:(_selector,options)=>{options.callback('synthetic');return 1;},reset(){}}},document:{querySelector:selector=>selector.includes('#community-form')?form:selector==='#form-status'?status:{hidden:true},createElement:()=>({}),head:{append:()=>context.window.erTurnstileReady()}},fetch:async(path,options={})=>handle(new Request(origin+path,{method:options.method||'GET',headers:{...options.headers,Origin:origin},body:options.body}),env)};
  globalThis.fetch=async(url,options)=>{if(url==='https://challenges.cloudflare.com/turnstile/v0/siteverify')return Response.json({success:true,hostname:new URL(origin).hostname,action:'registration'});assert.equal(url,'https://api.brevo.com/v3/contacts/doubleOptinConfirmation');calls++;payload=JSON.parse(options.body);return Response.json({});};
  try{vm.runInNewContext(readFileSync('assets/infrastructure.js','utf8'),context);for(let i=0;i<20&&button.disabled;i++)await new Promise(r=>setImmediate(r));assert.equal(button.disabled,false);await handlers.submit({preventDefault(){}});assert.equal(calls,1);assert.equal(payload.templateId,15);assert.deepEqual(payload.includeListIds,[3]);assert.equal(payload.redirectionUrl,origin+'/newsletter?confirmare=brevo');assert.equal(payload.attributes.CONSENT_SOURCE,origin+(source==='home'?'/acasa#newsletter':'/newsletter'));}finally{DB.close();}
 }}finally{globalThis.fetch=oldFetch;}
});
test('Legacy DOI templates cannot be selected for new collection and unrecognised source is rejected before database writes',async()=>{
 const DB=database();try{const env=environment(DB);for(const id of ['2','8','12','13'])assert.throws(()=>assertCollectionConfiguration({...env,BREVO_DOI_TEMPLATE_ID:id}),/newsletter_doi_template_required/);
 const request=new Request(origin+'/api/community',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({email:'fixture@example.invalid',formSource:'https://evil.example.invalid'})});const response=await handle(request,env);assert.equal(response.status,400);assert.equal((await response.json()).error,'newsletter_source');assert.equal(DB.sqlite.prepare('SELECT count(*) n FROM consent_requests').get().n,0);
 }finally{DB.close();}
});
