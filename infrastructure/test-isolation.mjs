import {HttpError,email,origin} from './security.mjs';

export function doiList(env) {
 if(env.TEST_MODE===undefined||env.TEST_MODE==='false')return 3;
 const id=Number(env.TEST_BREVO_LIST_ID);
 if(env.TEST_MODE!=='true'||!/^\d+$/.test(env.TEST_BREVO_LIST_ID||'')||!Number.isSafeInteger(id)||id<1||id===3)throw new HttpError(503,'test_not_configured');
 return id;
}

// Opt-in isolation profile. No recipient address is stored in source or public config.
export function isolatedRecipient(env,address) {
 if(env.TEST_MODE===undefined||env.TEST_MODE==='false')return;
 if(env.TEST_MODE!=='true')throw new HttpError(503,'test_not_configured');
 let allowed,hostname;
 try{allowed=email(env.TEST_RECIPIENT_EMAIL);hostname=new URL(origin(env)).hostname.replace(/\.$/,'');}
 catch{throw new HttpError(503,'test_not_configured');}
 if(hostname==='iuliabobeica.ro'||hostname.endsWith('.iuliabobeica.ro'))throw new HttpError(503,'test_not_configured');
 if(email(address)!==allowed)throw new HttpError(403,'test_recipient');
}

export function isolatedBrevoRequest(env,path,payload) {
 if(env.TEST_MODE===undefined||env.TEST_MODE==='false')return;
 if(path==='contacts/doubleOptinConfirmation') {
  isolatedRecipient(env,payload.email);
  if(!Array.isArray(payload.includeListIds)||payload.includeListIds.length!==1||payload.includeListIds[0]!==doiList(env)||payload.excludeListIds!==undefined)throw new HttpError(403,'test_list');
 }else if(path==='smtp/email') {
  if(!Array.isArray(payload.to)||payload.to.length!==1||payload.cc||payload.bcc||payload.messageVersions)throw new HttpError(403,'test_recipient');
  isolatedRecipient(env,payload.to[0]?.email);
 }else throw new HttpError(503,'test_operation');
}
