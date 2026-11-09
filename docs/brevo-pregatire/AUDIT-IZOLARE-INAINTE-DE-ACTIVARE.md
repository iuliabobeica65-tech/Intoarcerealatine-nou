# Audit înainte de activarea Brevo #2 — 9 noiembrie 2026

## Verdict: NU este pregătit pentru activare

Nu s-a activat nimic, nu s-a trimis niciun mesaj și nu s-au modificat contacte sau configurații externe în acest audit.

Verificat local: ramura pregatire-infrastructura-email-plati, worktree inițial curat, numai .env.example ca fișier de configurare identificat; originea exemplu este .invalid. Nu există dovadă verificată de runtime HTTPS izolat, binding D1 separat cu patru migrări aplicate, Turnstile dedicat sau secrete configurate în mediul de test. Absența dovezii locale nu demonstrează absența resurselor din cont.

Inventarul browserului arată sesiuni Brevo și Cloudflare, însă accesul de citire Brevo a expirat înainte de obținerea paginii. Setările curente de cont, automations, destinatari și resurse Cloudflare nu au putut fi validate. Ultima stare Brevo verificată anterior: cinci șabloane inactive. Nu se prezintă această stare istorică drept inventar actual.

## Destinatar unic: insuficient garantat în prezent

Codul requestDoi transmite emailul primit de la formular. Nu există o allowlist server-side de test. Restricțiile de origine, Turnstile și rate limiting nu restricționează destinatarii la proprietară. Păstrarea EMAIL_SEND_ENABLED=false nu oprește DOI; acesta depinde de COMMUNITY_ENABLED. Nu activa endpointul pe un mediu accesibil public în această stare.

Înainte de test: restricție server-side la adresa proprie autorizată, cu respingere înainte de scrierea D1 și de orice apel Brevo pentru alte adrese; verificare negativă locală cu o adresă fictivă .invalid, fără mesaj real. Valoarea adresei autorizate se configurează privat și nu se comite în Git. În plus, mediu cu acces restrâns, endpoint verificat și lipsa automatizărilor/consumatorilor care ar reacționa la contactul de test. Lista #3 este lista comunității, deci nu este prin ea însăși izolare de cont. Nu se pot garanta efecte zero asupra altor fluxuri înainte de inventarul real.

O listă separată de test ar îmbunătăți izolarea datelor, dar ar cere creare aprobată, configurare explicită și modificare locală: implementarea actuală fixează lista 3. Nu s-a creat sau schimbat nicio listă. Nu se presupune că un test într-o altă listă validează automat producția.

## Acțiuni propuse în Brevo, numai după pregătire și aprobare

1. Inventar în citire: #2 inactiv, conținut/expeditor/tag, starea inițială a adresei proprii, lista 3 și automatizările existente. Nu modifica contacte reale și nu exporta lista comunității.
2. Activare temporară numai #2, fără campanii, workflowuri sau alte șabloane.
3. Exact o solicitare contacts/doubleOptinConfirmation, includeListIds=[3], templateId=2, numai către adresa proprie autorizată; numele/atributele de consimțământ se limitează la fixture aprobată.
4. Iulia primește mesajul și, dacă aprobă această etapă, confirmă linkul DOI. Furnizorul poate crea/actualiza înregistrarea proprie, istoricul și atributele; confirmarea poate adăuga adresa în lista 3. Nu promite absența efectelor de automatizare înainte de inventar.
5. Verificare a rezultatului, apoi închidere. Bun venit automat, preferințe și dezabonare sunt teste ulterioare distincte; #3–#6 nu se activează în această etapă.

## Riscuri și revenire

- Mesaj real, cotă și jurnale reale: trimiterea nu poate fi anulată după livrare; nu există rollback identic cu situația inițială.
- Starea adresei proprii/atributele/apartenența la listă pot fi schimbate. Se înregistrează privat starea inițială înainte; fără ștergere, reabonare, eliminare din listă sau schimbare de blacklist automată la final. Orice restaurare a datelor necesită comparație și aprobare explicită separată.
- Alte automatizări, dacă există, pot reacționa la confirmare. Testul este oprit până la excluderea acestui risc prin verificarea configurației.
- Timeout poate ascunde o trimitere reușită: se verifică mesajele/logurile și Inbox înainte de orice repetare.
- Dezactivarea #2 nu dovedește invalidarea linkului DOI deja trimis. Linkul poate continua să aibă efect; comportamentul/expirarea trebuie verificate separat. Nu se publică tokenul în dovezi.
- Închidere tehnică: COMMUNITY_ENABLED=false în mediul de test; #2 readus Inactive dacă a fost activat de acest test; celelalte flags rămân false, fără schimbarea producției sau revocarea cheilor comune. Se verifică starea finală și se păstrează dovada. Se monitorizează solicitarea deja trimisă, nu se presupune anulată.

Activarea este amânată. Cererea anterioară de aprobare pentru #2 a fost prematură deoarece mediul și izolarea destinatarului nu erau validate.

Sursă tehnică reverificată: [Brevo DOI API](https://developers.brevo.com/reference/create-doi-contact), 9 noiembrie 2026. Specifică email, lista, templateId, redirect și atribute; nu reprezintă dovadă despre configurația contului Iuliei.
