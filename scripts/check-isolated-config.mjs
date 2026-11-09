import {pathToFileURL} from 'node:url';
import {isolatedRecipient} from '../infrastructure/test-isolation.mjs';

// Offline only: reads process environment; prints check names, never values.
export function checkIsolatedConfig(env) {
 const checks=[];
 const add=(name,pass)=>checks.push({name,pass:Boolean(pass)});
 add('TEST_MODE',env.TEST_MODE==='true');
 let valid=false;try{isolatedRecipient(env,env.TEST_RECIPIENT_EMAIL);valid=env.TEST_MODE==='true';}catch{}
 add('private_recipient_and_separate_origin',valid);
 let realOrigin=false;try{const h=new URL(env.APP_ORIGIN).hostname;realOrigin=h.includes('.')&&!h.endsWith('.invalid')&&!['localhost','127.0.0.1'].includes(h);}catch{}
 add('non_placeholder_origin',realOrigin);
 for(const key of ['COMMUNITY_ENABLED','REGISTRATIONS_ENABLED','EMAIL_SEND_ENABLED','PAYMENTS_TEST_ENABLED','LIVE_PAYMENTS_ENABLED','INVOICING_ENABLED'])add(key,env[key]==='false');
 add('BREVO_DOI_TEMPLATE_ID',env.BREVO_DOI_TEMPLATE_ID==='2');
 add('BILLING_PROVIDER',env.BILLING_PROVIDER==='mock');
 add('INVOICE_EMAIL_SENDER',env.INVOICE_EMAIL_SENDER==='none');
 add('APPROVED_TEMPLATE_IDS',env.APPROVED_TEMPLATE_IDS==='[]');
 for(const key of ['BREVO_API_KEY','TURNSTILE_SECRET','TURNSTILE_SITE_KEY'])add(key,typeof env[key]==='string'&&env[key].trim().length>0);
 for(const key of ['DATA_HMAC_KEY','ADMIN_TOKEN'])add(key,typeof env[key]==='string'&&env[key].length>=32);
 return {configurationPass:checks.every(c=>c.pass),checks,externalEnvironmentVerified:false,activationAuthorized:false};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const result=checkIsolatedConfig(process.env);console.log(JSON.stringify(result,null,2));
 if(!result.configurationPass)process.exitCode=1;
}
