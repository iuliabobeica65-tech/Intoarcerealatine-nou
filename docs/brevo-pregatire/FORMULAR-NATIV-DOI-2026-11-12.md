> **Decizia curenta 13.11.2026: DOI prin API Brevo, lista izolata #4 pentru test.** Urmeaza `DOI-API-CONTINUARE-2026-11-13.md`; continutul de mai jos pastreaza istoricul si nu autorizeaza activari. Formularul nativ existent nu a fost modificat.

# Newsletter — un singur formular nativ DOI, pregătire controlată

> **REZULTAT ULTERIOR ÎN CITIRE — 12.11.2026:** expunerea publică înainte de Done este CONFIRMATĂ, șablonul DOI #8 este Active / engleză / expeditor personal. Trimiterea și acceptarea înscrierilor NU au fost testate. Nu folosi stările istorice de mai jos drept garanție de inactivitate. Vezi ultima secțiune și inventarul actualizat.

> **Stare curentă, 12.11.2026, după aprobările de configurare:** formularul `6af5c20e8646ba0a458ab642` există în Brevo, designul și mesajele sunt în română, lista #4 este singura selectată, DOI folosește temporar `Default Template Double opt-in confirmation`, Final confirmation email OFF. Nu s-a apăsat Done, nu s-a distribuit/încadrat formularul și nu s-a trimis nimic. **Brevo a generat totuși un URL la Share; inactivitatea și blocarea accesului public NU sunt demonstrate.** Nu interpreta numele PREGATIT sau Done neapăsat drept protecție. Detalii în ultima secțiune. Paragrafele inițiale de mai jos descriu pregătirea anterioară și rămân istoric.

Decizia Iuliei din 12 noiembrie 2026: formular nativ Brevo, lista izolată #4; fără DOI API pentru această abonare. Documentul înlocuiește instrucțiunile operative API din documentele anterioare, care rămân păstrate ca istoric. Nu constituie aprobare de modificare a contului, activare, trimitere sau deployment.

## Stare: verificat / pregătit / netestat

- **Verificat în citire:** șablonul #6, numele ER | COM-01 | Confirmare formular Brevo | DRAFT, Inactive, expeditor contact@iuliabobeica.ro, link Confirm abonarea cu `{{ doubleoptin }}`, fără personalizare pe atribute de contact. Copia HTML locală și manifestul au aceeași variabilă, fără `params.DOIurl`; tagul optin este în manifest (opțional conform documentației). Nu s-a apăsat Save, Test sau Activate.
- **Pregătit:** specificația formularului și integrarea testului, inventarul și scenariile de mai jos. Nu există ID/URL de formular nativ nou, nici embed sau action URL inventat.
- **Netestat:** acceptarea efectivă a #6 în selectorul Double confirmation email, substituirea linkului DOI, ordinea actualizării atributului și triggerului, livrarea, duplicatele, preferințele/dezabonarea și restricția server-side la adresa proprie.
- **Păstrat:** codul API, toate șabloanele, automatizarea #1 inactivă, infrastructura evenimentelor și deploymentul OFF existent. D1/Turnstile ale API-ului nu sunt condiție implicită pentru un newsletter nativ; nu se configurează resurse suplimentare pentru a duplica Brevo.

## Configurație de aplicat numai după aprobare externă

Nume intern: ER TEST | Newsletter DOI nativ | PREGATIT. Tip: Full page/embedded, nu popup suplimentar. Un singur formular; asociere numai listei #4 existente. Nu se creează altă listă, nu se adaugă #3, #6 sau #2, nu se importă/mută contacte. Inventarul listei #4 (0 contacte) provine din auditul deja făcut, nu dintr-o recalculare nouă.

Câmpuri: email obligatoriu; prenume opțional numai dacă maparea PRENUME este disponibilă fără creare de atribute. Fără telefon, informații personale despre ședințe, plăți, calendare sau câmpuri ascunse care declară confirmarea. Consimțământ obligatoriu, nebifat. Text pregătit: „Doresc să primesc prin e-mail noutăți, invitații și oferte de la Iulia Bobeica – Echilibrarea Rădăcinilor. Îmi pot retrage acordul oricând prin linkul de dezabonare.” Politica publică se leagă fără a modifica site-ul. Informare privind prelucrarea prin Brevo; participarea la evenimente și WhatsApp sunt separate. Textul final al acordului trebuie reflectat în DOI #6; copia actuală transmite scopul, dar nu conține literal întregul text pregătit. Orice aliniere a șablonului în cont cere aprobare, nu s-a executat.

