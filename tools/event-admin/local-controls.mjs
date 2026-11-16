export function setupLocalControls({local,refresh,report}){
 const $=id=>document.getElementById(id);let editing=null,busy=false;
 const button=(parent,label,action)=>{const b=document.createElement('button');b.textContent=label;b.addEventListener('click',action);parent.append(b);return b;};
 async function run(action){if(busy)return;busy=true;try{await action();await refresh();report('Operațiunea locală a fost salvată. Niciun mesaj expediat.');}catch(error){report(error.message);}finally{busy=false;}}
 function confirmButton(parent,label,action){const b=button(parent,label,()=>{if(b.dataset.confirm!=='yes'){b.dataset.confirm='yes';b.textContent='Confirmă: '+label.toLowerCase();return;}b.dataset.confirm='';b.textContent=label;run(action);});return b;}
 $('local-controls').hidden=false;
 $('create-event').addEventListener('submit',event=>{event.preventDefault();const f=event.currentTarget;if(!f.reportValidity())return;run(()=>local.write('offering',{id:f.elements.id.value,title:f.elements.title.value,kind:f.elements.kind.value,startsAt:Date.parse(f.elements.starts.value)/1000,endsAt:Date.parse(f.elements.ends.value)/1000,capacity:Number(f.elements.capacity.value),location:'Online — date sintetice',status:'draft'}));});
 $('edit-event').addEventListener('submit',event=>{event.preventDefault();if(!editing)return;const f=event.currentTarget;run(async()=>{await local.write('lifecycle',{id:editing.id,expectedRevision:editing.revision,action:'change',startsAt:Date.parse(f.elements.starts.value)/1000,endsAt:Date.parse(f.elements.ends.value)/1000,capacity:Number(f.elements.capacity.value)});f.hidden=true;editing=null;});});
 $('prepare-local').addEventListener('click',()=>run(()=>local.write('prepare-reminders',{})));
 $('backup-local').addEventListener('click',async()=>{try{const r=await local.backup();report('Backup local salvat: '+r.id);}catch(error){report(error.message);}});
 $('list-backups').addEventListener('click',async()=>{try{const r=await local.backups();$('backup-list').replaceChildren();for(const row of r.items){const p=document.createElement('p');p.textContent=row.id+' · '+row.reason+' ';if(row.valid!==false)confirmButton(p,'Restaurează local',()=>local.restore(row.id));else p.append(document.createTextNode('Metadate nevalide; restaurare refuzată.'));$('backup-list').append(p);}}catch(error){report(error.message);}});
 return {
  eventCell(td,row){
   if(!['draft','open','closed'].includes(row.status)){td.textContent='Eveniment închis definitiv.';return;}
   button(td,'Modifică data / locurile',()=>{editing=row;const f=$('edit-event');f.elements.starts.value=new Date(row.starts_at*1000).toISOString();f.elements.ends.value=new Date(row.ends_at*1000).toISOString();f.elements.capacity.value=row.capacity;f.hidden=false;f.elements.starts.focus();});
   button(td,row.status==='open'?'Închide înscrierile':'Deschide înscrierile',()=>run(()=>local.write('lifecycle',{id:row.id,expectedRevision:row.revision,action:'change',status:row.status==='open'?'closed':'open'})));
   confirmButton(td,'Anulează evenimentul',()=>local.write('lifecycle',{id:row.id,expectedRevision:row.revision,action:'cancel'}));
   confirmButton(td,'Finalizează evenimentul',()=>local.write('lifecycle',{id:row.id,expectedRevision:row.revision,action:'complete'}));
  },
  participantCell(td,row){if(['reserved','confirmed'].includes(row.status))confirmButton(td,'Anulează înscrierea',()=>local.write('cancel-registration',{id:row.id,expectedStatus:row.status}));else td.textContent='—';}
 };
}
