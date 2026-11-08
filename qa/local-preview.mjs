import {createServer} from 'node:http';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {handle} from '../infrastructure/api.mjs';
const root=resolve('dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.xml':'application/xml','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1:4173');
  if(url.pathname.startsWith('/api/')){
   const response=await handle(new Request(url,{method:req.method}),{});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;
  }
  let file=resolve(root,'.'+decodeURIComponent(url.pathname));if(!file.startsWith(root+sep)&&file!==root){res.writeHead(403);res.end();return;}
  if(file===root)file=resolve(root,'index.html');
  if(!existsSync(file)&&!extname(file))file+='.html';
  if(!existsSync(file)||!statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(readFileSync(file));
 }catch{res.writeHead(500);res.end('Preview error');}
});
server.listen(4173,'127.0.0.1',()=>console.log('Local preview: http://127.0.0.1:4173/comunitate (services OFF)'));
