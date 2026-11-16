# Validare Cloudflare izolată — rezultat 13.11.2026

Stare finală: **OFF verificat**, după validarea D1 aprobată. Nu reprezintă lansare publică sau validare completă a panoului în browser.

## Ce s-a executat

- OAuth oficial Device Flow finalizat personal de Iulia. Wrangler a confirmat identitatea, contul așteptat și exact scope-urile user:read, account:read, pages:write, d1:write, offline_access. Nu s-au cerut permisiunile suplimentare din avertismentul generic Wrangler.
- Preflight: proiectul `er-brevo-test-izolat`, fără Git integration; inițial un singur Preview și zero baze D1. Variabile comerciale OFF, fără binding D1. Ambele aplicații Access există: domeniul principal și wildcard Preview; fiecare are regula Allow numai pentru adresa proprie autorizată, fără Bypass/Service Auth observate. AUD Preview citit din UI, nu din cookie/token. API-ul OAuth nu permitea detaliile Access sau abonamentele; acestea au fost verificate în browserul conectat, fără extinderea permisiunilor.
- Planul Workers **Free** confirmat în panou: 100.000 cereri/zi, CPU 10 ms/invocare; D1 10 baze, 5 GB total, 5 milioane citiri/zi, 100.000 scrieri/zi. Nu s-a făcut upgrade. Contorul exact de cereri Workers rămas pentru zi nu a fost extras; planul/cotele nominale și inventarul D1 au fost verificate. Volumul de test a fost redus; nu este benchmark de capacitate globală.
- Creată o singură bază: `er-brevo-test-izolat-events-validation`, UUID `d630add8-e006-4379-b3ee-0b16307afdcb`. Cele șase migrații existente au trecut. Exclusiv fixture-uri `validation-`, adrese `example.invalid`; nicio copiere din producție.
- Configurare exclusiv Preview, verificând prin comparație configurația Production nemodificată. Un deployment privat de validare: `68247f92-8704-4de8-842a-9e6ed61ea723`. URL: https://68247f92.er-brevo-test-izolat.pages.dev . Pachetul de 11 fișiere și cele șase migrații aveau hashurile neschimbate înainte de execuție. API-ul public de înscriere, Brevo, Stripe, facturarea și dispatch au rămas excluse din wrapper.

## Teste trecute și limitele dovezilor

**8/8 scenarii D1 remote trecute**, 30 cereri API D1 în runner, 86 rânduri citite / 43 scrise raportate pentru runner (nu totalul migrațiilor/exporturilor):

| Scenariu | Rezultat |
|---|---|
| 6 inserări concurente pentru 3 locuri | 3 acceptate, 3 refuzate de constrângere; fără supraocupare |
| 6 inserări concurente cu același e-mail/eveniment | una acceptată, 5 refuzate UNIQUE |
| Rezervări în așteptare | ocupă locurile, capacitatea respectată |
| Anulare repetată | aceeași înscriere rămâne anulată; operație SQL idempotentă |
| Loc eliberat după anulare | o nouă rezervare sintetică acceptată |
| Refund repetat, numai SQL | invoice_jobs rămâne review; fără Stripe sau document fiscal |
| Ledger repetat, numai SQL | un singur eveniment în ledger; fără webhook HTTP real |
| Izolare și integritate | zero adrese reale, foreign_key_check fără erori |

**Restaurare Time Travel remote verificată:** după păstrarea exportului post-test, revenire la bookmark-ul după bootstrap. Rezultat: un eveniment, două înscrieri inițiale, `validation-confirmed=confirmed`, invoice job `awaiting_provider`, șase migrații. Baza ocupă 204.800 bytes. Nu s-a șters baza.

**2/2 teste locale NOI ale exporturilor reale trecute:** ambele dumpuri D1 se încarcă în SQLite local, integrity_check=ok și foreign_key_check fără erori; exportul post-test păstrează dovezile pentru capacitate/duplicate/anulare/review. Fișier: `qa/cloud-backup-export.test.mjs`. Cele 9 teste locale din pregătire nu au fost repetate în această execuție; rămân dovezi anterioare.

