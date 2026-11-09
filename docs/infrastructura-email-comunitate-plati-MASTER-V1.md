# MASTER — Infrastructura digitala Echilibrarea Radacinilor

## Test editorial Brevo — 9 noiembrie 2026

După autorizarea adresei proprii de către Iulia, a fost inițiată o singură trimitere prin Preview & test → Send Test pentru COM-02, ID 3. Destinatar unic selectat; cealaltă adresă din lista de test a rămas nebifată. Butonul a devenit temporar indisponibil și apoi disponibil, fără confirmare explicită capturată. Acceptarea furnizorului și primirea în Inbox rămân neconfirmate; nu se retrimite automat. Afirmațiile istorice „0 e-mailuri” de mai jos descriu etapa anterioară.

Acesta este un test editorial; nu dovedește DOI, preferințe sau dezabonare funcționale. Nu s-a activat niciun șablon sau workflow și nu s-a schimbat abonarea unui contact. Celelalte teste de trimitere așteaptă rezultatul primului. Producția, Stripe live și facturarea rămân neactivate.

Versiune: V2.1 — pregătire locală, SmartBill, decizii issues #81/#82 și salvare fără deploy; NU validare comercială, fiscală sau metodologică.
Data: 2026-11-08
Proprietar: Iulia Bobeica
Domeniu: https://iuliabobeica.ro/
Expeditor Brevo testat: contact@iuliabobeica.ro

## Actualizare 9 noiembrie 2026 — șabloane salvate în Brevo

Sunt salvate și verificate în lista contului cinci drafturi **Inactive**: DOI API #2, bun venit #3, preferințe #4, confirmare dezabonare #5, DOI formular nativ #6. Expeditor: contact@iuliabobeica.ro. Conținutul a fost previzualizat; ID 4 are formularul implicit de profil asociat și salvat. Linkurile personale nu au fost testate prin livrare reală. Niciun șablon sau workflow nu a fost activat, niciun e-mail trimis, nicio cheie creată și nicio schimbare de runtime/Cloudflare efectuată.

Starea exactă și ID-urile sunt în [brevo-pregatire/stare-cont.json](brevo-pregatire/stare-cont.json) și README-ul pachetului. Mesajele anterioare despre lipsa șabloanelor/blocajul conexiunii sunt istoric. Pentru codul site-ului, ID-ul DOI va fi **2**, numai după aprobarea activării și testării; nu se folosește ID 6 în locul lui. Variabila de mediu nu a fost schimbată.

Înainte de activare: aprobare de conținut, adresă proprie autorizată pentru test, configurare privată a accesului API sau formularului nativ ales, dovadă DOI și suprimări, test preferințe/dezabonare, verificarea limitei `0 contacts can enter Automations` afișate anterior. Analytics rămâne etapa ulterioară conform priorității Iuliei. Site-ul oficial, ramura de producție și proiectul vechi sunt nemodificate.

## Continuarea infrastructurii Brevo — actualizare în aceeași zi

Prioritate confirmată de Iulia: se termină mai întâi infrastructura din cererea inițială; analytics/conversii este etapa următoare. După primirea instrucțiunii de oprire s-a făcut auditul de protecție; mesajul ulterior a cerut reluarea infrastructurii în această ordine. Proiectul vechi Cloudflare este exclus din lucru, fără presupunerea că deconectarea GitHub raportată a fost finalizată.

Munca și backupurile sunt intacte: ramura este aceeași, HEAD anterior `dafeb82aca68fdde836e8531b00bd18ba87d9fe6`, toate cele trei arhive corespund SHA-256 din manifest. În Brevo sunt confirmate lista #3 (0 contacte), expeditorul verificat și domeniul autentificat. Au fost create PRENUME, CONSENT_VERSION, CONSENT_REQUESTED_AT și CONSENT_SOURCE ca Text, fără popularea contactelor. Free afișează 300 e-mailuri și în Automations `0 contacts can enter Automations`; automatizarea nu se declară disponibilă înainte de clarificare.

