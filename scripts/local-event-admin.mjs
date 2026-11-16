import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {randomUUID} from 'node:crypto';
import {createLocalRuntime} from '../tools/event-admin/local-runtime.mjs';
const assets={'/':['index.html','text/html; charset=utf-8'],'/admin.css':['admin.css','text/css; charset=utf-8'],'/admin.mjs':['admin.mjs','text/javascript; charset=utf-8'],'/read-model.mjs':['read-model.mjs','text/javascript; charset=utf-8'],'/demo.mjs':['demo.mjs','text/javascript; charset=utf-8'],'/local-reader.mjs':['local-reader.mjs','text/javascript; charset=utf-8'],'/local-controls.mjs':['local-controls.mjs','text/javascript; charset=utf-8']};
export function localRuntimeServer(runtime){
 const nonce=randomUUID()+randomUUID();
 return createServer(async(req,res)=>{
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow, noarchive','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; connect-src 'self'; form-action 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"};
  const send=(status,data)=>{res.writeHead(status,headers);res.end(JSON.stringify(data));};
  if(!/^127\.0\.0\.1(?::\d+)?$/.test(req.headers.host||''))return send(403,{error:'host'});
  try{
   const url=new URL(req.url,'http://'+req.headers.host),file=assets[url.pathname];
   if(file&&req.method==='GET'){let bytes=await readFile(new URL('../tools/event-admin/'+file[0],import.meta.url));if(url.pathname==='/')bytes=Buffer.from(bytes.toString().replace('<body>','<body data-runtime="local-api">'));res.writeHead(200,{...headers,'Content-Type':file[1]});return res.end(bytes);}
   if(url.pathname==='/local/session'&&req.method==='GET')return send(200,{nonce,syntheticOnly:true});
   if(req.method!=='POST')return send(405,{error:'method'});
   if(req.headers.origin!=='http://'+req.headers.host||req.headers['x-local-session']!==nonce||!req.headers['content-type']?.startsWith('application/json'))return send(403,{error:'local_session'});
   const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>8192)return send(413,{error:'too_large'});chunks.push(chunk);}let data;try{data=JSON.parse(Buffer.concat(chunks).toString());}catch{return send(400,{error:'invalid_json'});}
   if(!data||typeof data!=='object'||Array.isArray(data))return send(400,{error:'invalid_json'});
   if(url.pathname==='/local/backup')return send(201,await runtime.snapshot());
   if(url.pathname==='/local/backups')return send(200,{items:await runtime.backups()});
   if(url.pathname==='/local/restore')return send(200,await runtime.restore(data.id));
   const section=url.pathname.match(/^\/api\/admin\/([a-z-]+)$/)?.[1];if(!section)return send(404,{error:'not_found'});
   const result=await runtime.call(section,data);return send(result.status,result.data);
  }catch{return send(503,{error:'local_service_error'});}
 });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const runtime=await createLocalRuntime(resolve('.local/admin-runtime'));localRuntimeServer(runtime).listen(4180,'127.0.0.1',()=>console.log('Panou local + API existent + SQLite sintetic: http://127.0.0.1:4180/'));}
