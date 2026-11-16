# Continuare infrastructură — 12.11.2026

Stare: implementare LOCALĂ, ramura pregatire-infrastructura-email-plati. Niciun push, merge, commit nou, deployment, contact real, eveniment real sau mesaj. Nu s-a accesat/modificat Brevo în această continuare. Formularul său rămâne în ultima stare publică observată; ticket #5670720, ultimul status cunoscut Open, fără răspuns observat la ultima verificare anterioară. Nu se prezintă această observație drept verificare nouă a ticketului.

## 1. Evenimente și D1

Modelul existent a fost reutilizat: offerings, registrations, orders, payment_events, outbox, invoice_jobs și tabelele separate pentru facturare. Migrațiile 0001–0004 sunt păstrate. Noua 0005-event-admin.sql adaugă numai două indexuri și un trigger care refuză reducerea capacității sub locurile ocupate (reserved + confirmed). Migrarea peste o bază cu date în schema 0001–0004 a trecut local fără pierdere de date. NU a fost aplicată în D1 extern.

API-ul public de listare expune acum și available. Validările existente pentru duplicate, capacitate, anti-spam și consimțământ administrativ au fost păstrate. Anulările sunt idempotente, eliberează locul, nu produc o a doua notificare și refuză falsul succes pentru o participare completed. Tranzacția de anulare folosește revizia curentă a evenimentului, inclusiv când citirea inițială a devenit veche.

Administrarea poate deschide un draft, închide înscrierile, modifica data/capacitatea cu expectedRevision și anula/finaliza evenimentul. Nu poate redeschide un eveniment cancelled/completed și nu poate retrage un eveniment public în draft. Schimbările de revizie reutilizează triggerul existent: opresc mesajele pending vechi și pregătesc notificările corespunzătoare. Schimbarea capacității sau open/closed poate genera notificare de modificare; operatorul trebuie să revizuiască coada înainte de activarea trimiterii. Nu au fost introduse date/oferte reale.

Rezervările plătibile continuă să ocupe locul până la anulare/revizuire; nu s-a introdus expirare automată riscantă. Reînscrierea aceleiași adrese după anulare nu reactivează automat înregistrarea; este necesară rezolvarea manuală. Acestea sunt comportamente deliberate, nu mecanisme complete de ticketing comercial.

## 2. Administrare pregătită

Sunt API-uri administrative JSON, NU un panou vizual pentru utilizatoare. Rutele sunt locale/nepublicate și necesită token Bearer server-side, origine exactă, POST JSON, REGISTRATIONS_ENABLED=true și D1. Fără token/configurare răspund 403/503, fără CORS permisiv, răspunsuri no-store. Cloudflare Access trebuie păstrat separat pentru orice viitor mediu administrativ. Nicio cheie nu este pusă în HTML, URL, repository sau stocare de browser.

| Rută POST /api/admin/ | Intrare principală | Rezultat |
|---|---|---|
| events | limit 1–100, after opțional | evenimente, reserved+confirmed ocupate, anulate, locuri disponibile, revizie |
| participants | offeringId, status opțional, limit/after | persoane/înscrieri și situație plată; fără token sau token_hash |
| outbox | status opțional, limit/after | mesaje pending/sending/sent/stopped/review, fără expediere |
| message-preview | id mesaj | subiect/corp text, marcaj stale; fără schimbarea statusului sau trimitere |
| payments | limit/after | comenzi și revizuiri plată/factură; fără profil fiscal/email/tokens |
| prepare-reminders | obiect gol | pregătire în lot de maximum 10, fără fetch/expediere |
| cancel-registration | id, expectedStatus | anulare administrativă idempotentă; fără rambursare automată |

Rutele existente offering/lifecycle sunt reutilizate. after este ultimul ID returnat, ordonare după ID, nu după cronologie; next=null înseamnă ultima pagină. Sunt liste limitate, nu exporturi integrale. Protejarea tokenului, rotația și logurile de acces rămân configurări de activare. Nu se acordă acces prin simpla cunoaștere a unui ID.

Pregătirea reminderelor este separată de scheduleReminders/dispatch. Cu EMAIL_SEND_ENABLED diferit de true, scheduleReminders refuză înainte de scrierile în coadă. prepare-reminders poate pregăti coada numai în mediul autorizat, fără trimitere. Cron/scheduler extern NU este instalat. Preview-ul unui mesaj pentru un eveniment plătibil nu arată accesul dacă plata nu este paid; aceeași regulă a fost întărită în dispatcher pentru o înregistrare confirmed fără comandă/plată. COM/FIN/OPS/SES și mesajele promoționale nu sunt expediate prin outboxul de evenimente.

Limitare participant: tokenul de administrare a înscrierii rămâne doar în sessionStorage în browserul inițial, fără recuperare cross-device. Operatorul are acum anulare după ID, fără să afle/reemită tokenul. Nu se pretinde un portal complet de cont/clientă.

## 3. Contact și programări