Auditul a găsit o campanie de test draft, păstrată, un formular implicit de profil (netestat), fără șabloane Email salvate și fără workflowuri configurate. Au fost pregătite local cinci drafturi HTML: DOI API, alternativa DOI pentru formular nativ, bun venit cu WhatsApp, preferințe și confirmare de dezabonare (preferabil mesaj în pagină). Niciunul nu este considerat salvat/activ în Brevo până la verificarea în cont. Vezi [brevo-pregatire/README.md](brevo-pregatire/README.md).

Conexiunea Chrome a început să expire la deschiderea editorului. Nu s-au creat chei API, nu s-au trimis teste sau campanii și nu s-au activat automatizări. Un ID de șablon real, testarea DOI, linkurile personale și integrarea externă sunt încă necesare. Nu s-a făcut push/deploy și nu s-au schimbat paginile, SEO, meniurile sau designul. Auditul analytics și modelul săptămânal sunt păstrate în `.local/brevo-2026-11-08/` pentru etapa următoare, fără tracking nou.

## Actualizare de coordonare și salvare — 8 noiembrie 2026

Verificare inițială: worktree curat, commit local `b25d0e2ec9227b6f5d219aa41ebed4c4693e5582`. Ramura remote de lucru rămâne la `91b84a094bfe93982f30609aa1e214775dce4fd9`, iar producția cunoscută la `b64af72153794881e9ee5c5b434da62c3f97656f`. Nu există schimbări remote noi de integrat; issue-urile #81 și #82 declară explicit că nu au editat concurent fișierele. În această etapă se actualizează numai documentația.

