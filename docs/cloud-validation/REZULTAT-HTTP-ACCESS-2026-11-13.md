# Rezultat HTTP privat și revenire OFF — 13.11.2026

**Rezultat: aplicația nu este încă validată funcțional în cloud. Mediul a revenit la OFF, verificat.**

OAuth Device Flow a reușit la confirmarea finală a Iuliei; cele șase scope-uri au fost verificate, inclusiv `challenge-widgets.write`. Contul/identitatea, proiectul, D1 existent și inventarul de trei Preview-uri anterioare au corespuns. Nicio integrare Git și nicio bază nouă.

A fost creat exact un widget gratuit `er-brevo-test-izolat-http-validation`, mode managed, no_clearance, numai pentru `pregatire-infrastructura-ema.er-brevo-test-izolat.pages.dev`. Fără Spin, fără modificarea altor widgeturi. Cheia secretă este exclusiv în fișierul privat ignorat de Git; nu este inclusă în artefact sau raport. Widgetul este păstrat pentru testele viitoare, fără secret conectat în Preview la final.

În browser au fost recitite regulile Access principale și Preview, cu adresa proprie autorizată. Aplicația Preview avea o singură politică Allow, fără Bypass/Service Auth observate. Cererile neautentificate au fost redirecționate către echipa Access așteptată.

După export/bookmark nou, s-a pregătit numai fixture-ul gratuit `validation-http` în D1 existent. Prima cerere SQL cu parametri multipli a fost refuzată; verificarea în citire a confirmat zero efecte înainte de corectarea în două instrucțiuni separate. Nu s-au duplicat fixture-uri. Configurația temporară avea expirare server-side la 45 minute și protecție independentă de revenire la 40 minute.

Un deployment privat aprobat: https://5d177330.er-brevo-test-izolat.pages.dev . Accesarea aliasului `/http-events` prin browserul conectat a afișat `{"error":"access_required"}`. Refuzul provine din verificarea JWT internă; cauza exactă (header, cheie, claims sau identitate) NU este încă demonstrată. Nu s-au extras cookie-uri/tokenuri și nu s-au relaxat verificările. Zero înscrieri HTTP și zero provocări Turnstile reale au fost executate. Testele locale anterioare nu sunt prezentate ca rezultate ale acestui deployment.

În Brevo s-au confirmat în citire automatizarea #1 INACTIVĂ, trigger lista #4 și prezența filtrului adresei proprii/acțiunii welcome. Verificarea completă a tuturor filtrelor și a eligibilității nu a fost finalizată; nu s-a apăsat Activate sau Test. **Zero DOI, zero welcome și zero dezabonări reale în această etapă.** Nu s-a creat/modificat niciun contact.

## OFF confirmat

Revenirea manuală s-a încheiat la **21:41:31 Europe/Bucharest**, după cel mult **10 minute** de pregătire/configurație temporară, sub limita de 60 minute. Protecția automată a detectat rezultatul final și s-a închis, fără alte scrieri ulterioare.

- Variabilele Preview restaurate exact; binding D1 și secretele temporare eliminate.
- Export post-test păstrat, D1 restaurat la bookmarkul proaspăt: două înscrieri sintetice inițiale, un eveniment și șase migrații. Marcajul a fost rotit pentru blocarea deploymentului imuabil de test.
- Artefactul OFF verificat a fost republicat exclusiv Preview, conform aprobării de revenire. URL: https://41f0a85f.er-brevo-test-izolat.pages.dev . Toate cele cinci deploymenturi inventariate sunt Preview.
- La **21:42:28**, trei cereri GET fără autentificare (root, alias, API admin) au primit 302 către Access. Configurația Production a proiectului izolat este identică snapshotului. Site-ul oficial și proiectul său nu au fost modificate.
- Nu s-au făcut push/merge, plăți, facturare, upgrade-uri sau activări publice.

Cheile publice JWKS sunt accesibile din verificarea CLI: HTTP 200, două chei RSA. Aceasta nu demonstrează că fetch-ul din Worker sau JWT-ul cererii a fost valid. Documentația oficială recomandă verificarea assertion headerului, a issuer-ului și a AUD, nu dezactivarea verificării: [Cloudflare JWT](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/), [Pages plugin](https://developers.cloudflare.com/pages/functions/plugins/cloudflare-access/).

## Diagnostic local pregătit, nepublicat

Fără a presupune cauza, codul poate indica numai o etapă constantă de refuz: assertion_missing / assertion_format / algorithm / public_keys / matching_key / signature / claims / owner_identity. Răspunsul rămâne 403; nu se emit tokenuri, cookie-uri, valori de header, atribute de identitate sau erori brute. Funcția este OFF implicit și serverul limitează fereastra de diagnostic la 15 minute. Niciun fallback de autentificare nu a fost introdus.

3 teste noi și 2 regresii criptografice țintite au trecut. Pachetul diagnostic separat este compilat offline, 11 fișiere, manifest `.local/final-validation-2026-11-13/access-diagnostic-manifest.json`, SHA-256 `af4d8d96d948a724701d82289043eb2659de62ec78b1df53c8674fc955bffcfe`. Artefactul HTTP aprobat anterior rămâne păstrat.

**Noua aprobare necesară:** un singur deployment privat de diagnostic, maximum 15 minute, pentru citirea codului constant de refuz; fără binding D1, fără fixture-uri/înscrieri, fără secret/apeluri Turnstile sau Brevo. Access și validarea JWT/identității rămân obligatorii. Se restaurează variabilele/secretele temporare și aliasul OFF, inclusiv redeploymentul OFF dacă este necesar. Nicio altă permisiune OAuth solicitată. Nu se publică acest pachet până la aprobarea separată a Iuliei.

Dovezi private: `.local/final-validation-2026-11-13/execution-1794597762893/` — receipt widget fără secret în `widget-result.json`, snapshoturi/exporturi, context, deployment, `off-final.json`, `verification-final.json` și `execution-result-public.json`. Directorul include și fișiere cu secrete: nu se publică integral și nu se include în backupul surselor. Toate documentele/artefactele anterioare sunt păstrate.
