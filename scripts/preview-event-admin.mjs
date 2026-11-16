import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const files={'/':['index.html','text/html; charset=utf-8'],'/admin.css':['admin.css','text/css; charset=utf-8'],'/admin.mjs':['admin.mjs','text/javascript; charset=utf-8'],'/read-model.mjs':['read-model.mjs','text/javascript; charset=utf-8'],'/demo.mjs':['demo.mjs','text/javascript; charset=utf-8']};
export function localAdminServer(){return createServer(async(req,res)=>{
 const headers={'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow, noarchive','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; connect-src 'none'; form-action 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"};
 // Loopback bind plus Host allowlist prevents DNS rebinding to this local viewer.
 if(!/^127\.0\.0\.1(?::\d+)?$/.test(req.headers.host||'')){res.writeHead(403,headers);return res.end();}
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,headers);return res.end();}
 const file=files[new URL(req.url,'http://127.0.0.1').pathname];if(!file){res.writeHead(404,headers);return res.end();}
 try{const bytes=await readFile(new URL('../tools/event-admin/'+file[0],import.meta.url));res.writeHead(200,{...headers,'Content-Type':file[1]});res.end(req.method==='HEAD'?undefined:bytes);}catch{res.writeHead(500,headers);res.end();}
});}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)localAdminServer().listen(4179,'127.0.0.1',()=>console.log('Demonstrație sintetică, numai consultare: http://127.0.0.1:4179/'));
