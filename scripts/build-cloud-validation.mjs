// Offline bundling only. Pass the path of an already installed esbuild package.
import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
const manifestPath=process.argv[3]||'.local/cloud-validation/manifest.json';
const manifest=JSON.parse(readFileSync(manifestPath));
if(manifest.project!=='er-brevo-test-izolat'||!manifest.preparedOnly||manifest.deployAuthorized)throw Error('wrong_target');
const dir=resolve(manifest.artifactDirectory);
if(!dir.startsWith(resolve('.local/cloud-validation')+'/')&&!dir.startsWith(resolve('.local/cloud-validation')+'\\'))throw Error('invalid_output');
if(!process.argv[2])throw Error('Provide the already installed esbuild package.json path; no installation is performed.');
const require=createRequire(resolve(process.argv[2]));
await require('esbuild').build({entryPoints:['infrastructure/cloud-validation/worker.mjs'],outfile:join(dir,'_worker.js'),bundle:true,format:'esm',platform:'browser',target:'es2022'});
manifest.workerCompiled=true;
manifest.files=readdirSync(dir).sort().map(file=>({file,sha256:createHash('sha256').update(readFileSync(join(dir,file))).digest('hex')}));
manifest.artifactSha256=createHash('sha256').update(JSON.stringify(manifest.files)).digest('hex');
writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({files:manifest.files.length,sha256:manifest.artifactSha256,offline:true}));