**Neverificat:** panoul și POST-urile administrative prin sesiunea Access autorizată, întregul flux HTTP de înscriere, headerul noindex al noului Worker văzut din interiorul Access și performanța end-to-end. Controlul browserului s-a blocat la deschiderea panoului; nu s-au extras cookie-uri/tokenuri, nu s-a dezactivat Access și nu se declară succes pentru acea verificare. Cele 9/9 POST și 24/24 cereri istorice privesc deploymentul OFF anterior, nu acest pachet. Simulările SQL nu validează transportul webhook Stripe sau expedierea e-mailurilor.

## Revenirea OFF confirmată

1. Export baseline și export post-test păstrate, cu SHA-256. Restaurarea D1 a reușit și datele inițiale au fost verificate.
2. Marcajul din `_validation_identity` a fost rotit reversibil DUPĂ restaurare. Vechiul marcaj așteptat de deploymentul imuabil de validare nu mai există (zero potriviri confirmate prin query). Acesta blochează accesul acelui Worker la D1 prin codul verificat local; nu este un POST autentificat verificat în browser. Datele de afaceri inițiale au rămas restaurate.
3. Variabilele Preview au fost restaurate exact la inventarul inițial. Secretele administrative noi și bindingul D1 au fost eliminate din configurația Preview. Un PATCH complet a fost respins (400); PATCH-ul minim a restaurat variabilele, iar eliminarea bindingului a necesitat explicit `DB:null` (un obiect gol nu elimină bindingul). Starea finală a fost recitită și verificată.
4. Preview nu acceptă rollback nativ Pages. Conform aprobării de revenire, s-a republicat numai artefactul OFF original cu **154/154 hashuri verificate**. Deployment OFF nou: `5fa02c49-3a0b-441c-841e-ef4fbace632b`; URL: https://5fa02c49.er-brevo-test-izolat.pages.dev . Acesta este deploymentul Preview cel mai recent, reușit; aliasul rămâne https://pregatire-infrastructura-ema.er-brevo-test-izolat.pages.dev . Deci au existat un deployment de validare și un deployment necesar revenirii OFF, nu două iterații de implementare.
5. Verificarea finală la 13:19 UTC: trei cereri GET fără autentificare către domeniul principal, alias și `/api/admin/events` au primit 302 către echipa Cloudflare Access așteptată. Configurația Production a proiectului izolat este identică snapshotului inițial; toate cele trei deploymenturi inventariate sunt Preview. Politicile Access nu au fost modificate.

Nu s-a modificat `iuliabobeica.ro`, proiectul `intoarcerealatine-nou`, GitHub sau Brevo. Zero e-mailuri, plăți, notificări ori documente fiscale reale. Nu s-au creat contacte, nu s-au activat servicii publice, nu s-au făcut upgrade-uri.

## Dovezi locale și următorii pași

Fișiere ignorate de Git, în `.local/cloud-validation/`: `d1-test-results.json`, `final-verification.json`, `baseline-export.sql`, `post-test-export.sql`, `baseline-time-travel.json`, `restore-result.json`, `off-configuration-restored.json`, manifestele și logurile private. Nu publica întregul director: include profiluri/fișiere operaționale private. Raportul nu include secrete.

Pregătiri fără activări: verificarea offline a dumpurilor este acum automatizată; scenariile D1 sunt reproductibile și limitate la șase cereri concurente. Pentru volum mare rămâne necesar testul end-to-end cu latențe/erori, în limitele CPU Free, fără garanții de capacitate din acest test SQL redus. Nu se recomandă retry orb pentru scrieri; folosește idempotency și backoff limitat numai pentru operațiile demonstrabil sigure. Nu construi alte sisteme/calendar.

Pentru următoarea validare cloud va trebui reconfigurat deliberat mediul privat și noul marcaj; nu reutiliza automat secretele sau configurația vechiului deployment. Verificarea panoului în browser și a API-ului autentificat rămâne de făcut când controlul browserului răspunde stabil. Abonarea/confirmările, Brevo și plățile rămân etape distincte și inactive. Nicio lansare publică nu este autorizată prin acest raport.
