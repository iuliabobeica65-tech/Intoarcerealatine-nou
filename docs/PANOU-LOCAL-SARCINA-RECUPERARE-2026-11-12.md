# Panou local, solicitări simultane și recuperare — 12.11.2026

## Rezultatul curent

Arhitectura rămâne Cloudflare Workers + D1 pentru evenimente, Brevo pentru expediere și Google Calendar Appointment Schedules pentru programări individuale. Node/SQLite de mai jos este numai un runtime LOCAL de validare a aceluiași API și a migrațiilor D1; nu este un server nou de producție și nu înlocuiește Workers.

Pornire: `npm run admin:local`, apoi http://127.0.0.1:4180/. Node 24.21 a fost folosit la teste; minimul declarat este 22.16 pentru API-ul SQLite backup. Serverul de verificare a fost oprit la final. Previzualizarea statică veche `npm run preview:admin` rămâne păstrată pentru istoric/teste, nu este fluxul principal și nu este o a doua bază de producție.

Panoul local reutilizează handle() din infrastructure/api.mjs și SQL-ul/migrațiile existente. Funcționează: consultarea/paginarea evenimentelor și persoanelor, filtrarea anulelor, creare de ciornă sintetică, deschidere/închidere înscrieri, editarea datei/capacității cu expectedRevision, anularea/finalizarea unui eveniment, anularea unei înscrieri cu verificarea stării, pregătirea reminderelor, previzualizarea mesajelor și ledgerul plăților. Anularea/finalizarea/restaurarea cer două apăsări; confirmarea se resetează după operațiune. Rezultatele întârziate ale unei consultări nu suprascriu un filtru mai nou.

Nu există încasare, refund inițiat la furnizor, emitere fiscală, creare de contacte Brevo sau expediere. Ruta dispatch este blocată în runtime-ul local. EMAIL_SEND/PAYMENTS_TEST/LIVE_PAYMENTS/INVOICING sunt false; niciun secret comercial nu este citit din mediul calculatorului. Tokenul intern al API-ului este generat în memorie, fără afișare sau stocare în browser. Datele inițiale și cele folosite în verificări sunt sintetice; nu introduce date personale reale în acest instrument de test.

## Securitate și limite ale panoului

Serverul ascultă numai pe 127.0.0.1:4180. Host este verificat; cererile de administrare cer JSON, o sesiune locală aleatorie și Origin exact al paginii. Nu există CORS permisiv, rută de citire .env/cod server, HTML injectat sau secret în URL. CSP permite conexiuni numai către aceeași origine, refuză formulare externe/iframe-uri, iar răspunsurile sunt no-store/noindex. Aceasta este protecție pentru test pe calculatorul proprietarei, NU un înlocuitor pentru identitatea utilizatoarei și Cloudflare Access în cloud.

Adaptorul protected-reader.mjs este pregătit și testat separat pentru consultare viitoare: implicit OFF, doar proiectul er-brevo-test-izolat pe HTTPS/port standard, aceeași origine, numai cinci rute read, token tranzitoriu furnizat explicit, fără redirecționări/retry automat și răspunsuri filtrate. NU este importat de panoul local și NU a efectuat conexiuni externe. Activarea în cloud și transportul administrativ privat de scriere necesită configurarea/autorizarea separată a mediului, nu simpla copiere a serverului Node.

## Concurență și corecții

