# Newsletter DOI API — decizia curentă, 13.11.2026

**Decizia Iuliei: un singur mecanism ales, DOI API Brevo.** Înlocuiește pentru lucrările viitoare decizia formularului nativ din 12.11.2026. Codul, formularele, șabloanele și dovezile istorice se păstrează; nimic nu a fost modificat în conturi. Cloudflare rămâne OFF. Nu este aprobare de expediere/deployment/activare.

## Proveniența dovezilor

Iulia a transmis răspunsul reprezentantei Brevo Tanishka Gupta din 13.11.2026, tichet #5670720: POST contacts/doubleOptinConfirmation trimite DOI, adaugă în includeListIds numai după confirmare, setează DOUBLE_OPT-IN=Yes după confirmare și permite triggerul Contact added to a list. Înainte de click nu adaugă în acele liste. **Confirmare a furnizorului conform răspunsului transmis de Iulia; nu un test real în acest cont și nici o recitire independentă a tichetului în această etapă.**

Același răspuns: un singur formular găzduit nu poate fi suspendat temporar; editarea/ștergerea sunt alternative, neautorizate aici. URL-ul rămâne accesibil chiar dacă nu este integrat/distribuit. Brevo nu a modificat contul; lista #4 avea zero contacte la verificarea lor, nu este o numărătoare actuală efectuată de noi.

