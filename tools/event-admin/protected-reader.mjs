import {createReader} from './read-model.mjs';

const fields={
 events:['id','kind','title','status','starts_at','ends_at','timezone','capacity','revision','occupied','cancelled','available'],
 participants:['id','offering_id','name','email','status','created_at','order_id','payment_status','amount','currency'],
 outbox:['id','registration_id','offering_id','template_id','revision','due_at','status'],
 payments:['id','registration_id','offering_id','registration_status','status','amount','currency','updated_at','invoice_job_status','billing_documents','accountantReviewRequired','manualPaymentReviewRequired']
};
const statuses={participants:['reserved','confirmed','cancelled','completed'],outbox:['pending','sending','sent','stopped','review']};
const textId=value=>typeof value==='string'&&value.length>0&&value.length<=100&&!/[\x00-\x1f]/.test(value);
function inputFor(section,input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Filtre invalide.');
 const keys=section==='message-preview'?['id']:['limit','after',...(section==='participants'?['offeringId','status']:section==='outbox'?['status']:[])];
 if(Object.keys(input).some(key=>!keys.includes(key)))throw Error('Parametru nepermis pentru consultare.');
 if(section==='message-preview'){if(!textId(input.id))throw Error('Mesaj invalid.');return {id:input.id};}
 const result={limit:input.limit??25,after:input.after??''};
 if(!Number.isSafeInteger(result.limit)||result.limit<1||result.limit>100||typeof result.after!=='string'||result.after.length>100)throw Error('Paginare invalidă.');
 if(section==='participants'){if(!textId(input.offeringId))throw Error('Eveniment invalid.');result.offeringId=input.offeringId;}
 if(input.status!==undefined){if(!statuses[section]?.includes(input.status))throw Error('Stare invalidă.');result.status=input.status;}
 return result;
}
const pick=(object,keys)=>Object.fromEntries(keys.filter(key=>Object.hasOwn(object,key)).map(key=>[key,object[key]]));
function filteredResponse(section,value){
 if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Răspuns administrativ invalid.');
 if(section==='message-preview'){
  if(value.previewOnly!==true||typeof value.subject!=='string'||typeof value.text!=='string'||typeof value.stale!=='boolean')throw Error('Previzualizare invalidă.');
  return pick(value,['previewOnly','stale','status','subject','text']);
 }
 if(!Array.isArray(value.items)||value.items.length>100||(value.next!==null&&!textId(value.next))||value.items.some(row=>!row||Array.isArray(row)||typeof row!=='object'||!textId(row.id)))throw Error('Listă administrativă invalidă.');
 return {items:value.items.map(row=>pick(row,fields[section])),next:value.next,
  ...(section==='outbox'?{sendingEnabled:value.sendingEnabled===true}:{}),
  ...(section==='payments'?{livePaymentsSupported:false,fiscalIssuanceSupported:false}:{})};
}

// Preparation only: not imported by admin.mjs and not served by the local demo.
// No global fetch fallback, token storage, automatic connection or write operation.
export function createProtectedReader({origin,enabled=false,getToken,getPageOrigin=()=>globalThis.location?.origin,fetcher}={}){
 let target;try{target=new URL(origin);}catch{throw Error('Origine de test invalidă.');}
 const host=target.hostname;
 if(target.protocol!=='https:'||target.port||target.origin!==origin||target.pathname!=='/'||target.search||target.hash||target.username||target.password||
  !(host==='er-brevo-test-izolat.pages.dev'||/^[a-z0-9-]+\.er-brevo-test-izolat\.pages\.dev$/.test(host)))throw Error('Este permis numai proiectul izolat.');
 return createReader(async(section,input)=>{
  if(enabled!==true)throw Error('Conectarea administrativă este dezactivată.');
  if(typeof fetcher!=='function'||typeof getToken!=='function'||getPageOrigin()!==target.origin)throw Error('Context administrativ nepermis.');
  const data=inputFor(section,input),token=getToken();
  if(typeof token!=='string'||token.length<32||token.length>512||!/^[\x21-\x7e]+$/.test(token))throw Error('Autentificare administrativă necesară.');
  let response;
  try{response=await fetcher(new URL('/api/admin/'+section,target.origin),{
   method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify(data),
   credentials:'same-origin',redirect:'error',cache:'no-store',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(10000)
  });}catch{throw Error('Consultarea nu a reușit. Nu se reîncearcă automat.');}
  if(response.status===401||response.status===403)throw Error('Acces administrativ refuzat.');
  if(!response.ok)throw Error('Serviciul administrativ este indisponibil.');
  if(!response.headers.get('Content-Type')?.toLowerCase().startsWith('application/json'))throw Error('Răspuns neconfirmat. Verifică sesiunea Cloudflare Access.');
  let value;try{value=await response.json();}catch{throw Error('Răspuns administrativ invalid.');}
  return filteredResponse(section,value);
 });
}
