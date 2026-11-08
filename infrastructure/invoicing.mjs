import {HttpError,now} from './security.mjs';
// No network issuing transport exists in this preparation branch. This is intentional:
// SmartBill does not document an isolated non-fiscal sandbox in the sources reviewed.
export function billingMode(env) {
 const mode=env.BILLING_PROVIDER||'mock';
 if(!['mock','smartbill_native','smartbill_api'].includes(mode))throw new HttpError(503,'billing_configuration');
 if(env.INVOICING_ENABLED==='true')throw new HttpError(503,'fiscal_issuance_locked');
 return mode;
}
export function validateBillingClient(client) {
 if(!client||typeof client!=='object'||!['person','company'].includes(client.type))throw new HttpError(400,'billing_client');
 for(const key of ['name','country','city','address'])if(typeof client[key]!=='string'||!client[key].trim()||client[key].length>300||/[<>\x00-\x1f]/.test(client[key]))throw new HttpError(400,'billing_client');
 if(client.type==='company'&&(typeof client.taxId!=='string'||! /^[A-Z0-9 -]{2,30}$/i.test(client.taxId)))throw new HttpError(400,'billing_tax_id');
 // Never collect a personal CNP by default. Accountant must establish any requirement.
 return Object.fromEntries(['type','name','country','city','address',...(client.type==='company'?['taxId']:[])].map(k=>[k,client[k].trim()]));
}
export function smartbillPayload(config,client,order) {
 if(!config.companyVatCode||!config.series||!config.productName||typeof config.taxName!=='string'||!Number.isFinite(config.taxPercentage)||config.taxPercentage<0||config.taxPercentage>100||typeof config.isTaxPayer!=='boolean')throw new HttpError(409,'fiscal_data_required');
 if(!Number.isSafeInteger(order.amount)||order.amount<=0||! /^[a-z]{3}$/.test(order.currency||''))throw new HttpError(400,'billing_amount');
 const c=validateBillingClient(client);
 return {companyVatCode:config.companyVatCode,seriesName:config.series,issueDate:config.issueDate,
  client:{name:c.name,vatCode:c.taxId||'',isTaxPayer:config.clientIsTaxPayer===true,address:c.address,city:c.city,country:c.country,saveToDb:false},
  currency:order.currency.toUpperCase(),language:'RO',precision:2,observations:`Stripe: ${order.payment_intent}; Order: ${order.id}`,
  products:[{name:config.productName,measuringUnitName:config.unitName||'buc',currency:order.currency.toUpperCase(),quantity:1,price:order.amount/100,isTaxIncluded:true,taxName:config.taxName,taxPercentage:config.taxPercentage,isService:true,saveToDb:false}],
  sendEmail:false};
}
export async function prepareInvoice(env,{orderId,client,config}) {
 const provider=billingMode(env);
 const order=await env.DB.prepare('SELECT * FROM orders WHERE id=?').bind(orderId).first();
 if(!order||order.status!=='paid')throw new HttpError(409,'paid_order_required');
 const old=await env.DB.prepare("SELECT * FROM billing_documents WHERE order_id=? AND operation='invoice'").bind(order.id).first();if(old)return {id:old.id,status:old.status,duplicate:true};
 const normalized=validateBillingClient(client);
 // Mapping is possible only when approved fiscal configuration is supplied.
 const payload=config?smartbillPayload(config,normalized,order):null;
 const clientId=crypto.randomUUID(),id=crypto.randomUUID();
 await env.DB.batch([
  env.DB.prepare('INSERT OR IGNORE INTO billing_clients(id,registration_id,billing_data,updated_at) VALUES(?,?,?,?)').bind(clientId,order.registration_id,JSON.stringify(normalized),now()),
  env.DB.prepare("INSERT OR IGNORE INTO billing_documents(id,order_id,client_id,operation,source_key,provider,status,created_at) SELECT ?,?,id, 'invoice',?,?,?,? FROM billing_clients WHERE registration_id=?").bind(id,order.id,`invoice:${order.id}`,provider,provider==='mock'?'issued_mock':'prepared',now(),order.registration_id)
 ]);
 const document=await env.DB.prepare("SELECT * FROM billing_documents WHERE order_id=? AND operation='invoice'").bind(order.id).first();
 return {id:document.id,status:document.status,provider,payloadPreview:payload,fiscalDocumentIssued:false};
}
export async function prepareCredit(env,{orderId,refundId,originalDocumentId}) {
 billingMode(env);
 if(typeof refundId!=='string'||! /^re_[A-Za-z0-9]+$/.test(refundId))throw new HttpError(400,'refund_reference');
 const original=await env.DB.prepare("SELECT d.* FROM billing_documents d JOIN orders o ON o.id=d.order_id WHERE d.id=? AND d.order_id=? AND d.operation='invoice' AND o.status='refunded'").bind(originalDocumentId,orderId).first();
 if(!original)throw new HttpError(409,'refund_review_required');
 const id=crypto.randomUUID();
 await env.DB.prepare("INSERT OR IGNORE INTO billing_documents(id,order_id,client_id,operation,source_key,original_document_id,provider,status,created_at) VALUES(?,?,?,'credit',?,?,?,'review',?)").bind(id,orderId,original.client_id,`credit:${refundId}`,original.id,original.provider,now()).run();
 return {status:'review',fiscalDocumentIssued:false};
}
export async function claimInvoiceNotification(env,documentId) {
 billingMode(env);
 const sender=env.INVOICE_EMAIL_SENDER||'none';
 if(!['none','brevo','smartbill'].includes(sender))throw new HttpError(503,'billing_configuration');
 const document=await env.DB.prepare('SELECT * FROM billing_documents WHERE id=?').bind(documentId).first();
 if(!document||document.status!=='external_recorded')throw new HttpError(409,'real_document_required');
 await env.DB.prepare('INSERT OR IGNORE INTO billing_notifications(document_id,sender,status) VALUES(?,?,?)').bind(documentId,sender,sender==='none'?'disabled':'pending').run();
 if(sender!=='brevo')return {send:false,sender};
 const claim=await env.DB.prepare("UPDATE billing_notifications SET status='sending' WHERE document_id=? AND sender='brevo' AND status='pending' RETURNING document_id").bind(documentId).first();
 return {send:!!claim,sender};
}
