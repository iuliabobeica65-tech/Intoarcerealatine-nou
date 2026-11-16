import {createProtectedReader} from './protected-reader.mjs';
// Used only in the separately packaged Access-protected cloud validation panel.
export function connectCloudReader(){return new Promise(resolve=>{
 const host=location.hostname;if(location.protocol!=='https:'||! /^[a-z0-9-]+\.er-brevo-test-izolat\.pages\.dev$/.test(host))throw Error('Origine de test nepermisă.');
 const form=document.createElement('form'),label=document.createElement('label'),input=document.createElement('input'),button=document.createElement('button'),status=document.createElement('p');
 label.textContent='Codul privat de administrare (numai în memorie)';input.type='password';input.autocomplete='off';input.required=true;input.minLength=32;label.append(input);button.textContent='Conectează consultarea';status.setAttribute('role','status');form.append(label,button,status);document.querySelector('main').prepend(form);
 let token='';form.addEventListener('submit',async event=>{event.preventDefault();if(!form.reportValidity())return;button.disabled=true;token=input.value;input.value='';
  try{const read=createProtectedReader({origin:location.origin,enabled:true,getToken:()=>token,fetcher:fetch.bind(globalThis)});await read('events',{limit:1});form.remove();resolve(read);}
  catch{token='';status.textContent='Conectare refuzată. Verifică sesiunea Access și codul administrativ.';button.disabled=false;}
 });
});}