Verificare statică a sursei locale, fără mesaje, rezervări sau modificări externe:
- Linkuri WhatsApp prezente în 14 fișiere HTML din rădăcină; Messenger în 4, inclusiv o previzualizare locală. Aceste numere NU sunt un audit al paginilor publice actuale și nu dovedesc livrarea mesajelor.
- Consultația gratuită de 30 de minute este menționată în 7 fișiere. CTA-ul existent solicită programarea prin WhatsApp; nu este dovadă de slot rezervat sau confirmare Google.
- mailto:contact@iuliabobeica.ro apare în comunitate.html și evenimente.html; configurarea sender/domain Brevo verificată anterior nu demonstrează recepția e-mailurilor la această căsuță. MX/căsuța, redirecționarea și recepția unui test autorizat rămân de confirmat; nu s-a trimis un test.
- Nu există URL calendar.app.google / appointments Google în paginile HTML locale sau documentele/configurările căutate. Google Calendar Appointment Schedules rămâne sistemul decis în issue #82. Nu putem confirma că pagina de rezervare este deja funcțională sau chiar că nu există separat în cont.
- Conectorul disponibil expune calendare/evenimente, nu configurarea Appointment Schedules; nu am citit întâlniri personale pentru a deduce o configurare pe care conectorul nu o poate demonstra. Nu am accesat/configurat setările Calendar în această etapă.
- Linkul comunității WhatsApp din issue #81 se păstrează în configuratie-publica.json. Intrarea în comunitate, abonarea email și înscrierea la eveniment rămân independente.

Verificare exactă rămasă în contul Google: pagina existentă și URL-ul ei oficial, titlul/descrierea consultației gratuite, durata 30 minute, cost 0/fără Stripe, Europe/Bucharest, disponibilitate, buffer, avans minim/maxim, calendarele care blochează conflictele, Google Meet/locație, câmpurile minime, confirmările/reminderele disponibile în plan și linkul de anulare/reprogramare. Nu se creează alt calendar și nu se dublează confirmările în Brevo.

Surse oficiale citite: https://support.google.com/calendar/answer/10729749?hl=en (configurarea programării și confirmărilor); https://support.google.com/calendar/answer/11608416?hl=en (unele funcții, inclusiv reminderele, depind de abonament); https://support.google.com/calendar/answer/10737245?hl=en (anularea trimite notificare și eliberează slotul). Aceste articole nu certifică setările contului Iuliei.

## 4. Încasări și facturare

Reutilizate Stripe test, semnătură webhook, stări canonicale, idempotency, deduplicare de evenimente, legătura comandă–înscriere și revizuirea rambursării/facturii. Niciun refund nu este inițiat prin noua administrare. Ledgerul nou identifică plățile sosite după anulare, rezervările cu plată failed și refund/review pentru lucru manual.

Adaptorul de pregătire SmartBill refuză acum text fiscal lipsă/invalid, date inexistente de calendar pentru emitere și referințe de plată lipsă. Validarea este locală; nu este validare fiscală sau calcul al regimului TVA. Payloadul păstrează sendEmail=false; transport fiscal real absent și INVOICING_ENABLED=true respins. Seria LOCAL și datele Fixture există numai în testele sintetice; NU sunt configurare de firmă.

După înființare sunt necesare: denumire/formă juridică, CUI/CIF și registru, sediu/adresă, bancă/IBAN, reprezentant și verificări Stripe/KYC, regim TVA și activități aprobate de contabil, catalog/prețuri/monedă și politici de anulare/refund, planul SmartBill și un singur emitent (nativ sau API), serii/numere/date, acces SPV/e-Factura și responsabil pentru validări/corecții/arhivare, protecția datelor și un singur canal de trimitere a facturii. Detalii în ACTIVARE-DUPA-INFIINTAREA-FIRMEI.md. Nu s-a fixat un termen fiscal sau un regim juridic prin cod.

## 5. Verificări efectuate pentru modificări

- 14 teste noi evenimente/admin/D1 (13 în rularea principală și unul ulterior pentru citire veche/concurență), toate PASS.
- 3 teste noi validare facturare, toate PASS.
- 9 regresii selectate din suita anterioară (7 pentru lifecycle/outbox/plăți și 2 pentru anulare), toate PASS. Total: 17 teste noi + 9 regresii = 26 cazuri distincte trecute. Repetările justificate de corecții nu sunt numărate ca teste noi.
- Build static standard local PASS; nu s-au modificat sursele publice/design/meniuri/SEO. dist este ieșire locală standard, NU un pachet nou aprobat de deployment izolat.
- Compilarea offline Pages Functions cu Wrangler 4.160.0 PASS, rezultat în .local/implementation-2026-11-12/functions. Primul apel a avertizat că nu poate scrie logul în profilul global; reluarea cu XDG_CONFIG_HOME local a trecut fără acea problemă. Nu s-a folosit OAuth, nu s-a instalat nimic și nu s-a făcut deploy.
- Testele folosesc SQLite în memorie și fetch interzis/mock; niciun mesaj, contact, rezervare sau document fiscal real.
- Nu s-au repetat 28/28 integral, 9/9 POST autentificate, 24/24 Access sau noindex. Aceste dovezi rămân istorice pentru deploymentul 1d970123; nu validează noul cod nepublicat.

