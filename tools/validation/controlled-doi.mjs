// Controlled provider test, reusing the existing DOI implementation.
// Default is preparation only. No recipient/key is printed or stored in this ledger.
import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {requestDoi} from '../../infrastructure/brevo.mjs';
import {CONSENT_VERSION} from '../../infrastructure/api.mjs';
import {email,now,hash,equal} from '../../infrastructure/security.mjs';
const ledger=resolve('.local/final-validation-2026-11-13/controlled-doi-attempt.json');
function diskLedger(){return {exists:()=>existsSync(ledger),claim:()=>{mkdirSync(dirname(ledger),{recursive:true});writeFileSync(ledger,JSON.stringify({status:'claimed_not_confirmed',at:now()}),{flag:'wx'});}};}
const privateRecipientHash=()=>JSON.parse(readFileSync('.local/final-validation-2026-11-13/authorized-recipient.json','utf8')).recipientSha256;
export async function controlledDoi({send=false,env={},store=diskLedger(),deliver=requestDoi,authorizedHash=privateRecipientHash}={}){
 const base={preparedOnly:!send,realEmailRequested:false,confirmationVerified:false,welcomeVerified:false};
 if(!send)return {...base,status:'not_executed'};
 if(env.BREVO_CONTROLLED_TEST_APPROVED!=='true'||env.TEST_MODE!=='true'||env.TEST_BREVO_LIST_ID!=='4'||env.BREVO_DOI_TEMPLATE_ID!=='2'||env.EMAIL_SEND_ENABLED!=='false'||env.LIVE_PAYMENTS_ENABLED!=='false')throw Error('controlled_test_not_approved_or_isolated');
 const target=new URL(env.APP_ORIGIN);
 if(target.origin!==env.APP_ORIGIN||target.protocol!=='https:'||! /^[a-z0-9-]+\.er-brevo-test-izolat\.pages\.dev$/.test(target.hostname))throw Error('wrong_test_origin');
 const recipient=email(env.TEST_RECIPIENT_EMAIL);
 if(!equal(await hash(recipient),authorizedHash()))throw Error('recipient_not_authorized');
 if(!env.BREVO_API_KEY)throw Error('provider_not_configured');
 if(store.exists())throw Error('attempt_already_claimed_no_automatic_retry');
 store.claim(); // Exclusive claim BEFORE network. Preserve even after ambiguous failure.
 try{await deliver(env,{email:recipient,name:'',version:CONSENT_VERSION,requestedAt:now()},target.origin);}
 catch{throw Error('attempt_unresolved_do_not_retry_check_provider_logs');}
 return {...base,status:'DOI_requested_confirmation_unverified',realEmailRequested:true};
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/controlled-doi.mjs')){
 try{console.log(JSON.stringify(await controlledDoi({send:process.argv.includes('--send'),env:process.env})));}
 catch{console.error('Test oprit. Nu se reincearca automat; verifica preconditiile si istoricul privat.');process.exitCode=1;}
}
