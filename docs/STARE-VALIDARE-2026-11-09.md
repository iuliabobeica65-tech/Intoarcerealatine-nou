# Stare de validare — 9 noiembrie 2026

Infrastructura este pregătită local, dar nu este gata de lansare. Ramură exclusivă: pregatire-infrastructura-email-plati. Fără push, merge, PR sau deploy. Nicio modificare a producției.

## Implementat și verificat

- Comunitate cu solicitare DOI, înscrieri separate de marketing, capacități, comenzi, outbox administrativ și deduplicare: validate local cu furnizori simulați.
- Stripe limitat la test și SmartBill limitat la pregătire/mock; live și emiterea fiscală blocate.
- Cinci șabloane Brevo salvate inactive, ID 2–6; un singur test COM-02 primit în Inbox, confirmat de Iulia. Acesta nu dovedește abonarea reală.
- Documentele MASTER, configurarea, activarea după înființarea firmei și rapoartele anterioare păstrate.

## Retestare locală în această etapă

13/13 teste infrastructure.test.mjs PASS; build-cloudflare.mjs PASS; verify-infrastructure.mjs PASS: 18 pagini, 82 articole, 100 URL-uri sitemap, 3.781 referințe, 0 ținte lipsă, 147 fișiere de bază identice, redirecturi intacte și fișiere private excluse. Aceste rezultate nu reprezintă teste externe. Nu s-au repetat testele vizuale din etapa anterioară.

## Ce mai trebuie pentru funcționare reală

| Etapă | Ce lipsește |
|---|---|
| Abonare Brevo | Aprobare pentru activarea limitată a șablonului DOI și mediu de test izolat; configurare server-side protejată, Turnstile și D1; verificarea confirmării în lista 3 |
| Bun venit automat | Sursă verificată a confirmării DOI, deduplicare și clarificarea accesului la Automations; testul editorial nu validează declanșarea |
| Preferințe/dezabonare | Test cu linkuri personale reale, verificarea suprimării și excluderii ulterioare; fără reabonare automată |
| Programări | URL oficial Google Calendar Appointment Schedules și setările Iuliei, conform issue #82; fără confirmări Brevo duplicate |
| Evenimente/programe | Date, capacități și reguli aprobate; mediu izolat și teste reale ale mesajelor administrative |
| Stripe | Configurație sandbox și teste reale Checkout/webhook/refund; fără Stripe live |
| SmartBill | Datele firmei, abonament, serii, alegerea emitentului unic și validarea cu contabilul; fără documente fiscale reale |
| Lansare | Revizuire juridică/retentie și aprobare explicită; verificarea tuturor regulilor Cloudflare înainte de orice push |

Nu se cer chei sau parole în chat. Configurările se introduc numai în locul securizat al serviciului, după stabilirea mediului autorizat.

## Analytics — propunere, fără activare

Auditul anterior a identificat GA4 și încărcare condiționată de consimțământ. Sunt disponibile page_view și un eveniment generic click, dar destinația acestuia nu este demonstrată. Datele observate includ posibile previewuri; nu se prezintă ca trafic curat al domeniului oficial. Nu s-a instalat tracking nou.

Propunere de convenții, de aprobat ulterior: service_view (service_id din listă fixă), contact_click (channel whatsapp/email), booking_click (provider google_calendar), community_click (channel email/whatsapp). Confirmările reale se numără din Brevo/registrul de evenimente/Google Calendar și plățile din furnizor, agregat; nu se deduc din clickuri și nu se trimit automat la GA4.

Fără adrese e-mail, telefon, nume, conținut WhatsApp, tokenuri, query strings sau detalii despre ședințe în evenimentele analytics. Niciun eveniment opțional înainte de consimțământ. Confirmările între servicii nu au atribuire verificată; nu se poate afirma unde a abandonat fiecare persoană.

Raportul săptămânal propus este în MODEL-RAPORT-SAPTAMANAL.md. Verificare înainte de implementare: asocierea streamului GA4 cu Measurement ID, setările enhanced measurement, excluderea previewurilor și scenarii refuz/acceptare/retragere consimțământ. Datele necunoscute se marchează N/D, nu zero. Acesta este un model, nu o automatizare instalată.
