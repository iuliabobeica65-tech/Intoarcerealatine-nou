# Teste și rezultate reale — 8 noiembrie 2026

## Ultima continuare — panou local, concurență și recuperare

23 teste noi PASS: qa/load-recovery.test.mjs (11), qa/local-admin-runtime.test.mjs (5), qa/protected-reader.test.mjs (7). 30 regresii selectate PASS: events-admin (14), infrastructură (10 nume relevante pentru batch/înscrieri/plăți/outbox), admin-view (6). Total 53 cazuri distincte; fără reluarea integrală a suitei vechi de 28 ori a verificărilor Cloudflare. Compilare offline Worker PASS; nicio migrare sau publicare externă.

Browser local: creare/deschidere ciornă, refuz capacitate sub ocupate, schimbare validă, anulare participantă, backup, restaurare cu păstrarea stării anterioare, pregătire remindere fără expediere. Captură .local/implementation-2026-11-12/admin-local-working.png. Rezultatele detaliate și limitele testului de 200 cereri sunt în [raport](PANOU-LOCAL-SARCINA-RECUPERARE-2026-11-12.md). Nu sunt teste D1/Stripe/Brevo reale sau benchmark de producție.

## Continuare locală 12.11.2026 — evenimente/admin/facturare

17 teste noi trecute: 14 în qa/events-admin.test.mjs (inclusiv migrare peste schema existentă și anulare cu citire veche) și 3 în qa/billing-preparation.test.mjs. 9 regresii selectate din qa/infrastructure.test.mjs au trecut (checkout, payment pending/refund, lifecycle, outbox, SmartBill mock, separarea Google/marketing/facturi, loturi D1 și două scenarii de anulare). Total 26 cazuri distincte, fără a număra repetările după corecții drept cazuri noi. Suita veche de 28 NU a fost reluată integral.

Build static local PASS, Pages Functions compile offline PASS cu Wrangler 4.160.0 și loguri în .local/implementation-2026-11-12/wrangler-config. JSON/JS verificate și git diff --check fără erori de whitespace; avertismentele CRLF sunt ale mediului. Nu s-au repetat verificările 9/9 POST, 24/24 Access sau noindex. Testele noi sunt SQLite în memorie și fetch interzis/simulat, nu integrare D1/Brevo/Stripe/SmartBill reală. Niciun e-mail/participant/document fiscal real.

Comenzi pentru testele noi: npm run test:events și npm run test:billing. Raport detaliat, limite și procentajele de pregătire: [CONTINUARE-INFRASTRUCTURA-2026-11-12.md](CONTINUARE-INFRASTRUCTURA-2026-11-12.md).

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

## Retestare Brevo — 11 noiembrie 2026

28/28 teste locale PASS, inclusiv restricția destinatarului, lista separată obligatorie și refuzul listelor multiple/excluderilor înainte de apeluri externe. Build Cloudflare PASS. Verificator: 18 pagini, 82 articole, 100 URL-uri sitemap, 3.781 referințe, 0 lipsă, 147 fișiere identice cu baselineul local; redirects nemodificate, fișiere private excluse. Baselineul nu este o comparație cu producția actuală.

Preflight offline: configurationPass=false, externalEnvironmentVerified=false, activationAuthorized=false, deoarece variabilele private nu sunt injectate în proces. Nu s-au citit fișiere de secrete și nu s-a demonstrat configurația contului prin acest test. Fără trimitere reală, activare, push sau deploy. Acțiunea welcome este salvată inactiv în Brevo; detalii în brevo-pregatire/CONTINUARE-2026-11-10.md. DOI API → atribut confirmat → welcome unic → preferințe → dezabonare rămâne netestat în cont.

## Confirmare Iulia din Chrome — 12 noiembrie 2026

