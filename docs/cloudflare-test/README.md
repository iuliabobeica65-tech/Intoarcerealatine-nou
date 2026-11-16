# Profil izolat pregătit local, fără resurse externe

Fișierul wrangler.jsonc.example este un model nefuncțional, cu identificator D1 invalid intenționat și origine .invalid. Nu este wrangler.jsonc la rădăcină, nu este încărcat automat și nu se execută pentru publicare. Nu au fost create resurse.

Pentru un mediu aprobat: proiect separat de producție și de proiectul vechi exclus, fără domeniul public; acces restrâns verificat inclusiv la /api/* și binding DB către o bază nouă goală. Verifică fiecare alias pages.dev: blocarea domeniului iuliabobeica.ro din cod nu dovedește că un alias pages.dev nu este de producție. Niciun push până la verificarea integrărilor Git și aprobare.

Migrări: 0001.sql → 0002-smartbill.sql → 0003-lifecycle.sql → 0004-invoice-refund.sql, numai pe DB de test. Adaptorul SQLite local le execută pe toate și verifică constrângeri și triggere; nu certifică D1 în cont. Închide endpointurile până la finalizarea migrărilor.

TEST_MODE=true și TEST_RECIPIENT_EMAIL configurat privat sunt obligatorii pentru testul controlat. Dacă modul este omis sau false, profilul normal nu aplică restricția destinatarului. Codul respinge lipsa adresei/valoarea invalidă în modul true și moduri scrise greșit. Restricția se aplică solicitărilor comunitate/eveniment înainte de scrieri și verificării Turnstile, apoi din nou la frontiera Brevo; blochează destinatari multipli, CC/BCC și operații Brevo nepermise. Nu publică adresa în /api/config. Nu substituie autentificarea și protecția mediului.

Secrete private: TEST_RECIPIENT_EMAIL, BREVO_API_KEY, TURNSTILE_SECRET, DATA_HMAC_KEY, ADMIN_TOKEN. Cheia publică Turnstile este singura cheie destinată browserului. Nu lipi valori în comenzi, chat, capturi, Git sau rapoarte. Nu crea și nu extinde accesul fără aprobare. Nu copia secretele, datele sau DB din producție.

Verificare offline: node scripts/check-isolated-config.mjs în contextul unde variabilele sunt injectate securizat. Nu citește .env automat și nu accesează rețeaua. Afișează doar nume și rezultate, niciodată valori. Lipsa configurației produce exit 1, cum este de așteptat aici. Chiar configurationPass=true nu certifică bindingul D1, migrările, protecția accesului, Turnstile real, contul Brevo sau aprobarea activării; acestea rămân externalEnvironmentVerified=false și activationAuthorized=false. Nu activa automat nimic pe baza acestui rezultat.

## Compatibilitate de plan — documentație consultată 9 noiembrie 2026

Pages Functions consumă cota Workers; Free are 100.000 solicitări zilnice comune. [Sursă](https://developers.cloudflare.com/pages/functions/pricing/). D1 Free: 50 interogări per invocare, 500 MB per DB, 10 baze și 5 GB total. [Limite D1](https://developers.cloudflare.com/d1/platform/limits/). În această continuare, dispatch este limitat la 10 joburi, iar planificarea la 10 remindere noi per apel. Simularea verifică bugetul de apeluri D1 sub 50 și progresul lotului următor fără duplicate. Numărul de rânduri citite/scrise, CPU, cotele zilnice și triggerele reale necesită măsurare în D1. Nu se declară compatibilitate completă de performanță doar pe baza SQLite.

Turnstile Free oferă widgeturi și verificări pentru testare; hostname-ul trebuie configurat exact. [Planuri](https://developers.cloudflare.com/turnstile/plans/). Nu folosi chei de test care ocolesc provocarea pe un mediu public. Nu a fost verificat planul efectiv Cloudflare, consumul sau disponibilitatea resurselor contului. Nu s-a făcut upgrade.

Oprire: COMMUNITY_ENABLED=false, toate celelalte flags păstrate false, șablon #2 readus Inactive dacă a fost activat pentru test. Mesajul livrat, istoricul și efectele unui link deja emis nu sunt reversibile prin simpla oprire. Nu șterge contacte și nu modifica suprimări automat.

Actualizare 10 noiembrie: pentru modul izolat este obligatoriu și TEST_BREVO_LIST_ID=4 (lista goală verificată în Brevo); lista 3 și combinațiile de liste sunt respinse. Vezi ../brevo-pregatire/CONTINUARE-2026-11-10.md. Acest model nu este încă o configurație runtime funcțională.

## Audit în cont — 11 noiembrie 2026

Confirmat în UI: producție pregatire-cloudflare-2026-10-20, deploy automat activ; Preview All non-production branches, fără variabile/secrete și fără bindings. Preview access oferă Restrict previews, încă neaplicat. Un push pe ramura de test produce Preview public, deci nu este mediu privat de test Brevo.

Inventar Workers & Pages: numai intoarcerealatine-nou și intoarcerea-la-tine-campanii (No Git connection). Nu există proiect separat de test în acest inventar. Pagina indică necesitatea Set up Zero Trust înainte de Access; onboarding deschis afișează Choose a plan, Free $0/seat/month (50 seats), Standard $7 și Enterprise. Nu s-a ales planul, creat proiect, DB, politică, cheie sau binding. S-a cerut Iuliei selectarea exclusiv Free și oprirea la card/plată/termeni. Inițializarea Zero Trust nu înseamnă că accesul privat este deja protejat; viitoarea politică și toate aliasurile/API trebuie verificate înainte de configurarea trimiterii.

### Proiect gol confirmat în cont

Iulia a aprobat explicit numai crearea proiectului gol er-brevo-test-izolat, fără Git/upload/deployment/secrete/e-mailuri, apoi a realizat crearea manual când controlul filei a expirat. Verificat în UI pe 11 noiembrie: proiectul apare în inventar cu No Git connection, iar Deployments afișează Create your first deployment. Prin urmare are 0 deployments; nu există încă site de test funcțional sau protecție Access verificată. Numele rezervat este er-brevo-test-izolat.pages.dev. Zero Trust overview a confirmat planul Free după inițializarea efectuată de Iulia; datele cardului nu au fost inspectate. Nu s-au creat politici Access, DB sau chei. Dovezile rămân locale. Această confirmare înlocuiește inventarul anterior cu numai două proiecte; nu autorizează publicarea.

### Access — configurare parțială salvată, 11 noiembrie

Iulia a aprobat explicit protejarea adresei principale și Preview-urilor exclusiv pentru adresa proprie autorizată. Restrict previews a generat aplicația f362f320-f2d7-483d-82b8-27470b09a789, cu politica legacy b14129a8-a7f5-4059-84d7-62343e1f985b. Dialogul politicii a confirmat o singură regulă Include → Emails → adresa proprie autorizată (valoare omisă din Git), utilizată de o singură aplicație; login One-time PIN. Rezumatul generic All authenticated users nu descrie singur conținutul regulii.

Conform procedurii oficiale https://developers.cloudflare.com/pages/platform/known-issues/#enable-access-on-your-pagesdev-domain, aplicația a fost redenumită ER Brevo test izolat - adresa principala și wildcardul eliminat. Salvarea confirmată prin Application successfully configured și inventarul cu destinația exactă er-brevo-test-izolat.pages.dev. Următorul pas, reactivarea Restrict previews pentru wildcard, nu este încă verificat: fila Pages s-a întrerupt. S-a cerut ajutorul Iuliei pentru acest buton. NU considera Preview-urile protejate complet până nu există și este verificată a doua destinație *.er-brevo-test-izolat.pages.dev cu regula corectă. Nu există deployment, secrete sau DB; protecția pe rețea/API și loginul real rămân netestate. Proiectul oficial nu a fost modificat.

### Ambele destinații Access confirmate

După apăsarea Restrict previews de către Iulia, inventarul Access a confirmat două aplicații distincte: adresa principală er-brevo-test-izolat.pages.dev (aplicația f362f320-f2d7-483d-82b8-27470b09a789, politica b14129a8-a7f5-4059-84d7-62343e1f985b) și Preview *.er-brevo-test-izolat.pages.dev (aplicația 3483e2b4-6eba-4676-93c8-b859dc446e5e, politica 4a2fb560-b84c-489d-8d2e-63541691f0f3). Politica Preview a fost deschisă: exact o regulă Include → Emails → numai adresa proprie autorizată, folosită de o aplicație. Regula adresei principale fusese verificată separat. Nu există bypass ori Service Auth observat în tabelele acestor aplicații. Aceasta încheie verificarea configurației salvate, NU testarea protecției pe rețea/API. Proiectul nu are încă deployment; loginul real, respingerea vizitatorilor neautorizați și verificarea tuturor aliasurilor necesită un deployment separat aprobat, inițial fără secrete și cu toate operațiunile externe oprite. Nu activa Brevo pe baza acestei verificări.

### Pregătire deployment OFF — 11 noiembrie

Wrangler oficial 4.160.0 executat din npm. Compilare locală reușită: pages functions build functions --outdir .local/brevo-2026-11-11/worker-off --compatibility-date 2026-11-11. Worker index.js rezultat: 73.696 bytes. Configurație locală ignorată wrangler.off.json: proiect er-brevo-test-izolat, origine proprie, TEST_MODE=true, lista 4; toate cele șase flags externe false, billing mock, invoice sender none, template allowlist goală; fără bindings ori secrete. Nu este configurația proiectului oficial și nu a fost publicată.

Wrangler whoami indică lipsa autentificării CLI. S-a cerut aprobarea separată pentru OAuth cu account:read, user:read, pages:write; ultima permisiune este la nivel de cont, nu limitată tehnic la proiect. Nu s-a inițiat login, nu s-a creat token și nu s-a făcut deployment. Permisiunile D1, DNS, KV, email și Turnstile nu au fost solicitate. Nu încărca doar folderul functions din browser: Direct Upload UI nu îl compilează. Sursa oficială: https://developers.cloudflare.com/pages/get-started/direct-upload/.

### Limite OAuth și oprire înainte de deployment

Iulia a aprobat account:read, user:read, pages:write și explicit offline_access. Prima sesiune OAuth a expirat fără cod de autorizare; nu este dovadă de login reușit. Autorizarea a fost reinițiată, cu log privat ignorat. Ultima instrucțiune cere numai autentificare și verificări fără modificări; niciun deployment până la prezentarea exactă a pachetului și aprobare separată.

Documentația oficială https://developers.cloudflare.com/workers/authorization/workers/ și https://developers.cloudflare.com/fundamentals/api/reference/permissions/ descrie Pages Write pentru crearea/modificarea/ștergerea proiectelor și conținutului Pages, la nivel de cont. Nu a fost găsită o restricție documentată la un singur proiect Pages. Un API token cu Pages Write în același cont nu constituie izolare pe proiect; per-Worker roles nu se aplică Pages. Alternativă cu izolare administrativă: cont Cloudflare separat pentru test, ceea ce ar necesita resurse și configurare noi și nu s-a făcut. OAuth nu reprezintă selectarea tehnică a unui proiect; fiecare operațiune ulterioară trebuie să indice explicit er-brevo-test-izolat și contul verificat. Nu se rulează comenzi de scriere asupra altor proiecte. Nu se solicită alte permisiuni și nu se stochează secrete în Git sau chat.

### Diagnostic callback OAuth, fără autentificare nouă

După ce Iulia a apăsat Authorize și browserul a afișat ERR_CONNECTION_REFUSED la localhost, verificările au confirmat: sesiunea login închisă cu exit 1, log AUTH_LOG_EXPIRED, niciun listener TCP pe 8976 la momentul auditului și whoami CLI_NOT_AUTHENTICATED. Nu se presupune autentificare din simpla apăsare Authorize. Expirarea și absența listenerului explică refuzul curent; nu este demonstrată o problemă de firewall sau de izolare la momentul redirectului. Nu se deschid porturi și nu se relaxează protecții.

Alternativă oficială propusă: wrangler login --device --browser=false --scopes account:read user:read pages:write (offline_access implicit, deja aprobat). Device flow nu pornește server localhost; utilitarul sondează Cloudflare, iar Iulia confirmă în browser. Nu a fost inițiat în această etapă, conform instrucțiunii de a verifica înainte de a repeta autorizarea. Sursă: https://developers.cloudflare.com/changelog/post/2026-08-04-wrangler-login-device-flow/. Fără parole/tokenuri în chat și fără deployment. După login sunt necesare verificarea identității/contului și citirea proiectului exact, înainte de orice scriere; deploymentul cere prezentare și aprobare separată.

### OAuth Device Flow reușit — 11 noiembrie

Device Flow finalizat cu confirmarea personală a Iuliei: proces exit 0 și log Successfully logged in. whoami a confirmat sesiune activă, identitatea proprietarei și contul așteptat b954dd025a008e1c784797b561e0d55f. Scope-uri raportate: user(read), account(read), pages(write), offline_access; fără scope-uri suplimentare afișate. Logurile private sunt ignorate de Git; nu s-au afișat tokenuri. Verificare Pages prin comandă numai de citire în contul explicit. OAuth rămâne acces la nivel de cont, nu izolare tehnică la proiect; ținta autorizată pentru operații ulterioare rămâne exclusiv er-brevo-test-izolat. Nu s-a executat deployment, schimbare de setări, import/trimitere Brevo sau activare. Oprire după verificările de autentificare, conform cerinței Iuliei. Primul deployment necesită prezentarea exactă a pachetului și acord separat.
