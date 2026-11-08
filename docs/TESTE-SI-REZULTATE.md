# Teste și rezultate reale — 8 noiembrie 2026

## Verdict

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
