import { HttpError } from './security.mjs';
export async function brevo(env,path,payload,headers={}) {
 if(!env.BREVO_API_KEY)throw new HttpError(503,'not_configured');
 const response=await fetch(`https://api.brevo.com/v3/${path}`,{method:'POST',headers:{'api-key':env.BREVO_API_KEY,'Content-Type':'application/json',...headers},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
 if(!response.ok)throw new HttpError(response.status===429?429:502,'email_provider');
 return response.status===204?{}:response.json();
}
export async function requestDoi(env,{email,name,version,requestedAt},origin) {
 const templateId=Number(env.BREVO_DOI_TEMPLATE_ID);
 if(!Number.isSafeInteger(templateId)||templateId<1)throw new HttpError(503,'not_configured');
 return brevo(env,'contacts/doubleOptinConfirmation',{
  email,includeListIds:[3],templateId,redirectionUrl:`${origin}/comunitate?confirmare=brevo`,
  attributes:{PRENUME:name,CONSENT_VERSION:version,CONSENT_REQUESTED_AT:new Date(requestedAt*1000).toISOString(),CONSENT_SOURCE:'community'},
  contactPixelTrackingConsent:false
 });
}