Confirmare: **Double confirmation email**, candidat șablon #6 exclusiv. Dacă #6 nu este selectabil fără activare, se oprește și se raportează; nu se substituie #2 și nu se activează automat șablonul. **Final Confirmation Email OFF**. Fără e-mail suplimentar la submit și fără a doua automatizare DOI. Captcha și setările reale de tracking trebuie inspectate înainte de utilizare; nu se presupune că un parametru al vechiului API controlează formularul nativ. Fără noi consimțăminte de tracking în acest test.

Pagină după submit: „Verifică e-mailul pentru confirmare. Solicitarea nu este încă abonare confirmată.” Pagină după click: confirmare generică, fără email/token în URL sau analytics. Redirectul și mesajul afișat nu sunt dovezi server-side. URL-urile concrete se aleg din mediul izolat aprobat doar după verificarea accesului; nu se configurează un redirect blocat pentru destinatar.

## Un singur welcome, automatizarea #1 rămâne INACTIVĂ

Păstrează triggerul lista #4, AND adresa proprie autorizată (numai privat în Brevo), DOUBLE_OPT-IN=Yes, Email campaigns subscriptions=Subscribed. Păstrează re-entry OFF. Ramura eligibilă → welcome #7 → Exit; cealaltă → Exit. Nu porni mesajul final al formularului, welcome #3 separat sau outboxul evenimentelor pentru newsletter. Nu seta manual DOUBLE_OPT-IN și nu folosi un câmp ascuns editabil de client ca dovadă DOI. La test trebuie verificată sincronizarea atributului cu triggerul; un contact ieșit pe ramura neeligibilă nu reintră automat, deci nu se ascunde o problemă de ordine prin re-entry ON.

## Integrare pregătită pentru proiectul izolat, neaplicată

Țintă exclusiv er-brevo-test-izolat. Deploymentul actual rămâne https://1d970123.er-brevo-test-izolat.pages.dev, fără actualizare. Codul /api/community și șablonul API #2 se păstrează, cu COMMUNITY_ENABLED=false; nu se mai folosesc pentru această abonare. EMAIL_SEND_ENABLED și toate flags evenimente/plăți/facturare rămân false. Nicio nouă cheie API pentru newsletterul nativ.

După aprobări și existența unui URL real: integrare numai într-o copie de test, printr-un singur link explicit către formular sau un embed revizuit. Acesta înlocuiește în test calea de submit a vechiului formular, nu se pune lângă un al doilea submit DOI. Nu se modifică acum HTML/JS, meniuri, SEO sau buildul. Niciun listener nu trebuie să mai POST-eze /api/community pentru același submit. Sursa Brevo rămâne singura responsabilă pentru DOI/consimțământ newsletter; evidența evenimentelor în D1 rămâne separată. Google Calendar Appointment Schedules rămâne responsabil pentru ședințe individuale; fără calendar D1 paralel.

### Blocaj de izolare care trebuie rezolvat înainte de orice trimitere

URL-ul/endpointul formularului Brevo este extern. Cloudflare Access pe pagina de test NU protejează automat formularul Brevo, inclusiv când este în iframe. TEST_MODE și TEST_RECIPIENT_EMAIL din vechiul API nu se aplică unui submit direct Brevo. Formularul nepublicizat, câmpul readonly, validarea JavaScript sau un URL greu de ghicit nu reprezintă restricție server-side a destinatarului.

Nu se finalizează/publică formularul și nu se trimit solicitări până nu este demonstrată o restricție furnizor/server-side compatibilă, exclusiv la adresa autorizată. Dacă Brevo nu oferă mecanismul necesar, se oprește pentru o soluție de izolare aprobată; nu se reactivează API DOI, nu se creează proxy sau al doilea flux din proprie inițiativă. Crearea unui draft trebuie oprită dacă UI implică imediat un formular accesibil și trimitere posibilă fără aceste protecții. Confirmarea unei adrese de test nu autorizează adăugarea altor adrese/aliasuri.

