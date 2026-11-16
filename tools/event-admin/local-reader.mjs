// The server exposes only a synthetic local runtime. No remote URL is accepted.
export async function connectLocalRuntime(){
 if(location.hostname!=='127.0.0.1'||location.protocol!=='http:')throw Error('Runtime-ul este numai local.');
 const session=await fetch('/local/session',{cache:'no-store'}).then(r=>r.json());if(session.syntheticOnly!==true||typeof session.nonce!=='string')throw Error('Sesiune locală invalidă.');
 async function request(path,data={}){const response=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json','X-Local-Session':session.nonce},body:JSON.stringify(data),credentials:'same-origin',redirect:'error',cache:'no-store'});const value=await response.json();if(!response.ok)throw Error(({capacity_below_occupied:'Capacitatea este sub numărul locurilor ocupate.',revision_mismatch:'Datele s-au schimbat. Reîncarcă evenimentul.',event_finished:'Evenimentul este deja anulat sau finalizat.'})[value.error]||'Operațiunea locală a fost refuzată.');return value;}
 return {read:(section,data)=>request('/api/admin/'+section,data),write:(section,data)=>request('/api/admin/'+section,data),backup:()=>request('/local/backup'),backups:()=>request('/local/backups'),restore:id=>request('/local/restore',{id})};
}
