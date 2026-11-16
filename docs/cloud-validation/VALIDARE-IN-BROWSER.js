// Prepared only. Run personally in the approved alias after Access login and cloud approval.
// Does not read cookies/Access tokens or persist the administrative code.
(async()=>{
 const target='https://pregatire-infrastructura-ema.er-brevo-test-izolat.pages.dev';
 if(location.origin!==target)throw Error('wrong_target');
 let token=prompt('Codul privat de administrare: folosit numai pentru validarea aprobata, fara salvare.');
 if(!token||token.length<32)throw Error('admin_required');
 const results=[];
 async function call(section,input={},expected=200,authorization=token){
  const r=await fetch('/api/admin/'+section,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+authorization},body:JSON.stringify(input),credentials:'same-origin',redirect:'error',cache:'no-store'});
  const value=await r.json();results.push({check:section,status:r.status,pass:r.status===expected});if(r.status!==expected)throw Error('unexpected_'+section);return value;
 }
 try{
  await call('events',{},403,'invalid-fixture');await call('events');
  await call('dispatch',{},403);
  const roster=await call('participants',{offeringId:'validation-capacity'});if(roster.items.some(p=>!p.email.endsWith('@example.invalid')))throw Error('non_synthetic_data');
  const start=performance.now();let done=0;const samples=[];
  await Promise.all(Array.from({length:6},async()=>{for(let i=0;i<4;i++){const t=performance.now();await call('events');samples.push(performance.now()-t);done++;}}));
  samples.sort((a,b)=>a-b);results.push({check:'bounded_parallel_reads',requests:done,concurrency:6,elapsedMs:Math.round(performance.now()-start),p95Ms:Math.round(samples[Math.floor(samples.length*.95)])});
  await call('cancel-registration',{id:'validation-confirmed',expectedStatus:'confirmed'});
  await call('cancel-registration',{id:'validation-confirmed',expectedStatus:'confirmed'});
  await call('prepare-reminders');const queue=await call('outbox');if(queue.sendingEnabled!==false)throw Error('sending_not_disabled');
  console.table(results);console.log('Validare limitata finalizata; fara date personale in raport. Nu include teste Stripe/Brevo reale.');
 }finally{token='';}
})();
