import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
export function checkCloudContract(contract,config){
 const checks=[];const add=(name,pass)=>checks.push({name,pass:!!pass});
 add('target',contract.project==='er-brevo-test-izolat'&&config.name===contract.project);
 add('branch_preview',contract.branch==='pregatire-infrastructura-email-plati'&&contract.environment==='preview');
 add('production_has_no_db',config.d1_databases?.length===0&&config.vars?.VALIDATION_ACTIVE==='false'&&config.vars?.REGISTRATIONS_ENABLED==='false');
 const preview=config.env?.preview,db=preview?.d1_databases?.[0];
 add('one_separate_test_db',preview?.d1_databases?.length===1&&db?.binding==='DB'&&db.database_name==='er-brevo-test-izolat-events-validation');
 for(const key of ['COMMUNITY_ENABLED','EMAIL_SEND_ENABLED','PAYMENTS_TEST_ENABLED','LIVE_PAYMENTS_ENABLED','INVOICING_ENABLED'])add(key,preview?.vars?.[key]==='false');
 add('billing_off',preview?.vars?.BILLING_PROVIDER==='mock'&&preview?.vars?.INVOICE_EMAIL_SENDER==='none'&&preview?.vars?.APPROVED_TEMPLATE_IDS==='[]');
 add('no_credentials_in_template',!/(?:sk_live_|sk_test_|whsec_|xkeysib-|Bearer )/.test(JSON.stringify(config)));
 return {preparationPass:checks.every(x=>x.pass),checks,readyForDeployment:false,missing:['approved_cloud_execution','actual_separate_D1_id','verified_preview_AUD','private_owner_identity_HMAC','generated_server_secrets','remote_Access_and_bindings_preflight']};
}
if(process.argv[1]?.endsWith('check-cloud-validation.mjs')){const c=JSON.parse(readFileSync('docs/cloud-validation/contract.json','utf8')),w=JSON.parse(readFileSync('docs/cloud-validation/wrangler.preview.template.json','utf8'));const result=checkCloudContract(c,w);console.log(JSON.stringify(result,null,2));if(!result.preparationPass)process.exitCode=1;}