## Scenarii viitoare — toate netestate pentru formularul nativ

| Scenariu | Dovadă cerută |
| --- | --- |
| Pregătire | Aprobări pentru contact/trimiteri și activări; starea inițială a adresei proprii consemnată privat. Nu șterge/reabonează contactul pentru a fabrica o stare nouă. |
| Destinatar neautorizat | Restricția demonstrată fără folosirea unei adrese reale străine; niciun mesaj/creare contact în afara adresei autorizate. Dacă nu poate fi demonstrată sigur, testul nu pornește. |
| Fără acord | Refuz fără trimitere sau creare/modificare contact; checkbox nebifat inițial. |
| Submit valid | Un DOI #6; loguri cu sursa formularului; zero welcome înainte de click. Apartenența la listă și atributul nu se deduc din simpla existență a contactului global. |
| Confirmare | Istoric DOI confirmat, lista #4, Yes și Subscribed; exact un welcome #7. Numărul din Inbox și loguri concordă. |
| Click repetat / submit duplicat | Zero welcome suplimentare; comportamentul mesajelor DOI repetate se consemnează, nu se presupune deduplicarea vechiului API. Oprire dacă apar trimiteri neaprobate. |
| Ordinea trigger/atribut | Contactul trece ramura eligibilă după confirmare; dacă atributul apare prea târziu și welcome lipsește, se raportează blocajul, fără schimbarea automată a regulilor. |
| Preferințe | Link personal rezolvat și formular implicit corect; fără abonare suplimentară sau resetarea suprimării. |
| Dezabonare | Statut marketing suprimat și mesajele viitoare blocate; fără test de expediere forțată, ștergere/reabonare sau e-mail #5 automat. |
| Oprire | Automatizarea oprită și retragerea accesului formularului conform opțiunilor furnizorului; mesajele deja livrate nu sunt reversibile. |

Nu se execută niciun scenariu extern în această etapă. Este nevoie de aprobare separată pentru contactul de test, numărul/scopul mesajelor și activările temporare; automatizarea nu poate trimite welcome cât este inactivă. Dezabonarea și preferințele pot afecta contactul la nivelul întregului cont, nu numai lista #4.

## Aprobare externă consolidată necesară ulterior

Pachet propus: crearea/configurarea unui singur draft nativ pentru lista #4; selectarea #6 dacă este compatibil și disponibil fără activare; alinierea textului DOI doar dacă este aprobată; final confirmation OFF; fără alt welcome și fără schimbarea stării automatizării #1. Oprire înainte de orice pas care publică formularul, activează un șablon sau permite trimiterea în afara adresei autorizate. Nicio modificare a site-ului sau Cloudflare. Această aprobare de configurare NU acoperă activarea, contacte, mesaje, embed public sau deployment; acestea vor avea un plan concret după rezolvarea izolării.

## Surse oficiale și probe

- https://help.brevo.com/hc/en-us/articles/208771869-Create-a-sign-up-form-in-Brevo — dublă confirmare, lista după click, atributul DOI și e-mailul final opțional.
- https://help.brevo.com/hc/en-us/articles/360019540880-Create-a-custom-double-opt-in-DOI-email-template-for-a-sign-up-form-created-in-Brevo — șablon nativ, link DOI, fără personalizare pe atribute; acordul reflectat în mesaj; tag optin opțional.
- Verificare UI #6 în citire la 12 noiembrie: link nativ, expeditor, Inactive. Acceptarea în selector nu a fost verificată, deoarece presupune configurarea unui formular nou.

Rezultatele testelor locale/build/static din această pregătire se consemnează în inventar. Ele nu validează formularul Brevo inexistent sau livrarea reală.

## Validare locală încheiată

28/28 teste existente trecute, build reușit; verificator: 18 pagini, 82 articole, 100 URL-uri sitemap, 3.781 referințe, 0 lipsă, 147 fișiere identice cu baselineul local (nu o comparație nouă cu producția). Opt verificări statice ale specificației trecute: JSON, lista unică #4, linkul nativ #6, lipsa personalizării pe contact, welcome unic inactiv, formular nepublicat, DOI API neales și restricție destinatar marcată explicit neverificată. Hashurile celor 154 de fișiere ale artefactului aprobat anterior sunt neschimbate. git diff --check trecut. Testele nu au trimis mesaje și nu demonstrează validare externă.