Pe deploymentul izolat aprobat: 9/9 POST autentificate pass:true; înscrieri 503/not_configured, Stripe webhook 503/payments_disabled, administrare 403/forbidden. Pentru paginile testate: X-Robots-Tag: noindex, nofollow, noarchive. Rezultate confirmate prin capturile Chrome conform declarației Iuliei în chat; capturile nu au fost atașate și inspectate independent de agent. Nu se declară că toate răspunsurile API au headerul. Rezultatele anterioare 24/24 Access fără autentificare rămân valabile și nu au fost repetate. Nu s-au activat servicii sau executat alte deploymenturi. Raport consolidat: cloudflare-test/REZULTAT-PRIMUL-DEPLOYMENT.md, cu lipsurile Brevo și pasul propus, neexecutat.

## Pregătire formular nativ — 12 noiembrie 2026

28/28 teste locale PASS, build PASS și verificator PASS (18 pagini, 82 articole, 100 sitemap, 3.781 referințe, 0 lipsă, 147 baseline local identice). Opt verificări statice ale specificației native trecute; artefactul aprobat anterior cu 154 fișiere este neschimbat. Numai documentație și inventar actualizate. Formular Brevo necreat, integrare neaplicată, automatizare inactivă, zero mesaje și contacte modificate în această etapă. Compatibilitate structurală #6 verificată în citire; selectabilitatea și izolarea server-side a destinatarului rămân netestate. Plan curent: brevo-pregatire/FORMULAR-NATIV-DOI-2026-11-12.md. Scenariile API istorice nu mai sunt instrucțiunea pentru această abonare; codul se păstrează.

### 12.11.2026 — configurare nativă Brevo autorizată, fără test real

Formular `6af5c20e8646ba0a458ab642`: lista #4 unică, DOI implicit temporar, Final confirmation OFF; design și mesaje în română, consimțământ obligatoriu nebifat și link de confidențialitate. Settings și Messages recitite după salvare. Originalul #6 inspectat în editor HTML, păstrat nemodificat; cauza absenței din selector nu este demonstrată. Automatizarea #1 neactivată.

8/8 verificări statice ale inventarelor JSON PASS; git diff --check PASS (avertismente de conversie CRLF, fără erori). Nu s-au repetat testele Cloudflare sau build-ul, deoarece nu s-a modificat codul aplicației în această etapă. Nu sunt teste de livrare sau de validare a unui submit.

STOP înainte de Done: Brevo a generat URL la Share; o stare explicită Inactive și blocarea publică nu au fost confirmate. 0 Submits / 0 New contacts în inventarul UI. Fără e-mailuri, contacte, push, merge sau deployment. Mai lipsesc izolarea server-side, verificarea e-mailului implicit, politica pentru newsletter și aprobarea separată a testului real. Detalii și dovezi în docs/brevo-pregatire/FORMULAR-NATIV-DOI-2026-11-12.md.

### 12.11.2026 — citire publică, fără submit

Confirmat în browser separat fără login Brevo: formularul existent se afișează înainte de Done, form POST și submit enabled. Acceptarea înscrierilor rămâne netestată. Șablon implicit #8 Active/en/expeditor personal; #9–#11 observate Active. #1 Inactive, 0 porniri. Nicio înscriere, trimitere sau dezactivare efectuată. Planul complet și cererea de suspendare sunt păstrate în docs/brevo-pregatire. Corectează interpretarea anterioară: Done neapăsat nu reprezintă izolare.

### Continuare — interfață de administrare demonstrativă

6/6 teste noi qa/admin-view.test.mjs PASS. Primul apel HTTP pe loopback a eșuat EACCES în sandbox; reluarea autorizată local a trecut. Verificări browser pentru cele patru secțiuni, paginare, anulări și mesaj cu revizie veche PASS. Date exclusiv sintetice, fără API/provider real, fără scrieri. Serverul demonstrativ a fost oprit. Niciun test anterior Cloudflare sau din cele 26 de cazuri anterioare nu a fost reluat în această subetapă.


### Actualizare 13.11.2026 — pregatire validare cloud, fara executie

Planul consolidat este in `docs/cloud-validation/PLAN-CONSOLIDAT-2026-11-13.md`. Pachet administrativ privat separat (11 fisiere), Worker compilat offline, D1 nou doar proiectat, sase migratii existente pastrate. 9 teste locale noi trecute; 11/11 verificari ale sablonului de configurare. Scenariile externe si rollback sunt pregatite, nu executate. ID D1/AUD/preflight/cote raman de verificat dupa aprobarea consolidata. Brevo, productia, GitHub si Cloudflare nu au fost modificate. Testele cloud istorice nu au fost repetate. Nu reprezinta lansare sau plati functionale.


