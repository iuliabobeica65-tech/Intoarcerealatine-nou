export class HttpError extends Error {
 constructor(status, code) { super(code); this.status=status; this.code=code; }
}
export const now = () => Math.floor(Date.now()/1000);
export function json(data, status=200) {
 return new Response(JSON.stringify(data), {status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
export async function hash(value) {
 return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))].map(x=>x.toString(16).padStart(2,'0')).join('');
}
export async function keyedHash(secret,value) {
 if(!secret || secret.length<32) throw new HttpError(503,'not_configured');
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 return [...new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(value)))].map(x=>x.toString(16).padStart(2,'0')).join('');
}
export function equal(a,b) {
 if(typeof a!=='string'||typeof b!=='string'||a.length!==b.length)return false;
 let diff=0;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0;
}
export function email(value) {
 if(typeof value!=='string'||value.length>254||! /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value.trim()))throw new HttpError(400,'invalid_email');
 return value.trim().toLowerCase();
}
export function name(value='') {
 if(typeof value!=='string'||value.length>80||/[\x00-\x1f<>]/.test(value))throw new HttpError(400,'invalid_name');return value.trim();
}
export function origin(env) {
 let u;try{u=new URL(env.APP_ORIGIN);}catch{throw new HttpError(503,'not_configured');}
 if(u.protocol!=='https:'||u.pathname!=='/'||u.search||u.hash||u.username||u.password)throw new HttpError(503,'not_configured');return u.origin;
}
export async function body(request,env) {
 if(request.method!=='POST')throw new HttpError(405,'method');
 if(request.headers.get('Origin')!==origin(env))throw new HttpError(403,'origin');
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))throw new HttpError(415,'content_type');
 const text=await limitedText(request,8192);
 try{const value=JSON.parse(text);if(!value||Array.isArray(value)||typeof value!=='object')throw Error();return value;}catch{throw new HttpError(400,'invalid_json');}
}
export async function limitedText(request,max) {
 if(Number(request.headers.get('Content-Length'))>max)throw new HttpError(413,'too_large');
 const reader=request.body?.getReader();if(!reader)return '';
 const chunks=[];let total=0;
 while(true){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>max){await reader.cancel();throw new HttpError(413,'too_large');}chunks.push(value);}
 const bytes=new Uint8Array(total);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}return new TextDecoder().decode(bytes);
}
export async function guard(request,env,input) {
 if(!env.DB||!env.TURNSTILE_SECRET)throw new HttpError(503,'not_configured');
 if(input.website)throw new HttpError(400,'invalid_request');
 const id=await keyedHash(env.DATA_HMAC_KEY,`${request.headers.get('CF-Connecting-IP')||'unknown'}:${Math.floor(now()/600)}`);
 const row=await env.DB.prepare('INSERT INTO rate_limits(id,count,expires_at) VALUES(?,1,?) ON CONFLICT(id) DO UPDATE SET count=count+1 RETURNING count').bind(id,now()+1200).first();
 if(row.count>10)throw new HttpError(429,'rate_limit');
 if(typeof input.turnstile!=='string'||input.turnstile.length>2048)throw new HttpError(400,'challenge');
 const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env.TURNSTILE_SECRET,response:input.turnstile}),signal:AbortSignal.timeout(10000)});
 const result=await r.json();
 if(!result.success||result.hostname!==new URL(origin(env)).hostname||result.action!=='registration')throw new HttpError(400,'challenge');
}
export function sandbox(env) {
 if(env.PAYMENTS_TEST_ENABLED!=='true'||env.LIVE_PAYMENTS_ENABLED!=='false'||!env.STRIPE_SECRET_KEY?.startsWith('sk_test_')||!env.STRIPE_WEBHOOK_SECRET?.startsWith('whsec_'))throw new HttpError(503,'payments_disabled');
}
export function admin(request,env) {
 if(!env.ADMIN_TOKEN||env.ADMIN_TOKEN.length<32||!equal(request.headers.get('Authorization'),`Bearer ${env.ADMIN_TOKEN}`))throw new HttpError(403,'forbidden');
}
