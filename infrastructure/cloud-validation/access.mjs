import {HttpError,keyedHash,equal,now} from '../security.mjs';
const cache=new Map();
function teamOrigin(value){let u;try{u=new URL(value);}catch{throw new HttpError(503,'validation_configuration');}if(u.protocol!=='https:'||u.origin!==value||! /^[a-z0-9-]+\.cloudflareaccess\.com$/.test(u.hostname))throw new HttpError(503,'validation_configuration');return u.origin;}
async function keysFor(team){
 const old=cache.get(team);if(old&&old.until>Date.now())return old.promise;
 // Workers supports manual/follow only. Reject redirects through the status check.
 const promise=(async()=>{const response=await fetch(team+'/cdn-cgi/access/certs',{redirect:'manual',signal:AbortSignal.timeout(5000)});if(!response.ok)throw Error('jwks');const data=await response.json();if(!Array.isArray(data.keys)||data.keys.length>20)throw Error('jwks');return data.keys;})();
 cache.set(team,{promise,until:Date.now()+300000});try{return await promise;}catch(error){cache.delete(team);throw error;}
}
function decode(value){if(!/^[A-Za-z0-9_-]+$/.test(value))throw Error('encoding');return Uint8Array.from(atob(value.replaceAll('-','+').replaceAll('_','/')),c=>c.charCodeAt(0));}
export async function verifyValidationAccess(request,env,{getKeys=keysFor,time=now()}={}){
 const issuer=teamOrigin(env.ACCESS_TEAM_ORIGIN);
 if(!env.ACCESS_PREVIEW_AUD||!env.ACCESS_OWNER_HMAC||!env.DATA_HMAC_KEY)throw new HttpError(503,'validation_configuration');
 let stage='assertion_missing';
 try{
  const token=request.headers.get('Cf-Access-Jwt-Assertion');if(!token)throw Error('token');
  stage='assertion_format';
  if(token.length>16384)throw Error('token');
  const parts=token.split('.');if(parts.length!==3)throw Error('token');const header=JSON.parse(new TextDecoder().decode(decode(parts[0]))),claims=JSON.parse(new TextDecoder().decode(decode(parts[1])));
  stage='algorithm';if(header.alg!=='RS256'||typeof header.kid!=='string'||header.kid.length>200||header.crit)throw Error('algorithm');
  stage='public_keys';const keys=await getKeys(issuer);stage='matching_key';const jwk=keys.find(k=>k.kid===header.kid&&k.kty==='RSA'&&(!k.alg||k.alg==='RS256')&&(!k.use||k.use==='sig'));if(!jwk)throw Error('key');
  stage='signature';
  const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
  if(!await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,decode(parts[2]),new TextEncoder().encode(parts[0]+'.'+parts[1])))throw Error('signature');
  const audience=Array.isArray(claims.aud)?claims.aud:[claims.aud];
  stage='issuer';if(claims.iss!==issuer)throw Error('claims');
  stage='audience';if(!audience.includes(env.ACCESS_PREVIEW_AUD))throw Error('claims');
  stage='expiry';if(!Number.isInteger(claims.exp)||claims.exp<=time)throw Error('claims');
  stage='not_before';if(claims.nbf!==undefined&&(!Number.isInteger(claims.nbf)||claims.nbf>time))throw Error('claims');
  stage='issued_at';if(claims.iat!==undefined&&(!Number.isInteger(claims.iat)||claims.iat>time+30))throw Error('claims');
  stage='owner_identity';if(typeof claims.email!=='string'||!equal(await keyedHash(env.DATA_HMAC_KEY,claims.email.trim().toLowerCase()),env.ACCESS_OWNER_HMAC))throw Error('identity');
  return true;
 }catch{const error=new HttpError(403,'access_required');if(env.VALIDATION_ACCESS_DIAGNOSTICS==='true')error.validationStage=stage;throw error;}
}
