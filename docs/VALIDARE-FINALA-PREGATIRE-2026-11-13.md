# Etapa finală de validare — pregătire locală, 13.11.2026

**Nicio autorizare externă nouă nu a fost executată.** Cloudflare rămâne în ultima stare OFF verificată; nu s-au recitit conturile în această etapă. Fără deployment, e-mailuri, automatizări, GitHub sau modificări de producție. Ramură: pregatire-infrastructura-email-plati. Istoricul nu este înlocuit.

## 1. Diferența backupurilor: verificare efectivă

Au fost recalculate toate hashurile din ambele manifeste, fără erori:

| Backup | Surse | Dovezi cloud | Proceduri | Artefact privat | Total |
|---|---:|---:|---:|---:|---:|
| cloud-validation-executed-2026-11-13-1794576057555 | 291 | 9 | 10 | 11 | 321 |
| newsletter-api-2026-11-13-1794576557305 | 294 | 0 | 0 | 0 | 294 |

**321 − 30 + 3 = 294.** Cele trei surse noi sunt raportul DOI API din 13.11, decision-api-2026-11-13.json și qa/doi-continuation.test.mjs. Zero surse absente în backupul nou; 13 surse au versiuni modificate, păstrate și în backupul anterior. Cele 30 de dovezi/proceduri/fișiere compilate nu au fost șterse: sunt în backupul de 321. Backupul de 294 este un snapshot al surselor, nu înlocuitorul integral al arhivei cloud. Numărătorile nu includ fișierul backup-manifest.json însuși. Comparația exactă: `.local/final-validation-2026-11-13/backup-comparison.json`.

## 2. Browser și aplicație privată

Reutilizează planul cloud, panoul, D1 existent și scenariul `docs/cloud-validation/VALIDARE-IN-BROWSER.js`; nu îl executa acum și nu crea alt script de consolă. Aliasul actual servește artefactul OFF, nu panoul de validare. Vechiul deployment are marcajul D1 blocat. A deschide doar vechiul URL nu demonstrează că aplicația nouă funcționează.

Precondiții pentru viitoarea execuție: cont/proiect exacte, lipsă conflicte Preview, Access principal+wildcard numai pentru proprietară, AUD și identitate verificate, D1 existent confirmat prin UUID, export/bookmark proaspete, secrete administrative noi și marcaj nou. Nu restaura automat vechile credențiale. Configurația Preview este comună Preview-urilor proiectului. Fără modificări Production.

Acceptare browser: login personal Access fără extragere cookie/token; încărcare panou, consultare/paginare cu cod administrativ păstrat în memorie; POST autorizat și refuzul codului/Origin greșite; anulare sintetică repetată; pregătire coadă cu sent=0 și dispatch refuzat. Verifică în Network răspunsul efectiv X-Robots-Tag noindex,nofollow,noarchive/no-store, nu doar fișierul sursă. Nu se dezactivează Access. La indisponibilitate de control: o verificare a stării, apoi NEEXECUTAT; fără bucle de încercări sau timp îndelungat de așteptare. Se poate oferi procedura existentă Iuliei pentru execuție personală și capturi fără secrete.

## 3. Brevo: un singur DOI și un welcome

Planul detaliat rămâne `brevo-pregatire/DOI-API-CONTINUARE-2026-11-13.md`. Nu este încă test real. ID-uri: lista #4, șablon API candidat #2, automatizare #1, mesaj welcome #7 provenit din șablonul #3. Verifică actualele dependențe/stări/expeditor/autentificare și limba română în citire înainte de orice activare; nu activa automat #2 dacă este folosit neprevăzut în alte fluxuri.

Instrument nou de pregătire: `tools/validation/controlled-doi.mjs`. Fără argumente: preparedOnly, zero rețea/zero e-mailuri. Viitoarea trimitere ar necesita simultan --send, BREVO_CONTROLLED_TEST_APPROVED=true, TEST_MODE=true, lista #4, șablon #2, EMAIL_SEND_ENABLED=false, LIVE_PAYMENTS_ENABLED=false, originea HTTPS izolată și potrivirea hashului destinatarului cu profilul privat autorizat. Cheia și adresa sunt numai în configurația privată, fără afișare. Codul reutilizează requestDoi, nu creează alt mecanism DOI.

