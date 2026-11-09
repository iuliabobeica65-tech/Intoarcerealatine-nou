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