Deciziile proprietarei din [issue #81](https://github.com/iuliabobeica65-tech/Intoarcerealatine-nou/issues/81) și [issue #82](https://github.com/iuliabobeica65-tech/Intoarcerealatine-nou/issues/82) sunt detaliate în CONFIGURARE-SERVICII. Linkul WhatsApp este acum furnizat, dar nu este activat de această actualizare. Pentru rezervările individuale se va folosi Google Calendar Appointment Schedules, nu modelul personalizat local de rezervări; acesta rămâne neactivat pentru ședințe individuale. Evenimentele/programele pot păstra evidența separată. Nu dubla confirmările Google prin Brevo.

**Nu se face push:** ultimul commit remote de lucru are un preview Cloudflare reușit în proiectul `intoarcerealatine-nou` și un build eșuat în proiectul `intoarcerea-la-tine-campanii`. Lipsesc verificarea configurațiilor curente și excluderea acestei ramuri din toate integrările de deploy. Nu au fost modificate setări. Alternativa este un bundle Git complet și un ZIP de surse, verificate local; vezi [SALVARE-SIGURA-FARA-DEPLOY.md](SALVARE-SIGURA-FARA-DEPLOY.md). Documentele MASTER, activare și teste se păstrează integral.

## Actualizare de implementare — 8 noiembrie 2026

Iulia a confirmat în sesiune ramura Cloudflare de producție. Auditul GitHub a identificat head `b64af72153794881e9ee5c5b434da62c3f97656f`, inclus integral în ramura de lucru. Head inițial de lucru: `91b84a0` (documentație). Nu a fost necesară integrarea altor modificări. Paginile-sursă existente, fotografiile, conținutul CMS și articolele nu au fost editate.

Cererea integrală și extensia sunt păstrate în [CERERE-INITIALA.txt](CERERE-INITIALA.txt) și [CERINTE-SI-EXTINDERE-SMARTBILL.md](CERINTE-SI-EXTINDERE-SMARTBILL.md).

### Arhitectură pregătită

- Site static păstrat; pagini noi `comunitate.html` și `evenimente.html`, CSS/JS proprii. Designul și navigația sunt preluate din site. Paginile vechi nu primesc modificări globale sau linkuri noi. Descoperirea noilor pagini se face prin URL direct și sitemap până la aprobarea amplasării în meniu.
- Build Cloudflare extins explicit cu cele două pagini; canonical, sitemap și testul CI sunt actualizate. Fișierele private rămân excluse din dist.
- Pages Function catch-all `/api/*`, module server în `infrastructure/`, D1 cu patru migrații. Bindingurile nu sunt create și nu există deploy.
- Comunitate: DOI Brevo nativ către lista 3, atribute explicite, dovada solicitării pseudonimizată, Turnstile și rate limiting persistent; marketingul nu este activat înainte de DOI. Confirmarea efectivă, bun venit, preferințe și dezabonare se configurează/verifică în Brevo. Parametrul de redirecționare nu reprezintă dovadă de confirmare.
- Evenimente și programe: catalog privat configurabil, înscriere administrativă distinctă de marketing, capacitate protejată în SQL, token de acces privat, revizii pentru reprogramări/anulări/finalizări și outbox cu unicități. Nu există portal administrativ/autentificare clientă/calendar extern sau recuperare automată a tokenului.
- Automatizări administrative: outbox verifică destinatarul, revizia, statutul și aprobarea șablonului. Livrarea incertă merge în review. Reminderele necesită apel programat server-side al endpointului admin; nu este instalat cron. Nu există campanii sau workflowuri create în Brevo.
- Stripe Checkout exclusiv test: gate explicit, chei live respinse, preț/sumă/monedă verificate pe server, comandă unică/înscriere, idempotency key Stripe, webhook semnat și stare canonică reinterogată, rambursările suspendă accesul. Nu se deduce plata din succesul din browser.
- SmartBill: simulator fără rețea, mapare payload V1 condiționată de date fiscale, client fiscal separat, factură unică/comandă, credit unic/refund legat de original, review la rambursare și registru unic de notificare. Transportul real, sincronizarea nativă și expedierea facturilor sunt neactivate/neimplementate intenționat până la clarificarea mediului și datelor firmei.
- Catalog: 52 șabloane draft, metadate complete, variabile validate; niciun text aprobat implicit. Mesajele marketing conțin un draft editorial de completat, fără promisiuni metodologice inventate.

### Stare și dependențe

| Componentă | Stare reală |
|---|---|
| Build, sitemap, păstrarea site-ului | implementate și verificate local; vezi raportul de teste |
| Comunitate/DOI | cod și simulări locale; configurare Brevo/Turnstile/D1 necesară |
| Evenimente/programe/ședințe | cod și SQLite local; oferte/date/acces lipsă; scheduler neinstalat |
| E-mailuri administrative | cod de outbox și expediere; OFF; teste reale de livrare lipsă |
| Marketing, bun venit, preferințe/dezabonare | catalog și pași; necesită configurarea reală Brevo |
| Stripe test | cod și simulări locale; nu există tranzacție în cont sandbox în această sesiune |
| Stripe live | blocat intenționat în cod și de date juridice/comerciale |
| SmartBill | simulator și adaptor de pregătire testate local; fără emitere/sincronizare reală |
| GDPR și fiscal | pregătire pentru revizuire; fără certificare sau validare automată |

### Decizii explicite

Se alege un singur emitent fiscal — integrarea nativă SmartBill–Stripe **sau** API — și un singur expeditor al facturii — Brevo **sau** SmartBill. Nu se activează două mecanisme care dublează documentele. API-ul SmartBill este documentat pentru Facturare Platinum; planul contului și eventualul mediu de test se confirmă la furnizor. Nu s-a găsit dovadă suficientă de sandbox fiscal izolat; nu se emit documente de probă în contul real.

Rezervările nu expiră automat; eliberarea și rambursarea sunt gestionate manual pentru a evita accesul fără loc. Tranșele/abonamentele nu sunt implementate. Datele fiscale nu se colectează din formularul public și nu merg în marketing. Retenția, exportul/ștergerea și procedurile de acces necesită decizie juridică înainte de activare.

### Documente de predare și reluare

[ACTIVARE-DUPA-INFIINTAREA-FIRMEI.md](ACTIVARE-DUPA-INFIINTAREA-FIRMEI.md), [CONFIGURARE-SERVICII.md](CONFIGURARE-SERVICII.md), [CATALOG-SABLOANE-EMAIL.md](CATALOG-SABLOANE-EMAIL.md), [CATALOG-SABLOANE-EMAIL.json](CATALOG-SABLOANE-EMAIL.json), [TESTE-SI-REZULTATE.md](TESTE-SI-REZULTATE.md), [RAPORT-MODIFICARI.md](RAPORT-MODIFICARI.md).

La reluare: verifică mai întâi producția actuală și diferențele față de acest snapshot; citește limitările și pașii de activare, apoi rulează build/test/verify. Nu face merge și nu publica fără aprobarea explicită a Iuliei.

---

Mai jos este planul V1 păstrat pentru trasabilitate. Formulările „de redactat” reprezintă starea inițială; starea curentă este tabelul de mai sus.

## Reguli de protectie — obligatorii
- Productie Cloudflare: ramura `pregatire-cloudflare-2026-10-20`; NU se modifica direct.
- Ramura documentatie/lucru: `pregatire-infrastructura-email-plati`.
- Nu se face merge, push pe productie, publicare, modificare de DNS, modificare Brevo sau trimitere catre clienti fara aprobare explicita.
- Inainte de orice merge: se actualizeaza ramura de lucru din ultima productie, se revizuiesc conflictele, se ruleaza build-ul si testele, se face snapshot/backup si se obtine aprobare.
- Nu se pun tokenuri, chei API, date ale clientilor sau informatii sensibile in repository.
- Se conserva toate paginile, articolele, SEO-ul, stilurile, imaginile si modificarile ulterioare ale proprietarei.
- Numele actual: Echilibrarea Radacinilor. Nu se reintroduce vechiul brand in materiale noi.

## Constatari verificabile din audit partial GitHub
- Repo: `iuliabobeica65-tech/Intoarcerealatine-nou`; default branch `main`, distinct de ramura Cloudflare de productie.
- Scriptul `scripts/build-cloudflare.mjs` produce `dist` din lista explicita de pagini si genereaza sitemap, redirects, articole. Orice pagina noua trebuie integrata in build si sitemap fara a strica SEO.
- `live.html`, `acasa.html` si `politica-confidentialitate.html` folosesc contact WhatsApp/mailto; in paginile verificate nu apare un formular Brevo.
- Acesta este audit partial; nu presupunem ca alte componente nu exista.

## Etapa A — comunitate si comunicare (prioritatea lansarii)
1. Inventariere liste, contacte, formulare, campanii, automatizari existente in Brevo. Fara stergeri.
2. Model unic de contact cu email, prenume optional, sursa, interes declarat, preferinte, data/versiunea consimtamantului, status abonare. Fara date sensibile din sesiuni.
3. Formular cu double opt-in pentru newsletter/comunitate, text clar despre marketing si dezabonare.
4. Pagina 'Comunitatea Echilibrarea Radacinilor' cu doua cai independente: abonare email si intrare voluntara in WhatsApp. Link WhatsApp numai dupa confirmarea celui corect.
5. Fluxuri Brevo: confirmare abonare; bun venit; invitatii la LIVE gratuit; remindere; mesaj dupa eveniment; newsletter; oferte numai catre contacte cu temei legal.
6. LIVE-urile gratuite trebuie sa poata fi accesate si fara abonare comerciala; orele/datele se confirma inaintea fiecarei campanii.
7. Teste cu adrese de test, inclusiv Gmail/Yahoo, dezabonare si tratarea erorilor.

## Etapa B — inscrieri si evenimente
- Webinarii gratuite: inscriere, confirmare, schimbare data, reminder, post-eveniment.
- Workshopuri online/offline: cerere/rezervare, disponibilitate, confirmare, detalii logistice, reminder, anulare/reprogramare.
- Sesiuni individuale: solicitare, confirmare manuala/automata dupa aprobare, reminder, reprogramare.
- Programe de grup: inscriere, confirmare, acces, calendar, notificari de sedinte, incheiere.
- Separare mesaje administrative de mesaje promotionale.
- Evitarea dublurilor; evidenta evenimentelor si a statusurilor.

## Etapa C — Stripe si facturare (doar sandbox pana la activarea legala)
- Catalog de oferte si preturi aprobat explicit; nu se inventeaza.
- Stripe Checkout in mod test; webhook semnat verificat pe server; statusul platii nu se deduce din pagina de succes.
- Evidenta operationala separata a comenzilor, participantilor, tranzactiilor si evenimentelor, cu idempotenta.
- Plati reusite, esuate, in asteptare, rambursari, transe daca sunt aprobate.
- E-mailuri tranzactionale: confirmare plata, acces, plata esuata, rambursare, modificari.
- Integrarea cu un furnizor de facturare se alege dupa cerintele legale/fiscale; nu se emite factura falsa.
- In productie: date juridice/fiscale, verificare Stripe, cont bancar, politici comerciale, verificare facturare si teste finale.

## Biblioteca de mesaje — de redactat si aprobat
COM-01 confirmare email; COM-02 bun venit; COM-03 invitatie WhatsApp; COM-04 preferinte/dezabonare.
LIVE-01 confirmare; LIVE-02 invitatie; LIVE-03 reminder; LIVE-04 post-eveniment.
WEB-01..05 confirmare/remindere/modificare/post-eveniment.
WRK-01..06 rezervare/plata/detalii/reminder/anulare/post-workshop.
PRG-01..07 inscriere/plata/acces/calendar/transe/finalizare.
SES-01..04 confirmare/reminder/reprogramare/administrativ.
PAY-01..06 confirmare/esec/asteptare/rambursare/transe/eroare.
FIN-01..03 factura/corectie/problema.
MKT-01..04 newsletter/lansare/invitatie/revenire.
OPS-01..04 bounce/dezabonare/duplicat/eroare.

Fiecare sablon necesita: scop, trigger, destinatari, consimtamant/temei, subiect, preheader, corp complet, variabile, CTA, criterii de oprire, test si aprobare.

## Separarea responsabilitatilor
ChatGPT: arhitectura, mesaje, validarea logicii si documentatie, audit read-only.
Codex: implementarea tehnica in ramura izolata, teste, PR pentru revizuire; fara merge autonom.
Brevo: liste, formulare, automatizari, livrabilitate (necesita acces sau configurare asistata).
WhatsApp: comunitate si link de invitatie creat de proprietara.
Stripe: configurare test si verificare la activarea reala.

## Decizii si acces in asteptare
- Inventar real Brevo si nivelul planului (limite automatizari).
- Confirmarea structurii comunitatii WhatsApp si linkului de invitatie.
- Oferte, preturi, politici de rambursare si tipuri de plata.
- Furnizor facturare, calendar/programari si solutie de evidenta comenzi.
- Texte legale, consimtamant, retentie date si procesare GDPR.
- Acces tehnic autorizat la Brevo/Stripe pentru implementare; nu se cer secrete in chat.

## Criterii de acceptare
- Zero schimbari neaprobate in productie.
- Build si navigatie, SEO, articole si pagini existente intacte.
- Inscriere/confirmare/dezabonare functionale si logate.
- Remindere doar pentru evenimente corecte, fara duplicari.
- Teste plati reusite/esec/rambursare si webhook idempotent.
- Verificarea accesului si livrarii e-mailurilor.
- PR revizuit si aprobat explicit inainte de lansare.