1. Simulatorul D1 execută batch-ul SQLite fără await între instrucțiuni: tranzacția rămâne atomică și nu mai produce BEGIN-uri intercalate artificiale. Folosește aceleași constrângeri/triggere ca schema D1; nu simulează rețeaua, CPU-ul sau cotele Cloudflare.
2. O înscriere duplicată care pierde cursa INSERT primește răspuns idempotent 202/already_requested, nu falsă indisponibilitate; nu primește tokenul unei alte solicitări.
3. Dacă un refund câștigă înaintea unui batch de plată întârziat, factura nu este pregătită pe baza unei citiri vechi. invoice_jobs și șablonul notificării sunt determinate din starea comenzii din tranzacție. Starea refunded rămâne prioritară; anularea nu este inversată de o plată târzie.
4. Migrarea 0006-load-indexes.sql adaugă indexuri pentru evenimente deschise/date, participanți confirmați și expirarea rate-limiturilor. Nu elimină sau rescrie date. Schema curentă locală este 0001–0006; nicio migrare nu a fost aplicată în cloud.
5. Mesajele concurente se revendică o singură dată. O livrare incertă ajunge review și nu este retransmisă automat. Un status review/sending trebuie rezolvat prin reconciliere cu furnizorul; nu înseamnă că mesajul nu a plecat.

Rezervările reserved ocupă locuri. Nu există expirare automată inventată; abandonele și plățile failed necesită revizuire/anulare manuală până la aprobarea unei politici de rezervare. Limita anti-abuz existentă este 10 solicitări/10 minute/IP; un grup legitim pe același IP poate fi limitat. Nu a fost relaxată pentru a obține rezultate artificiale de trafic.

## Rezultate de test

23 teste noi: 11 în load-recovery, 5 în local-admin-runtime și 7 în protected-reader. Toate au trecut. 30 regresii selectate: 14 evenimente/admin, 10 din vechea suită de infrastructură și 6 pentru interfața statică păstrată. Total 53 cazuri distincte PASS; reluările după corecții nu sunt numărate ca teste noi.

| Scenariu sintetic | Rezultat verificat |
|---|---|
| 200 solicitări simultane, 25 locuri, IP-uri distincte | 25 acceptate / 175 indisponibile, 25 înscrieri și notificări în coadă, fără 503 sau supravânzare |
| 80 duplicate simultane | o înscriere, o notificare pregătită, 1 răspuns 201 + 79 răspunsuri 202 |
| 50 solicitări pentru 10 locuri plătibile | 10 reserved, 40 indisponibile; niciuna tratată ca plată confirmată |
| 25 solicitări de pe același IP | 10 acceptate, 15 răspunsuri 429; limita se păstrează |
| 30 webhookuri semnate identice | o înregistrare payment_events, o comandă confirmată, un invoice_job și o notificare de plată |
| Refund parțial, duplicate și evenimente întârziate | refunded păstrat, acces suspendat, o notificare refund, revizuire contabilă |
| Refund câștigător înaintea unui batch paid | nu apare o factură nouă din starea veche; notificarea corespunde refundului |
| Eroare furnizor înainte de reconciliere | eveniment neconfirmat în ledger, retry posibil; plata târzie nu reactivează anularea |
| 20 dispatchuri concurente cu rezultat incert | o singură încercare simulată; review, fără retrimitere oarbă |
| Eroare la introducerea mesajului în coadă | înscrierea este rollback; retry ulterior poate ocupa locul |
| Backup/restaurare/corupere | starea se recuperează, punctul anterior restaurării se păstrează, snapshoturile corupte se refuză |
| Un manifest de backup corupt | celelalte puncte valide rămân listate și accesibile |
| Admin/Host/Origin/sesiune/ID/rute | accesul neautorizat și operațiunile externe sunt refuzate; fără token_hash în roster |

Mockurile fetch din testele financiare/notificări nu sunt apeluri Brevo/Stripe reale. Testele de HTTP au folosit numai loopback și execuție locală autorizată în afara izolării de rețea când sandboxul a refuzat localhost. Nu s-au reluat 28/28 integral, 9/9 POST externe, 24/24 Access sau noindex. Compilarea offline Pages Functions curente a trecut. Sursele paginilor publice nu au fost modificate.

Verificare în browser a panoului API + SQLite: creare ciornă sintetică, deschidere, editare capacitate refuzată la 1 loc sub 2 ocupate, editare validă la 5, backup, anulare participantă sintetică, restaurare la confirmed, pregătire a reminderelor fără expediere. Punctul anterior restaurării a fost păstrat. Captură: .local/implementation-2026-11-12/admin-local-working.png. Backupul final verificat manual este 6aba8024-7eb4-4b89-bce2-46f1ab14f2d4, în .local/admin-runtime; sunt păstrate și backupul inițial și cel before-restore.

