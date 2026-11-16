> Decizia curentă newsletter: [colectare voluntară, numai DOI, fără welcome sau promovare](NEWSLETTER-COLECTARE-PREVIEW.md). Preview privat, colectare OFF; condițiile pentru activare sunt în raport.

> Starea curentă: [finalizarea tehnică din 15.11.2026](FINALIZARE-TEHNICA-2026-11-15.md). Notele datate de mai jos păstrează istoricul și nu autorizează activări.

# MASTER — Infrastructura digitala Echilibrarea Radacinilor

## Stare curentă — panou local funcțional și teste de concurență

[Raport complet](PANOU-LOCAL-SARCINA-RECUPERARE-2026-11-12.md). Workers + D1 rămân backendul decis; Brevo pentru e-mailuri și Google pentru programări. `npm run admin:local` oferă administrare pe API-ul existent și SQLite local cu date fictive: evenimente, capacitate/stări, înscrieri/anulări, mesaje, plăți și backup/restaurare. Nu este backend Node de producție. Interfața statică anterioară și codul existent sunt păstrate.

23 teste noi + 30 regresii selectate PASS; 200 solicitări/25 locuri fără supravânzare, 80 duplicate cu efect unic, 30 webhookuri semnate repetate cu ledger/notificare unice, refund prioritar față de paid întârziat, dispatch concurent, rollback și recuperare. Migrarea 0006 adaugă indexuri; simulatorul batch este atomic. Performanța/cotele reale D1 nu sunt încă măsurate. Compilare offline Pages Functions PASS, fără publicare.

Runtime local oprit; backupurile sintetice sunt păstrate. Fără push/merge/deploy, schimbări Brevo/site/Cloudflare/Google, plăți sau mesaje reale. Ultima stare cunoscută a ticketului #5670720 și riscul public al formularului nu au fost reverificate/modificate. Istoricul de mai jos rămâne integral.

### Ultima completare locală — interfața administrativă demonstrativă

tools/event-admin oferă acum consultarea vizuală în română a evenimentelor, locurilor, înscrierilor/anulărilor, mesajelor și plăților. Numai date sintetice, fără conexiune la backend real, fără modificări/expedieri și neinclusă în build-ul public. 6/6 teste noi și verificări de navigare în browser trecute; serverul temporar oprit. Integrarea reală rămâne de aprobat/pregătit separat; procentajele operaționale nu au fost crescute. Raportul și inventarul de mai jos au fost completate, păstrând istoricul.

## Continuare locală — 12.11.2026, evenimente/admin/încasări

Starea curentă și limitele sunt în [raportul consolidat](CONTINUARE-INFRASTRUCTURA-2026-11-12.md) și [inventarul local](stare-infrastructura.json). Istoricul de mai jos se păstrează integral; nu înseamnă autorizare de push, merge, deployment sau activare.

Implementat local: consultare administrativă paginată (evenimente, persoane, mesaje și plăți), preview text fără expediere, anulare administrativă, pregătire remindere fără dispatch, capacitate administrată cu trigger D1 și control de revizie, anulări fără efect fals pentru completed și fără cozi la revizie veche, acces privat refuzat pentru eveniment plătibil fără plată, validare completă a datelor obligatorii din payloadul fiscal. Migrarea nouă este 0005-event-admin.sql, neaplicată în cloud. Este un API administrativ, nu un panou vizual sau un calendar nou.

Validări: 17 teste noi + 9 regresii selectate PASS; build static local și compilare offline Pages Functions PASS. Nu au fost reluate integral 28/28, verificările Access/noindex sau POST-urile deploymentului anterior. Nicio modificare la sursele paginilor publice sau la site-ul oficial; niciun serviciu extern activat și niciun push/deploy.

Brevo rămâne neschimbat, cu riscul public documentat și ticket #5670720. Ultima observație Open/fără răspuns este istorică; nu s-a recitit contul în această etapă. Google Appointment Schedules rămâne soluția pentru ședințe; nu există URL confirmat în sursa locală, deci funcționarea rezervării online nu este certificată. Stripe live și emiterea fiscală rămân blocate. Pregătire estimată: newsletter 40%, evenimente 80%, programări 20%, încasări 60%; barème și criterii în raport, nu procente de funcționare în producție.

