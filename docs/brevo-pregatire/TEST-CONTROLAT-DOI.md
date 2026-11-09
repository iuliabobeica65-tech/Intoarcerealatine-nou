# Test controlat Brevo DOI — pregătit, neexecutat

Data: 9 noiembrie 2026. Niciun pas din acest document nu constituie aprobare de activare. Unicul test livrat până acum este previzualizarea editorială COM-02, confirmată în Inbox de Iulia.

## Limita testului propus

Un singur destinatar: adresa proprie deja autorizată de Iulia, păstrată în afara Git. Integrarea site-ului folosește DOI API #2 și lista #3. Nu se activează alternativa nativă #6. Fără campanii, alte destinatare, Stripe, facturi sau modificări ale producției. Nu se publică preview înainte de aprobarea separată a mediului.

## Condiții înainte de prima trimitere reală DOI

1. Verifică starea curentă Brevo și eventualele schimbări făcute de Iulia; nu suprascrie configurări concurente.
2. Confirmă aprobarea explicită pentru activarea temporară numai a șablonului #2 și pentru o singură solicitare DOI către adresa autorizată. Simpla livrare a testului COM-02 nu este această aprobare.
3. Stabilește mediul exact de test și originea HTTPS autorizată, distinctă de producție, baza D1 separată și Turnstile pentru hostname-ul respectiv. Orice publicare cere aprobare. Nu folosi exemplul .invalid ca mediu funcțional.
4. Aplică în baza izolată toate cele patru migrări, în ordinea documentată. Configurează secretele exclusiv server-side, nu în chat, Git, capturi sau browserul public. Nu crea credențiale fără fluxul de aprobare aplicabil.
5. Numai în mediul autorizat: COMMUNITY_ENABLED=true și BREVO_DOI_TEMPLATE_ID=2. Păstrează REGISTRATIONS_ENABLED=false, EMAIL_SEND_ENABLED=false, PAYMENTS_TEST_ENABLED=false, LIVE_PAYMENTS_ENABLED=false, INVOICING_ENABLED=false, BILLING_PROVIDER=mock și APPROVED_TEMPLATE_IDS=[]. EMAIL_SEND_ENABLED controlează outboxul administrativ; nu este un întrerupător general pentru solicitarea DOI, care depinde de COMMUNITY_ENABLED.
6. Verifică expeditorul, tagul optin, linkul params.DOIurl și lipsa contactelor neautorizate în destinatari. Nu considera o previzualizare cu variabila neînlocuită drept link funcțional.
7. Verifică situația inițială a adresei proprii în Brevo. Dacă este deja abonată/dezabonată, nu îi schimba starea pentru a fabrica scenariul contact nou. Nu inventa aliasuri sau alte adrese autorizate.

## Scenarii și dovezi de acceptare

| Scenariu | Rezultat cerut | Stare |
|---|---|---|
| Formular fără consimțământ marketing | solicitare DOI respinsă; nicio abonare | local validat; real netestat |
| Solicitare validă | un mesaj DOI; dovada solicitării în D1, fără abonare dedusă din răspunsul API | real netestat |
| Solicitare repetată | fără al doilea mesaj în fereastra locală de deduplicare | local validat; real netestat |
| Înainte de click | absența confirmării demonstrată în istoricul Brevo; nu deduce starea doar din existența contactului | netestat |
| Click DOI real | confirmare vizibilă în Brevo și apartenență eligibilă în lista 3, fără a folosi redirectul ca dovadă | netestat |
| Click repetat | fără bun venit duplicat; rezultatul linkului documentat, nu presupus | netestat |
| Bun venit | exact o trimitere după DOI demonstrat; sursa declanșării verificată și suprimări respectate | numai previzualizare livrată |
| Preferințe | link personal valid și efect verificat, fără expunerea tokenului în dovezi | netestat |
| Dezabonare | stare de suprimare verificată; excludere din selecția de marketing, fără campanie reală de probă | netestat |
| Contact existent/dezabonat, link expirat | comportament real documentat; fără reabonare sau ștergere automată pentru test | necesită scenarii/adrese autorizate |
| Eroare/timeout furnizor | reconciliere înainte de retrimitere; fără retry orb | local parțial, extern netestat |

Bun venit automat este un pas ulterior: verifică eligibilitatea planului și un trigger care dovedește DOI. Intrarea generică într-o listă nu constituie dovadă. Nu activa #3 sau un workflow doar pentru că a fost aprobat #2. #4/#5/#6 rămân inactive în această primă etapă.

## Oprire și închidere

Oprește la destinatar greșit, dubluri, stare ambiguă, lipsă dovadă DOI, expunere de secrete sau nevoie de publicare neaprobată. Nu retrimite automat după timeout. Dezactivează COMMUNITY_ENABLED în mediul de test și șablonul #2 la închiderea testului, conform aprobării. Nu șterge contactul, dovezile sau istoricul. Nu modifica producția și nu revoca chei existente folosite în altă parte.

În registrul local ignorat Git se păstrează: data, scenariul, numărul trimiterilor, rezultat, identificator de mesaj dacă este disponibil și dovada verificării; fără corpul conversațiilor, tokenuri DOI sau chei. Raportul Git conține numai rezultate agregate și limitări.

## Sursă oficială reverificată

[Brevo DOI API](https://developers.brevo.com/reference/create-doi-contact), consultată la 9 noiembrie 2026: endpoint contacts/doubleOptinConfirmation, includeListIds, templateId, redirectionUrl, atribute existente și params.DOIurl. Parametrul contactPixelTrackingConsent=false este deja transmis de cod; efectul depinde de funcția activă în cont și nu garantează dezactivarea universală a trackingului. Verifică setările reale înainte de test.
