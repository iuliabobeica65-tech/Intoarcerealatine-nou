import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
test('Compiled isolated artifact has exact allowlist and matches its manifest',()=>{
 const m=JSON.parse(readFileSync('.local/cloud-validation/manifest.json'));
 assert.equal(m.workerCompiled,true);assert.equal(m.deployAuthorized,false);
 assert.deepEqual(readdirSync(m.artifactDirectory).sort(),['_headers','_routes.json','_worker.js','admin.css','admin.mjs','cloud-reader.mjs','demo.mjs','index.html','protected-reader.mjs','read-model.mjs','robots.txt'].sort());
 for(const f of m.files)assert.equal(createHash('sha256').update(readFileSync(join(m.artifactDirectory,f.file))).digest('hex'),f.sha256);
 const html=readFileSync(join(m.artifactDirectory,'index.html'),'utf8');assert.match(html,/data-runtime="cloud-api"/);assert.doesNotMatch(html,/id="local-controls"/);
 const worker=readFileSync(join(m.artifactDirectory,'_worker.js'),'utf8');assert.doesNotMatch(worker,/node:sqlite|node:fs|sk_live_|xkeysib-/);assert.match(worker,/verifyValidationAccess/);
});
