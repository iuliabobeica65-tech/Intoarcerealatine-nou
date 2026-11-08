// Editorial approval is deliberately separate from technical availability.
const groups={
 COM:['Confirmă adresa de e-mail','Bun venit în comunitate','Invitație WhatsApp','Preferințe','Dezabonare'],
 LIVE:['Confirmarea înscrierii','Invitație LIVE','Reminder LIVE','După LIVE','Modificarea întâlnirii','Anulare LIVE'],
 WEB:['Confirmarea înscrierii','Reminder webinar','Modificare webinar','După webinar','Anulare webinar'],
 WRK:['Rezervarea înregistrată','Detalii despre plată','Acces la întâlnire','Reminder workshop','Anulare workshop','După workshop','Modificare workshop'],
 PRG:['Înscriere în program','Detalii despre plată','Acces la program','Calendarul programului','Informații despre tranșe','Finalizarea programului','Modificare program','Anulare program'],
 SES:['Programarea ședinței','Reminder ședință','Reprogramarea ședinței','Anularea ședinței'],
 PAY:['Confirmarea plății','Plată nereușită','Plată în așteptare','Rambursare','Informații despre tranșe','Verificarea plății'],
 FIN:['Factura','Corecția facturii','Problemă la facturare'],
 MKT:['Newsletter','Lansare','Invitație','Noutăți'],
 OPS:['Livrare eșuată','Dezabonare înregistrată','Duplicat detectat','Eroare operațională']
};
export const templates=Object.entries(groups).flatMap(([group,titles])=>titles.map((title,i)=>{
 const id=`${group}-${String(i+1).padStart(2,'0')}`;
 const marketing=group==='MKT'||id==='LIVE-02'||id==='COM-03';
 return {id,trigger:id.toLowerCase(),recipients:group==='OPS'?'operator autorizat':marketing?'abonați confirmați eligibili':'persoana vizată de operațiune',
  basis:marketing?'consimțământ marketing confirmat, verificat înainte de trimitere':'temei administrativ de revizuit juridic pentru operațiune; fără înscriere marketing',
  subject:title,preheader:'Iulia Bobeica · Echilibrarea Rădăcinilor',
  body:group==='COM'?(id==='COM-01'?'Ai solicitat abonarea la e-mailurile comunității Echilibrarea Rădăcinilor. Confirmă adresa folosind linkul de mai jos. Dacă nu ai solicitat abonarea, ignoră mesajul.':id==='COM-02'?'Bun venit în comunitatea Echilibrarea Rădăcinilor. Vei primi e-mailurile pentru care ți-ai dat acordul. Poți modifica preferințele sau te poți dezabona oricând.':id==='COM-03'?'Dacă dorești, poți intra separat în comunitatea WhatsApp. Participarea este opțională. Membrii își pot vedea numerele de telefon.':id==='COM-04'?'Poți actualiza preferințele pentru e-mailurile comunității folosind linkul personal de mai jos.':'Dezabonarea oprește mesajele de marketing. Mesajele administrative privind rezervările existente sunt gestionate separat.'):
   marketing?'Mesaj editorial de completat și aprobat de Iulia înainte de orice activare.':`{{name}},\n\n${title}: {{title}}.\n{{details}}\n\nIulia Bobeica · Echilibrarea Rădăcinilor`,
  variables:group==='COM'||marketing?['cta_url']:['name','title','details','cta_url'],cta:'Deschide detaliile',marketing,
  stop:marketing?'dezabonare, lipsă DOI, bounce, lipsă aprobare':'destinatar nepotrivit, revizie veche, anulare incompatibilă cu mesajul, livrare incertă, lipsă aprobare',
  tests:['variabile lipsă respinse','URL HTTPS','destinatar eligibil','dublură oprită','revizie verificată'],approved:false};
}));
export function renderTemplate(id,vars) {
 const t=templates.find(t=>t.id===id);if(!t)throw Error('unknown_template');
 for(const key of t.variables)if(typeof vars[key]!=='string'||!vars[key]||vars[key].length>2000||/[\x00-\x08\x0b-\x1f]/.test(vars[key]))throw Error(`invalid_variable:${key}`);
 const url=new URL(vars.cta_url);if(url.protocol!=='https:'||url.username||url.password)throw Error('invalid_cta');
 return {...t,text:t.body.replace(/\{\{(\w+)\}\}/g,(_,k)=>vars[k])+`\n\n${t.cta}: ${url.href}`};
}
