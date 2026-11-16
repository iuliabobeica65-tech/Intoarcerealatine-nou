const $=id=>document.getElementById(id);
let token='',challenge='',widget,config;
const target='https://pregatire-infrastructura-ema.er-brevo-test-izolat.pages.dev';
if(location.origin!==target)throw Error('Origine privată nepermisă.');
async function call(path,input={}){
 if(!token||Date.now()/1000>=config?.expiresAt)throw Error('Sesiune indisponibilă sau expirată.');
 const r=await fetch(path,{method:'POST',credentials:'same-origin',redirect:'error',cache:'no-store',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(input),signal:AbortSignal.timeout(15000)});
 const value=await r.json();if(!r.ok)throw Error('Refuz '+r.status+' / '+(value.error||'necunoscut'));return value;
}
function message(text){$('status').textContent=text;}
$('login').addEventListener('submit',async e=>{e.preventDefault();token=$('admin').value;$('admin').value='';
 try{config=await call('/api/validation/config');if(config.syntheticOnly!==true||config.emailSending!==false)throw Error('Profil neconfirmat.');
  $('login').hidden=true;$('test').hidden=false;
  const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;
  script.onload=()=>{widget=window.turnstile.render('#challenge',{sitekey:config.turnstileSiteKey,action:'registration',callback:value=>{challenge=value;$('submit').disabled=false;},'expired-callback':()=>{challenge='';$('submit').disabled=true;},'error-callback':()=>{challenge='';$('submit').disabled=true;message('Turnstile indisponibil; nu se retrimite automat.');}});};
  script.onerror=()=>message('Scriptul Turnstile nu s-a încărcat. Nu se trimite înscrierea.');document.head.append(script);message('Profil sintetic confirmat.');
 }catch(error){token='';config=undefined;message(error.message);}
});
async function refresh(){const data=await call('/api/admin/participants',{offeringId:$('event').value});$('rows').replaceChildren();for(const row of data.items){
 if(!row.email.endsWith('@example.invalid'))throw Error('Date nesintetice; oprește testul.');
 const tr=document.createElement('tr');for(const value of [row.id,row.email,row.status]){const td=document.createElement('td');td.textContent=value;tr.append(td);}
 const td=document.createElement('td'),button=document.createElement('button');button.type='button';button.textContent='Anulează';button.disabled=!['confirmed','reserved'].includes(row.status);button.onclick=async()=>{button.disabled=true;try{await call('/api/admin/cancel-registration',{id:row.id,expectedStatus:row.status});await refresh();message('Anulare confirmată.');}catch(error){message(error.message);}};td.append(button);tr.append(td);$('rows').append(tr);
}}
$('registration').addEventListener('submit',async e=>{e.preventDefault();if(!$('email').value.trim().toLowerCase().endsWith('@example.invalid')||!challenge)return message('Sunt permise numai adrese fictive și un challenge valid.');$('submit').disabled=true;
 try{const result=await call('/api/register',{offeringId:$('event').value,email:$('email').value,name:'Fixture',administrative:true,turnstile:challenge});message('Răspuns înscriere: '+result.status);await refresh();}
 catch(error){message(error.message+'; verifică înscrierile înainte de o nouă tentativă.');}
 finally{challenge='';window.turnstile?.reset(widget);}
});
$('refresh').onclick=()=>refresh().catch(error=>message(error.message));
$('logout').onclick=()=>{token='';challenge='';config=undefined;location.reload();};
