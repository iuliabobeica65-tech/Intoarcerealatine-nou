# Validarea cloud a infrastructurii existente — 13.11.2026

Stare: PREGĂTIT LOCAL. Nu s-au creat resurse, nu s-a executat deployment, push sau merge. Nu există aprobare pentru executarea acestei etape. Istoricul din 12.11.2026 rămâne valabil; testele Cloudflare deja trecute nu au fost repetate.

## Pachetul propus

Exclusiv proiectul Pages Direct Upload `er-brevo-test-izolat`, ramura `pregatire-infrastructura-email-plati`, mediul Preview. Folosim Worker-ul Pages existent ca model, fără un serviciu Workers sau calendar paralel. Panoul de consultare reutilizează API-ul existent. Comenzile administrative de validare folosesc aceleași rute, nu un API nou de simulare.

Pachet separat, 11 fișiere: index.html, admin.css, admin.mjs, read-model.mjs, demo.mjs (dependență existentă; date sintetice), cloud-reader.mjs, protected-reader.mjs, _worker.js, _routes.json, _headers, robots.txt. UI-ul de scriere/backup local nu este publicat. Compilarea este offline, cu esbuild deja instalat. Manifestul cu hashurile este `.local/cloud-validation/manifest.json`; fiecare pregătire produce un director nou și păstrează versiunile precedente.

Baza nouă propusă: `er-brevo-test-izolat-events-validation`. ID-ul nu există încă în contract. Cele șase migrații existente sunt păstrate integral și verificate. Nu se importă baza locală, contacte sau backupuri reale. Doar fixture-uri prefixate `validation-`, adrese `example.invalid`, o tabelă `_validation_identity` cu marcaj unic generat după verificarea ID-ului bazei noi.

## Protecțiile pregătite

- Ținta, originea exactă a aliasului și etapa Preview sunt obligatorii; adresa principală și URL-urile unice diferite de alias sunt refuzate de noul Worker.
- Cloudflare Access rămâne obligatoriu. Worker-ul verifică suplimentar semnătura RS256, issuer, AUD, expirare și identitatea proprietarei prin HMAC; simpla prezență a headerului nu este suficientă. AUD și politica efectivă trebuie citite înaintea execuției.
- API-ul administrativ cere suplimentar Bearer privat, Origin exact și JSON POST; secretul se introduce personal numai în formularul privat și rămâne în memorie, nu în URL/storage. Nu se extrag cookie-uri sau tokenuri Access.
- Accesul D1 cere marcajul corect. Root config nu are binding D1 și rămâne OFF. Configurația Preview este un șablon neexecutabil în starea actuală: ID/AUD lipsă, VALIDATION_ACTIVE=false.
- Newsletter, înscrieri publice, checkout, webhook Stripe și dispatch nu sunt permise de wrapper. Fără chei Brevo/Stripe/SmartBill/Turnstile. Orice asemenea secret sau flag comercial activ provoacă refuz. REGISTRATIONS_ENABLED=true este necesar API-ului administrativ existent, dar rutele publice rămân blocate de wrapper.
- Toate răspunsurile noului Worker: no-store și X-Robots-Tag noindex, nofollow, noarchive. Fără scripturi analytics în pachet.

## Verificat local în această etapă

9 cazuri distincte trecute: 8 în `qa/cloud-validation.test.mjs`, 1 în `qa/cloud-artifact.test.mjs`. Acoperă semnături și claims JWT falsificate, configurații interzise, porți Access/Bearer/marcaj DB, refuzul operațiunilor comerciale/publice, migrații + fixture sintetic + refund/review, contractul și integritatea pachetului compilat, scenariile SQL de capacitate/duplicate. Verificatorul configurației: 11/11 condiții de pregătire trecute. Sintaxa scenariului de browser validă.

Testul SQL local verifică schema și constrângerile; NU demonstrează concurența distribuită D1. Nu s-au repetat cele 53 de cazuri anterioare sau 9/9 POST și 24/24 cereri Cloudflare. Nu există rezultate noi din cloud.

## Operațiunile externe propuse, într-o singură etapă aprobată