## Continuare autorizată — draft creat în Brevo, 12.11.2026

- Creat un singur formular incomplet: `ER TEST | Newsletter DOI nativ | PREGATIT`, ID `6af5c20e8646ba0a458ab642`.
- Salvată exclusiv lista de test #4; rezumatul Lists confirmă numele ei. Lista afișa 0 contacte.
- Oprit la Settings: Double confirmation email selectat implicit, Final confirmation email debifat. Pasul Settings NU a fost finalizat/salvat prin Next.
- Selectorul a afișat numai `Default Template Double opt-in confirmation`; șablonul #6 nu era disponibil. Nu a fost selectat șablonul implicit și nu a fost activat #6.
- Designul este încă cel implicit, în engleză; textul de consimțământ și câmpurile din specificația locală rămân de aplicat. Nu reprezintă un formular gata de lansare.
- Nu s-a ajuns la Messages/Share, nu s-a distribuit un URL, nu s-a publicat integrarea. Accesibilitatea publică a unui eventual endpoint Brevo nu a fost testată și nu este garantată ca blocată. Izolarea destinatarului rămâne nedemonstrată.
- Automatizarea #1 nu a fost modificată sau activată. Zero e-mailuri trimise și zero contacte create/modificate prin aceste operațiuni. Niciun push/deployment; site-ul oficial nemodificat de această etapă.
- Dovezi locale: `.local/brevo-2026-11-11/native-draft-settings.png`; observațiile UI și ID-ul sunt păstrate în inventar. Rezultatele testelor locale anterioare rămân istorice, nu teste ale acestui draft.
- Blocaj: continuarea cu #6 necesită clarificarea disponibilității lui fără activare, apoi demonstrarea izolării destinatarului. Nu este autorizată activarea sau trimiterea. Nu crea alt formular la reluare: folosește acest ID.

## Configurare autorizată continuată — 12.11.2026

### Verificat în interfață

- Formular unic existent: `6af5c20e8646ba0a458ab642`; nu s-a creat alt formular sau alt șablon.
- Lista #4, `ER | TEST DOI isolat | 2026-11-10`, singura bifată; asocierea a persistat. Inventarul Forms afișa 0 Submits / 0 New contacts după configurare.
- Șablonul original #6 a fost inspectat fără salvare în editorul `classic/html/6`: conține ancora `{{ doubleoptin }}`, dar nu are panoul Button / Type / Double opt-in link al editorului vizual. Originalul a rămas nemodificat și nu a fost activat. Absența din selector este verificată; cauza exactă (clasificarea DOI, starea inactivă sau alt filtru) NU este demonstrată. Nu deducem că HTML-ul este în mod necesar incompatibil.
- Fallback aprobat: `Default Template Double opt-in confirmation` selectat și păstrat după revenirea în Settings; ID numeric neafișat, nu îl inventăm. Double confirmation email ON, Final confirmation email OFF; fără al doilea welcome. Automatizarea #1 nu a fost modificată/activată în această etapă; observația anterioară Inactive rămâne referința.
- Design salvat și recitit: titlu, explicație, eticheta adresei, ajutor și buton în română. Numai EMAIL obligatoriu și câmpul existent OPT_IN obligatoriu, nebifat; fără prenume sau atribute noi. Consimțământul pregătit mai sus a fost aplicat; linkul din text indică `https://iuliabobeica.ro/politica-confidentialitate`. Blocul are reprezentarea required în editor; validarea reală la submit rămâne netestată.
- Mesajele de succes/invalid/eroare/câmp gol au fost traduse și recitite după salvarea pasului Messages. Succesul spune că abonarea necesită confirmare; nu pretinde înscriere deja finalizată.
- La Share, Brevo generează automat un URL și un iframe ÎNAINTE de Done. Nu au fost deschise, copiate în integrare sau distribuite. Done NU a fost apăsat. Meniul Forms oferă Duplicate/Delete, fără stare explicită Draft/Inactive sau control de dezactivare observabil. Nu putem afirma că URL-ul este inaccesibil public; publicEnabled este null în inventar. Acesta este un blocaj de siguranță, nu o configurație pregătită pentru test real.