[Referința API oficială](https://developers.brevo.com/reference/create-doi-contact), recitită 13.11.2026, documentează email, includeListIds, templateId, redirectionUrl, atributele existente și params.DOIurl. Nu descrie explicit în schema endpointului setarea atributului personalizat DOUBLE_OPT-IN sau ordinea atomică dintre atribut și trigger. Dovada acestor detalii vine din răspunsul suportului; sincronizarea efectivă în automatizarea noastră trebuie testată.

## Inventarul ID-urilor — fără schimbări arbitrare

| Resursă | Rol corect / dovadă |
|---|---|
| Lista #4 | singura destinație pentru viitorul test API; TEST_MODE=true + TEST_BREVO_LIST_ID=4 + allowlist server-side a adresei proprii |
| Lista #3 | comunitate în codul normal și documente istorice; nu este destinație de test și nu se schimbă/activează acum |
| Șablon #2 | COM-01-API, cu params.DOIurl; candidatul API existent. Ultima stare documentată Inactive; trebuie reverificat în citire înaintea unei activări controlate |
| Șablon #6 | alternativă nativă cu doubleoptin, incompatibilitate observată în selectorul nativ; nu se investește în el și nu se folosește ca șablon API |
| Șablon #8 | implicit al formularului găzduit; engleză/expeditor personal în ultima verificare. Nu se dezactivează, nu se reutilizează automat pentru API |
| Automatizarea #1 | welcome unic, ultima stare verificată Inactive; trigger lista #4, filtre AND adresă proprie + DOUBLE_OPT-IN=Yes + Email campaigns subscriptions=Subscribed; re-entry OFF |
| Mesaj #7 / șablon sursă #3 | mesajul din acțiunea welcome #1, respectiv șablonul său sursă; nu sunt două automatizări sau două welcome de activat |
| Șabloane #4 / #5 | conținut preferințe / dezabonare; linkuri native Brevo, nu încă două automatizări de trimis |
| Formular găzduit existent | ID 6af5c20e8646ba0a458ab642; păstrat neschimbat și neintegrat. Nu se distribuie URL-ul |

Documentele vechi care spun API/lista #3 sau „API neales / folosește formularul #6” sunt istoric. Nu se deduce că #6 este valid pentru API sau că #7 este ID de șablon DOI. Toate ID-urile au rămas neschimbate în cod/configurația live.

## Flux și responsabilități

Solicitare explicită + consimțământ + Turnstile → claim D1 → POST Brevo DOI #2/lista #4 în test → click DOI → Brevo confirmă atributul/lista → automatizarea #1 verifică eligibilitatea curentă → un welcome #7 → linkuri native preferințe/dezabonare → suprimare Brevo.

- `infrastructure/api.mjs`, ruta POST /api/community, apelează `requestDoi` din `infrastructure/brevo.mjs`; includeListIds vine din doiList. Nu adaugă direct contactul la listă, nu setează DOUBLE_OPT-IN și nu trimite welcome. Redirectul confirmare=brevo nu este dovadă server-side de confirmare.
- Testul omite atributele de profil: nu suprascrie profilul global al proprietarei. În modul normal sunt trimise doar PRENUME opțional și metadatele solicitării de consimțământ, nu dovada confirmării.
- DOI_CLAIM_SQL este acum un singur INSERT condiționat atomic, cu verificare rolling 24h, inclusiv la trecerea dintre zile UTC. Timeout, 5xx sau confirmare de transport ambiguă păstrează pending; răspunsul 4xx definitiv păstrează failed. Nici pending, nici submitted nu înseamnă abonare confirmată. Fără retry automat; o nouă solicitare explicită după fereastră poate genera alt DOI, nu este deduplicare pe viață.
- Unicitatea welcome este responsabilitatea automatizării #1, re-entry OFF și filtrelor native, nu a claimului D1. Nu există un al doilea sender welcome sau un cron de reabonare. Nu se folosesc operații de unblock/blacklist=false pentru a evita dezabonarea.
- Preferințele și dezabonarea rămân native Brevo. Nu construim o bază D1 paralelă de consimțământ confirmat, un nou endpoint unsubscribe sau un webhook nesemnat. Suprimarea curentă și eventualele mesaje deja programate trebuie verificate efectiv: nu se declară implementare complet testată doar pentru că linkurile apar în șablon.

## Matricea stării

| Element | Confirmat furnizor | Implementat / configurat | Test local | Cloudflare / real |
|---|---|---|---|---|
| API DOI + liste după click + Yes | răspunsul transmis | endpoint și payload existente; atributul nu este fabricat în cod | payload mock verificat | DOI real netestat |
| Dedupl. cereri / erori ambigue | nu promisiune Brevo | claim atomic și pending conservator | 5 cazuri noi + 3 regresii trecute | schimbările noi nu sunt publicate |
| Welcome unic | trigger posibil conform suportului | #1 configurată istoric, INACTIVĂ; filtre/re-entry existente | nu se poate valida execuția automatizării local | netestat în cont |
| Preferințe / unsubscribe / suprimare | funcții native alese | linkuri în mesajele existente | fără simulare prezentată drept provider real | persistența și oprirea reală a mesajelor netestate |
| Evenimente / D1 | independent de DOI | schema și API existente | dovezi locale anterioare | 6 migrații, 8 scenarii D1 și restaurare deja trecute; mediu OFF |
| Admin browser | independent | panou privat pregătit | testele locale anterioare păstrate | autentificare+POST end-to-end neconfirmate, control browser blocat anterior |

Build Worker API offline reușit în director nou `.local/newsletter-api-2026-11-13/`; artefactele cloud aprobate anterior nu au fost rescrise. Nu se repetă testele D1, exporturilor, 24/24 sau 9/9 istorice. Nicio migrație nouă nu este necesară pentru corecția DOI.

## Planul testului real — numai pregătit

Preflight în citire: stări curente #2/#1/#7, listele exacte, limba română și expeditorul profesional autentificat; params.DOIurl; politica de confidențialitate; identitatea proprietarei în allowlist numai server-side; istoricul global al adresei de test. Verifică păstrarea filtrelor și re-entry OFF. Nu activa un mesaj final separat.

1. Solicitare API numai cu adresa proprie autorizată. Un DOI, zero welcome înainte de click. Verifică lista #4 și istoricul Brevo; nu deduce starea doar din contactul global sau redirect.
2. Cerere repetată/concurentă în fereastra de deduplicare: niciun DOI suplimentar al API-ului; simulează erorile numai local. Nu provoca artificial erori reale ale furnizorului.
3. Confirmare: dovadă în istoricul DOI, apartenența la #4, DOUBLE_OPT-IN=Yes și Subscribed; exact un welcome #7. Verifică ordinea atribut/trigger, fără a activa re-entry ca să maschezi o problemă.
4. Click DOI repetat și solicitare duplicată: zero welcome suplimentare. Pentru o nouă solicitare explicită după 24h verifică separat politica DOI; nu presupune că providerul deduplică definitiv.
5. Preferințe: linkul nativ se rezolvă pentru destinatar, alegerea se salvează și nu dezabonează/reabonează neintenționat; nu publica tokenul linkului în raport.
6. Dezabonare: starea nativă este suprimată; nu rulează welcome restant și nu se trimite marketing. Nu goli blacklist-ul și nu reabona automat pentru „restaurarea” testului. O eventuală reabonare se testează doar ca solicitare explicită nouă, cu consimțământ și aprobare separate.

Oprire la orice destinatar diferit, welcome prematur/duplicat, schimbare globală neașteptată, pierderea Access/allowlist sau loguri care nu permit atribuirea sursei. Dezactivarea automatizării nu poate retrage un e-mail deja trimis; verifică și coada providerului. Preferințele/dezabonarea pot afecta contactul la nivelul întregului cont, nu numai lista #4.

**Risc rezidual nerezolvat:** formularul nativ deja găzduit are URL public, iar Brevo nu poate suspenda doar acel formular. Alegerea API nu îl dezactivează. Nu se poate garanta izolarea absolută a listei #4 cât timp acel endpoint există. Nu se activează implicit automatizarea doar pe baza acestui raport; filtrul strict al destinatarului protejează welcome, dar nu suspendă formularul sau DOI-ul său. Orice editare/ștergere a formularului este o decizie externă separată, neexecutată.

## Evenimente, programări, încasări și efort rămas

Nu reconstruim D1. Următorul test nou este end-to-end al aplicației private: login Access, consultare/paginare, Origin/Bearer greșite, anulare prin API/UI, pregătire coadă fără dispatch, latențe p95/p99 și erori 429/503 cu concurență limitată. `VALIDARE-IN-BROWSER.js` rămâne procedură de referință, nu se execută în starea OFF și nu se folosește cu marcajul vechi. Necesită configurare privată și deployment aprobate separat; noindex pentru noul Worker trebuie citit în sesiunea autorizată. La browser indisponibil: NEEXECUTAT, fără încercări repetitive.

Programări: Google Calendar Appointment Schedules rămâne sistemul unic, consultație gratuită 30 min, notificări Google native. URL-ul și setările efective nu sunt încă demonstrate în documentația verificată; nu construim alt calendar. Rămân verificarea disponibilității/fusului orar, linkului și anulării/reprogramării.

Plăți/facturare: numai pregătirea existentă, inactivă. Datele firmei/KYC, prețurile/politicile, contractele, contabilul, un emitent SmartBill și obligațiile e-Factura/SPV rămân în ACTIVARE-DUPA-INFIINTAREA-FIRMEI.md. Nu se inventează date sau termene și nu se activează transporturi fiscale.

Estimare de lucru tehnic rămas, condiționată de acces stabil și decizii: 4–8 ore newsletter (configurație verificată + test controlat), 4–8 ore evenimente/admin end-to-end și erori/volum redus, 1–2 ore verificarea programărilor existente. Total orientativ 9–18 ore tehnice, plus timpul de așteptare/aprobări și remedieri descoperite. Lansarea încasărilor nu are o dată responsabilă înaintea firmei, KYC și validării contabile; integrarea live necesită o estimare separată după completarea acelor date. Nu se declară sistemul complet funcțional sau 100% pregătit pentru creștere pe baza testelor SQL.
