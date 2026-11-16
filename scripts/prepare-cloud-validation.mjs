import {readFileSync,readdirSync,mkdirSync,writeFileSync,copyFileSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
const root=process.cwd(),target=resolve(root,'.local/cloud-validation/package-'+Date.now());
const http=process.argv.includes('--http');
const manifestPath=resolve(root,process.argv.find(x=>x.startsWith('--manifest='))?.slice(11)||'.local/cloud-validation/manifest.json');
if(!manifestPath.startsWith(resolve(root,'.local')+'\\')&&!manifestPath.startsWith(resolve(root,'.local')+'/'))throw Error('invalid_manifest_output');
const contract=JSON.parse(readFileSync('docs/cloud-validation/contract.json','utf8'));
if(contract.project!=='er-brevo-test-izolat'||contract.branch!=='pregatire-infrastructura-email-plati'||contract.environment!=='preview')throw Error('wrong_target');
if(!target.startsWith(root+'\\.local\\')&&!target.startsWith(root+'/.local/'))throw Error('invalid_output');
mkdirSync(target,{recursive:true});
const source='tools/event-admin/';
let html=readFileSync(source+'index.html','utf8').replace('<body>','<body data-runtime="cloud-api">');
// Strip local write/backup UI entirely; this stage only connects cloud consultation.
html=html.replace(/<section id="local-controls"[\s\S]*?<\/section>/,'');
writeFileSync(join(target,'index.html'),html);
for(const file of ['admin.css','admin.mjs','read-model.mjs','demo.mjs','cloud-reader.mjs','protected-reader.mjs'])copyFileSync(source+file,join(target,file));
if(http){copyFileSync('tools/validation/http-events.html',join(target,'http-events.html'));copyFileSync('tools/validation/http-events.mjs',join(target,'http-events.mjs'));}
writeFileSync(join(target,'robots.txt'),'User-agent: *\nDisallow: /\n');
writeFileSync(join(target,'_headers'),"/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n  Cache-Control: no-store\n  Referrer-Policy: no-referrer\n  Content-Security-Policy: default-src 'self'; connect-src 'self'; form-action 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'\n");
writeFileSync(join(target,'_routes.json'),JSON.stringify({version:1,include:['/*'],exclude:[]},null,2));
const migrations=readdirSync('infrastructure/migrations').filter(f=>f.endsWith('.sql')).sort();
if(JSON.stringify(migrations)!==JSON.stringify(contract.migrations))throw Error('migration_set_changed');
const sha=file=>createHash('sha256').update(readFileSync(file)).digest('hex');
const manifest={project:contract.project,branch:contract.branch,environment:contract.environment,artifactDirectory:target,preparedOnly:true,deployAuthorized:false,workerCompiled:false,
 profile:http?'synthetic-http-events':'administration',existingDatabaseId:contract.databaseId,
 files:readdirSync(target).filter(f=>f!=='_worker.js').map(file=>({file,sha256:sha(join(target,file))})),migrations:migrations.map(file=>({file,sha256:sha('infrastructure/migrations/'+file)}))};
writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log('Pachet local pregatit; fara resurse cloud, ID D1 sau deployment.');