### Dovezi oficiale și limite

- https://help.brevo.com/hc/en-us/articles/360019540880-Create-a-custom-double-opt-in-DOI-email-template-for-a-sign-up-form-created-in-Brevo — procedura recomandată: buton cu Type = Double opt-in link; consimțământul din e-mail să corespundă formularului; fără personalizare pe atribute. Articolul nu demonstrează cauza excluderii acestui #6 din selector.
- https://help.brevo.com/hc/en-us/articles/208771869-Create-a-sign-up-form-in-Brevo — Messages/Next salvează mesajele, Share generează link/embed, Done este finalizarea. Nu este documentată aici o garanție de izolare numai la o adresă sau de inactivitate înainte de Done. DOI nativ adaugă contactul în lista selectată după confirmare; substituirea linkului și livrarea nu au fost testate.
- Limba, expeditorul și conținutul efectiv al e-mailului implicit nu au fost confirmate. Nu s-a modificat șablonul implicit partajat cu potențiale alte formulare. Personalizarea lui necesită o strategie care păstrează izolarea și originalele.
- Copia locală `politica-confidentialitate.html`, linia 40, spune că nu există newsletter. Linkul este configurat corect în draft, dar politica trebuie revizuită înainte de lansare pentru această prelucrare și Brevo. Încercarea de citire a paginii publice prin instrumentul web nu a reușit; nu prezentăm copia locală drept conținut public actual verificat. Nicio politică nu a fost modificată.
- Captură: `.local/brevo-2026-11-11/native-configured-settings.png`. URL-ul de submit nu este inclus în documentația versionabilă.

### Rămâne înaintea testului real

1. Stabilirea unei protecții server-side demonstrabile pentru endpointul nativ sau a unui mediu Brevo separat, fără a confunda Cloudflare Access cu protecția URL-ului Brevo. Nu este suficient ca URL-ul să fie nepublicizat.
2. Verificarea/personalizarea sigură a e-mailului DOI implicit (română, expeditor, consimțământ) ori o copie compatibilă a #6; fără activare în această etapă.
3. Revizuirea politicii pentru newsletter, clarificarea CAPTCHA/tracking și a păstrării dovezilor de consimțământ. Nu se colectează date noi pentru testele statice.
4. Aprobare separată, concretă, pentru finalizarea formularului și numărul controlat de mesaje/contacte către unica adresă proprie. Automatizarea #1 rămâne inactivă până la acea aprobare.
5. Testele viitoare deja definite: înainte de confirmare zero welcome; după confirmare exact unul; duplicatul nu retrimite welcome; preferințe/dezabonare și actualitatea abonării verificate. Nu se execută acum.

Niciun push/merge/deployment, nicio operațiune pe Cloudflare sau site-ul oficial, nicio trimitere sau modificare de contact. Testele Cloudflare anterioare nu au fost repetate. Codul DOI API și documentele MASTER au rămas păstrate.

## Verificare finală numai în citire — expunere publică, 12.11.2026

### Verificat direct

