import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createProtectedReader} from '../tools/event-admin/protected-reader.mjs';
const origin='https://fixture.er-brevo-test-izolat.pages.dev',token='fixture-only-not-a-secret-'.repeat(2);
const response=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json'}});
function config(extra={}){return {origin,enabled:true,getToken:()=>token,getPageOrigin:()=>origin,fetcher:async()=>response({items:[],next:null}),...extra};}

test('protected reader refuses production, other projects, credentials and disguised hosts',()=>{
 for(const value of ['https://iuliabobeica.ro','https://intoarcerealatine-nou.pages.dev','https://er-brevo-test-izolat.pages.dev.evil.invalid','http://er-brevo-test-izolat.pages.dev',origin+':8443',origin+'/path',origin+'?token=fixture','https://user:password@fixture.er-brevo-test-izolat.pages.dev','https://nested.fixture.er-brevo-test-izolat.pages.dev'])assert.throws(()=>createProtectedReader(config({origin:value})));
});
test('reader is OFF by default and rejects another page origin before reading a token or using transport',async()=>{
 let calls=0,tokens=0;const e=config({getToken:()=>{tokens++;return token;},fetcher:async()=>{calls++;throw Error('unexpected');}});delete e.enabled;
 await assert.rejects(createProtectedReader(e)('events'),/dezactivată/);
 await assert.rejects(createProtectedReader({...e,enabled:true,getPageOrigin:()=>'http://127.0.0.1:4179'})('events'),/nepermis/);
 assert.equal(calls,0);assert.equal(tokens,0);
});
test('only read sections and bounded filters are accepted without any outbound operation on errors',async()=>{
 let calls=0;const read=createProtectedReader(config({fetcher:async()=>{calls++;return response({items:[],next:null});}}));
 for(const section of ['dispatch','prepare-reminders','offering','lifecycle','cancel-registration','../events'])await assert.rejects(read(section));
 for(const input of [{limit:101},{after:[]},{action:'cancel'},{token:'unexpected'}])await assert.rejects(read('events',input));
 await assert.rejects(read('participants',{}));await assert.rejects(read('outbox',{status:'unknown'}));assert.equal(calls,0);
});
test('same-origin read uses a memory token, refuses redirects and strips unrequested sensitive fields',async()=>{
 let calls=0;const read=createProtectedReader(config({fetcher:async(url,options)=>{
  calls++;assert.equal(String(url),origin+'/api/admin/participants');assert.equal(options.method,'POST');assert.equal(options.headers.Authorization,'Bearer '+token);assert.equal(options.credentials,'same-origin');assert.equal(options.redirect,'error');assert.equal(options.cache,'no-store');assert.equal(options.referrerPolicy,'no-referrer');assert(options.signal instanceof AbortSignal);assert.equal(JSON.parse(options.body).offeringId,'event');
  return response({items:[{id:'r1',name:'Synthetic',email:'fixture@example.invalid',status:'confirmed',token_hash:'must-not-return',billing_data:{address:'must-not-return'},secret:'must-not-return'}],next:null});
 }}));
 const result=await read('participants',{offeringId:'event'});assert.equal(result.items[0].email,'fixture@example.invalid');assert(!JSON.stringify(result).includes('must-not-return'));assert.equal(calls,1);
});
test('errors, Access login pages and network failures are sanitized and never automatically retried',async()=>{
 for(const failure of [async()=>{throw Error(token);},async()=>new Response(token,{status:403}),async()=>new Response(token,{status:503}),async()=>new Response('<html>'+token+'</html>',{headers:{'Content-Type':'text/html'}}),async()=>response({items:'wrong',next:null})]){
  let calls=0;const read=createProtectedReader(config({fetcher:async()=>{calls++;return failure();}}));
  await assert.rejects(read('events'),error=>!error.message.includes(token));assert.equal(calls,1);
 }
});
test('preview response must be explicit and cannot carry a registration capability or token',async()=>{
 const read=createProtectedReader(config({fetcher:async()=>response({previewOnly:true,stale:true,status:'stopped',subject:'Fixture',text:'Only synthetic text',token:'must-not-return'})}));
 const result=await read('message-preview',{id:'message'});assert.equal(result.stale,true);assert.equal(result.token,undefined);
});
test('the local demonstrator does not import the connector or collect credentials',async()=>{
 const app=await readFile('tools/event-admin/admin.mjs','utf8'),server=await readFile('scripts/preview-event-admin.mjs','utf8');
 assert(!app.includes('protected-reader'));assert(!server.includes('protected-reader'));assert(!/localStorage|sessionStorage/.test(await readFile('tools/event-admin/protected-reader.mjs','utf8')));
});