## Recuperare locală

Datele active sunt temporare; înainte de oprire se apasă Salvează backup local. Snapshotul SQLite și manifestul SHA-256 sunt scrise în .local/admin-runtime cu ID unic, fără suprascriere. Vezi backupurile → Restaurează local → confirmare. Înainte de înlocuirea bazei se verifică checksum, integrity_check, foreign_key_check și versiunea schemei, apoi se salvează automat starea curentă ca before-restore. Un snapshot nevalid nu înlocuiește baza activă. Nicio restaurare nu reia expedierea sau activează servicii.

După restart se pornește setul sintetic inițial; backupurile rămân disponibile pentru restaurare. Fișierele .local nu se încarcă în GitHub. Checksumul detectează coruperea; nu este criptare sau protecție contra unui utilizator local care rescrie și manifestul. Nu există import de baze de producție sau upload arbitrar de fișiere. Pentru date reale sunt necesare politici aprobate de retenție/acces/criptare și un exercițiu D1 separat.

## Ce nu este încă validat în cloud

Testele locale demonstrează invariantele funcționale, NU un număr garantat de cereri/secundă, SLA sau suficiența planului Free. Documentația D1 precizează că fiecare bază procesează query-urile pe rând și că debitul depinde de durata lor; sunt 50 query-uri/invocare pe Free și 1000 pe Paid. Lotul de mesaje rămâne limitat la 10 și regresia bugetului local a trecut. Limitele zilnice de citiri/scrieri pot opri operațiunile Free până la resetare; indexurile reduc costul, nu elimină limitele.

În mediul izolat aprobat trebuie măsurate latența p95/p99, erorile/429/503, query-urile și rândurile citite/scrise, rata webhookurilor, cotele furnizorilor și costurile, plus recuperarea D1 Time Travel/export. Time Travel depinde de plan (7 zile Free / 30 zile Paid în documentația consultată). Nu s-a făcut upgrade, configurat Time Travel sau restaurat D1 extern. Nu se activează replicare/sharding, scheduler sau o nouă bază pentru a masca lipsa măsurătorilor. Webhookurile repetate pot face citiri canonice duplicate la Stripe; efectele financiare/notificările rămân deduplicate, iar cotele furnizorului trebuie validate ulterior.

Surse oficiale: https://developers.cloudflare.com/d1/platform/limits/ ; https://developers.cloudflare.com/changelog/post/2026-09-01-d1-free-tier-limit-enforcement/ ; https://developers.cloudflare.com/d1/best-practices/retry-queries/ ; https://nodejs.org/api/sqlite.html .

## Pași de lansare rămași

1. Aprobare a pachetului nou și a mediului administrativ privat: Access + identitate + token server-side, D1 0001–0006, fără atingerea proiectului oficial. Runtime-ul local nu se publică drept backend.
2. Date de evenimente, politici de rezervare/anulare/refund/retentie, mesaje aprobate și responsabil de review/backup; nu se inventează oferte.
3. Teste externe limitate de volum/erori/recuperare în proiectul izolat, cu cote/plan evaluate; nu sunt autorizate acum.
4. Răspuns Brevo #5670720 și izolare, apoi e-mailuri numai într-un test separat aprobat; Google Calendar existent rămâne pentru programări, fără duplicare.
5. Firmă/KYC/contabil, prețuri/politici, un emitent fiscal, e-Factura și verificări Stripe/SmartBill autorizate înainte de încasări reale.

Totul a rămas local pe pregatire-infrastructura-email-plati. Niciun push/merge/deployment, nicio intervenție în Brevo sau site-ul oficial și niciun mesaj/plată/refund/document fiscal real. Istoricul, codul funcțional și documentele anterioare sunt păstrate.
