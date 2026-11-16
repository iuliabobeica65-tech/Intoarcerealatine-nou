import {COLLECTION_CONSENT_VERSION,COLLECTION_CONSENT_TEXT} from '../../infrastructure/newsletter.mjs';
// Static review only: no DB, no provider secret, no outbound fetch or submissions.
export default {async fetch(request,env){
 const path=new URL(request.url).pathname;
 let response;
 if(path==='/api/config')response=Response.json({community:false,events:false,turnstileSiteKey:null,whatsapp:null,googleAppointmentUrl:null,consentVersion:COLLECTION_CONSENT_VERSION,consentText:COLLECTION_CONSENT_TEXT,previewOnly:true});
 else if(path.startsWith('/api/'))response=Response.json({error:'preview_only_no_submission'},{status:503});
 else response=await env.ASSETS.fetch(request);
 const h=new Headers(response.headers);h.set('Cache-Control','no-store');h.set('X-Robots-Tag','noindex, nofollow, noarchive');h.set('Referrer-Policy','no-referrer');h.set('X-Content-Type-Options','nosniff');h.set('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; form-action 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
 return new Response(response.body,{status:response.status,headers:h});
}};
