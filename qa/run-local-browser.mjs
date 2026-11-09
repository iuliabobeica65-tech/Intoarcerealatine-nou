import {spawn} from 'node:child_process';
const server=spawn(process.execPath,['qa/local-preview.mjs'],{stdio:['ignore','pipe','inherit'],windowsHide:true});
try{
 await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(Error('preview_exit:'+code)));});
 const script=process.argv[2]==='infrastructure'?'qa/browser-infrastructure.mjs':process.argv[2]==='consent'?'qa/browser-consent.mjs':'qa/browser-smoke.mjs';
 const check=spawn(process.execPath,[script],{stdio:'inherit',env:process.env,windowsHide:true});
 const code=await new Promise((resolve,reject)=>{check.once('exit',resolve);check.once('error',reject);});
 if(code!==0)process.exitCode=code||1;
}finally{server.kill();}
