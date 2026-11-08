(() => {
 'use strict';
 const form=document.querySelector('#community-form, #event-form');if(!form)return;
 const status=document.querySelector('#form-status'),button=form.querySelector('button');let config,challengeToken='',widget;
 const community=form.id==='community-form';
 const messages={consent_required:'Confirmă acordul pentru abonare.',invalid_email:'Verifică adresa de e-mail.',challenge:'Te rugăm să refaci verificarea anti-spam.',rate_limit:'Prea multe solicitări. Încearcă mai târziu.',unavailable:'Înscrierea nu mai este disponibilă.',payments_disabled:'Plățile sunt dezactivate.',checkout_unavailable:'Plata nu este disponibilă pentru această înscriere.'};
 async function api(path,data){const r=await fetch('/api/'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const value=await r.json();if(!r.ok)throw Error(messages[value.error]||'Serviciul nu este disponibil acum. Te rugăm să revii sau să contactezi organizatoarea.');return value;}
 const slot='er-registration-token';
 function token(){try{return sessionStorage.getItem(slot);}catch{return null;}}
 async function refresh(){
  if(!token())return;
  const r=await api('registration',{token:token()});
  document.querySelector('#registration').hidden=false;
  document.querySelector('#registration-status').textContent=`${r.title}: ${{reserved:'rezervare în așteptare',confirmed:'înscriere confirmată',cancelled:'înscriere anulată',completed:'finalizată'}[r.status]||r.status}${r.payment?' · plata: '+r.payment:''}.`;
  document.querySelector('#checkout').hidden=r.status!=='reserved';
  document.querySelector('#cancel-registration').hidden=!['reserved','confirmed'].includes(r.status);
  const access=document.querySelector('#access');access.hidden=true;
  if(r.accessUrl){const u=new URL(r.accessUrl);if(u.protocol==='https:'){access.href=u.href;access.hidden=false;}}
 }
 if(!community){
  for(const [id,action] of [['refresh-registration',refresh],['checkout',async()=>{const r=await api('checkout',{token:token()});const u=new URL(r.url);if(u.origin!=='https://checkout.stripe.com')throw Error('Adresă de plată invalidă.');location.assign(u.href);}],['cancel-registration',async()=>{await api('cancel',{token:token()});await refresh();}]])document.getElementById(id).addEventListener('click',async()=>{try{await action();}catch(e){status.textContent=e.message;}});
  refresh().catch(()=>{status.textContent='Confirmarea înscrierii nu poate fi verificată acum.';});
 }
 fetch('/api/config').then(r=>{if(!r.ok)throw Error();return r.json();}).then(async c=>{
  config=c;
  if(community&&c.whatsapp){document.querySelector('#whatsapp').href=c.whatsapp;document.querySelector('#whatsapp').hidden=false;document.querySelector('#whatsapp-status').hidden=true;}
  if(!(community?c.community:c.events)||!c.turnstileSiteKey)return;
  if(!community){
   const r=await fetch('/api/events');if(!r.ok)throw Error();const {events}=await r.json();const select=document.querySelector('#offering');
   for(const event of events){const o=document.createElement('option');o.value=event.id;o.textContent=`${event.title} · ${new Intl.DateTimeFormat('ro-RO',{dateStyle:'medium',timeStyle:'short',timeZone:event.timezone}).format(new Date(event.starts_at*1000))} · ${Math.max(0,event.capacity-event.occupied)} locuri disponibile`;o.disabled=event.occupied>=event.capacity;select.append(o);}
   if(!events.length){status.textContent='Nu sunt înscrieri disponibile acum.';return;}
  }
  window.erTurnstileReady=()=>{widget=window.turnstile.render('#challenge',{sitekey:c.turnstileSiteKey,action:'registration',callback:t=>{challengeToken=t;button.disabled=false;},'expired-callback':()=>{challengeToken='';button.disabled=true;},'error-callback':()=>{button.disabled=true;status.textContent='Verificarea anti-spam nu este disponibilă.';}});};
  const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?onload=erTurnstileReady&render=explicit';script.async=true;script.onerror=()=>{status.textContent='Verificarea anti-spam nu este disponibilă.';};document.head.append(script);
  status.textContent='Completează formularul și verificarea anti-spam.';
 }).catch(()=>{status.textContent='Formularul nu este disponibil acum. Datele nu au fost trimise.';});
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(!config||!challengeToken||!form.reportValidity())return;button.disabled=true;status.textContent='Se trimite solicitarea…';
  const data=Object.fromEntries(new FormData(form));data.turnstile=challengeToken;
  if(community){data.consent=form.elements.consent.checked;data.consentVersion=config.consentVersion;}else data.administrative=form.elements.administrative.checked;
  try{
   const result=await api(community?'community':'register',data);
   status.textContent=community?'Verifică e-mailul, inclusiv folderul Spam. Abonarea se activează numai după confirmarea prin Brevo.':result.status==='already_requested'?result.message:'Înscrierea a fost înregistrată. Verifică mai jos stadiul ei.';
   if(!community&&result.token){try{sessionStorage.setItem(slot,result.token);}catch{status.textContent='Înscriere înregistrată. Browserul nu permite păstrarea accesului; contactează organizatoarea pentru detalii.';}await refresh();}
  }catch(error){status.textContent=error.message;}
  finally{challengeToken='';if(window.turnstile&&widget!==undefined)window.turnstile.reset(widget);}
 });
})();