## Actualizare: salvare GitHub și Preview autorizate

Cele 9 commituri până la c2f41b5 sunt acum salvate pe GitHub în ramura de test; Cloudflare a creat Preview-ul, cu operațiunile externe oprite. Vezi PUBLICARE-RAMURA-TEST-2026-11-09.md pentru dovezi și limitări. Formulările anterioare despre lipsa push-ului rămân istoric. Producția nu a fost ținta operațiilor.

## Continuare locală sigură — 9 noiembrie 2026

Instrucțiunea suplimentară este păstrată în CERERE-CONTINUARE-2026-11-09.txt. Raportul actual este RAPORT-CONTINUARE-2026-11-09.md; stările mai vechi de mai jos rămân istoric.

Implementat numai local: TEST_MODE=true cu destinatar unic privat TEST_RECIPIENT_EMAIL, verificat înainte de scrieri și la frontiera Brevo; verificator offline scripts/check-isolated-config.mjs; model Cloudflare nefuncțional în cloudflare-test/. Restricția nu se aplică profilului normal când TEST_MODE lipsește/este false; verificatorul cere explicit true. Originea cunoscută a producției este respinsă în test, dar identitatea tuturor aliasurilor trebuie verificată extern.

Outboxul evenimentelor respinge COM/FIN/OPS/SES și marketing; confirmarea DOI, facturile și programările Google nu se trimit pe această cale. Loturile sunt limitate la 10 pentru bugetul D1 Free; reminderele continuă în loturi fără duplicate. Nu există scheduler instalat.

Nu există încă mediu extern izolat validat. Nu s-a activat #2 sau alt șablon și nu s-au trimis mesaje reale în această continuare. Testul anterior COM-02 primit în Inbox rămâne singura livrare externă confirmată. Preferințe/dezabonare/DOI real și welcome automat rămân nevalidate.

Confirmare ulterioară, 9 noiembrie 2026: Iulia a confirmat „A sosit în Inbox” pentru testul COM-02, ID 3. Livrarea acestui singur mesaj de test este validată prin confirmarea destinatarei. Nu validează întregul flux DOI, preferințele, dezabonarea sau livrarea către alte adrese. Șabloanele și automatizările rămân inactive.

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


### Actualizare 13.11.2026 — pregatire validare cloud, fara executie

Planul consolidat este in `docs/cloud-validation/PLAN-CONSOLIDAT-2026-11-13.md`. Pachet administrativ privat separat (11 fisiere), Worker compilat offline, D1 nou doar proiectat, sase migratii existente pastrate. 9 teste locale noi trecute; 11/11 verificari ale sablonului de configurare. Scenariile externe si rollback sunt pregatite, nu executate. ID D1/AUD/preflight/cote raman de verificat dupa aprobarea consolidata. Brevo, productia, GitHub si Cloudflare nu au fost modificate. Testele cloud istorice nu au fost repetate. Nu reprezinta lansare sau plati functionale.


### Preflight Cloudflare 13.11.2026 — aprobare primita, executie oprita

Sesiunea existenta, contul si proiectul izolat confirmate; un singur Preview existent. Lipseste permisiunea d1:write. Nu s-a creat D1 si nu s-a facut deployment. Access/AUD/configuratia Preview si cotele necesita inca verificare curenta. Detalii: docs/cloud-validation/PREFLIGHT-2026-11-13.md.


### Executie izolata 13.11.2026 — stare finala OFF verificata

Raport curent: `docs/cloud-validation/REZULTATE-CLOUD-2026-11-13.md`. OAuth cu cele 5 permisiuni confirmat. O baza D1 noua, sase migratii trecute, 8/8 scenarii D1 remote si 2/2 teste locale noi ale exporturilor reale. Time Travel verificat. Un deployment privat de validare si republicarea necesara a artefactului OFF original, exclusiv Preview. Variabilele initiale restaurate exact, bindingul D1 si secretele administrative noi eliminate din cloud; vechiul deployment de test blocat prin rotirea marcajului bazei. Panoul/API-ul autentificat in browser NU sunt confirmate (control browser blocat). Nicio productie, GitHub, Brevo, plata sau expediere reala modificata. Nu este lansare publica si nu este benchmark end-to-end.


