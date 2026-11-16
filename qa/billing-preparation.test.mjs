import test from 'node:test';
import assert from 'node:assert/strict';
import {smartbillPayload,billingMode} from '../infrastructure/invoicing.mjs';
const config={companyVatCode:'FIXTURE',series:'LOCAL',productName:'Serviciu sintetic local',taxName:'Fixture tax',taxPercentage:0,isTaxPayer:false,issueDate:'2026-11-12'};
const client={type:'person',name:'Fixture',country:'RO',city:'Fixture',address:'Fixture'};
const order={id:'fixture-order',payment_intent:'pi_fixture',amount:100,currency:'ron'};
test('billing payload needs complete fiscal text and a real calendar issue date',()=>{
 for(const extra of [{issueDate:undefined},{issueDate:'2026-02-30'},{issueDate:'2026-13-01'},{issueDate:'12.11.2026'},{series:{}},{taxName:''},{companyVatCode:'  '},{isTaxPayer:undefined}])assert.throws(()=>smartbillPayload({...config,...extra},client,order),/fiscal_data_required/);
});
test('billing payload links the paid order and payment without issuing or requesting email',()=>{
 const result=smartbillPayload(config,client,order);assert.equal(result.sendEmail,false);assert.equal(result.client.saveToDb,false);assert.equal(result.products[0].saveToDb,false);assert.equal(result.products[0].price,1);assert(result.observations.includes('pi_fixture'));assert(result.observations.includes('fixture-order'));assert.equal(result.issueDate,'2026-11-12');assert(!JSON.stringify(result).includes('cnp'));
});
test('missing payment reference and fiscal activation stay blocked',()=>{
 assert.throws(()=>smartbillPayload(config,client,{...order,payment_intent:null}),/payment_reference_required/);
 assert.throws(()=>smartbillPayload(config,client,{...order,amount:0}),/billing_amount/);
 for(const provider of ['mock','smartbill_api','smartbill_native'])assert.throws(()=>billingMode({BILLING_PROVIDER:provider,INVOICING_ENABLED:'true'}),/fiscal_issuance_locked/);
});