- URL-ul Share observat în editor a fost deschis în browserul separat al aplicației, fără sesiunea Chrome/Brevo. Pagina a afișat formularul complet înainte de Done: EMAIL, acord nebifat, politica și butonul activ. HTML-ul conține form method POST către sibforms.com și submit disabled=false. Inputul de e-mail nu este neapărat type=email; controlul nu a fost completat. Nu s-a executat submit, nici POST gol și nici click pe link de confirmare.
- Concluzie strictă: Done NU este necesar pentru afișarea publică și salvarea designului/mesajelor observate. Acceptarea backend a unei înscrieri înainte de Done rămâne necunoscută. Se tratează preventiv ca formular potențial operațional.
- Șablon selectat #8, Default Template Double opt-in confirmation: Active, engleză, subiect Confirm your subscription, conținut de confirmare fără textul exact al acordului din formular. Expeditorul este adresa personală a contului (valoare omisă); UI avertizează despre înlocuirea domeniului cu brevosend.com. Linkul din conținut este {{ doubleoptin }}, nu URL fix. Nu a fost apăsat. Substituirea, expirarea și unicitatea tokenului sunt netestate.
- Lista Templates include #8 DOI, #9 simple confirmation, #10 final confirmation, #11 unsubscribe follow-up, toate Active cu aceeași dată/ora. Apariția automată prin inițializarea formularelor este o explicație dedusă, nu un audit log verificat. Nu s-au activat manual. Nu echivala starea Active a #10 cu opțiunea Final confirmation a formularului: aceasta a rămas OFF în ultima configurație verificată.
- Automatizarea #1: lista Automations confirmă Inactive, Active 0, Started 0. Nu a fost activată sau modificată. Editorul condițiilor nu a putut fi recitit stabil; se reutilizează dovezile din 11/12 noiembrie, nu se afirmă o nouă verificare a fiecărei condiții.
- Meniul șablonului #8 oferă Deactivate; nu a fost executat. Meniul formularului avea numai Duplicate/Delete. Nu este demonstrată o opțiune de suspendare a endpointului fără ștergere. A ascunde butonul, a nu distribui linkul, a nu apăsa Done sau a seta No confirmation NU reprezintă blocare sigură a înscrierilor.

### Măsura minimă și aprobarea necesară

Propunere, neexecutată: dezactivarea exclusivă a #8 pentru reducerea riscului de expediere DOI, păstrând formularul, lista și automatizarea. Dezactivarea unui șablon nu demonstrează refuzul POST, absența contactelor pending sau lipsa unui fallback; efectul exact trebuie confirmat de Brevo. Nu se dezactivează alte șabloane/proiecte. Nu se trece la No confirmation, care ar elimina protecția DOI.

Pentru oprire completă fără ștergere este necesară confirmarea/suspendarea server-side a formularului de către Brevo sau un control echivalent oferit de furnizor. Nu s-a găsit o astfel de comandă în interfața observată sau în articolul oficial Create a sign-up form in Brevo. Solicitarea de suport este pregătită separat, nu trimisă. Dezactivarea #8 și trimiterea cererii de suport necesită o singură aprobare consolidată; aceasta NU trebuie să autorizeze vreun test sau reactivare.

### Compatibilitatea welcome — dedusă din dovezi existente

Contractul oficial pentru formular nativ DOI: adăugare în lista aleasă numai după click și DOUBLE_OPT-IN=Yes pentru confirmare dublă. Acestea corespund triggerului listă #4 și filtrului DOI Yes din #1. Condițiile suplimentare rămân: adresa autorizată AND abonare curentă Subscribed; altfel Branch B Exit. Re-entry OFF. OPT_IN al căsuței este un atribut separat de DOUBLE_OPT-IN; bifarea nu înseamnă confirmare DOI. Lipsa API DOI pe această cale evită al doilea flux; codul API rămâne OFF și păstrat.

Nu este dovedită ordinea tranzacțională între actualizarea atributului și trigger. Un contact existent deja în #4 poate să nu declanșeze added-to-list, iar filtrul poate evalua înaintea atributului. Nu se activează re-entry și nu se șterge/recreează contactul pentru mascarea problemei.

### Plan complet de test viitor — NU executat

Prerechizite: endpoint blocat/protejat demonstrabil sau mecanism Brevo cu whitelist reală de destinatari; simpla separare în lista #4 ori Cloudflare Access nu asigură această condiție. Limba română, expeditorul profesional și acordul din DOI trebuie pregătite pe șablonul folosit, fără atingerea altor fluxuri. Politica de confidențialitate trebuie să acopere newsletterul; CAPTCHA/tracking și retenția dovezilor se clarifică. Apoi aprobare separată pentru contactul propriu, modificările lui și activarea temporară #1. Nicio extensie către comunitate.

