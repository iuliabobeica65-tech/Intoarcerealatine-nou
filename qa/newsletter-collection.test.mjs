import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {handle} from '../infrastructure/api.mjs';import {brevo} from '../infrastructure/brevo.mjs';import {database} from './d1-local.mjs';
import {COLLECTION_CONSENT_TEXT,COLLECTION_CONSENT_VERSION,COLLECTION_DOI_TEMPLATE_ID} from '../infrastructure/newsletter.mjs';import preview from '../tools/newsletter-preview/worker.mjs';
const origin='https://newsletter.example.invalid';
function env(DB){return {DB,APP_ORIGIN:origin,NEWSLETTER_COLLECTION_ONLY:'true',NEWSLETTER_AUTOMATIONS_REVIEWED:'true',NEWSLETTER_PRIVACY_APPROVED:'true',COMMUNITY_ENABLED:'true',EMAIL_SEND_ENABLED:'false',REGISTRATIONS_ENABLED:'false',PAYMENTS_TEST_ENABLED:'false',LIVE_PAYMENTS_ENABLED:'false',INVOICING_ENABLED:'false',TEST_MODE:'false',BREVO_DOI_TEMPLATE_ID:String(COLLECTION_DOI_TEMPLATE_ID),BREVO_API_KEY:'synthetic',TURNSTILE_SECRET:'synthetic',DATA_HMAC_KEY:'synthetic-only-'.repeat(5)};}
function req(input){return new Request(origin+'/api/community',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(input)});}
const input={email:'synthetic@example.invalid',name:'MUST NOT STORE',consent:true,consentVersion:COLLECTION_CONSENT_VERSION,turnstile:'synthetic'};
test('Collection-only writes no clear email/name to D1 and requests only DOI to public list3',async()=>{
 const DB=database(),e=env(DB),old=globalThis.fetch;let doi=0,payload;
 try{globalThis.fetch=async(url,options)=>{if(url==='https://challenges.cloudflare.com/turnstile/v0/siteverify')return Response.json({success:true,hostname:new URL(origin).hostname,action:'registration'});assert.equal(url,'https://api.brevo.com/v3/contacts/doubleOptinConfirmation');doi++;payload=JSON.parse(options.body);return Response.json({});};
 assert.equal((await handle(req({...input,consentVersion:'community-2026-11-08-v1'}),e)).status,400);assert.equal(doi,0);
 assert.equal((await handle(req(input),e)).status,202);assert.equal(doi,1);assert.deepEqual(payload.includeListIds,[3]);assert.equal(payload.templateId,COLLECTION_DOI_TEMPLATE_ID);assert.equal(payload.attributes.PRENUME,undefined);assert.equal(payload.attributes.CONSENT_VERSION,COLLECTION_CONSENT_VERSION);assert.equal(payload.attributes.CONSENT_SOURCE,origin+'/newsletter');assert.equal(payload.contactPixelTrackingConsent,false);
 const rows=DB.sqlite.prepare('SELECT * FROM consent_requests').all();assert.equal(rows.length,1);assert.equal(rows[0].status,'submitted');assert.ok(!JSON.stringify(rows).includes(input.email));assert.ok(!JSON.stringify(rows).includes(input.name));assert.equal(DB.sqlite.prepare('SELECT count(*) n FROM registrations').get().n,0);assert.equal(DB.sqlite.prepare('SELECT count(*) n FROM outbox').get().n,0);
 await assert.rejects(()=>brevo(e,'smtp/email',{to:[{email:input.email}]}),/newsletter_doi_only/);assert.equal(doi,1);
 }finally{globalThis.fetch=old;DB.close();}
});
test('Collection refuses unreviewed automation configuration, test profile or isolated DOI before processing',async()=>{
 const DB=database();try{for(const patch of [{NEWSLETTER_AUTOMATIONS_REVIEWED:'false'},{NEWSLETTER_PRIVACY_APPROVED:'false'},{TEST_MODE:'true',TEST_BREVO_LIST_ID:'7'},{BREVO_DOI_TEMPLATE_ID:'12'},{EMAIL_SEND_ENABLED:'true'}])assert.equal((await handle(req(input),{...env(DB),...patch})).status,503);assert.equal(DB.sqlite.prepare('SELECT count(*) n FROM consent_requests').get().n,0);}finally{DB.close();}
});
test('Email-only form matches new consent and private preview accepts no data',async()=>{
 const html=readFileSync('comunitate.html','utf8');assert.ok(!html.includes('name="name"'));assert.ok(html.includes(COLLECTION_CONSENT_TEXT));assert.ok(/type="checkbox" name="consent" required/.test(html));assert.ok(!/type="checkbox"[^>]*\bchecked\b/.test(html));
 const config=await (await preview.fetch(new Request(origin+'/api/config'),{})).json();assert.equal(config.community,false);assert.equal(config.consentVersion,COLLECTION_CONSENT_VERSION);assert.equal((await preview.fetch(req(input),{})).status,503);
 const policy=readFileSync('politica-confidentialitate.html','utf8');for(const text of ['contact@iuliabobeica.ro','Brevo','pseudonimizate','12 luni','viitor SRL','ANSPDCP','necesită validare juridică'])assert.ok(policy.includes(text),text);
});
test('Public configuration never enables collection without reviews and absent consent makes no writes',async()=>{
 const DB=database(),e=env(DB);try{
  for(const patch of [{NEWSLETTER_AUTOMATIONS_REVIEWED:'false'},{NEWSLETTER_PRIVACY_APPROVED:'false'},{EMAIL_SEND_ENABLED:'true'}]){const c=await (await handle(new Request(origin+'/api/config'),{...e,...patch})).json();assert.equal(c.community,false);assert.equal(c.consentVersion,COLLECTION_CONSENT_VERSION);}
  assert.equal((await handle(req({...input,consent:false}),e)).status,400);assert.equal(DB.sqlite.prepare('SELECT count(*) n FROM consent_requests').get().n,0);
 }finally{DB.close();}
});