### Continuare newsletter API — 13.11.2026

Decizia curenta revine la un singur flux DOI API, fara stergerea variantei native. Raport: `docs/brevo-pregatire/DOI-API-CONTINUARE-2026-11-13.md`; inventar: `decision-api-2026-11-13.json`. Raspunsul oficial Brevo #5670720 transmis de Iulia confirma lista dupa click si DOUBLE_OPT-IN=Yes, dar nu inlocuieste testul real. ID-uri: lista test #4, DOI API candidat #2, automatizare #1 INACTIVA, mesaj welcome #7 (sursa #3); #6/#8 raman ale fluxului nativ istoric. Nu s-au schimbat ID-uri/configurari live.

Corectie numai locala: claim atomic rolling 24h, erori ambigue pastrate pending, fara fabricarea confirmarii sau reabonare automata. 5 teste noi + 3 regresii relevante trecute, build API offline reusit, indexul existent reutilizat; fara migratii noi. Preferinte, unsubscribe/suprimare, welcome unic si panou cloud autentificat raman netestate end-to-end. Formularul gazduit are risc public rezidual; nu se distribuie linkul. Cloudflare ramane OFF, fara operatiuni externe, push, deployment sau mesaje.


### Pregatire validare finala — 13.11.2026

Raport adaugat: `docs/VALIDARE-FINALA-PREGATIRE-2026-11-13.md`; inventar separat: `docs/VALIDARE-FINALA-STARE-2026-11-13.json`. 6 teste noi ale instrumentelor de test trecute; zero apeluri externe. Backupurile 321/294 reverificate integral: 291 surse + 30 dovezi cloud versus 294 surse, cu trei surse noi si zero lipsa. Toate versiunile sunt pastrate. Cloudflare ramane OFF. Panoul autentificat, Brevo real si performanta HTTP nu sunt declarate validate; actiunile externe sunt consolidate in raport.


### Profil HTTP/Turnstile pregatit local — 13.11.2026

Raport: `docs/cloud-validation/HTTP-TURNSTILE-LOCAL-2026-11-13.md`. Pachet nou de 13 fisiere, build offline, reutilizare D1 existent si zero migratii noi. 7 teste noi + 3 regresii relevante trecute; browser local: 8 verificari, Access/Turnstile simulate, zero cereri externe. Profilul pastreaza JWT Access + Bearer + Origin + marcaj D1, adrese sintetice/evenimente gratuite si expirare maximum o ora. Brevo ramane separat: maximum un DOI/un welcome numai cu aprobare ulterioara. Pachetele vechi si documentele sunt pastrate. Niciun deployment/mesaj/activare in aceasta etapa; Cloudflare ramane OFF.


### Execution HTTP privee terminee et OFF verifie — 13.11.2026

Raport curent: `docs/cloud-validation/REZULTAT-HTTP-ACCESS-2026-11-13.md`. OAuth cu sase scope-uri confirmat; un widget Turnstile gratuit creat numai pentru aliasul privat, fara Spin. Deploymentul HTTP a refuzat accesul intern cu access_required; fluxul cloud nu este validat functional. Zero inscrieri HTTP, zero DOI/welcome, automatizarea Brevo neactivata si dezabonarea neexecutata. Revenire OFF verificata in maximum 10 minute: variabile restaurate, binding/secrete temporare eliminate, D1 restaurat (doua inscrieri sintetice/un eveniment/sase migratii), marcaj blocat, artefact OFF republicat in Preview. Productia/GitHub/site-ul oficial nemodificate. Diagnostic local separat pregatit, 3 teste noi + 2 regresii crypto trecute; necesita aprobare noua pentru deployment, maximum 15 minute, fara D1/Turnstile/Brevo.
