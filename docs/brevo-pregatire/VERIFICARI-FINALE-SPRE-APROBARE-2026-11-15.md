# Verificări finale Brevo — test izolat spre aprobare

Verificare exclusiv în citire, limitată la punctele rămase. Nicio activare, trimitere, creare de contact sau salvare de configurație. Nu s-au repetat testele validate sau inspecțiile filtrelor/re-entry deja finalizate. Conexiunea Chrome s-a întrerupt în timpul lucrului; verificările rămase au fost continuate într-o filă nouă, fără operațiuni de autentificare sau extragere de tokenuri.

## Rezultate confirmate

- **Welcome #14, automatizarea #2:** expeditor `contact@iuliabobeica.ro`, numele profesional existent. În Additional settings, opțiunea de Reply-to diferit este bifată, dar valoarea efectivă este tot `contact@iuliabobeica.ro`; mențiunea din sumar nu însemna o altă adresă. CC/BCC sunt OFF. Panoul a fost închis cu Cancel, fără Save.
- **DOI #12:** expeditor `contact@iuliabobeica.ro`, numele profesional existent. Reply-to `contact@iuliabobeica.ro`, confirmat vizual în câmpul avansat (reprezentarea text a câmpului era mascată). Tagul existent este `optin`. Nu s-a modificat sau salvat nimic.
- **Expeditor/domeniu:** Brevo afișează expeditorul profesional Verified; domeniul `iuliabobeica.ro` Authenticated și DMARC configurat. Avertismentul general despre unul sau mai mulți expeditori coexistă cu expeditorul Gmail, marcat freemail nerecomandat. Testul propus folosește numai expeditorul profesional, nu Gmail. Nicio setare DNS sau de domeniu nu a fost modificată.
- **Noua adresă deținută de Iulia:** căutare exactă în All contacts, fără filtru de listă, pentru `authorized-test-recipient@example.invalid` → zero contacte / couldn't find contacts. Nu s-a creat profilul și nu s-a importat adresa.
- **Formularul public existent:** în pasul Lists, o singură listă selectată: `ER | TEST DOI isolat | 2026-11-10` (#4). Lista `ER | TEST UNIC DOI API | 2026-11-14` (#7) apare explicit NEBIFATĂ; nu există un câmp multi-listă de selecție adăugat în formularul afișat. Nu s-a schimbat nicio bifă și nu s-a apăsat Next/Save. Prin fluxul configurat al formularului, noile înscrieri ajung în #4, nu în #7. Aceasta confirmă separarea configurației, nu o garanție de ACL sau un audit împotriva cererilor manipulate. Administratorii/API-urile autorizate pot gestiona listele aceluiași cont. Formularul poate continua trimiteri native independente, fără a declanșa noul trigger exclusiv #7.

Captură locală: `.local/brevo-form-list-isolation-2026-11-15.jpg`, cu lista veche bifată și lista nouă nebifată. Ultima încercare de închidere prin Cancel a întâmpinat o întrerupere a conexiunii; nu au fost introduse modificări în formular, iar revenirea de pagină nu este declarată confirmată. Nicio salvare a formularului nu a fost executată.

## Aprobare solicitată, încă neacordată

Un singur test real prin adaptorul local existent: activează temporar numai DOI #12 și automatizarea #2; o singură cerere DOI către `authorized-test-recipient@example.invalid`, `includeListIds:[7]`; Iulia confirmă linkul primit; verifică confirmarea și exact un welcome din mesajul #14. Maximum un DOI și un welcome. Fără trimitere separată a copiei #13, fără duplicate sau retry automat, fără dezabonare, modificarea profilurilor existente, formularului public sau originalelor.

Aprobarea include crearea/confirmarea exclusiv a noului profil Brevo și apartenența lui la #7. O confirmare a noului profil nu modifică consimțământul adreselor existente. După rezultat se dezactivează imediat #2 și #12 dacă au fost activate pentru test, se verifică logurile și mesajele în așteptare, iar istoricul și consimțământul nou se păstrează. Nu se pot retrage e-mailuri livrate și nu se presupune că dezactivarea invalidează linkul DOI. Dacă rezultatul este ambiguu, oprește și reconciliază, fără retrimitere.

Cloudflare rămâne OFF, fără deployment sau secrete noi în cloud; D1, Turnstile, site-ul oficial, producția, GitHub și backupurile nu se modifică. Testul este al fluxului Brevo, nu al formularului web/D1. Toate resursele sunt încă inactive conform stărilor deja documentate; această etapă nu autorizează implicit activarea.
