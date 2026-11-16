import {verifyValidationAccess} from './access.mjs';
import {HttpError,now} from '../security.mjs';
const target='https://pregatire-infrastructura-ema.er-brevo-test-izolat.pages.dev';
const stages=new Set(['assertion_missing','assertion_format','algorithm','public_keys','matching_key','signature','issuer','audience','expiry','not_before','issued_at','owner_identity']);
function response(value,status){return new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow, noarchive','Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'",'Referrer-Policy':'no-referrer'}});}
export async function diagnosticFetch(request,env,{verify=verifyValidationAccess}={}){
 const url=new URL(request.url);
 if(env.TEST_PROJECT!=='er-brevo-test-izolat'||env.VALIDATION_STAGE!=='preview'||url.origin!==target)return response({error:'wrong_target'},403);
 if(env.VALIDATION_ACTIVE!=='true'||env.VALIDATION_ACCESS_DIAGNOSTICS!=='true'||!Number.isSafeInteger(Number(env.VALIDATION_EXPIRES_AT))||Number(env.VALIDATION_EXPIRES_AT)<=now()||Number(env.VALIDATION_EXPIRES_AT)>now()+900)return response({status:'off'},503);
 if(request.method!=='GET'||url.pathname!=='/')return response({error:'diagnostic_only'},403);
 for(const key of ['COMMUNITY_ENABLED','REGISTRATIONS_ENABLED','EMAIL_SEND_ENABLED','PAYMENTS_TEST_ENABLED','LIVE_PAYMENTS_ENABLED','INVOICING_ENABLED'])if(env[key]!=='false')return response({error:'configuration'},503);
 if(env.DB||['BREVO_API_KEY','TURNSTILE_SECRET','STRIPE_SECRET_KEY','STRIPE_WEBHOOK_SECRET','SMARTBILL_TOKEN'].some(key=>env[key]))return response({error:'forbidden_binding_or_provider'},503);
 try{await verify(request,env);return response({authenticated:true},200);}
 catch(error){return response({error:error instanceof HttpError?error.code:'access_required',...(stages.has(error?.validationStage)?{diagnosticStage:error.validationStage}:{})},error instanceof HttpError?error.status:403);}
}
export default {fetch:diagnosticFetch};
