# Configurare servicii — fără secrete

Toate componentele sunt OFF implicit. Nu au fost modificate conturile Brevo, Stripe, SmartBill sau Cloudflare. Fișierul `.env.example` este doar inventar; nu se încarcă automat în Cloudflare.

## Cloudflare Pages și D1

Păstrează producția `pregatire-cloudflare-2026-10-20`. Funcțiile Pages se află în `functions/api/[[path]].js` și importă modulele din `infrastructure/`; nu se copiază aceste module ca fișiere publice în dist. Un upload static al dist nu instalează funcțiile. Git integration/Pages Functions trebuie verificate într-un mediu izolat, numai după aprobare.

Build: `node scripts/build-cloudflare.mjs`; output: `dist`. Schema D1: aplică **în ordine**, numai pe DB de test, `infrastructure/migrations/0001.sql`…`0004-invoice-refund.sql`. Binding server `DB`. Nu configura identificatori reali în repository. Nu folosi baza de producție la preview. D1 are alte limite în cont Free/Paid; verifică volumele înainte de alegerea planului.

Variabile normale:

| Nume | Rol / stare inițială |
|---|---|
| APP_ORIGIN | originea HTTPS exactă a previewului autorizat; fără cale sau slash final |
| COMMUNITY_ENABLED | false; true numai după configurarea DOI și revizuirea politicii |
| REGISTRATIONS_ENABLED | false; true după DB, Turnstile și configurarea ofertelor |
| EMAIL_SEND_ENABLED | false; true numai după aprobări și teste de livrare |
| BREVO_DOI_TEMPLATE_ID | ID real al șablonului DOI |
| TURNSTILE_SITE_KEY | cheie publică, hostname exact al previewului |
| WHATSAPP_COMMUNITY_URL | neconfigurat în runtime; valoarea oficială este consemnată mai jos din issue #81 |
| APPROVED_TEMPLATE_IDS | array JSON de ID-uri aprobate; implicit [] |
| PAYMENTS_TEST_ENABLED | false; true numai pentru Stripe test |
| LIVE_PAYMENTS_ENABLED | false obligatoriu pentru orice operațiune Stripe |
| BILLING_PROVIDER | mock implicit; alternative pregătite smartbill_native/smartbill_api |
| INVOICING_ENABLED | false; true este respins în această versiune |
| INVOICE_EMAIL_SENDER | none implicit; brevo sau smartbill numai după reconciliere |

Secrete server: `BREVO_API_KEY`, `TURNSTILE_SECRET`, `DATA_HMAC_KEY` (minimum 32 caractere aleatoare, stabil pentru dovezi), `ADMIN_TOKEN` (minimum 32 caractere aleatoare), `STRIPE_SECRET_KEY` (numai sk_test_), `STRIPE_WEBHOOK_SECRET` (whsec_). În viitor `SMARTBILL_USERNAME` și `SMARTBILL_TOKEN` numai dacă se implementează și aprobă transportul API; codul de acum nu le folosește.

Turnstile verifică hostname și action `registration`; honeypot, limită persistentă de 10 solicitări/10 minute/IP pseudonimizat, limită corp și validare de input. Nu adăuga excepții care ocolesc provocarea pe medii publice. Datele nu sunt scrise în loguri de aplicație. Revizuiește separat loggingul furnizorilor.

## Brevo

### Decizii confirmate prin issues #81 și #82