## 6. Grad de pregătire

Estimări de pregătire tehnică, NU procent de funcționare în producție. Cinci blocuri a câte 20 puncte pentru fiecare domeniu; contează numai blocuri documentate.

| Domeniu | Estimare | Fundament |
|---|---:|---|
| Newsletter | 40% | domeniu/expeditor profesional verificate anterior + formular/welcome pregătite structural; lipsesc izolarea, versiunea finală legală/editorială și testele reale |
| Evenimente | 80% | model/înscriere + capacitate/dedup + lifecycle + API admin/coadă testate local; lipsește validarea D1/runtime/delivery pe mediu extern aprobat; nu există panou vizual |
| Programări | 20% | canale de contact și oferta gratuită 30 min existente; pagina Google/configurarea/notificările/testul de rezervare nu sunt confirmate |
| Plăți/facturare | 60% | checkout/webhook test + ledger/refund + adaptor mock și blocaje fiscale pregătite; lipsesc firma/configurarea comercială și verificările externe/fiscale |

## 7. Maximum cinci acțiuni obligatorii rămase

1. Brevo: răspuns #5670720 și securizare demonstrată; apoi e-mail DOI profesional/română, politica și testul unic autorizat, fără reactivare acum.
2. Google: confirmarea URL-ului Appointment Schedules existent, consultația gratuită de 30 min și notificările native; rezervare/anulare controlată numai cu aprobare pentru efectele externe.
3. Evenimente: date reale aprobate (titlu/date/locuri/acces/politici), aprobarea mesajelor și responsabilitatea administrării/retenției; nu se inventează oferte.
4. Mediu izolat: aprobare separată a noului pachet, D1 0001–0005 și protecția admin, apoi testare externă limitată; fără trimitere până la aprobarea distinctă. Nu se reutilizează aprobarea vechiului pachet/deployment.
5. Încasări: firma/KYC/contabil, catalog și politici, alegerea unui emitent/canal fiscal și testele Stripe/SmartBill/e-Factura autorizate înainte de orice activare live.

## Continuare ulterioară — interfața locală de consultare

A fost adăugată o interfață vizuală demonstrativă în tools/event-admin, pentru API-urile deja pregătite: evenimente/capacitate, înscrieri și anulate, mesaje și preview, plăți/refund/revizuire. Nu este un panou conectat la date reale. Adaptorul folosește numai fixture-uri sintetice și acceptă exclusiv cele cinci secțiuni de consultare; nu există transport de scriere sau autentificare cu secrete. Logica operațională continuă să aparțină API-ului existent, fără bază paralelă sau calendar nou.

Pornire: npm run preview:admin, la http://127.0.0.1:4179/. Serverul temporar utilizat pentru verificare a fost oprit. Este legat numai la loopback, Host allowlist, cinci fișiere servite, POST și /api refuzate, CSP connect-src none/form-action none, no-store și noindex. Interfața nu este inclusă în build-ul public. Integrarea cu D1/runtime real rămâne neimplementată și cere aprobarea mediului extern; demonstrația nu ridică procentul de readiness operațional.

6/6 teste noi PASS: adaptor read-only, cursor, filtre/capacitate, preview de revizie veche, valori financiare și limite server. Primul test HTTP a fost blocat de izolarea loopback a sandboxului; a trecut la executarea locală autorizată, fără conexiuni la servicii externe. Browser: eveniment→înscrieri, paginare, filtru anulate, mesaje/stale și plăți/refund verificate. Sintaxa JS PASS. Dovezile anterioare (26 cazuri, Cloudflare Access/noindex, Brevo) nu au fost repetate.

Nu s-au modificat API-urile, migrațiile sau paginile publice în această ultimă subetapă. Nicio acțiune în Brevo, Cloudflare, GitHub, Calendar, Stripe sau SmartBill. Ticketul #5670720 și riscul formularului rămân neschimbate/neactualizate extern. Captură: .local/implementation-2026-11-12/admin-view.png. Detalii: tools/event-admin/README.md.

## Continuare — administrare locală funcțională și solicitări simultane

Starea curentă este documentată în PANOU-LOCAL-SARCINA-RECUPERARE-2026-11-12.md. Panoul de pe portul 4180 reutilizează API-ul existent și SQLite sintetic, cu administrare și backup/restaurare; nu este doar transportul static demonstrativ anterior. 23 teste noi și 30 regresii selectate au trecut (53 cazuri distincte), inclusiv burst 200/25 locuri, duplicate, plăți/webhookuri repetate, refund concurent, erori și recuperare. Nu reprezintă o certificare a performanței Cloudflare. Migrarea nouă 0006 conține indexuri; nu a fost aplicată extern. Arhitectura Workers+D1/Brevo/Google rămâne păstrată. Serverul local este oprit și backupurile sintetice sunt păstrate; fără push/deploy, servicii externe sau modificări ale site-ului oficial.
