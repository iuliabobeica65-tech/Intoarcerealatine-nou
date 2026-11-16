import {pageRows} from './read-model.mjs';
const start=Date.UTC(2027,0,15,16)/1000;
const events=[{id:'demo-live',kind:'live',title:'LIVE demonstrativ — fără eveniment real',status:'open',starts_at:start,timezone:'Europe/Bucharest',capacity:4,occupied:2,cancelled:1,available:2,revision:1},{id:'demo-workshop',kind:'workshop',title:'Workshop demonstrativ — fără eveniment real',status:'closed',starts_at:start+86400,timezone:'Europe/Bucharest',capacity:1,occupied:1,cancelled:0,available:0,revision:2}];
const participants=Array.from({length:5},(_,i)=>({id:'demo-person-'+i,offering_id:i===4?'demo-workshop':'demo-live',name:'Participantă sintetică '+(i+1),email:'fixture'+i+'@example.invalid',status:['confirmed','reserved','cancelled','completed','confirmed'][i],payment_status:i===1?'pending':null}));
const outbox=[{id:'demo-message-1',registration_id:'demo-person-0',offering_id:'demo-live',template_id:'LIVE-03',revision:1,due_at:start-86400,status:'pending'},{id:'demo-message-2',registration_id:'demo-person-2',offering_id:'demo-live',template_id:'LIVE-06',revision:1,due_at:start-90000,status:'review'},{id:'demo-message-3',registration_id:'demo-person-4',offering_id:'demo-workshop',template_id:'WRK-07',revision:1,due_at:start-90000,status:'stopped'}];
const payments=[{id:'demo-order',registration_id:'demo-person-1',status:'pending',amount:100,currency:'ron',accountantReviewRequired:false,manualPaymentReviewRequired:false},{id:'demo-refund',registration_id:'demo-person-2',status:'refunded',amount:100,currency:'ron',accountantReviewRequired:true,manualPaymentReviewRequired:false}];
export async function demoRead(section,input={}){
 if(section==='events')return pageRows(events,input);
 if(section==='participants')return pageRows(participants.filter(r=>r.offering_id===input.offeringId&&(!input.status||r.status===input.status)),input);
 if(section==='outbox')return {...pageRows(outbox.filter(r=>!input.status||r.status===input.status),input),sendingEnabled:false};
 if(section==='payments')return {...pageRows(payments,input),livePaymentsSupported:false,fiscalIssuanceSupported:false};
 if(section==='message-preview'){
  const row=outbox.find(r=>r.id===input.id);if(!row)throw Error('Mesaj inexistent.');
  return {previewOnly:true,stale:row.revision!==events.find(e=>e.id===row.offering_id).revision,status:row.status,subject:row.template_id==='LIVE-06'?'Anulare — exemplu sintetic':'Mesaj administrativ — exemplu sintetic',text:'Acesta este un mesaj demonstrativ. Nu se expediază și nu conține acces la un eveniment real.'};
 }
 throw Error('Secțiune necunoscută.');
}
