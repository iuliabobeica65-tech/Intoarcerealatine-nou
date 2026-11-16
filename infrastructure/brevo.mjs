import { HttpError } from './security.mjs';
import {isolatedBrevoRequest,doiList} from './test-isolation.mjs';
import {collectionOnly,assertCollectionConfiguration,COLLECTION_DOI_TEMPLATE_ID,COLLECTION_FORM_PATH} from './newsletter.mjs';
// One atomic rolling-window claim, including requests straddling UTC midnight.
// pending means unresolved delivery, never confirmed consent.
export const DOI_CLAIM_SQL="INSERT OR IGNORE INTO consent_requests(id,email_hash,version,requested_at,request_day,status) SELECT ?,?,?,?,?,'pending' WHERE NOT EXISTS (SELECT 1 FROM consent_requests WHERE email_hash=? AND requested_at>? AND status IN ('pending','submitted')) RETURNING id";
export async function brevo(env,path,payload,headers={}) {
 if(collectionOnly(env)){assertCollectionConfiguration(env);if(path!=='contacts/doubleOptinConfirmation'||payload.includeListIds?.length!==1||payload.includeListIds[0]!==3||payload.templateId!==COLLECTION_DOI_TEMPLATE_ID)throw new HttpError(503,'newsletter_doi_only');}
 isolatedBrevoRequest(env,path,payload);
 if(!env.BREVO_API_KEY)throw new HttpError(503,'not_configured');
 const response=await fetch(`https://api.brevo.com/v3/${path}`,{method:'POST',headers:{'api-key':env.BREVO_API_KEY,'Content-Type':'application/json',...headers},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
 if(!response.ok){const error=new HttpError(response.status===429?429:502,'email_provider');error.deliveryUncertain=response.status>=500;throw error;}
 return response.status===204?{}:response.json();
}
export async function requestDoi(env,{email,name,version,requestedAt,sourcePath=COLLECTION_FORM_PATH},origin) {
 const templateId=Number(env.BREVO_DOI_TEMPLATE_ID);
 if(!Number.isSafeInteger(templateId)||templateId<1)throw new HttpError(503,'not_configured');
 if(collectionOnly(env)&&!['/acasa#newsletter',COLLECTION_FORM_PATH].includes(sourcePath))throw new HttpError(400,'newsletter_source');
 let redirectionUrl=collectionOnly(env)?`${origin}${COLLECTION_FORM_PATH}?confirmare=brevo`:`${origin}/comunitate?confirmare=brevo`;
 // Isolated test destination only: the application origin remains private.
 if(env.TEST_MODE==='true'&&env.TEST_DOI_REDIRECTION_URL!==undefined){
  if(env.TEST_DOI_REDIRECTION_URL!=='https://iuliabobeica.ro/live')throw new HttpError(503,'test_redirect_not_configured');
  redirectionUrl=env.TEST_DOI_REDIRECTION_URL;
 }
 // Test list membership is isolated, but Brevo contact attributes are account-wide.
 // Do not overwrite an existing owner's profile/production consent during a test.
 const attributes=env.TEST_MODE==='true'?undefined:{
  ...(name?{PRENUME:name}:{}),CONSENT_VERSION:version,
  CONSENT_REQUESTED_AT:new Date(requestedAt*1000).toISOString(),CONSENT_SOURCE:collectionOnly(env)?`${origin}${sourcePath}`:'community'
 };
 return brevo(env,'contacts/doubleOptinConfirmation',{
  email,includeListIds:[doiList(env)],templateId,redirectionUrl,
  attributes,
  contactPixelTrackingConsent:false
 });
}
