# Teste și rezultate reale — 8 noiembrie 2026

## Continuare locală sigură — 9 noiembrie 2026

Instrucțiunea suplimentară este păstrată în CERERE-CONTINUARE-2026-11-09.txt. Raportul actual este RAPORT-CONTINUARE-2026-11-09.md; stările mai vechi de mai jos rămân istoric.

Implementat numai local: TEST_MODE=true cu destinatar unic privat TEST_RECIPIENT_EMAIL, verificat înainte de scrieri și la frontiera Brevo; verificator offline scripts/check-isolated-config.mjs; model Cloudflare nefuncțional în cloudflare-test/. Restricția nu se aplică profilului normal când TEST_MODE lipsește/este false; verificatorul cere explicit true. Originea cunoscută a producției este respinsă în test, dar identitatea tuturor aliasurilor trebuie verificată extern.

Outboxul evenimentelor respinge COM/FIN/OPS/SES și marketing; confirmarea DOI, facturile și programările Google nu se trimit pe această cale. Loturile sunt limitate la 10 pentru bugetul D1 Free; reminderele continuă în loturi fără duplicate. Nu există scheduler instalat.

Nu există încă mediu extern izolat validat. Nu s-a activat #2 sau alt șablon și nu s-au trimis mesaje reale în această continuare. Testul anterior COM-02 primit în Inbox rămâne singura livrare externă confirmată. Preferințe/dezabonare/DOI real și welcome automat rămân nevalidate.

Confirmare ulterioară, 9 noiembrie 2026: Iulia a confirmat „A sosit în Inbox” pentru testul COM-02, ID 3. Livrarea acestui singur mesaj de test este validată prin confirmarea destinatarei. Nu validează întregul flux DOI, preferințele, dezabonarea sau livrarea către alte adrese. Șabloanele și automatizările rămân inactive.

## Test editorial Brevo — 9 noiembrie 2026

După autorizarea adresei proprii de către Iulia, a fost inițiată o singură trimitere prin Preview & test → Send Test pentru COM-02, ID 3. Destinatar unic selectat; cealaltă adresă din lista de test a rămas nebifată. Butonul a devenit temporar indisponibil și apoi disponibil, fără confirmare explicită capturată. Acceptarea furnizorului și primirea în Inbox rămân neconfirmate; nu se retrimite automat. Afirmațiile istorice „0 e-mailuri” de mai jos descriu etapa anterioară.

Acesta este un test editorial; nu dovedește DOI, preferințe sau dezabonare funcționale. Nu s-a activat niciun șablon sau workflow și nu s-a schimbat abonarea unui contact. Celelalte teste de trimitere așteaptă rezultatul primului. Producția, Stripe live și facturarea rămân neactivate.


## Verdict

Actualizare 9 noiembrie 2026: salvare reală în Brevo a cinci șabloane, ID 2–6, verificate în lista finală ca Inactive; conținutul și expeditorul au fost inspectate în editor. Asocierea formularului implicit de profil la ID 4 a fost verificată și salvată. Este validare de configurare/previzualizare, **nu** livrare, DOI, preferințe sau dezabonare end-to-end. Nu s-au trimis e-mailuri și nu s-au activat workflowuri. Incidentul reversibil de metadate la ID 4 și corectarea lui sunt documentate în pachetul Brevo. Dovezi locale: `.local/brevo-2026-11-09/cinci-sabloane-inactive-final.png`.

Continuare Brevo, aceeași zi: cele patru atribute Text au fost create/verificate în UI; lista #3, planul, expeditorul și domeniul au fost citite în cont. Scriptul `node scripts/prepare-brevo-emails.mjs` a generat și validat cinci drafturi HTML locale: variabilele exacte, linkurile HTTPS/mailto, lista #3, lipsa scripturilor/formularelor/pixelilor și starea OFF. **Nu este test de livrare și nu dovedește salvarea șabloanelor în Brevo.** Browserul a devenit instabil înaintea salvării lor. Nu s-au rulat din nou testele generale pentru această schimbare numai de documentație/pregătire e-mail; rezultatele anterioare rămân cele de mai jos.

Actualizare documentară ulterioară în aceeași zi: s-au verificat worktree-ul, headurile remote, check-urile Cloudflare și issues #81/#82. Nu s-au schimbat codul, paginile sau testele; rezultatele de implementare de mai jos sunt păstrate, fără a pretinde o nouă rulare a testelor externe. Verificarea/restaurarea backupului este consemnată separat în `SALVARE-SIGURA-FARA-DEPLOY.md` și în manifestul local.

Pregătire locală funcțională în scenariile testate, **neactivată în servicii externe**. Producția nu a fost modificată. Nu s-au trimis e-mailuri, încasat bani sau emis documente fiscale.

## Teste executate