1. Preflight numai citire: identitatea contului din contract, proiectul exact, inventarul deploymenturilor și configurației Preview, protecțiile Access principale/wildcard, AUD și plan/cote D1. Salvează configurația nesensibilă pentru revenire. Oprește dacă există lucrări Preview concurente, altă bază sau cost/upgrade neaprobat. Configurația Preview se aplică tuturor Preview-urilor acestui proiect, nu unei singure ramuri.
2. Creează numai baza D1 nouă cu numele de mai sus; verifică UUID/nume/cont, aplică cele șase migrații numai acestui UUID și bootstrap-ul cu marcaj unic. Dacă numele există deja, nu reutiliza baza fără verificarea provenienței. Exportă schema și fixture-urile și înregistrează bookmark Time Travel după bootstrap; păstrează ambele în `.local`, fără import de producție.
3. Completează privat configurația Preview cu noul UUID, AUD verificat și directorul exact din manifest. Generează ADMIN_TOKEN, DATA_HMAC_KEY și ACCESS_OWNER_HMAC local, fără afișare în chat/loguri. Configurează doar Preview. Permisiunea D1 de scriere poate fi necesară suplimentar față de sesiunea Pages anterioară; sesiunea nu a fost reverificată aici. Dacă este necesar OAuth, confirmarea este personală, fără secrete în conversație. Permisiunile de cont pot acoperi mai multe resurse: comenzile trebuie fixate explicit pe proiectul/UUID-ul aprobate.
4. Un singur deployment al pachetului verificat în ramura de test, fără GitHub sau producție. Activează numai VALIDATION_ACTIVE pentru validarea administrativă izolată; serviciile comerciale rămân OFF. Păstrează Access. Nu modifica proiectul oficial ori domeniul oficial.
5. Execută scenariile de mai jos; exportă starea după mutații, restaurează exclusiv baza de test la bookmark-ul după bootstrap și verifică din nou marcajul/schema/numărătorile. La final oprește VALIDATION_ACTIVE pentru această etapă, păstrează datele/rapoartele și Access. Nu șterge baza sau deploymenturile.

## Scenariile externe pregătite

| Caz | Procedură și rezultat așteptat |
|---|---|
| Capacitate și rezervări | `d1-concurrency-cases.json`: setup, apoi 6 cereri D1 distincte în paralel pentru 3 locuri; exact 3 inserări și 3 refuzuri de constrângere. Rezervările ocupă locuri. Nu este testul întregului formular public. |
| Duplicate | Alte 6 inserări simultane, același eveniment/e-mail sintetic: una acceptată, cinci refuzate UNIQUE. Nicio repetare automată a inserărilor refuzate. |
| Administrare și anulare | `VALIDARE-IN-BROWSER.js`, numai după aprobare și autentificare: Bearer invalid refuzat, consultare autorizată, 24 citiri cu concurență 6, aceeași anulare de două ori, coadă pregătită cu sendingEnabled=false. Raport doar statusuri și latențe, nu conținut personal. |
| Plăți/rambursări simulate | `bootstrap.sql.template` introduce o comandă sintetică paid; `refund-simulation.sql` verifică refunded și invoice_jobs=review. Nu apelează un webhook Stripe și nu demonstrează Stripe end-to-end. Repetarea nu creează rambursări sau facturi. Logica webhook/idempotency are dovezi locale anterioare, nu cloud în această etapă. |
| Restaurare | Export pre/post + bookmark după bootstrap; restaurare numai UUID test, apoi `database-checks.sql`, foreign_key_check, marcaj, stări și capacitate. Păstrează exporturile. |
| Securitate | Access păstrat; Bearer greșit, origin greșit, operațiuni publice/dispatch/webhook blocate. Baza fără marcaj refuzată. Nu se dezactivează Access pentru test. |

Buget maxim propus: 1.000 cereri HTTP, 400 înscrieri sintetice, 10 MB bază nouă, aproximativ 10.000 scrieri de rânduri (inclusiv indecși/trigger-e). Limitele de scrieri sunt estimări: urmărește metadatele D1 și oprește la prag, eroare neașteptată, date nesintetice sau supraocupare. Nu efectua benchmark agresiv. Concurența 6 este limita aleasă pentru test, nu o promisiune de capacitate globală; D1 poate serializa scrierile și poate răspunde overloaded.

## Costuri și limite

