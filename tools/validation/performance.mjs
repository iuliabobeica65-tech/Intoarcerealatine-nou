// Transport is injected explicitly. No fetch, host, credentials or real services.
export async function measureBatch({invoke,requests=12,concurrency=1,accepted=[200],clock=()=>performance.now()}={}){
 if(typeof invoke!=='function'||!Number.isInteger(requests)||requests<1||requests>120||![1,3,6].includes(concurrency)||!Array.isArray(accepted)||accepted.some(s=>!Number.isInteger(s)))throw Error('invalid_bounded_plan');
 let next=0,stopped=false;const samples=[],statuses={};
 await Promise.all(Array.from({length:Math.min(concurrency,requests)},async()=>{while(!stopped&&next<requests){const id=next++,start=clock();let status;
  try{status=(await invoke(id))?.status;if(!Number.isInteger(status)||status<100||status>599)status=0;}catch{status=0;}
  samples.push(Math.max(0,clock()-start));statuses[status]=(statuses[status]||0)+1;
  if(!accepted.includes(status))stopped=true; // No retry; only in-flight work may finish.
 }}));
 samples.sort((a,b)=>a-b);const percentile=p=>samples[Math.max(0,Math.ceil(p*samples.length)-1)]??null;
 return {requested:requests,completed:samples.length,concurrency,stopped,statuses,p50Ms:percentile(.5),p95Ms:percentile(.95),p99Ms:percentile(.99),smallSample:samples.length<100};
}