| Verificare | Rezultat |
|---|---|
| Build inițial și build extins `node scripts/build-cloudflare.mjs` | PASS |
| `node --test qa/infrastructure.test.mjs` | 13/13 PASS, SQLite real în memorie, HTTP furnizori simulat |
| Sitemap/canonical/redirecturi `node qa/verify-infrastructure.mjs` | PASS: 18 pagini + 82 articole = 100 URL-uri distincte |
| Referințe locale HTML/assets | PASS: 3.781 referințe, 0 ținte lipsă |
| Comparație SHA-256 cu buildul inițial | PASS: 147 fișiere existente identice; sitemap extins separat |
| Excluderea modulelor private din dist | PASS: fără docs, functions, infrastructure, env sau package.json publice |
| Browser Edge/Chromium: 10 pagini × 320/390/768/1440 px | PASS: 40 verificări, 0 probleme detectate |
| Browser Chrome, pagini noi după ajustarea subsolului | PASS: 8 verificări de layout + 1 trimitere formular cu furnizori simulați; 0 e-mailuri reale |
| `git diff --check` | PASS |

Testul browser existent a raportat că selectorul CMS `contact-title` nu mai există pe pagina actuală și a omis acea verificare. Nu pretindem că salvarea în CMS sau acel câmp au fost retestate. Testele acoperă structura H1/main, imaginile esențiale, erori JavaScript și depășiri orizontale. Capturile au fost generate local în `qa-artifacts/`; subsolul a fost ajustat doar în paginile noi și reverificat. Testul punctual verifică și checkboxurile nebifate, butoanele OFF și solicitarea DOI prin UI cu servicii simulate.

Prima pornire Edge în sandbox a eșuat; prima încercare cu browser în afara sandboxului și server în interior a expirat. Rularea comună prin `qa/run-local-browser.mjs` a reușit. Aceste erori de mediu nu sunt prezentate drept teste ale serviciilor externe.

## Ce verifică cele 13 teste

1. Flags OFF, origine, tip și dimensiune cerere, input invalid.
2. DOI către Brevo/lista 3, fără înscriere marketing directă, deduplicare, dovada solicitării cu HMAC.
3. Turnstile/hostname/action, honeypot și rate limiting persistent.
4. Capacitate și reactivare rezervare protejate în SQL.
5. Înscriere administrativă fără consimțământ marketing, token, acces și anulare.
6. Chei live și lipsa comutatorului explicit false respinse.
7. Semnătură Stripe pe corp brut, alterare, expirare și eveniment live.
8. Checkout test cu validare preț și comandă idempotentă; pagina de succes nu acordă acces.
9. Plată în așteptare/eșuată/plătită, duplicat, livrare întârziată, refund și retragere acces.
10. Reprogramare/anulare cu revizie și actualizare tranzacțională a notificărilor/înscrierilor.
11. Reminder deduplicat, aprobare șablon obligatorie și review după livrare incertă.
12. Catalog de 52 șabloane: ID-uri unice, neaprobate implicit, variabile obligatorii și CTA sigur.
13. SmartBill mock: comandă–clientă–factură, duplicat, refund/storno în review, o singură notificare și zero cereri fiscale externe.

## Neexecutat / condiții de activare

- Cont Brevo: plan real, atribute/listă/șablon, DOI real, contact existent/dezabonat, bun venit, preferințe/dezabonare și suprimări, Gmail/Yahoo, bounce și livrabilitate.
- Cloudflare: deploy izolat, binding D1 real, migrații în D1 remote, Turnstile real, scheduler, backup și permisiuni. Nu există URL de preview public nou creat.
- Stripe: nicio tranzacție în cont sandbox; sunt testate simulări HTTP și semnături locale. Necesită chei test configurate privat și webhook test real.
- SmartBill: planul contului, serii, date firmă, transport/sincronizare reală, erori reale ale API-ului, fiscalitatea documentelor și e-Factura. Simulatorul **nu emite facturi SmartBill**.
- Juridic: politica și termenii nu sunt validate sau actualizate automat; retenția și procedurile de export/ștergere necesită aprobare înainte de colectare.
- Nu s-au testat încasări live, tranșe, abonamente, facturi/stornări reale sau SPV.

## Reproducere locală

Node >=22.13 (rularea curentă: 24.21.0):

```text
npm run build
npm test
npm run verify
node scripts/export-email-catalogue.mjs
```

Browser: `npm install --no-save --package-lock=false playwright@1.56.1`, apoi instalează Chromium sau setează `PLAYWRIGHT_EXECUTABLE_PATH` către browserul local. Rulează `node qa/run-local-browser.mjs`; pentru verificările noilor formulare, `node qa/run-local-browser.mjs infrastructure`. Sunt verificări locale, fără deploy. Raportul general: `qa-artifacts/browser-results.json`; imaginile și logurile nu se urcă în repository.

Comparația cu buildul inițial folosește snapshotul local ignorat `.local/baseline.json`. În CI sau într-o clonă nouă, verificarea sitemap/linkuri rulează, dar comparația istorică necesită regenerarea baselineului din commitul inițial separat. Nu interpreta `baselineUnchanged: 0` ca verificare de regresie istorică.

## Retestare 9 noiembrie 2026

13/13 teste locale PASS; build PASS; verificator PASS: 18 pagini, 82 articole, 100 URL-uri, 3.781 referințe, 0 lipsă, 147 fișiere de bază identice. Nu s-au reluat teste vizuale sau externe. Starea consolidată și pașii rămași: STARE-VALIDARE-2026-11-09.md.

Rezultate finale ale continuării: 25/25 teste locale, 40 verificări browser generale fără probleme (câmpul CMS absent omis explicit), 9 verificări infrastructură și 4 consimțământ. Vezi raportul de continuare pentru limite și erorile inițiale de mediu.