O singură tentativă reală DOI pentru această etapă: claim exclusiv în `.local/final-validation-2026-11-13/controlled-doi-attempt.json` înainte de rețea; rămâne păstrat și dacă răspunsul este ambiguu. Nu îl șterge pentru a încerca din nou. Orice nouă tentativă necesită verificarea logurilor și aprobare separată. Acest registru este al testului local, nu o bază paralelă de consimțământ și nu o simulare a confirmării Brevo.

Testul poate porni direct din codul local către Brevo după aprobare; nu necesită publicarea newsletterului. Acesta validează integrarea providerului. Fluxul complet formular web → API/Turnstile este o verificare distinctă, neacoperită de apelul direct.

Ordine și criterii:

1. Snapshot în citire al listei #4, stării globale a adresei proprii și automatizării. Re-entry OFF; filtre AND adresa proprie + DOUBLE_OPT-IN=Yes + Email campaigns subscriptions=Subscribed; nicio altă acțiune welcome/final confirmation activată.
2. După aprobare: cel mult un DOI API. Înainte de click: niciun welcome, nicio apartenență nouă la lista #4; contactul global existent nu dovedește confirmarea. Nu seta manual atributul Yes și nu adăuga manual contactul în listă.
3. Confirmare personală în Inbox: urmărește istoricul DOI, apartenența #4, Yes, Subscribed și ordinea atribut/trigger. Exact un welcome #7. Click repetat pe confirmare: niciun welcome suplimentar. Duplicatele concurente/timeout/zi UTC au dovezi locale existente, nu se provoacă erori reale ale furnizorului.
4. Preferințe: deschide linkul nativ al destinatarului, salvează o alegere minimă și reverifică persistența. Nicio reabonare implicită. Nu păstra URL-urile personalizate în raport.
5. Dezabonare: salvează retragerea, verifică starea suprimată, automatizarea și eventuala coadă. Verifică că nu există execuție welcome restantă; nu trimite un mesaj suplimentar „de probă”. Oprirea unei campanii viitoare este verificată prin stare/loguri, nu garantată printr-un send neautorizat. Nu goli blacklist-ul și nu reabona adresa automat la final.

Buget propus spre aprobare: **maximum un DOI și un welcome**, numai către adresa proprie autorizată; zero campanii și zero alte notificări. Eventualele e-mailuri automate ale formularelor de preferințe/dezabonare trebuie identificate în preflight; dacă nu pot fi oprite în limitele aprobate, nu se execută acea etapă fără o decizie suplimentară. Efectele preferințelor/dezabonării pot fi globale în cont. Dezactivarea automatizării nu retrage mesajele deja trimise.

Risc nerezolvat: formularul găzduit existent are URL public și nu poate fi suspendat individual conform răspunsului Brevo transmis de Iulia. Nu îi distribuim URL-ul, nu îl modificăm/ștergem. Allowlist-ul API și filtrul welcome nu suspendă acel endpoint. Înaintea testului, verifică istoricul sursei și oprește la orice activitate neatribuită testului. Izolarea absolută a listei nu poate fi declarată doar din configurarea API.

## 4. Performanță: pregătire, nu benchmark efectuat

Reutilizează API-ul evenimentelor și baza izolată. Nu repeta cele 8 scenarii SQL cloud. Noul obiectiv este costul întregii cereri HTTP și al autentificării, nu încă o demonstrație a triggerului SQLite.

`tools/validation/performance.mjs` este un măsurător fără transport implicit: trebuie injectat explicit apelul aprobat. Nu citește corpuri/PII sau credențiale, produce doar statusuri agregate și p50/p95/p99. Concurență permisă 1/3/6, cel mult 120 cereri/lot, fără retry; o eroare neașteptată oprește lansarea cererilor noi, cele deja în zbor pot termina. Niciun apel real nu a fost injectat/executat aici.

Scenarii noi pregătite: citire administrativă/paginare cu măsurare; înscriere validă cu măsurare completă; duplicate și capacitate la nivel HTTP; anulare concurentă cu o înscriere; refuz 429 și revenire după fereastra naturală; eroare/timeout și verificarea stării înaintea oricărei retrimiteri. Nu provoca artificial indisponibilitate în cont sau încărcare agresivă. Pentru înscrieri începe cu loturi de 1, 3 și 6 cereri (10 în total/fereastră/IP); a 11-a este un test separat cu 429 așteptat. Nu șterge rate_limits și nu falsifica IP-ul pentru a masca throttlingul.

