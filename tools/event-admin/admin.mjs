import {createReader,labels,dateLabel,moneyLabel,reviewLabel} from './read-model.mjs';
import {demoRead} from './demo.mjs';
let read=createReader(demoRead),local=null,controls=null;
const $=id=>document.getElementById(id);
if(document.body.dataset.runtime==='local-api'){
 const {connectLocalRuntime}=await import('./local-reader.mjs');local=await connectLocalRuntime();read=createReader(local.read);
 document.querySelector('.notice').textContent='Panou local · API existent · SQLite cu date sintetice';
 document.querySelector('header p:last-of-type').textContent='Modificări numai în baza locală de test. Fără Brevo, Stripe, Google Calendar sau D1 extern.';
 document.title='Administrare locală — API și SQLite sintetic';
 $('refresh').textContent='Reîncarcă datele locale';$('caption').textContent='Date sintetice din baza locală';
}
if(document.body.dataset.runtime==='cloud-api'){
 const {connectCloudReader}=await import('./cloud-reader.mjs');
 document.querySelector('.notice').textContent='Validare cloud izolată · numai consultare';
 document.querySelector('header p:last-of-type').textContent='Date sintetice din D1 separat. E-mailuri, plăți, facturare și înscrieri publice dezactivate.';
 read=await connectCloudReader();
}
let section='events',after='',next=null,history=[],busy=false,loadRevision=0;
const titles={events:'Evenimente',participants:'Înscrieri',outbox:'Mesaje pregătite',payments:'Evidența plăților'};
const columns={events:['Eveniment','Data · Europe/Bucharest','Stare','Ocupate / capacitate','Disponibile','Anulate'],participants:['Nume','E-mail sintetic','Înscriere','Plată'],outbox:['Șablon','Stare','Scadență','Consultare'],payments:['Comandă','Stare','Valoare sintetică','De verificat']};
if(local){columns.events.push('Administrare locală');columns.participants.push('Administrare locală');}
function cell(row,text){const td=document.createElement('td');td.textContent=String(text??'—');row.append(td);return td;}
async function preview(id){try{const p=await read('message-preview',{id});$('subject').textContent=p.subject;$('message-text').textContent=p.text;$('preview-warning').textContent=p.stale?'Revizie veche: acest mesaj nu trebuie expediat.':`Stare: ${labels[p.status]||p.status}.`;$('preview').hidden=false;$('close-preview').focus();}catch(e){$('feedback').textContent=e.message;}}
function render(rows){$('table-head').replaceChildren();$('table-body').replaceChildren();const head=document.createElement('tr');for(const label of columns[section]){const th=document.createElement('th');th.scope='col';th.textContent=label;head.append(th);}$('table-head').append(head);
 for(const r of rows){const tr=document.createElement('tr');
  if(section==='events'){const td=cell(tr,'');const b=document.createElement('button');b.textContent=r.title;b.addEventListener('click',()=>{ $('offering').value=r.id;switchSection('participants');});td.append(b);for(const v of [dateLabel(r.starts_at,r.timezone),labels[r.status]||r.status,`${r.occupied} / ${r.capacity}`,r.available,r.cancelled])cell(tr,v);}
  if(section==='participants')for(const v of [r.name,r.email,labels[r.status]||r.status,labels[r.payment_status]||'—'])cell(tr,v);
  if(section==='outbox'){for(const v of [r.template_id,labels[r.status]||r.status,dateLabel(r.due_at)])cell(tr,v);const td=cell(tr,'');const b=document.createElement('button');b.textContent='Vezi mesajul';b.addEventListener('click',()=>preview(r.id));td.append(b);}
  if(section==='payments')for(const v of [r.id,labels[r.status]||r.status,moneyLabel(r.amount,r.currency),reviewLabel(r)])cell(tr,v);
  if(controls&&section==='events')controls.eventCell(cell(tr,''),r);
  if(controls&&section==='participants')controls.participantCell(cell(tr,''),r);
  $('table-body').append(tr);
 }
 if(!rows.length){const tr=document.createElement('tr'),td=cell(tr,'Nu există înregistrări pentru filtrul ales.');td.colSpan=columns[section].length;$('table-body').append(tr);}
}
async function load(){const mine=++loadRevision;busy=true;$('feedback').textContent='Se citesc datele sintetice…';$('next').disabled=true;$('previous').disabled=true;
 try{const input={limit:3,after};if(section==='participants')input.offeringId=$('offering').value;if(['participants','outbox'].includes(section)&&$('status').value)input.status=$('status').value;const data=await read(section,input);if(mine!==loadRevision)return;next=data.next;render(data.items);$('summary').textContent=section==='outbox'?'Expediere dezactivată. Coada este doar demonstrativă.':section==='payments'?'Plăți și facturare inactive. Valorile sunt sintetice.':`${data.items.length} ${data.items.length===1?'înregistrare':'înregistrări'} pe pagina curentă.`;$('page-label').textContent=`Pagina ${history.length+1}`;$('feedback').textContent='';}
 catch(e){if(mine===loadRevision){$('feedback').textContent=e.message;next=null;}}finally{if(mine===loadRevision){busy=false;$('previous').disabled=history.length===0;$('next').disabled=!next;}}}
function reset(){after='';history=[];return load();}
function switchSection(value){section=value;$('section-title').textContent=titles[section];$('event-filter').hidden=section!=='participants';$('status-filter').hidden=!['participants','outbox'].includes(section);$('preview').hidden=true;for(const b of document.querySelectorAll('[data-section]'))b.setAttribute('aria-pressed',String(b.dataset.section===section));$('status').replaceChildren();for(const value of ['',...(section==='participants'?['reserved','confirmed','cancelled','completed']:['pending','sending','sent','stopped','review'])]){const option=document.createElement('option');option.value=value;option.textContent=value?labels[value]:'Toate stările';$('status').append(option);}reset();}
for(const b of document.querySelectorAll('[data-section]'))b.addEventListener('click',()=>switchSection(b.dataset.section));
$('refresh').addEventListener('click',reset);$('offering').addEventListener('change',reset);$('status').addEventListener('change',reset);$('previous').addEventListener('click',()=>{after=history.pop()||'';load();});$('next').addEventListener('click',()=>{if(next){history.push(after);after=next;load();}});$('close-preview').addEventListener('click',()=>{$('preview').hidden=true;});
async function reloadOfferings(){const selected=$('offering').value,events=await read('events',{limit:100});$('offering').replaceChildren();for(const e of events.items){const option=document.createElement('option');option.value=e.id;option.textContent=e.title;$('offering').append(option);}if([...$('offering').options].some(o=>o.value===selected))$('offering').value=selected;}
if(local){const {setupLocalControls}=await import('./local-controls.mjs');controls=setupLocalControls({local,refresh:async()=>{await reloadOfferings();await reset();},report:text=>{$('feedback').textContent=text;}});}
await reloadOfferings();switchSection('events');