Documentație oficială consultată 13.11.2026: Free include 5 milioane rânduri citite/zi, 100.000 scrise/zi și 5 GB total; bază Free maximum 500 MB. Paid: bază maximum 10 GB, costuri de consum după cotele incluse (citiri $0,001/milion, scrieri $1/milion, stocare $0,75/GB-lună). Time Travel: 7 zile Free / 30 Paid; maximum 10 restaurări/10 minute/bază. Limita de interogări per invocare: 50 Free / 1.000 Paid. Indexurile și trigger-ele consumă scrieri suplimentare. Utilizarea totală a contului și costurile Workers trebuie verificate înainte; nu promit cost total zero și nu aprob upgrade/abonament/plată. Volumul propus este redus, fără garanție de throughput pentru lansare.

Surse: [D1 limits](https://developers.cloudflare.com/d1/platform/limits/), [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/), [Preview config](https://developers.cloudflare.com/pages/functions/wrangler-configuration/), [Access JWT](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/).

## Revenire și condiții de oprire

Oprește VALIDATION_ACTIVE, păstrează Access și toate serviciile OFF; exportă starea înainte de restaurare. Reinstalează configurația Preview anterioară, inclusiv eliminarea numai a bindingului/secretelor NOU introduse de această etapă dacă nu existau înainte. Nu expune valori de secrete și nu suprascrie unele existente: conflictul impune oprire. Nu atinge configurația Production.

Preview nu este eligibil pentru rollback-ul nativ Pages. Pentru revenirea aliasului este necesar un nou deployment al artefactului OFF păstrat `.local/brevo-2026-11-11/deployment-off-1794421697090`, verificat din manifestul său, exclusiv pe aceeași ramură de test. Acest deployment de revenire trebuie inclus explicit în aprobarea consolidată; păstrează deploymentul eșuat și baza izolată pentru diagnostic. Nu folosi Rollback care schimbă Production. [Documentația Pages](https://developers.cloudflare.com/pages/configuration/rollbacks/).

Necunoscute până la preflight: sesiunea OAuth activă, AUD, cote/plan curent, absența schimbărilor concurente în Preview, UUID nou, latențele D1 și restaurarea efectivă. Brevo rămâne neschimbat, tichet #5670720; nicio verificare nouă a tichetului. Aceste limite nu sunt raportate ca implementare cloud funcțională.

## Aprobarea unică necesară

Crearea unei singure baze D1 de test, migrațiile și fixture-urile descrise, configurarea exclusiv Preview cu secrete administrative noi, un deployment privat al acestui pachet, testele bounded cu date sintetice, export/restaurare test și oprirea validării la final; numai dacă este necesar, redeploymentul artefactului OFF pentru revenire. Fără Brevo, e-mailuri, Stripe, facturare, GitHub, resurse suplimentare, ștergeri sau upgrade plătit. Orice abatere de țintă/configurație/siguranță oprește execuția.

Manifest pachet verificat local: `C:\Users\iulia\Documents\ChatGPT\Echilibrarea radacinilor infrastructura digitala\.local\cloud-validation\package-1794556713843`. SHA-256 al listei ordonate de fisiere/hashuri: `fc513707b53a24dc5533672c26ad23db1c569f11d2267582142595700051b97d`. Acesta nu este SHA de commit Git.


### Preflight Cloudflare 13.11.2026 — aprobare primita, executie oprita

Sesiunea existenta, contul si proiectul izolat confirmate; un singur Preview existent. Lipseste permisiunea d1:write. Nu s-a creat D1 si nu s-a facut deployment. Access/AUD/configuratia Preview si cotele necesita inca verificare curenta. Detalii: docs/cloud-validation/PREFLIGHT-2026-11-13.md.


### Executie izolata 13.11.2026 — stare finala OFF verificata

Raport curent: `docs/cloud-validation/REZULTATE-CLOUD-2026-11-13.md`. OAuth cu cele 5 permisiuni confirmat. O baza D1 noua, sase migratii trecute, 8/8 scenarii D1 remote si 2/2 teste locale noi ale exporturilor reale. Time Travel verificat. Un deployment privat de validare si republicarea necesara a artefactului OFF original, exclusiv Preview. Variabilele initiale restaurate exact, bindingul D1 si secretele administrative noi eliminate din cloud; vechiul deployment de test blocat prin rotirea marcajului bazei. Panoul/API-ul autentificat in browser NU sunt confirmate (control browser blocat). Nicio productie, GitHub, Brevo, plata sau expediere reala modificata. Nu este lansare publica si nu este benchmark end-to-end.