### Executie izolata 13.11.2026 — stare finala OFF verificata

Raport curent: `docs/cloud-validation/REZULTATE-CLOUD-2026-11-13.md`. OAuth cu cele 5 permisiuni confirmat. O baza D1 noua, sase migratii trecute, 8/8 scenarii D1 remote si 2/2 teste locale noi ale exporturilor reale. Time Travel verificat. Un deployment privat de validare si republicarea necesara a artefactului OFF original, exclusiv Preview. Variabilele initiale restaurate exact, bindingul D1 si secretele administrative noi eliminate din cloud; vechiul deployment de test blocat prin rotirea marcajului bazei. Panoul/API-ul autentificat in browser NU sunt confirmate (control browser blocat). Nicio productie, GitHub, Brevo, plata sau expediere reala modificata. Nu este lansare publica si nu este benchmark end-to-end.


### Continuare newsletter API — 13.11.2026

Decizia curenta revine la un singur flux DOI API, fara stergerea variantei native. Raport: `docs/brevo-pregatire/DOI-API-CONTINUARE-2026-11-13.md`; inventar: `decision-api-2026-11-13.json`. Raspunsul oficial Brevo #5670720 transmis de Iulia confirma lista dupa click si DOUBLE_OPT-IN=Yes, dar nu inlocuieste testul real. ID-uri: lista test #4, DOI API candidat #2, automatizare #1 INACTIVA, mesaj welcome #7 (sursa #3); #6/#8 raman ale fluxului nativ istoric. Nu s-au schimbat ID-uri/configurari live.

Corectie numai locala: claim atomic rolling 24h, erori ambigue pastrate pending, fara fabricarea confirmarii sau reabonare automata. 5 teste noi + 3 regresii relevante trecute, build API offline reusit, indexul existent reutilizat; fara migratii noi. Preferinte, unsubscribe/suprimare, welcome unic si panou cloud autentificat raman netestate end-to-end. Formularul gazduit are risc public rezidual; nu se distribuie linkul. Cloudflare ramane OFF, fara operatiuni externe, push, deployment sau mesaje.


### Profil HTTP/Turnstile pregatit local — 13.11.2026

Raport: `docs/cloud-validation/HTTP-TURNSTILE-LOCAL-2026-11-13.md`. Pachet nou de 13 fisiere, build offline, reutilizare D1 existent si zero migratii noi. 7 teste noi + 3 regresii relevante trecute; browser local: 8 verificari, Access/Turnstile simulate, zero cereri externe. Profilul pastreaza JWT Access + Bearer + Origin + marcaj D1, adrese sintetice/evenimente gratuite si expirare maximum o ora. Brevo ramane separat: maximum un DOI/un welcome numai cu aprobare ulterioara. Pachetele vechi si documentele sunt pastrate. Niciun deployment/mesaj/activare in aceasta etapa; Cloudflare ramane OFF.


### Execution HTTP privee terminee et OFF verifie — 13.11.2026

Raport curent: `docs/cloud-validation/REZULTAT-HTTP-ACCESS-2026-11-13.md`. OAuth cu sase scope-uri confirmat; un widget Turnstile gratuit creat numai pentru aliasul privat, fara Spin. Deploymentul HTTP a refuzat accesul intern cu access_required; fluxul cloud nu este validat functional. Zero inscrieri HTTP, zero DOI/welcome, automatizarea Brevo neactivata si dezabonarea neexecutata. Revenire OFF verificata in maximum 10 minute: variabile restaurate, binding/secrete temporare eliminate, D1 restaurat (doua inscrieri sintetice/un eveniment/sase migratii), marcaj blocat, artefact OFF republicat in Preview. Productia/GitHub/site-ul oficial nemodificate. Diagnostic local separat pregatit, 3 teste noi + 2 regresii crypto trecute; necesita aprobare noua pentru deployment, maximum 15 minute, fara D1/Turnstile/Brevo.