[Issue #81 — WhatsApp](https://github.com/iuliabobeica65-tech/Intoarcerealatine-nou/issues/81) furnizează linkul oficial, de păstrat exact în configurația serverului la activarea aprobată:

```text
https://chat.whatsapp.com/FCzRrYkltcT2AMg4wLCdcy?s=cl&p=a&iam=2
```

URL-ul se centralizează în `WHATSAPP_COMMUNITY_URL`. Pagina comunității are deja buton configurabil, dar această actualizare este doar documentară: nu setează variabila, nu afișează linkul într-un deploy și nu îl distribuie în alte locuri. La configurarea fluxului, mesajul de bun venit **după confirmarea DOI** trebuie să includă și invitația WhatsApp, fără condiționarea abonării și fără deducerea consimțământului marketing din aderarea la grup. Testul anterior a verificat butonul ascuns în lipsa configurației, nu navigarea linkului oficial. Linkul nu a fost accesat și nu s-a intrat în grup.

[Issue #82 — Google Calendar Appointment Schedules](https://github.com/iuliabobeica65-tech/Intoarcerealatine-nou/issues/82) stabilește soluția pentru programări individuale. Această decizie prevalează asupra pregătirii unui motor personalizat pentru ședințe:

- Iulia creează pagina nativă de rezervări și configurează disponibilitatea, durata, bufferul și regulile, în funcție de planul contului Google.
- Se așteaptă URL-ul oficial. Nu se inventează link, durată, disponibilitate sau tarif.
- După furnizare și aprobare, site-ul va afișa „Programează o ședință”, păstrând WhatsApp ca alternativă. Embedul se evaluează separat, cu păstrarea designului și analiza datelor/cookies.
- Confirmările și actualizările sunt responsabilitatea Google Calendar, conform configurației reale. Brevo nu trimite confirmări/remindere duplicate; rezervarea nu implică abonare marketing.
- Nu activa încasarea la rezervare. Nu configura oferte publice de tip `session` în motorul D1 pentru a înlocui Google Appointment Schedules. Modelul tehnic local existent rămâne neactivat pentru această utilizare; nicio rescriere a codului nu s-a făcut în această etapă documentară.

Necesare: URL-ul creat de Iulia, confirmarea setărilor de disponibilitate și a funcțiilor planului. Nu s-a creat și nu s-a modificat nicio programare sau configurare Google Calendar. Existența cerinței în issue nu înseamnă că integrarea funcționează deja.

Nu există conector Brevo în sesiune: planul, limitele și setările contului nu au fost inspectate. Documentația publică susține DOI API; nu demonstrează configurarea contului.

1. Confirmă lista 3 și expeditorul `Iulia Bobeica – Echilibrarea Rădăcinilor <contact@iuliabobeica.ro>`, autentificarea domeniului, aprobarea tranzacționalelor și limitele planului real.
2. Creează atribute text `PRENUME`, `CONSENT_VERSION`, `CONSENT_REQUESTED_AT`, `CONSENT_SOURCE`. Nu include date despre ședințe sau experiențe personale.
3. Creează șablonul DOI oficial: linkul de confirmare Brevo folosește `{{ params.DOIurl }}`. Verifică acest comportament cu documentația și contul real. Un link direct la pagina comunității nu confirmă abonarea.
4. Folosește POST `/v3/contacts/doubleOptinConfirmation`; includeListIds este fix [3]. Nu crea direct contact marketing. Configurează șablonul și ID-ul, păstrează dovada DOI și testează un contact nou, existent, dezabonat, confirmare repetată și link expirat.
5. Configurează manual bun venit după DOI, linkurile personale de preferințe/dezabonare și suprimările. Catalogul local nu creează workflowuri Brevo. Nu resubscrie automat un contact dezabonat. Cazurile existente/dezabonate necesită test în cont.
6. Marketingul se trimite exclusiv din Brevo către segmentul confirmat și nesuprimat. Outboxul administrativ respinge șabloanele marketing. Nu activează marketing prin înscriere la eveniment.
7. Verifică planul pentru automatizări, volum și contacte, limita zilnică, cozi și bounce. Rate limiting API și volumul abonamentului sunt limite distincte. La 429, codul nu continuă necontrolat și cere reluare/revizuire; nu promite livrare la o oră dacă planul nu o permite.

Surse: [DOI API](https://developers.brevo.com/reference/create-doi-contact), [limite API](https://developers.brevo.com/docs/api-limits), [limite Free](https://help.brevo.com/hc/en-us/articles/208580669-FAQs-What-are-the-limits-of-the-Free-plan), [cote](https://help.brevo.com/hc/en-us/articles/9168632514066-What-are-the-different-quotas-applied-in-Brevo).

## Administrare evenimente și programe

Fără oferte sau prețuri reale preîncărcate. API-ul administrativ necesită `Authorization: Bearer <ADMIN_TOKEN>`, Origin exact și JSON. Nu pune tokenul în browser, CMS sau URL.

- POST `/api/admin/offering`: `id`, `kind`, `title`, `status` draft/open/closed, `startsAt`, `endsAt` (secunde Unix), `capacity`, `location`, `accessUrl` opțional. Kind: live/webinar/workshop/constellation/individual_program/group_program/session. Fus public Europe/Bucharest. Pentru test plătit: priceTestId, amount în bani, currency, toate aprobate.
- POST `/api/admin/lifecycle`: id, expectedRevision, action change/cancel/complete; pentru change, startsAt/endsAt noi. O singură tranzacție SQL invalidează mesajele vechi și creează notificările noii revizii.
- POST `/api/admin/dispatch` cu `{}`: pregătește remindere pentru următoarele 24 ore și trimite cel mult 20 mesaje aprobate. Necesită un apel programat extern/manual, **nu există cron instalat**. Configurează ulterior un scheduler server-side cu secrete protejate. Repetarea apelului nu dublează joburile. Joburile sending blocate și review se reconciliază manual cu Brevo înainte de retry.
- POST `/api/register`: înscriere separată de marketing; tokenul de acces este capability privat păstrat în sessionStorage. Endpointurile registration/cancel/checkout îl cer în corp, nu URL. Închiderea sesiunii/browserului poate pierde tokenul; recuperarea prin organizatoare este manuală. Nu există autentificare de cont sau portal de administrare construit.

## Stripe și SmartBill

Stripe test: webhook `/api/stripe-webhook`, evenimente checkout.session.completed, async_payment_succeeded, async_payment_failed, expired, charge.refunded. Secret distinct test; nu folosi pagina de succes pentru confirmare. Codul reinteroghează starea Stripe, verifică suma și moneda, verifică semnătura pe corp brut și respinge evenimentele live. [Stripe webhooks](https://docs.stripe.com/webhooks).

Facturare: modulele `infrastructure/invoicing.mjs` oferă pregătire invoice/credit, mapare V1 și claim unic pentru notificări. Sunt funcții server, nu endpoint public pentru date fiscale. Nu există emitere reală, sincronizare SmartBill sau trimitere de facturi. Pentru alegerea nativ/API, abonament, serii, e-Factura și contabil, urmează [ACTIVARE-DUPA-INFIINTAREA-FIRMEI.md](ACTIVARE-DUPA-INFIINTAREA-FIRMEI.md).

## Date, acces și operare

D1 conține e-mailuri administrative și eventual date fiscale; nu sunt date publice. Limitează accesul contului Cloudflare și folosește MFA. Profilele fiscale sunt într-un tabel distinct, nu în marketing. Nu au fost introduse date reale în teste.

Stabilește cu responsabilul juridic retenția solicitărilor neconfirmate, înscrierilor, comenzilor și documentelor fiscale; implementează apoi exportul/ștergerea verificată, excepțiile legale și rotația/back-upul. Nu activa colectarea până la stabilirea procedurii. Retenția fiscală nu se echivalează cu retenția newsletterului. Nu șterge dovezi sau facturi la dezabonare fără analiza obligațiilor aplicabile.
