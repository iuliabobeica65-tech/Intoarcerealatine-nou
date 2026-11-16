# Pregătirea verificării finale newsletter / Brevo

Stare: numai pregătire locală, fără trimiteri, activări, modificări de cont sau deploymenturi. Etapa Access este FINALIZATĂ prin `REZULTAT-CONFIRMARE-ACCESS-2026-11-14.md`; nu se investighează și nu se testează din nou. Cloudflare rămâne OFF. Ramură: `pregatire-infrastructura-email-plati`.

## 1. Deja pregătit

Decizia curentă este DOI API Brevo, conform `DOI-API-CONTINUARE-2026-11-13.md` și `decision-api-2026-11-13.json`, nu alternativele native istorice. Adaptorul existent `requestDoi()` din `infrastructure/brevo.mjs` trimite `contacts/doubleOptinConfirmation`, cu șablonul #2 și `includeListIds:[4]` în profilul de test. Nu adaugă direct contactul în listă și nu fabrică atributul DOI. În test nu trimite atribute de profil, pentru a evita suprascrierea lor globală. Nu trimite welcome pe o a doua cale.

Restricțiile existente `TEST_MODE=true`, `TEST_BREVO_LIST_ID=4` și `TEST_RECIPIENT_EMAIL` privat permit numai adresa autorizată. Lista #3, șabloanele #6/#8 și formularul nativ rămân neatinse. Adresa și cheia Brevo nu se introduc în documente, artefacte publice sau Git. Se compară identitatea destinatarei cu dovada privată existentă înaintea trimiterii.

Automatizarea #1 are configurația istorică: trigger lista #4, filtre AND adresă autorizată + `DOUBLE_OPT-IN=Yes` + `Email campaigns subscriptions=Subscribed`, re-entry OFF. Acțiunea welcome este mesajul #7, sursa #3; nu se activează un al doilea mesaj welcome. Ultimele stări documentate sunt inactive; acestea nu sunt prezentate ca inventar live nou.

Codul `/api/community` are consimțământ explicit, restricția destinatarului înainte de scrieri, claim atomic pe 24h și tratare conservatoare a răspunsurilor ambigue, fără retry automat. Cele cinci teste noi DOI și trei regresii anterioare rămân dovezi existente; nu au fost rerulate. Testele D1 și Access sunt păstrate, nu repetate.

## 2. Activare temporară propusă și test unic

Pentru a păstra Cloudflare OFF, acest test este limitat la **fluxul real Brevo**, folosind adaptorul `requestDoi()` existent într-o execuție locală unică, fără server public, Cloudflare, D1, Turnstile sau formular nativ. Nu certifică POST-ul web `/api/community`, protecția anti-bot sau scrierea D1 end-to-end. Nu se creează o implementare alternativă de abonare sau un nou sender welcome.

Înainte de orice activare: inventar Brevo numai în citire al #2/#1/#7 și al profilului adresei autorizate, istoricul DOI/welcome, apartenenței la lista #4, suprimărilor și celorlalte automatizări care pot reacționa. Verifică expeditorul profesional autentificat, conținutul în română, `params.DOIurl`, filtrele AND, re-entry OFF și lipsa înscrierii retroactive a contactelor existente. Dacă profilul este deja confirmat, suprimat sau a parcurs #1, se oprește: nu șterge contactul, nu golește blacklist-ul și nu resetează istoricul pentru a fabrica scenariul.

Formularul nativ găzduit rămâne un risc documentat: URL-ul lui este public, iar suportul a precizat că nu poate fi suspendat individual. Nu se distribuie și nu se utilizează. Dacă activarea #2 ar produce efecte pe acel formular sau dacă alte fluxuri pot trimite mesaje neautorizate, se oprește înainte de activare; nu se editează/șterge formularul implicit. Filtrul welcome nu garantează izolarea mesajelor DOI ale formularului nativ.

După preflight conform și aprobare: activează numai șablonul DOI #2 și automatizarea #1, păstrând filtrele și re-entry OFF. Nu activa separat șablonul sursă #3 decât dacă Brevo demonstrează că este necesar; o asemenea abatere se prezintă înainte de execuție. În execuția locală folosește profilul privat de test, cheia server-side existentă și originea privată de test, niciodată domeniul oficial. Redirectul deja configurat în adaptor ajunge la aliasul privat OFF; nu se publică o pagină nouă și nu se tratează acel redirect drept dovadă de confirmare.

