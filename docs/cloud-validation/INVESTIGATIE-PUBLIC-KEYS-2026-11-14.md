# Cauza etapei public_keys și corecția locală

Investigație exclusiv locală pe `pregatire-infrastructura-email-plati`, după diagnosticul privat din 14.11.2026. Zero deploymenturi, apeluri Cloudflare API, reautorizări, cereri externe către JWKS sau utilizări D1/Brevo/Turnstile. Documentația publică Cloudflare a fost consultată. Testele anterior finalizate nu au fost repetate.

## Cauza confirmată

În `infrastructure/cloud-validation/access.mjs`, funcția `keysFor()` folosea `fetch(..., {redirect:'error', signal:AbortSignal.timeout(5000)})`. Același cod este păstrat în artefactul diagnosticului `85ded633-0c50-4c94-ad20-3fd4d337b303`.

Runtime-ul Cloudflare Workers nu acceptă modul `redirect:'error'`. Documentația precizează că apare TypeError la construirea cererii, înainte de trimiterea ei. Reproducerea nouă în workerd local (Miniflare deja instalat, compatibility date 2026-11-11, aceeași dată ca Preview) confirmă exact această eroare; `manual` este acceptat. Nu a fost necesar trafic extern. Timeoutul de cinci secunde este acceptat în handlerul folosit.

Este o incompatibilitate a opțiunii fetch din cod cu runtime-ul, suficientă pentru a explica blocarea la `public_keys`. Nu este necesară schimbarea contului, politicilor Access, AUD-ului sau adresei cheilor pentru acest defect.

## Configurație și adresă

Contractul, configurațiile locale și scriptul execuției diagnostice folosesc aceeași origine de echipă: `https://empty-star-0bba.cloudflareaccess.com`. URL-ul rezultat este `https://empty-star-0bba.cloudflareaccess.com/cdn-cgi/access/certs`, în formatul oficial Access JWKS. Nu este API-ul administrativ Cloudflare și nu cere tokenul OAuth al contului.

Dovezile existente din 13.11.2026 (`.local/final-validation-2026-11-13/execution-1794597762893/verification-final.json`) arată HTTP 200 și două chei RSA pentru aceeași adresă. Politicile principal/wildcard și AUD-ul au fost confirmate în browser în etapa precedentă din 14.11, conform raportului de diagnostic. Nu au fost recitite inutil.

Conectivitatea din Worker spre endpoint după corecție nu este încă validată în cloud. Defectul confirmat apare înainte de rețea, deci rezultatul anterior nu demonstrează un incident DNS/TLS, timeout sau refuz de autentificare la endpoint. Lipsesc numai rezultatele execuției în cloud cu opțiunea corectată, nu o nouă autorizare a contului.

## Corecția aplicată numai local

S-a înlocuit strict `redirect:'error'` cu `redirect:'manual'` în `keysFor()`. Verificarea existentă `!response.ok` refuză răspunsurile 3xx, astfel că redirecționările nu sunt urmate. URL-ul, timeoutul, cache-ul, verificarea cheilor, semnăturii JWT, issuerului, AUD-ului și identității rămân la fel. Refuzul accesului la eroare este păstrat.

Verificări NOI ale acestei corecții, workerd local cu sursa reală compilată temporar și răspunsuri sintetice:

- JWKS cu `keys:[]`: o singură cerere local simulată, trece de `public_keys` și refuză la `matching_key`, cum este corect în lipsa unei chei potrivite. Nu este test de autentificare reușită.
- HTTP 302: o singură cerere simulată, fără urmărirea Location, refuz `public_keys`.
- JSON cu structură invalidă: refuz `public_keys`.

Dovezi și scripturi: `.local/public-keys-investigation-2026-11-14/runtime-proof.json`, `runtime-proof.mjs`, `fix-verification.json`, `verify-fix.mjs`. Două încercări inițiale de inițializare Miniflare au necesitat adaptarea la API-ul v5 deja instalat; sandboxul a blocat apoi loopback, iar verificările au rulat cu acces local permis. Aceste încercări nu au accesat cloudul.

## Starea păstrată și următorul test

OFF rămâne neschimbat: deploymentul consemnat este `aecd7d41-e6ad-42a4-ba69-3297fb442467`, cu restaurarea și 154/154 hashuri deja verificate. Artefactele și toate backupurile existente sunt păstrate, inclusiv pachetul diagnostic anterior; nu au fost recompilate/suprascrise. Se modifică doar sursa locală și documentarea rezultatului.

Pentru testarea în cloud este necesară aprobarea explicită pentru **un deployment privat al diagnosticului JSON corectat și un deployment obligatoriu de restaurare OFF**, exclusiv `er-brevo-test-izolat` / Preview / ramura permisă, maximum 15 minute, fără D1, Brevo, Turnstile, formulare, e-mailuri sau plăți. Preflightul de siguranță și verificarea restaurării rămân necesare atunci. Nu este necesară o reautorizare preventivă; sesiunea existentă se verifică/reîmprospătează numai când acel test este aprobat. Aprobarea anterioară nu este reutilizată pentru un deployment nou.

Surse oficiale: [Request — redirect în Workers](https://developers.cloudflare.com/workers/runtime-apis/request/), [Access — Validate JWTs / JWKS](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/).
