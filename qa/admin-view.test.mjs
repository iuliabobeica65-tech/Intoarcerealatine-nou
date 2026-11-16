import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createReader,pageRows,moneyLabel,reviewLabel,dateLabel} from '../tools/event-admin/read-model.mjs';
import {demoRead} from '../tools/event-admin/demo.mjs';
import {localAdminServer} from '../scripts/preview-event-admin.mjs';

test('viewer adapter rejects mutation sections before calling its transport',async()=>{
 let calls=0;const read=createReader(async()=>{calls++;return {};});
 for(const section of ['dispatch','prepare-reminders','offering','lifecycle','cancel-registration','community','stripe-webhook','../events'])await assert.rejects(read(section));
 assert.equal(calls,0);await read('events');assert.equal(calls,1);
});
test('cursor pagination has no repeats and rejects unbounded pages',()=>{
 const rows=[{id:'c'},{id:'a'},{id:'b'}],first=pageRows(rows,{limit:2});assert.deepEqual(first.items.map(r=>r.id),['a','b']);assert.equal(first.next,'b');assert.deepEqual(pageRows(rows,{after:first.next,limit:2}).items.map(r=>r.id),['c']);
 for(const limit of [0,101,NaN,1.5])assert.throws(()=>pageRows(rows,{limit}));
});
test('synthetic data filters cancellations and preserves capacity summaries',async()=>{
 const events=(await demoRead('events',{limit:100})).items;for(const e of events)assert.equal(e.capacity-e.occupied,e.available);
 const cancelled=await demoRead('participants',{offeringId:'demo-live',status:'cancelled'});assert.equal(cancelled.items.length,1);assert.equal(cancelled.items[0].status,'cancelled');assert(cancelled.items[0].email.endsWith('@example.invalid'));
 const roster=(await demoRead('participants',{offeringId:'demo-live',limit:100})).items;assert.equal(roster.filter(r=>['confirmed','reserved'].includes(r.status)).length,events[0].occupied);
});
test('message preview is explicitly synthetic and shows an obsolete revision',async()=>{
 const old=await demoRead('message-preview',{id:'demo-message-3'});assert.equal(old.stale,true);assert.equal(old.previewOnly,true);assert(!old.text.includes('https://'));assert.equal((await demoRead('outbox')).sendingEnabled,false);
 await assert.rejects(demoRead('message-preview',{id:'absent'}));
});
test('financial presentation separates accounting review, payment review and invalid amounts',()=>{
 assert.equal(reviewLabel({accountantReviewRequired:true}),'Revizuire contabilă');assert.equal(reviewLabel({manualPaymentReviewRequired:true}),'Verificare plată');assert.equal(moneyLabel(null,null),'—');assert.equal(typeof moneyLabel(100,'ron'),'string');assert.match(dateLabel(Date.UTC(2027,0,15,16)/1000),/18:00/);
});
test('loopback viewer serves only its allowlist and refuses writes, APIs, cross-host and external connections',async(t)=>{
 const server=localAdminServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>{server.closeAllConnections();server.close();});const root='http://127.0.0.1:'+server.address().port;
 const page=await fetch(root);assert.equal(page.status,200);assert.match(page.headers.get('Content-Security-Policy'),/connect-src 'none'/);assert.match(page.headers.get('Content-Security-Policy'),/form-action 'none'/);assert.equal(page.headers.get('Cache-Control'),'no-store');assert.match(page.headers.get('X-Robots-Tag'),/noindex/);
 assert.equal((await fetch(root,{method:'POST',body:'{}'})).status,405);assert.equal((await fetch(root+'/api/admin/events')).status,404);assert.equal((await fetch(root+'/.env')).status,404);
 const {request}=await import('node:http');const crossHost=await new Promise((resolve,reject)=>{const r=request(root,{headers:{Host:'outside.example.invalid'}},res=>{res.resume();resolve(res.statusCode);});r.on('error',reject);r.end();});assert.equal(crossHost,403);
 const app=await readFile('tools/event-admin/admin.mjs','utf8');assert(!/innerHTML|localStorage|sessionStorage|fetch\(/.test(app));
});