Execută o singură solicitare explicită DOI, după aprobarea textului de consimțământ existent. Buget: o cerere de trimitere DOI, maximum un DOI și un welcome către aceeași adresă. Fără cereri duplicate reale sau repetarea testelor de deduplicare deja trecute. La timeout/5xx/rezultat ambiguu: păstrează dovada locală a încercării și reconciliază logurile/Inbox; nu retrimite automat.

Înainte de click: verifică mesajul DOI și absența unui welcome nou atribuit acestei încercări. Confirmarea o efectuează Iulia din mesajul primit, exprimând consimțământul; nu se citesc sau copiază tokenuri în raport. După click: confirmă în istoricul Brevo evenimentul DOI, apartenența la #4, `DOUBLE_OPT-IN=Yes`, starea Subscribed și exact o expediere welcome #7. Nu deduce confirmarea din 202, redirect sau simpla existență a profilului. Dacă ordinea atribut/trigger împiedică welcome, nu activa re-entry și nu trimite manual un welcome pentru a declara succes.

Înregistrarea corectă în acest test înseamnă datele și istoricul **Brevo**, cu identificatori/timpi salvați privat și rezultate agregate în raport. Nu există scriere D1 în această variantă. Nu executa dezabonare reală și nu salva modificări de preferințe globale. Linkurile pot fi inspectate în mesaj fără acționarea lor.

## 3. Aprobări strict necesare

Aprobarea de pregătire actuală nu autorizează operațiunile de mai jos. După preflight conform este necesară o aprobare concretă pentru: activarea temporară a #2 și #1 cu configurația verificată; o solicitare DOI către adresa proprie autorizată; confirmarea DOI și efectele native asupra profilului/listării #4; maximum un welcome automat #7; apoi dezactivarea resurselor activate exclusiv pentru test. Include explicit faptul că confirmarea actualizează profilul global Brevo și nu este reversibilă prin simpla oprire tehnică. Nu este necesară aprobarea unui deployment deoarece Cloudflare rămâne OFF. Nu se cer chei noi, reautorizări sau permisiuni suplimentare preventiv.

Dacă inventarul arată efecte în alte fluxuri, contact deja neeligibil sau necesitatea modificării formularului/altor setări, aprobarea de mai sus nu acoperă acele modificări. Se prezintă blocajul exact, fără schimbări automate sau noi destinatari.

## 4. Revenirea la OFF

Cloudflare nu este activat și nu necesită redeployment/rollback pentru acest test. Nu se conectează secrete Brevo în cloud. La final/eroare, oprește execuția locală și dezactivează #1 și #2 numai dacă au fost activate de acest test, readucând stările de activare la snapshotul inițial. Dacă sunt deja active la preflight, se oprește pentru reconciliere; nu se dezactivează resurse folosite în altă parte.

Verifică stările finale și istoricul/coada mesajelor: dezactivarea nu retrage mesajele trimise și nu garantează anularea celor programate sau invalidarea linkului DOI. Orice DOI încă neconfirmat și orice welcome în așteptare se raportează, fără a pretinde închidere completă. Nu șterge contactul, nu îl scoate din listă, nu îl reabonează și nu restaura atribute/blacklist în mod automat. Datele consimțământului și istoricul real se păstrează. OFF tehnic nu înseamnă anularea consimțământului dat de Iulia.

Păstrează snapshotul privat inițial/final și toate dovezile. Nu suprascrie backupurile existente; la execuție inventariază integritatea lor înainte/după. Ultima verificare deja trecută: 3.845 fișiere de backup neschimbate și artefact OFF 154/154. Nu se rerulează în etapa de pregătire.

## 5. Ce mai rămâne

Pentru newsletter: preflightul live Brevo și testul unic propus; apoi, separat, confirmarea formularului/aplicației și a înregistrării D1 în mediu privat, care necesită aprobare de deployment și configurare temporară. Testul Brevo local nu substituie această integrare web. Preferințele/dezabonarea globală și suprimarea rămân limitări explicite netestate în această etapă, nu motive pentru dezabonarea proprietarei.

Pentru infrastructura completă: verificările end-to-end încă lipsă ale administrării/evenimentelor, programările Google existente și activarea plăților/facturării după condițiile firmei/KYC/contabilului. Se folosesc implementările existente și rapoartele curente; Access este închis, iar probele deja trecute nu se repetă. Nicio lansare publică sau activare financiară nu este autorizată prin acest plan.