| Pas | Acțiune aprobată ulterior | Rezultat/evidență cerută |
|---|---|---|
| 0 | Citire stare destinatar, membership #4 și suppression, fără export | Baseline; dacă e deja în listă sau blocat, se oprește pentru adaptarea testului, fără ștergere/unblock |
| 1 | O singură abonare voluntară cu adresa proprie și acord | Cel mult un DOI, zero welcome; contactul nu intră în #4 înainte de confirmare |
| 2 | Click personal pe confirmarea primită | Membership #4, DOUBLE_OPT-IN Yes, abonare curentă corectă, dovezi de consimțământ |
| 3 | Observare #1 cu filtrele existente și re-entry OFF | Exact un welcome #7; fără e-mail final nativ, fără welcome din alt mecanism |
| 4 | Refolosire link DOI și o singură solicitare duplicată | Niciun al doilea welcome sau contact duplicat; dacă DOI se retrimite, se înregistrează separat și se evaluează limitarea frecvenței |
| 5 | Acces la preferințe prin linkul personal din welcome, schimbare minimă aprobată | Persoana și preferințele corecte, fără retrimiterea welcome; nu se dezabonează alte contacte |
| 6 | Dezabonare prin linkul nativ | Starea email devine unsubscribed; schimbarea unei liste nu este suficientă dacă marketingul rămâne permis |
| 7 | Observare suppression și eligibilitate welcome | Filtrul Subscribed refuză persoana; zero mesaje suplimentare. Nicio campanie reală trimisă pentru a proba blocarea |
| 8 | Oprire test și revenire la #1 Inactive / DOI oprit | Se păstrează logurile și dezabonarea; nu se șterge dovada consimțământului și nu se reactivează abonarea |

Buget propus: maximum 2 DOI (inițial + posibil duplicat) și 1 welcome, numai adresei proprii; orice mesaj neașteptat oprește testul. Mesajele suplimentare de preferințe/dezabonare rămân OFF; dovezi prin loguri redactate. Preferințele și dezabonarea modifică efectiv contactul, deci nu sunt incluse în aprobarea de citire/configurare.

### Limite și dovezi

Captură locală: .local/brevo-2026-11-11/native-public-read.png. URL-ul complet și adresa personală nu sunt copiate în documentația versionabilă. Nu s-a modificat configurația Brevo/Cloudflare în această etapă, nu s-a trimis formularul și nu s-au făcut push/deployment. Nu s-au repetat testele Cloudflare. Observațiile de backend rămân netestate.

Surse: https://help.brevo.com/hc/en-us/articles/208771869-Create-a-sign-up-form-in-Brevo ; https://help.brevo.com/hc/en-us/articles/19591451188114-Protect-your-forms-from-bots-and-spam-signups . Documentația prezintă Done ca finalizare, dar nu garantează că publicarea este blocată înaintea lui; observația browserului arată afișarea înaintea lui. CAPTCHA previne abuzuri, nu limitează trimiterea la o singură adresă.

## Direcție de securizare revizuită — 12.11.2026

Decizia Iuliei: NU se dezactivează #8; cererea V1 și recomandarea anterioară de dezactivare sunt depășite și se păstrează numai ca istoric. Cererea curentă este CERERE-SUPORT-SUSPENDARE-FORMULAR-V2.txt, pregătită local, NETRIMISĂ.

Nu s-a identificat o metodă oficială public documentată de suspendare a formularului standard găzduit, fără ștergere și cu păstrarea istoricului. Aceasta este limita cercetării, nu dovada că Brevo nu are un control intern. Se reutilizează observarea meniului Duplicate/Delete; nu s-a repetat verificarea publică sau auditul contului. Funcțiile de ascundere după submit, CAPTCHA, blocare freemail/disposable și protejarea unui site Cloudflare nu suspendă endpointul sibforms.com.

Utilizări #8 — concluzie limitată: este asociat formularului de test. Inventarul anterior verificat avea un singur formular de abonare; welcome #1 utilizează mesajul #7. Căutarea locală arată BREVO_DOI_TEMPLATE_ID necompletat în .env.example și valoarea 2 în exemplul Cloudflare, nu 8. Codul citește ID-ul din mediu, deci nu poate demonstra ce configurări externe există. Nu există o evidență completă used-by pentru toate integrările, formularele de alte tipuri sau apelurile API externe. Reutilizarea #8 în altă parte rămâne NECUNOSCUTĂ; nu se modifică.

Operațiunea externă propusă: un singur ticket din cont, Help (?) → Support and Tickets → Contact your support team → Submit, cu textul V2. Ticketul cere suspendarea strict a endpointului formularului 6af5c20e8646ba0a458ab642 dacă furnizorul confirmă că operațiunea păstrează configurația/istoricul și nu atinge altă resursă. Altfel suportul trebuie să explice alternativa și să aștepte o nouă aprobare. Acțiunea nu a fost executată.

