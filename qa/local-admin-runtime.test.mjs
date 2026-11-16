import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {createLocalRuntime} from '../tools/event-admin/local-runtime.mjs';
import {localRuntimeServer} from '../scripts/local-event-admin.mjs';
const directory=()=>resolve('.local/test-local-runtime/'+randomUUID());
test('private local panel reuses the existing API for state, capacity, cancellations and queue without providers',async()=>{
 const runtime=await createLocalRuntime(directory());try{
  const row=(await runtime.call('events')).data.items[0];assert.equal(row.available,2);
  assert.equal((await runtime.call('lifecycle',{id:row.id,action:'change',expectedRevision:row.revision,capacity:1})).status,409);
  assert.equal((await runtime.call('cancel-registration',{id:'fixture-2',expectedStatus:'reserved'})).status,200);
  assert.equal((await runtime.call('events')).data.items[0].available,3);
  assert.equal((await runtime.call('prepare-reminders')).data.sent,0);assert.equal((await runtime.call('outbox')).data.sendingEnabled,false);
  for(const path of ['dispatch','stripe-webhook','community'])assert.equal((await runtime.call(path)).status,403);
 }finally{await runtime.close();}
});
test('backup and restore preserve prior state and verify checksums without overwriting snapshots',async()=>{
 const dir=directory(),runtime=await createLocalRuntime(dir);try{
  const saved=await runtime.snapshot(),original=await readFile(join(dir,saved.id+'.sqlite'));
  await runtime.call('cancel-registration',{id:'fixture-2',expectedStatus:'reserved'});assert.equal((await runtime.call('events')).data.items[0].available,3);
  const result=await runtime.restore(saved.id);assert.equal(result.restored,true);assert.equal((await runtime.call('events')).data.items[0].available,2);assert(result.preservedCurrentState);assert.deepEqual(await readFile(join(dir,saved.id+'.sqlite')),original);
  await runtime.restore(result.preservedCurrentState);assert.equal((await runtime.call('events')).data.items[0].available,3);
 }finally{await runtime.close();}
});
test('corrupt snapshots and traversal attempts cannot replace the active local database',async()=>{
 const dir=directory(),runtime=await createLocalRuntime(dir);try{
  const saved=await runtime.snapshot();await writeFile(join(dir,saved.id+'.sqlite'),'corrupt fixture');await assert.rejects(runtime.restore(saved.id));await assert.rejects(runtime.restore('../outside'));
  assert.equal((await runtime.call('events')).data.items[0].available,2);
 }finally{await runtime.close();}
});
test('one corrupt backup manifest does not hide the remaining valid recovery points',async()=>{
 const dir=directory(),runtime=await createLocalRuntime(dir);try{const saved=await runtime.snapshot(),bad=randomUUID();await writeFile(join(dir,bad+'.json'),'invalid fixture');const rows=await runtime.backups();assert.equal(rows.find(r=>r.id===saved.id).valid,true);assert.equal(rows.find(r=>r.id===bad).valid,false);assert.equal((await runtime.call('events')).data.items[0].available,2);}finally{await runtime.close();}
});
test('local HTTP requires its session and exact origin, and blocks dispatch and secrets',async(t)=>{
 const runtime=await createLocalRuntime(directory()),server=localRuntimeServer(runtime);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(async()=>{server.closeAllConnections();server.close();await runtime.close();});const origin='http://127.0.0.1:'+server.address().port;
 const session=await fetch(origin+'/local/session').then(r=>r.json());assert.equal(session.syntheticOnly,true);
 const call=(path,data={},extra={})=>fetch(origin+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','X-Local-Session':session.nonce,...extra},body:JSON.stringify(data)});
 assert.equal((await call('/api/admin/events',{}, {'X-Local-Session':''})).status,403);assert.equal((await call('/api/admin/events',{}, {Origin:'https://wrong.example.invalid'})).status,403);
 assert.equal((await call('/api/admin/dispatch')).status,403);assert.equal((await fetch(origin+'/.env')).status,405);assert.equal((await fetch(origin+'/local-runtime.mjs')).status,405);
 const page=await fetch(origin);assert((await page.text()).includes('data-runtime="local-api"'));assert.match(page.headers.get('Content-Security-Policy'),/connect-src 'self'/);
 const result=await call('/api/admin/participants',{offeringId:'local-live'});assert.equal(result.status,200);const text=await result.text();assert(!text.includes('token_hash'));assert(!text.includes('ADMIN_TOKEN'));
});
