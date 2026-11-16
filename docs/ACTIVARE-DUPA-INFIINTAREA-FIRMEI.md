# Activare după înființarea firmei/PFA

## Actualizare locală — 12.11.2026

Raport curent: [CONTINUARE-INFRASTRUCTURA-2026-11-12.md](CONTINUARE-INFRASTRUCTURA-2026-11-12.md). Se păstrează cerințele și sursele istorice de mai jos. Nicio activare este autorizată implicit.

În această continuare: ledger administrativ al comenzilor/refund/review, fără export de date fiscale; semnale pentru plată paid după anulare sau failed cu loc încă rezervat. SmartBill payload refuză date fiscale obligatorii lipsă/nevalide, dată de emitere imposibilă și referință PaymentIntent lipsă. Nu există transport de emitere reală, iar sendEmail=false și fiscal_issuance_locked rămân obligatorii. Mockurile și valorile Fixture/LOCAL sunt numai în teste.

Date de completat după înființare: denumire și formă juridică, CUI/CIF/registru, sediu, reprezentant, bancă/IBAN și KYC Stripe, regim TVA validat de contabil, produse/servicii și prețuri aprobate, condiții de anulare/refund și termeni/retentie date, abonament SmartBill confirmat, un singur emitent nativ/API, serii/numere/date și regulile stornării, SPV/certificat/autorizări e-Factura, responsabil pentru validări/respingere/XML/recipise/arhivare și un singur expeditor al facturii. Aceste date nu sunt inventate și nu se cer chei în chat.

Nu este suficientă schimbarea unui flag pentru lansare: sunt necesare transporturile/configurarea live aprobate, teste autorizate Stripe și facturare cu contabilul și reconciliere. Rambursarea nu emite automat storno și anularea unei înscrieri nu inițiază refund. Datele și obligațiile concrete se reverifică la activare, fără a presupune că un termen fiscal istoric se aplică atunci.

## Continuare locală sigură — 9 noiembrie 2026

Instrucțiunea suplimentară este păstrată în CERERE-CONTINUARE-2026-11-09.txt. Raportul actual este RAPORT-CONTINUARE-2026-11-09.md; stările mai vechi de mai jos rămân istoric.

Implementat numai local: TEST_MODE=true cu destinatar unic privat TEST_RECIPIENT_EMAIL, verificat înainte de scrieri și la frontiera Brevo; verificator offline scripts/check-isolated-config.mjs; model Cloudflare nefuncțional în cloudflare-test/. Restricția nu se aplică profilului normal când TEST_MODE lipsește/este false; verificatorul cere explicit true. Originea cunoscută a producției este respinsă în test, dar identitatea tuturor aliasurilor trebuie verificată extern.

Outboxul evenimentelor respinge COM/FIN/OPS/SES și marketing; confirmarea DOI, facturile și programările Google nu se trimit pe această cale. Loturile sunt limitate la 10 pentru bugetul D1 Free; reminderele continuă în loturi fără duplicate. Nu există scheduler instalat.

Nu există încă mediu extern izolat validat. Nu s-a activat #2 sau alt șablon și nu s-au trimis mesaje reale în această continuare. Testul anterior COM-02 primit în Inbox rămâne singura livrare externă confirmată. Preferințe/dezabonare/DOI real și welcome automat rămân nevalidate.

Stare la 8 noiembrie 2026: pregătire în ramura `pregatire-infrastructura-email-plati`. Nu este autorizare de lansare. Stripe live și emiterea fiscală sunt blocate în cod.

## 1. Reluarea și protecția producției

1. Citește MASTER V1, CONFIGURARE-SERVICII și TESTE-SI-REZULTATE din această ramură.
2. Verifică din nou Cloudflare Pages → Settings → Builds → Production branch. La audit, Iulia a confirmat `pregatire-cloudflare-2026-10-20`; `main` nu este ramura declarată de producție.
3. Fetch pentru ambele ramuri, compară commiturile și păstrează schimbările noi ale proprietarei. Fă backup. Nu înlocui producția cu această copie veche.
4. Verifică dacă push pe ramura de lucru produce automat un preview Cloudflare. Nu schimba regulile de deploy. Obține aprobarea pentru publicare înainte de push dacă acesta declanșează deploy.
5. Reia documentația oficială: API-urile, abonamentele și obligațiile legale se pot schimba.

