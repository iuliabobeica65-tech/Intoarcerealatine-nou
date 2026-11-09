# Raport de predare — infrastructură izolată

## Test editorial Brevo — 9 noiembrie 2026

După autorizarea adresei proprii de către Iulia, a fost inițiată o singură trimitere prin Preview & test → Send Test pentru COM-02, ID 3. Destinatar unic selectat; cealaltă adresă din lista de test a rămas nebifată. Butonul a devenit temporar indisponibil și apoi disponibil, fără confirmare explicită capturată. Acceptarea furnizorului și primirea în Inbox rămân neconfirmate; nu se retrimite automat. Afirmațiile istorice „0 e-mailuri” de mai jos descriu etapa anterioară.

Acesta este un test editorial; nu dovedește DOI, preferințe sau dezabonare funcționale. Nu s-a activat niciun șablon sau workflow și nu s-a schimbat abonarea unui contact. Celelalte teste de trimitere așteaptă rezultatul primului. Producția, Stripe live și facturarea rămân neactivate.


Repository: `iuliabobeica65-tech/Intoarcerealatine-nou`.
Ramură locală: `pregatire-infrastructura-email-plati`.
Ramura de producție confirmată de Iulia: `pregatire-cloudflare-2026-10-20`.

## Actualizare 9 noiembrie — configurare reală Brevo

Cinci șabloane sunt acum salvate în cont și verificate Inactive: #2 DOI API, #3 bun venit, #4 preferințe, #5 confirmare dezabonare, #6 DOI formular nativ. Cele patru atribute create anterior sunt păstrate. Nu s-au trimis e-mailuri, activat fluxuri, schimbat credențiale sau publicat site-ul. Sunt încă necesare testele reale și aprobările din README; salvarea nu înseamnă flux funcțional.

Fișiere actualizate: MASTER, CONFIGURARE-SERVICII, TESTE-SI-REZULTATE, acest raport, README și manifestul pachetului Brevo, scriptul de regenerare; fișier nou `docs/brevo-pregatire/stare-cont.json` pentru păstrarea ID-urilor reale la regenerare. Niciun fișier de pagină, SEO, meniu, design sau runtime nu este schimbat.

## Continuare prioritară Brevo

În cont sunt create și verificate patru atribute Text, fără contacte sau trimiteri; expeditorul și domeniul sunt confirmate, lista #3 este goală. Limita de automatizare afișată este `0 contacts can enter Automations`, deci fluxurile nu sunt activate și planul trebuie clarificat. Conexiunea Chrome nu a mai finalizat editorul; niciun șablon nou nu este declarat salvat în cont.

Pregătire locală suplimentară: `docs/brevo-pregatire/` (configurație publică, cinci drafturi HTML, manifest și instrucțiuni), `scripts/prepare-brevo-emails.mjs`. Se actualizează numai documentația MASTER/configurare/teste/raport. Nicio pagină, stil global, rută sau configurare de producție nu a fost schimbată. Analytics este amânat conform priorității Iuliei; auditul și modelul săptămânal sunt păstrate separat în `.local/brevo-2026-11-08/`. Propunerea de backup off-site nu a fost executată.

## Actualizare ulterioară: păstrare fără publicare

