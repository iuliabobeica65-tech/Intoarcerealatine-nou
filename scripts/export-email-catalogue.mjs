import {writeFileSync} from 'node:fs';
import {templates} from '../infrastructure/templates.mjs';
writeFileSync('docs/CATALOG-SABLOANE-EMAIL.json',JSON.stringify(templates,null,2)+'\n');
writeFileSync('docs/CATALOG-SABLOANE-EMAIL.md','# Catalog de șabloane e-mail\n\n'+
 'Toate textele sunt drafturi, neaprobate și neactivate. Catalogul JSON conține corpul complet, variabilele, CTA, destinatarii, temeiul, triggerul, opririle și testele fiecărui șablon. Sursele sunt în infrastructure/templates.mjs; regenerare: node scripts/export-email-catalogue.mjs.\n\n'+
 'COM-01 se implementează prin șablonul DOI Brevo, cu linkul special params.DOIurl. COM-02, COM-04 și COM-05 necesită configurarea fluxurilor și linkurilor personale în cont; pagina locală nu furnizează un endpoint fals de confirmare/dezabonare. Marketingul editorial și mesajele despre tranșe sunt blocate până la completare/aprobare. Nu există eșalonări active. FIN nu emite și nu trimite facturi reale.\n\n'+
 '| ID | Subiect | Tip | Stare |\n|---|---|---|---|\n'+templates.map(t=>`| ${t.id} | ${t.subject} | ${t.marketing?'marketing':'operațional/abonare'} | draft neaprobat |`).join('\n')+'\n\n'+
 'Automatizări pregătite în cod: confirmare înscriere, reminder administrativ la apelul schedulerului, schimbare/anulare/finalizare pe revizii, statusuri de plată verificate prin webhook și job facturare. Nu există scheduler instalat, workflow Brevo creat sau campanie trimisă. După o livrare incertă, operatorul verifică jurnalul furnizorului înainte de retry.\n');
console.log(`${templates.length} șabloane exportate, toate neaprobate.`);
