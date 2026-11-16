// SQL preparation only: no network, shell execution or credentials.
import {writeFileSync} from 'node:fs';
export function d1Cases(){
 const offering=(id,cap)=>`INSERT INTO offerings(id,kind,title,status,starts_at,ends_at,capacity,location) VALUES('${id}','live','Fixture cloud','open',unixepoch()+7200,unixepoch()+10800,${cap},'Sintetic');`;
 const registration=(id,event,email)=>`INSERT INTO registrations(id,offering_id,email,name,token_hash,status,created_at) VALUES('${id}','${event}','${email}@example.invalid','Fixture','hash-${id}','reserved',unixepoch());`;
 return {preparedOnly:true,concurrency:6,setup:[offering('validation-load',3),offering('validation-duplicate',10)],
  capacity:Array.from({length:6},(_,i)=>registration('validation-load-'+i,'validation-load','load-'+i)),
  duplicates:Array.from({length:6},(_,i)=>registration('validation-duplicate-'+i,'validation-duplicate','same-address')),
  expected:{capacitySuccess:3,capacityConstraintFailures:3,duplicateSuccess:1,duplicateConstraintFailures:5},
  checks:["SELECT offering_id,count(*) occupied FROM registrations WHERE offering_id IN ('validation-load','validation-duplicate') AND status IN ('reserved','confirmed') GROUP BY offering_id;","PRAGMA foreign_key_check;"],
  execution:'After approval only: verify exact account/new D1 UUID and marker before each batch. Submit each statement as a separate remote D1 request, at most six in parallel. Record constraint failures individually; never retry rejected inserts. No DELETE, no production import. Inspect metrics; stop on unexpected failure or budget limit.'};
}
if(process.argv[1]?.endsWith('cloud-d1-cases.mjs')){writeFileSync('docs/cloud-validation/d1-concurrency-cases.json',JSON.stringify(d1Cases(),null,2)+'\n');console.log('SQL scenarios prepared locally; none executed remotely.');}