S-au reverificat headurile GitHub și lipsa modificărilor locale concurente. Issues [#81](https://github.com/iuliabobeica65-tech/Intoarcerealatine-nou/issues/81) și [#82](https://github.com/iuliabobeica65-tech/Intoarcerealatine-nou/issues/82) sunt integrate în documentație: link WhatsApp oficial, bun venit după DOI și Google Calendar Appointment Schedules pentru programări individuale, fără confirmări duplicate în Brevo. URL-ul Google și configurarea rămân de furnizat; nu s-au schimbat funcționalități sau pagini.

Push-ul este oprit: check-urile ultimului commit remote dovedesc un preview reușit și un al doilea build Cloudflare. Pregătirea nu este salvată pe GitHub; se păstrează commit local, bundle Git restaurabil și ZIP de surse. Dovezi, excluderea de branch necesară și restaurare: [SALVARE-SIGURA-FARA-DEPLOY.md](SALVARE-SIGURA-FARA-DEPLOY.md). SHA-ul final și hashurile arhivelor se află în manifestul backupului local. Fără PR, merge, deploy sau schimbări de setări.

Fișierele acestei actualizări: acest raport, MASTER V2.1, CONFIGURARE-SERVICII, ACTIVARE-DUPA-INFIINTAREA-FIRMEI, TESTE-SI-REZULTATE și noul SALVARE-SIGURA-FARA-DEPLOY. Inventarul implementării inițiale de mai jos rămâne păstrat.

## Pentru Iulia

Sunt pregătite două pagini noi, abonarea cu double opt-in, înscrieri/rezervări cu limită de locuri, e-mailuri administrative, Stripe exclusiv test și pregătirea SmartBill cu protecție împotriva duplicatelor. Sunt 52 șabloane draft. Site-ul existent nu a fost rescris.

Validare locală: build reușit, 13 teste de logică reușite, 40 verificări generale în browser fără probleme și 9 verificări suplimentare pentru paginile/formularul nou. Cele 147 fișiere existente comparate sunt identice; sitemapul include acum două pagini suplimentare. Furnizorii au fost simulați; aceasta nu este o validare în conturile lor.

Brevo, Cloudflare/D1/Turnstile și Stripe test necesită configurare privată și probe reale. SmartBill necesită confirmarea abonamentului, datele firmei, seriile și deciziile contabilului; emiterea și trimiterea fiscală nu sunt implementate ca funcții active. Live, facturarea reală și mesajele comerciale sunt oprite.

## Stare pe componente

| Componentă | Implementat/testat local | De făcut înainte de activare |
|---|---|---|
| Comunitate | pagină, formular, protecții, apel DOI lista 3 | cont Brevo, atribute/șablon, dovezi DOI reale, preferințe/dezabonare, politică |
| WhatsApp | configurare separată de e-mail | link nou confirmat de Iulia; linkurile vechi rămân intacte |
| Evenimente/programe/ședințe | catalog, locuri, înscriere, status, acces, reprogramare/anulare/finalizare | oferte/date/capacități reale, DB test, administrare autorizată |
| Mesaje administrative | outbox, unicități, destinatari/revizii, expediere Brevo | aprobare șabloane, livrare reală, apel programat server-side |
| Marketing | catalog și instrucțiuni | conținut aprobat, automatizări și segmente configurate în Brevo |
| Stripe test | Checkout, webhook semnat, reconciliere, refund, protecții | chei private test și teste efective în contul sandbox |
| SmartBill | mock, mapare, legături date, unicități, review refund/storno, claim notificare | cont/plan, firmă, contabil, transport/sincronizare și teste autorizate |
| Stripe live | respins de cod | date juridice și implementare/revizuire distinctă, aprobare |
| Fiscal real/e-Factura | checklist | SPV/SmartBill/contabil, validare și arhivare; neactivate |

## Protecția producției și riscuri rămase

- Zero merge, zero push, zero publicare, zero schimbări DNS sau setări Cloudflare/Brevo/Stripe/SmartBill. Toată implementarea rămâne în commit local. PR: necreat.
- GitHub arată integrare Cloudflare automată, inclusiv preview pentru ramura de lucru. Push-ul ar putea declanșa deploy; nu s-a făcut pentru a respecta interdicția publicării fără aprobare.
- Linkul ramurii GitHub există, dar arată starea remote anterioară. Codul și documentația noi sunt în copia locală; linkurile GitHub către fișiere noi nu sunt încă disponibile.
- Funcțiile Pages, migrațiile D1 și setările de servicii nu au fost validate remote. Un build static reușit nu demonstrează instalarea lor.
- Nicio politică juridică existentă nu este modificată. Ea necesită revizuire înainte de folosirea noilor formulare. Nu există certificare GDPR/fiscală.
- Nu există portal de administrare, conturi cliente, recuperare automată de token, calendar extern sau scheduler instalat. Rezervările nu expiră automat. Configurarea și excepțiile sunt explicate în CONFIGURARE-SERVICII.
- Testul CMS pentru selectorul dispărut a fost omis de scriptul existent; nu s-a testat salvarea în editor.
- Două pagini noi sunt în sitemap și accesibile prin URL, dar nu au fost introduse în meniurile vechi pentru a evita modificarea navigației fără alegerea amplasării.
- Textele existente din build generează avertismente editoriale deja prezente. Nu au fost rescrise în această lucrare.

## Ce trebuie să furnizeze proprietara

1. Configurarea privată/autorizată în Brevo, Stripe test și Cloudflare; nu trimite secrete în chat sau repository.
2. Confirmarea planului Brevo și a linkului WhatsApp, aprobarea șabloanelor și politicii actualizate.
3. Oferte, prețuri, date, durate, locuri, locații și reguli comerciale.
4. După înființare: date juridice, cont SmartBill/plan și serii, decizii TVA/e-Factura cu contabilul și alegerea unui singur emitent/expeditor.
5. Aprobarea separată pentru orice push care declanșează preview/publicare, pentru merge și pentru activarea reală.

## Reluare peste câteva luni

Deschide această copie locală și ramura exactă. Rulează `git status` și `git log -1 --format=%H` pentru SHA complet al livrării. Citește MASTER V2 și documentul de activare, verifică ramura actuală de producție și compară modificările noi înainte de integrare. Rulează `npm run build`, `npm test`, `npm run verify`. Nu activa prin simpla schimbare a flagurilor: SmartBill real și Stripe live sunt blocate intenționat și cer etapa de implementare/revizuire descrisă în documentație.

Link ramură existentă: [pregatire-infrastructura-email-plati](https://github.com/iuliabobeica65-tech/Intoarcerealatine-nou/tree/pregatire-infrastructura-email-plati). Activare: [ACTIVARE-DUPA-INFIINTAREA-FIRMEI.md](ACTIVARE-DUPA-INFIINTAREA-FIRMEI.md). Skill folosit: Sites, pentru lucru local și verificare; găzduirea Sites nu a fost folosită.

## Inventar complet fișiere

Lista de mai jos include toate fișierele schimbate/adăugate față de începutul implementării. Dist, pachetele locale și capturile nu sunt comise.

| Stare | Fișier |
|---|---|
| adăugat | .env.example |
| modificat | .github/workflows/qa-site-v2.yml |
| adăugat | .gitignore |
| adăugat | assets/infrastructure.css |
| adăugat | assets/infrastructure.js |
| adăugat | comunitate.html |
| adăugat | docs/ACTIVARE-DUPA-INFIINTAREA-FIRMEI.md |
| adăugat | docs/CATALOG-SABLOANE-EMAIL.json |
| adăugat | docs/CATALOG-SABLOANE-EMAIL.md |
| adăugat | docs/CERERE-INITIALA.txt |
| adăugat | docs/CERINTE-SI-EXTINDERE-SMARTBILL.md |
| adăugat | docs/CONFIGURARE-SERVICII.md |
| modificat | docs/infrastructura-email-comunitate-plati-MASTER-V1.md |
| adăugat | docs/RAPORT-MODIFICARI.md |
| adăugat | docs/TESTE-SI-REZULTATE.md |
| adăugat | evenimente.html |
| adăugat | functions/api/[[path]].js |
| adăugat | infrastructure/api.mjs |
| adăugat | infrastructure/brevo.mjs |
| adăugat | infrastructure/invoicing.mjs |
| adăugat | infrastructure/migrations/0001.sql |
| adăugat | infrastructure/migrations/0002-smartbill.sql |
| adăugat | infrastructure/migrations/0003-lifecycle.sql |
| adăugat | infrastructure/migrations/0004-invoice-refund.sql |
| adăugat | infrastructure/operations.mjs |
| adăugat | infrastructure/payments.mjs |
| adăugat | infrastructure/security.mjs |
| adăugat | infrastructure/templates.mjs |
| adăugat | package.json |
| adăugat | qa/browser-infrastructure.mjs |
| modificat | qa/browser-smoke.mjs |
| adăugat | qa/d1-local.mjs |
| adăugat | qa/infrastructure.test.mjs |
| adăugat | qa/local-preview.mjs |
| adăugat | qa/run-local-browser.mjs |
| adăugat | qa/verify-infrastructure.mjs |
| modificat | scripts/build-cloudflare.mjs |
| adăugat | scripts/export-email-catalogue.mjs |
