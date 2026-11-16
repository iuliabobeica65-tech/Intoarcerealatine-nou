import {handle} from '../api.mjs';
import {HttpError,json,admin,body,email,now} from '../security.mjs';
import {verifyValidationAccess} from './access.mjs';
const project='er-brevo-test-izolat';
const permitted=new Set(['events','participants','outbox','message-preview','payments','offering','lifecycle','cancel-registration','prepare-reminders']);
export async function validationFetch(request,env,{verifyAccess=verifyValidationAccess}={}){
 try{
  const url=new URL(request.url),origin=new URL(env.APP_ORIGIN);
  if(env.TEST_PROJECT!==project||env.VALIDATION_STAGE!=='preview'||origin.protocol!=='https:'||! /^[a-z0-9-]+\.er-brevo-test-izolat\.pages\.dev$/.test(origin.hostname)||url.origin!==origin.origin)throw new HttpError(403,'wrong_target');
  if(env.VALIDATION_ACTIVE!=='true')throw new HttpError(503,'validation_disabled');
  if(env.VALIDATION_ACCESS_DIAGNOSTICS==='true'&&(!Number.isSafeInteger(Number(env.VALIDATION_EXPIRES_AT))||Number(env.VALIDATION_EXPIRES_AT)<=now()||Number(env.VALIDATION_EXPIRES_AT)>now()+900))throw new HttpError(503,'diagnostic_expired_or_unconfigured');
  const http=env.VALIDATION_HTTP_REGISTRATIONS==='true';
  if(![undefined,'false','true'].includes(env.VALIDATION_HTTP_REGISTRATIONS))throw new HttpError(503,'validation_configuration');
  if(http&&(env.TEST_MODE!=='true'||env.VALIDATION_DATABASE_ID!=='d630add8-e006-4379-b3ee-0b16307afdcb'||!Number.isSafeInteger(Number(env.VALIDATION_EXPIRES_AT))||Number(env.VALIDATION_EXPIRES_AT)<=now()||Number(env.VALIDATION_EXPIRES_AT)>now()+3600||!env.TURNSTILE_SECRET||!env.TURNSTILE_SITE_KEY))throw new HttpError(503,'http_validation_configuration');
  for(const flag of ['COMMUNITY_ENABLED','EMAIL_SEND_ENABLED','PAYMENTS_TEST_ENABLED','LIVE_PAYMENTS_ENABLED','INVOICING_ENABLED'])if(env[flag]!=='false')throw new HttpError(503,'validation_configuration');
  if(env.REGISTRATIONS_ENABLED!=='true'||env.BILLING_PROVIDER!=='mock'||env.INVOICE_EMAIL_SENDER!=='none'||env.APPROVED_TEMPLATE_IDS!=='[]')throw new HttpError(503,'validation_configuration');
  for(const key of ['BREVO_API_KEY','STRIPE_SECRET_KEY','STRIPE_WEBHOOK_SECRET','SMARTBILL_TOKEN',...http?[]:['TURNSTILE_SECRET']])if(env[key])throw new HttpError(503,'provider_secret_forbidden');
  await verifyAccess(request,env);
  if(url.pathname.startsWith('/api/')){
   admin(request,env);
   const section=url.pathname.match(/^\/api\/admin\/([a-z-]+)$/)?.[1];
   const registration=http&&url.pathname==='/api/register',configuration=http&&url.pathname==='/api/validation/config';
   if(!registration&&!configuration&&(!permitted.has(section)||(http&&['offering','lifecycle'].includes(section))))throw new HttpError(403,'operation_disabled');
   if(!env.DB||! /^[a-f0-9-]{36}$/.test(env.VALIDATION_DATABASE_MARKER||''))throw new HttpError(503,'validation_database_required');
   const marker=await env.DB.prepare('SELECT marker,purpose FROM _validation_identity WHERE marker=?').bind(env.VALIDATION_DATABASE_MARKER).first();if(!marker||marker.purpose!=='er-brevo-test-izolat-events-validation')throw new HttpError(503,'wrong_database');
   if(configuration){await body(request,env);return harden(json({syntheticOnly:true,emailSending:false,turnstileSiteKey:env.TURNSTILE_SITE_KEY,expiresAt:Number(env.VALIDATION_EXPIRES_AT)}));}
   if(registration){
    const input=await body(request.clone(),env);
    if(!email(input.email).endsWith('@example.invalid')||typeof input.offeringId!=='string'||!/^validation-[a-zA-Z0-9-]{1,80}$/.test(input.offeringId))throw new HttpError(403,'synthetic_fixture_required');
    const offering=await env.DB.prepare('SELECT price_test_id,amount,currency FROM offerings WHERE id=?').bind(input.offeringId).first();
    if(offering&&(offering.price_test_id||offering.amount!==null||offering.currency!==null))throw new HttpError(403,'free_fixture_required');
    // Only this authenticated synthetic event request bypasses the DOI recipient
    // profile. Existing Turnstile, rate limit, capacity and duplicate checks run.
    return harden(await handle(request,{...env,TEST_MODE:'false'}));
   }
   return harden(await handle(request,env));
  }
  return harden(await env.ASSETS.fetch(request));
 }catch(error){return harden(json({error:error instanceof HttpError?error.code:'validation_unavailable',...(env.VALIDATION_ACCESS_DIAGNOSTICS==='true'&&error.code==='access_required'&&['assertion_missing','assertion_format','algorithm','public_keys','matching_key','signature','claims','owner_identity'].includes(error.validationStage)?{diagnosticStage:error.validationStage}:{})},error instanceof HttpError?error.status:503));}
}
function harden(response){const headers=new Headers(response.headers);headers.set('X-Robots-Tag','noindex, nofollow, noarchive');headers.set('Cache-Control','no-store');headers.set('Referrer-Policy','no-referrer');headers.set('Content-Security-Policy',"default-src 'self'; script-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'");return new Response(response.body,{status:response.status,headers});}
export default {fetch:validationFetch};