Sursa canalului oficial: https://help.brevo.com/hc/en-us/articles/360020434360-Contact-the-support-team . Cercetarea suplimentară a documentației de formulare și permisiuni nu a identificat o comandă de suspendare a acestui tip de formular; suspendarea unei automatizări sau dezactivarea unui template reprezintă alte funcții.

Criteriul de securizare: confirmare Brevo a blocării atât a accesului/submitului găzduit cât și a trimiterilor directe/embeddingului, fără creare/modificare de contacte ori declanșări de mesaje/automatizări; clarificarea cererilor DOI pending. Un GET nefuncțional singur nu dovedește blocarea POST. Nu se fac POST-uri pentru validare în această etapă.

Planul DOI complet din secțiunea anterioară rămâne pregătit. Continuarea lui este condiționată de securizarea demonstrată, apoi de pregătirea destinatarului autorizat și de o aprobare separată pentru testul real. Nu se reia testul acum, nu se creează alt formular și nu se activează nimic.

## Cerere V2 trimisă cu aprobarea Iuliei — 12.11.2026

Ticket Brevo #5670720: https://help.brevo.com/hc/en-us/requests/5670720 . UI a confirmat Your request was successfully submitted; status Open, creat 12.11.2026, 16:23 conform interfeței. Un singur Submit; nu s-a retrimis la întârzierea observației.

Textul V2 a fost trimis din contul existent, fără atașamente, parole, chei, exporturi de contacte sau adresa destinatarului de test. Permisiunea transmisă către suport: suspendare numai pentru endpointul formularului 6af5c20e8646ba0a458ab642, dacă păstrează configurația/istoricul și nu afectează alte resurse. Fără modificarea/dezactivarea #8 sau altor șabloane. Soluțiile cu efecte mai largi necesită o nouă aprobare. Nu s-a trimis prin formularul newsletter și nu s-a activat niciun test.

Cererea de suport este înregistrată, NU reprezintă confirmarea suspendării. Formularul rămâne cu ultima stare publică observată până la confirmarea furnizorului. Așteptăm răspunsul în același ticket; nu se creează duplicate. Pregătirea testului DOI rămâne condiționată de securizare și de o aprobare separată pentru trimitere/activare/contactul propriu. Nicio schimbare la site, Cloudflare, GitHub sau automatizări.

Dovadă locală: .local/brevo-2026-11-11/support-ticket-5670720.png . Cererea V2 locală se păstrează ca text trimis; mențiunile anterioare NETRIMISĂ sunt istoric.

## Limitare suplimentară transmisă în același ticket — 12.11.2026, 16:26 UI

Iulia a confirmat că intervenția trebuie să fie temporară, reversibilă și precedată de confirmarea explicită Brevo a limitării la formularul de test. Precizarea a fost trimisă în ticket #5670720, comentariu 40692866302226. UI: Your reply was successfully added. Nu s-a creat alt ticket.

Textul transmis: solicităm blocare TEMPORARĂ și REVERSIBILĂ numai pentru formularul 6af5c20e8646ba0a458ab642 și endpointurile sale; suportul trebuie să confirme explicit înaintea intervenției păstrarea formularului, configurației și istoricului și lipsa efectelor asupra altor formulare, șabloane, liste, contacte și automatizări. Fără modificarea șablonului 8 sau automatizării 1. Dacă nu pot garanta limitarea și reversibilitatea, NU intervin și prezintă alternativa. Fără înscrieri sau mesaje de test.

La ultima verificare: ticket Open, două comentarii trimise de titulară, niciun răspuns de la suport. Suspendarea nu este confirmată. Pregătirea locală a testului rămâne disponibilă; nu se execută înaintea securizării demonstrate și a unei aprobări separate. Urmărirea răspunsului în același ticket este autorizată; nu sunt autorizate noi efecte externe în afara mandatului limitat.

Dovadă locală: .local/brevo-2026-11-11/support-ticket-5670720-scope.png. Site-ul oficial, Cloudflare, GitHub, șabloanele, automatizările și contactele nu au fost modificate de această etapă.
