import {database,wrapSqlite} from '../../qa/d1-local.mjs';
import {DatabaseSync,backup} from 'node:sqlite';
import {mkdir,readFile,writeFile,copyFile,readdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {handle} from '../../infrastructure/api.mjs';
import {hash,now} from '../../infrastructure/security.mjs';

const origin='https://local-runtime.example.invalid';
const allowed=new Set(['events','participants','outbox','message-preview','payments','offering','lifecycle','cancel-registration','prepare-reminders']);
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
export async function createLocalRuntime(directory){
 const root=resolve(directory);await mkdir(root,{recursive:true});
 const env={DB:database(),APP_ORIGIN:origin,ADMIN_TOKEN:randomUUID()+randomUUID(),REGISTRATIONS_ENABLED:'true',COMMUNITY_ENABLED:'false',EMAIL_SEND_ENABLED:'false',PAYMENTS_TEST_ENABLED:'false',LIVE_PAYMENTS_ENABLED:'false',INVOICING_ENABLED:'false',APPROVED_TEMPLATE_IDS:'[]'};
 const stamp=now();
 await env.DB.prepare("INSERT INTO offerings(id,kind,title,status,starts_at,ends_at,capacity,location) VALUES('local-live','live','LIVE sintetic local','open',?,?,4,'Online')").bind(stamp+7200,stamp+10800).run();
 for(const [id,status] of [['fixture-1','confirmed'],['fixture-2','reserved'],['fixture-3','cancelled']])await env.DB.prepare('INSERT INTO registrations(id,offering_id,email,name,token_hash,status,created_at) VALUES(?,?,?,?,?,?,?)').bind(id,'local-live',id+'@example.invalid','Participantă sintetică '+id,await hash(randomUUID()),status,stamp).run();
 env.DB.sqlite.exec('PRAGMA user_version=6');
 let chain=Promise.resolve();const exclusive=fn=>{const task=chain.then(fn,fn);chain=task.catch(()=>{});return task;};
 async function snapshot(reason='manual'){
  const id=randomUUID(),file=join(root,id+'.sqlite');await backup(env.DB.sqlite,file);
  const manifest={id,reason,syntheticOnly:true,schemaVersion:6,createdAt:now(),sha256:digest(await readFile(file))};
  await writeFile(join(root,id+'.json'),JSON.stringify(manifest,null,2)+'\n');return manifest;
 }
 async function list(){const rows=[];for(const file of await readdir(root))if(/^[a-f0-9-]{36}\.json$/.test(file)){
  try{const row=JSON.parse(await readFile(join(root,file),'utf8'));if(row.id!==file.slice(0,-5)||row.syntheticOnly!==true||row.schemaVersion!==6)throw Error('invalid');rows.push({id:row.id,createdAt:row.createdAt,reason:row.reason,valid:true});}
  catch{rows.push({id:file.slice(0,-5),createdAt:0,reason:'invalid-manifest',valid:false});}
 }return rows.sort((a,b)=>b.createdAt-a.createdAt);}
 async function restore(id){
  if(typeof id!=='string'||! /^[a-f0-9-]{36}$/.test(id))throw Error('backup_invalid');
  const manifest=JSON.parse(await readFile(join(root,id+'.json'),'utf8')),source=join(root,id+'.sqlite');
  if(manifest.id!==id||manifest.syntheticOnly!==true||manifest.schemaVersion!==6||manifest.sha256!==digest(await readFile(source)))throw Error('backup_invalid');
  const work=join(root,'work-'+randomUUID()+'.sqlite');await copyFile(source,work);const sqlite=new DatabaseSync(work);
  try{if(sqlite.prepare('PRAGMA integrity_check').get().integrity_check!=='ok'||sqlite.prepare('PRAGMA foreign_key_check').all().length||sqlite.prepare('PRAGMA user_version').get().user_version!==6)throw Error('backup_invalid');}
  catch(error){sqlite.close();throw error;}
  let preserved;try{preserved=await snapshot('before-restore');}catch(error){sqlite.close();throw error;}
  const old=env.DB;env.DB=wrapSqlite(sqlite);old.close();return {restored:true,preservedCurrentState:preserved.id};
 }
 return {
  call:(section,input={})=>exclusive(async()=>{
   if(!allowed.has(section))return {status:403,data:{error:'local_operation_disabled'}};
   const response=await handle(new Request(origin+'/api/admin/'+section,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',Authorization:'Bearer '+env.ADMIN_TOKEN},body:JSON.stringify(input)}),env);
   return {status:response.status,data:await response.json()};
  }),
  snapshot:()=>exclusive(()=>snapshot()),backups:()=>exclusive(list),restore:id=>exclusive(()=>restore(id)),
  close:()=>exclusive(()=>env.DB.close())
 };
}
