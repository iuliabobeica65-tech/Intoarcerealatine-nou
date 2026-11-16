import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {handle} from '../infrastructure/api.mjs';
import {prepareGoogleAppointmentLinks} from '../assets/google-appointments.js';

test('Form rejects stale challenge after error and overlapping submits make one request',async()=>{
 const handlers={},status={textContent:''},button={disabled:true};let callbacks,submitted=0,release;
 const form={id:'community-form',elements:{consent:{checked:true}},querySelector:()=>button,reportValidity:()=>true,addEventListener:(event,handler)=>handlers[event]=handler};
 const context={URL,FormData:class{*[Symbol.iterator](){yield ['email','fixture@example.invalid'];yield ['consent','on'];}},window:{turnstile:{render:(_selector,options)=>{callbacks=options;options.callback('first-challenge');return 1;},reset:()=>{}}},document:{querySelector:selector=>selector.includes('#community-form')?form:selector==='#form-status'?status:{hidden:true},createElement:()=>({}),head:{append:()=>context.window.erTurnstileReady()}},fetch:async(path)=>{if(path==='/api/config')return Response.json({community:true,turnstileSiteKey:'fixture',consentVersion:'fixture'});assert.equal(path,'/api/community');submitted++;await new Promise(resolve=>release=resolve);return Response.json({status:'check_email'});}};
 vm.runInNewContext(readFileSync('assets/infrastructure.js','utf8'),context);
 for(let i=0;i<20&&!callbacks;i++)await new Promise(resolve=>setImmediate(resolve));assert.ok(callbacks);
 callbacks['error-callback']();await handlers.submit({preventDefault(){}});assert.equal(submitted,0,'A stale token must not cause a request');
 callbacks.callback('fresh-challenge');const first=handlers.submit({preventDefault(){}});await handlers.submit({preventDefault(){}});assert.equal(submitted,1,'Enter/double-submit must not create overlapping requests');
 callbacks.callback('challenge-during-request');assert.equal(button.disabled,true);release();await first;assert.match(status.textContent,/Verifică e-mailul/);assert.equal(button.disabled,true);
 await handlers.submit({preventDefault(){}});assert.equal(submitted,1,'Another submission needs a fresh post-request challenge');
});

test('Google config stays OFF and only exact HTTPS booking-page URLs can be exposed',async()=>{
 const good='https://calendar.google.com/calendar/appointments/schedules/fixture_schedule';
 const request=()=>new Request('https://fixture.example.invalid/api/config');
 async function config(env){const r=await handle(request(),env);assert.equal(r.status,200);return r.json();}
 assert.equal((await config({GOOGLE_APPOINTMENT_URL:good})).googleAppointmentUrl,null);
 assert.equal((await config({GOOGLE_APPOINTMENTS_ENABLED:'true',GOOGLE_APPOINTMENT_URL:good})).googleAppointmentUrl,good);
 const shared='https://calendar.app.google/fixtureSchedule';assert.equal((await config({GOOGLE_APPOINTMENTS_ENABLED:'true',GOOGLE_APPOINTMENT_URL:shared})).googleAppointmentUrl,shared);
 for(const url of ['javascript:alert(1)','http://calendar.app.google/fixture','https://calendar.app.google.evil.invalid/fixture','https://user:pass@calendar.app.google/fixture','https://calendar.google.com/calendar/u/0/r','https://calendar.app.google/fixture?email=private@example.invalid','https://calendar.app.google/fixture#private'])assert.equal((await config({GOOGLE_APPOINTMENTS_ENABLED:'true',GOOGLE_APPOINTMENT_URL:url})).googleAppointmentUrl,null);
 const body=await config({GOOGLE_APPOINTMENTS_ENABLED:'true',GOOGLE_APPOINTMENT_URL:good,BREVO_API_KEY:'private-fixture-key',ADMIN_TOKEN:'private-admin-fixture'});assert.ok(!JSON.stringify(body).includes('private-'));
});

test('Prepared Google button preserves fallback and never calls Google on page load',async()=>{
 const link={},container={hidden:true,querySelector:()=>link},doc={querySelectorAll:()=>[container]};let calls=0;
 const fetcher=value=>{calls++;assert.equal(value,'/api/config');return Promise.resolve(Response.json({googleAppointmentUrl:null}));};
 await prepareGoogleAppointmentLinks(doc,fetcher);assert.equal(container.hidden,true);assert.equal(link.href,undefined);
 await prepareGoogleAppointmentLinks(doc,()=>Promise.resolve(Response.json({googleAppointmentUrl:'https://evil.invalid/booking'})));assert.equal(container.hidden,true);
 await prepareGoogleAppointmentLinks(doc,()=>Promise.resolve(Response.json({googleAppointmentUrl:'https://calendar.app.google/fixtureSchedule'})));assert.equal(container.hidden,false);assert.equal(link.href,'https://calendar.app.google/fixtureSchedule');assert.equal(calls,1);
 const html=readFileSync('sedinte-individuale.html','utf8');assert.ok(html.includes('hidden data-google-appointment-container'));assert.ok(html.includes('https://wa.me/40758321125'));assert.ok(html.includes('type="module" src="/assets/google-appointments.js"'));
});