Înregistrări sintetice numai example.invalid, fără e-mailuri de eveniment (EMAIL_SEND_ENABLED=false, dispatch blocat). Profilul cu mai multe adrese sintetice pentru evenimente trebuie separat de restricția strictă a destinatarului DOI, fără relaxarea acesteia. **Wrapperul cloud actual interzice /api/register, /api/community și secretele Turnstile/Brevo.** Pentru testele HTTP de înscriere este necesar un pachet privat revizuit și verificat local, cu autentificare/allowlist obligatorii și configurarea Turnstile pentru originea izolată; nu este suficient schimbarea unui flag și nu este autorizat deploymentul acum. Nu se folosesc chei de producție și nu se testează dezactivând verificarea anti-bot pe un endpoint public.

Se colectează latențe HTTP separat de durata SQL/metadatele D1, erori 429/503, rânduri citite/scrise, CPU/cote Free. Loturile mici au percentile descriptive, nu p99 credibil sau SLA. Pragul de acceptare pentru timpi trebuie stabilit înaintea benchmarkului; nu inventăm o promisiune de suport pentru trafic mare. Oprire la supraocupare, date reale, provider call nepermis, timeout repetat, creștere neașteptată a costurilor sau conflict Preview. Fără upgrade.

## 5. Dovezi noi și acțiuni externe consolidate

6 teste locale noi trecute în qa/final-validation-preparation.test.mjs (2 cazuri relevante reverificate după adăugarea protecției de identitate). Sunt teste ale instrumentelor/limitelor, nu dovezi că Brevo trimite corect sau că aplicația cloud funcționează. Modul implicit al utilitarului DOI a fost rulat: not_executed, zero emailRequested. Backupurile 321/294 au fost verificate integral. Nu s-au repetat testele de business/Cloudflare deja confirmate.

După definitivarea pachetului privat pentru HTTP, este necesară o singură aprobare consolidată pentru:

1. **Cloudflare privat:** reconfigurare temporară exclusiv Preview pe er-brevo-test-izolat, reutilizarea D1 existent cu snapshot/bookmark și marcaj nou, credențiale administrative noi, Access păstrat; un deployment al pachetului revizuit și teste browser/API autorizate. Configurarea Turnstile izolată numai dacă verificarea HTTP o impune; nicio resursă/permisiune suplimentară fără prezentare explicită.
2. **Brevo controlat:** verificări finale în citire, apoi numai activarea temporară necesară șablonului API #2 și automatizării #1 în limitele demonstrate; un DOI și un welcome către adresa proprie. Nu activa dacă dependențele/filtrele sau riscul formularului public nu permit testarea în limitele aprobate.
3. **Confirmare, preferințe, dezabonare:** acțiuni personale pentru adresa de test și verificarea istoricului/suprimării, acceptând efectul posibil asupra profilului global. Fără contacte reale din comunitate/importuri/reabonare automată.
4. **Performanță și închidere:** loturile HTTP limitate, date sintetice și măsurători, export/restaurare D1, oprirea testului Brevo, restaurarea exactă a configurației OFF și, dacă este necesar, redeploymentul sigur al artefactului OFF; verificarea Access și păstrarea tuturor dovezilor. Nu șterge resurse/dovezi și nu modifica producția.

Aceasta este lista operațiunilor viitoare, **nu aprobarea sau execuția lor**. Pachetul cloud pentru înscrieri HTTP și verificarea stabilității browserului rămân condiții de pregătire; nu se solicită încă aprobarea unui pachet nedefinit și nu se declară testele finalizate.


### Profil HTTP/Turnstile pregatit local — 13.11.2026

Raport: `docs/cloud-validation/HTTP-TURNSTILE-LOCAL-2026-11-13.md`. Pachet nou de 13 fisiere, build offline, reutilizare D1 existent si zero migratii noi. 7 teste noi + 3 regresii relevante trecute; browser local: 8 verificari, Access/Turnstile simulate, zero cereri externe. Profilul pastreaza JWT Access + Bearer + Origin + marcaj D1, adrese sintetice/evenimente gratuite si expirare maximum o ora. Brevo ramane separat: maximum un DOI/un welcome numai cu aprobare ulterioara. Pachetele vechi si documentele sunt pastrate. Niciun deployment/mesaj/activare in aceasta etapa; Cloudflare ramane OFF.