## 2. Date și decizii necesare

- Forma juridică, denumire, CIF/CUI, număr de înregistrare, sediu, cont bancar, date de contact și persoană responsabilă.
- Statut TVA, tratamentul fiecărui serviciu, cote și denumiri TVA, moneda, tratamentul cursului valutar și al comisioanelor, stabilite cu contabilul.
- Oferte, prețuri finale, date, durate, capacități, locații, reguli de rezervare, anulare, rambursare și acces. Nimic din acestea nu este inventat în configurația livrată.
- Aprobarea textelor comerciale și operaționale din catalog; programele în tranșe și abonamentele nu sunt implementate ca produse active.
- Revizuire juridică a politicii existente: operatorul, Brevo, Cloudflare/D1/Turnstile, Stripe, SmartBill, scopuri, temeiuri, destinatari, transferuri, retenție, drepturi, cookies și procesul de ștergere/export. Politica actuală nu a fost rescrisă și nu acoperă automat infrastructura nouă.

## 3. Brevo și lansarea fără încasări

Actualizare de coordonare: [issue #81](https://github.com/iuliabobeica65-tech/Intoarcerealatine-nou/issues/81) furnizează linkul WhatsApp exact, păstrat în CONFIGURARE-SERVICII. Configurează-l centralizat la activarea aprobată; include-l în bun venit numai după confirmarea DOI. Intrarea în grup rămâne voluntară. Nu distribui linkul suplimentar fără motiv.

Pentru ședințele individuale, [issue #82](https://github.com/iuliabobeica65-tech/Intoarcerealatine-nou/issues/82) stabilește Google Calendar Appointment Schedules. Iulia configurează pagina, durata, disponibilitatea, bufferul și regulile și furnizează URL-ul oficial. Apoi se pregătește butonul „Programează o ședință”, cu WhatsApp alternativ. Verifică planul Google; evită confirmări și remindere duplicate în Brevo. Nu activa încasarea și nu folosi motorul local personalizat ca înlocuitor. Aceste configurări sunt încă de făcut, fără modificarea actuală a site-ului.

Verifică planul real în cont, lista 3, expeditorul și autentificarea domeniului. Orice modificare DNS necesită acordul Iuliei. Configurează șablonul DOI oficial și atributele din CONFIGURARE-SERVICII. Nu folosi creare simplă de contact în loc de DOI.

Configurează în cont bun venit, preferințe, dezabonare și suprimări. Confirmarea nu se deduce din parametrul URL al paginii. Păstrează istoricul DOI în Brevo și verifică retragerile înainte de orice campanie. Exportul și retenția dovezilor necesită o procedură aprobată; baza locală păstrează doar solicitarea cu hash HMAC, versiune și oră, nu dovada confirmării.

Testează Gmail/Yahoo cu adrese de test autorizate: solicitare → DOI → lista 3 → bun venit → preferințe → dezabonare → campanie exclusă după dezabonare. Verifică duplicate, bounce, eșecuri, limite zilnice și trimiterea din outbox. Nu activa înainte de această verificare și revizuirea politicii.

## 4. Stripe sandbox înainte de live

Creează separat configurația test, prețuri test aprobate, webhook HTTPS test și baza D1 izolată. Fără chei live. Folosește `PAYMENTS_TEST_ENABLED=true`, `LIVE_PAYMENTS_ENABLED=false`.

Testează în contul Stripe test: Checkout reușit, card refuzat, plată asincronă, sesiune expirată, webhook repetat/întârziat, rambursare totală/parțială, anulare înainte de plată și acces. Testele locale livrate folosesc simulări; nu înlocuiesc acest pas.

Rezervările plătibile rămân ocupate până la anulare/revizuire manuală. Nu există expirare automată care să elibereze un loc în timp ce plata mai poate sosi. Sesiunile expirate și plățile ulterioare anulării necesită reconciliere/refund manual. Nu se cumpără un nou Checkout automat pentru aceeași comandă eșuată.

## 5. SmartBill: alege un singur emitent

Documentația oficială confirmă integrarea nativă Stripe pentru link de plată și facturare pe baza plăților. Pentru emiterea automată sunt necesare configurarea integrării și seria de facturi. Integrarea poate intra în conflict cu Netopia/EuPlătesc și cu alte integrări eCommerce/API. **Nu activa simultan emiterea nativă Stripe și adaptorul API pentru aceeași plată.**

Surse verificate la audit: [Integrarea Stripe](https://ajutor.smartbill.ro/article/1230-integrarea-cu-stripe), [avertismentul oficial despre duplicate](https://blog.smartbill.ro/integrare-stripe-smartbill/), [acces API](https://ajutor.smartbill.ro/article/196-integrare-api), [referința API](https://api.smartbill.ro/).

Accesul API este documentat pentru Facturare Platinum, cu limita de 3 apeluri/secundă. Confirmă în scris cu SmartBill planul și costurile aplicabile contului concret, disponibilitatea integrării native Stripe, eventuala activare prin suport, comportamentul în test și ce operațiuni sunt incluse. Nu presupune că un cont de probă emite documente fără efect fiscal. Nu introduce aici chei reale.

### Alegerea nativă

`BILLING_PROVIDER=smartbill_native`: SmartBill va fi singurul emitent după aprobarea activării. Adaptorul local pregătește evidența; importul numărului/seriei/documentului și reconcilierea cu ID tranzacție Stripe trebuie implementate și verificate în cont. Codul livrat nu pretinde că această sincronizare este deja configurată.

### Alegerea API

`BILLING_PROVIDER=smartbill_api`: contractul și maparea payloadului V1 sunt pregătite. Transportul de emitere este intenționat absent, iar `INVOICING_ENABLED=true` este respins. Implementarea lui cere o etapă aprobată separat după datele fiscale și clarificarea mediului de test cu SmartBill. Folosește username/token exclusiv server-side, limitează rata, reconciliază timeouturile cu SmartBill înainte de retry. Un timeout poate însemna că factura a fost emisă; nu retrimite orbește.

### Date și serii

Cu contabilul: stabilește seria și numerotarea facturilor, seria/corelația pentru stornări, data emiterii și a încasării, produsele/serviciile, unitățile, TVA și rotunjirea, clientă persoană fizică versus firmă, datele strict necesare și perioada legală de păstrare. Nu colecta implicit CNP și nu exporta adrese fiscale în Brevo marketing.

Relația este: înscriere → comandă → sesiune Checkout → PaymentIntent → profil de facturare separat → document → eventual storno legat de original și ID rambursare → notificare. Indexurile unice previn o a doua factură pentru aceeași comandă și același storno pentru același refund. Rambursarea nu emite și nu șterge automat o factură: marchează revizuire contabilă. Anularea și stornarea au efecte diferite și trebuie validate de contabil, inclusiv rambursări parțiale și diferențe de curs.

### RO e-Factura

Cu contabilul și suportul SmartBill verifică obligațiile actuale B2B/B2C pentru forma juridică și activitățile concrete, excepțiile aplicabile, termenele în vigoare, înrolarea SPV, certificatul și autorizările, conectarea SmartBill–ANAF, mesajele de validare/respingere, arhivarea XML și recipiselor, corecțiile/stornările și cine urmărește erorile. Nu este suficient un PDF sau un e-mail trimis clientei. [ANAF explică separat transmiterea către clientă și raportarea B2C](https://static.anaf.ro/static/3/Anaf/20241216155311_precizari%20anaf%20e%20factura.pdf). Acest material nu constituie validare fiscală și nu fixează automat un termen legal pentru viitor.

### O singură notificare

Alege `INVOICE_EMAIL_SENDER=brevo|smartbill|none`. Dacă Brevo trimite, dezactivează trimiterea SmartBill pentru aceeași factură. Dacă SmartBill trimite, Brevo nu retransmite factura; poate trimite separat confirmarea plății, cu text care nu promite o factură atașată. Registrul notificărilor are o singură înregistrare/document și nu reîncearcă automat o trimitere cu rezultat incert. Catalogul FIN necesită aprobarea textului și documentul real reconciliat; mockurile nu pot fi trimise drept facturi.

## 6. Activare live: etapă distinctă

1. Verificare juridică/fiscală, eligibilitate Stripe și KYC, cont bancar, produse/prețuri și politici aprobate.
2. SmartBill: abonament confirmat, serii, date firmă, TVA, proces e-Factura și responsabil pentru erori.
3. Implementare și revizuire a transportului fiscal ales și a căii live. Codul curent respinge cheile live și emiterea reală; nu ajunge schimbarea unui flag.
4. Webhookuri live separate, semnături, secrete, baze și acces de producție separate de preview. Nu copia datele clientelor în medii de test.
5. Teste finale autorizate împreună cu contabilul, reconciliere plată–factură–încasare–recipisă, rambursare/storno și un singur e-mail.
6. Backup, raport de regresie, PR draft revizuit, aprobarea explicită a Iuliei înainte de merge/publicare. Monitorizare și procedură de oprire după lansare.


### Actualizare 13.11.2026 — pregatire validare cloud, fara executie

Planul consolidat este in `docs/cloud-validation/PLAN-CONSOLIDAT-2026-11-13.md`. Pachet administrativ privat separat (11 fisiere), Worker compilat offline, D1 nou doar proiectat, sase migratii existente pastrate. 9 teste locale noi trecute; 11/11 verificari ale sablonului de configurare. Scenariile externe si rollback sunt pregatite, nu executate. ID D1/AUD/preflight/cote raman de verificat dupa aprobarea consolidata. Brevo, productia, GitHub si Cloudflare nu au fost modificate. Testele cloud istorice nu au fost repetate. Nu reprezinta lansare sau plati functionale.


### Executie izolata 13.11.2026 — stare finala OFF verificata

Raport curent: `docs/cloud-validation/REZULTATE-CLOUD-2026-11-13.md`. OAuth cu cele 5 permisiuni confirmat. O baza D1 noua, sase migratii trecute, 8/8 scenarii D1 remote si 2/2 teste locale noi ale exporturilor reale. Time Travel verificat. Un deployment privat de validare si republicarea necesara a artefactului OFF original, exclusiv Preview. Variabilele initiale restaurate exact, bindingul D1 si secretele administrative noi eliminate din cloud; vechiul deployment de test blocat prin rotirea marcajului bazei. Panoul/API-ul autentificat in browser NU sunt confirmate (control browser blocat). Nicio productie, GitHub, Brevo, plata sau expediere reala modificata. Nu este lansare publica si nu este benchmark end-to-end.


### Continuare newsletter API — 13.11.2026

Decizia curenta revine la un singur flux DOI API, fara stergerea variantei native. Raport: `docs/brevo-pregatire/DOI-API-CONTINUARE-2026-11-13.md`; inventar: `decision-api-2026-11-13.json`. Raspunsul oficial Brevo #5670720 transmis de Iulia confirma lista dupa click si DOUBLE_OPT-IN=Yes, dar nu inlocuieste testul real. ID-uri: lista test #4, DOI API candidat #2, automatizare #1 INACTIVA, mesaj welcome #7 (sursa #3); #6/#8 raman ale fluxului nativ istoric. Nu s-au schimbat ID-uri/configurari live.

Corectie numai locala: claim atomic rolling 24h, erori ambigue pastrate pending, fara fabricarea confirmarii sau reabonare automata. 5 teste noi + 3 regresii relevante trecute, build API offline reusit, indexul existent reutilizat; fara migratii noi. Preferinte, unsubscribe/suprimare, welcome unic si panou cloud autentificat raman netestate end-to-end. Formularul gazduit are risc public rezidual; nu se distribuie linkul. Cloudflare ramane OFF, fara operatiuni externe, push, deployment sau mesaje.
