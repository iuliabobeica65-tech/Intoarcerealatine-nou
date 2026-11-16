# Newsletter — verificare GDPR și operațională înainte de activare
Data: 16 noiembrie 2026
Statut: PROPUNERE TEHNICĂ/OPERAȚIONALĂ — nu este aviz juridic, nu autorizează activarea sau trimiterea de e-mailuri.

## 1. Sursele și starea cunoscută

**Confirmări ale Iuliei:** Numele juridic este **Bobeica Iulia-Alexandra**, cu cratimă. Identitatea publică este „Iulia Bobeica – Echilibrarea rădăcinilor”. Contact pentru cereri privind datele: **contact@iuliabobeica.ro**. Nu există încă PFA/SRL; NU se inițiază vânzări, facturare sau plăți. Iulia a cerut să se pregătească abonarea, dar fără mesaje de bun-venit sau promovare până la clarificarea juridică și aprobarea ei.

**Din capturile raportului Codex (nu dintr-o verificare în cont în această etapă):** formularul este pregătit local, cu numai e-mail și consimțământ nebifat; lista Brevo destinatară propusă este #3; DOI separat #15 este inactiv; vechiul formular/lista #4 și șablonul #2 rămân păstrate; welcome/promo/automatizări sunt OFF. Testele DOI anterioare au fost deja efectuate în mediu izolat; NU le repeta automat.

**Din verificarea directă în GitHub și pe site la 16.11:** publicul /newsletter redirecționează către /acasa. În ramura „verificare-gdpr-2026-11-16” sunt corectate numele juridic, contactul și descrierea GA4/cookie-urilor pe 18 fișiere. Producția rămâne la ramura „pregatire-cloudflare-2026-10-20”, nealterată. Modificările locale recente ale Codex pentru newsletter NU apar încă în această ramură GitHub; nu pretinde că au fost verificate sau integrate.

## 2. Furnizorii și acordurile privind datele

- **Brevo**: pagina oficială precizează că DPA este parte din termenii de utilizare, în secțiunea Data Processing Agreement. Trebuie verificat în CONTUL REAL că termenii aplicabili sunt acceptați, cine este titularul contului și care sunt subcontractanții, accesul și transferurile relevante. Pagina Brevo despre stocare declară centre de date în UE; aceasta NU elimină necesitatea examinării accesului și transferurilor subcontractanților.
- **Cloudflare**: DPA oficial și lista oficială de subcontractanți sunt disponibile. Trebuie identificat exact ce servicii procesează date ale formularului (Pages, Workers, D1, Turnstile, Access, loguri), regiuni, categorii, retenție efectivă și transferuri.
- Nu declara un DPA „semnat/validat” numai pentru că URL-ul este accesibil. Păstrează separat rezultatul verificării în cont și documentele relevante.

Surse primare:
- https://help.brevo.com/hc/en-us/articles/15403782599570-Where-can-I-find-the-Data-Processing-Agreement-DPA
- https://www.brevo.com/legal/termsofuse/
- https://help.brevo.com/hc/en-us/articles/360001005510-Data-storage-location
- https://www.cloudflare.com/cloudflare-customer-dpa/
- https://www.cloudflare.com/gdpr/subprocessors/

## 3. Ce se colectează — limita strictă a formularului

**Propunere pentru formularul viitor:** e-mailul, sursa și versiunea acordului, momentul cererii, momentul confirmării DOI și evidențele retragerii, atât cât este necesar și justificat. Nu solicita nume, telefon, informații medicale, experiențe personale sau câmpuri suplimentare prin newsletter.

- Brevo = registrul principal al contactelor și al stării înscrierii.
- Cloudflare D1 = numai metadatele tehnice minim necesare integrării, fără dublarea adreselor de e-mail în clar, dacă funcția poate fi îndeplinită astfel.
- Fără adrese/chei/API tokenuri/secrete sau exporturi de contacte în GitHub, preview public, documentație ori chat.
- DOI #15 trimite strict mesajul de confirmare solicitat, după activarea aprobată. Confirmarea DOI nu permite mesaje de promovare imediat în această etapă; bun venit, campanii și workflowuri rămân OFF.
- Verifică explicit că retragerea/ștergerea este respectată și de orice export și restaurare; nu reabona dintr-un backup.

## 4. Retenție — decizie de validat înainte de activare

GDPR nu impune o perioadă universală de 6 sau 12 luni pentru o listă de newsletter; datele trebuie păstrate doar cât este justificat de scop și obligații. **Propunere operațională, nu regulă legală confirmată**:
1. Revizuirea abonărilor după șase luni dacă newsletterul nu a fost lansat.
2. La maximum 12 luni de inactivitate pre-lansare, evaluează ștergerea ori solicitarea unui acord nou; fără reactivare automată sau campanii către adresele vechi.
3. Perioada pentru probe DOI, loguri tehnice și evidența minimă a dezabonării trebuie stabilită distinct, împreună cu temeiul și riscurile; evită păstrarea nelimitată.
4. Pentru backupuri: criptare, acces restrâns și rotație documentată. Propunerea anterioară „două generații/maximum 65 de zile” pentru exporturi este o opțiune care necesită confirmarea că sistemul o poate aplica și că retenția este adecvată. Fără ștergeri automatizate până la validare.

Surse primare:
- https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/principles-gdpr_en
- https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/legal-grounds-processing-data_en

## 5. Cereri de acces, rectificare, dezabonare și ștergere

**Propunere de procedură de lucru**:
1. Monitorizează zilnic sau regulat **contact@iuliabobeica.ro**; confirmă că mesajele nu se pierd.
2. Înregistrează securizat data cererii, categoria (acces/rectificare/retragere/ștergere), termenul de răspuns, acțiunea și data rezolvării. Nu stoca mai multe date decât este necesar.
3. Verifică identitatea solicitantului proporțional, fără a cere automat copii de acte; nu transmite listele altor persoane.
4. Pentru retragere: oprește imediat comunicările vizate și actualizează starea în Brevo. Pentru ștergere: evaluează excepțiile legale și șterge din registrele aplicabile; păstrează doar o eventuală evidență minimală justificată pentru a preveni recontactarea și a demonstra respectarea cererii, cu termen separat.
5. Răspunde fără întârzieri nejustificate, de regulă cel târziu într-o lună; în cazuri complexe se poate aplica prelungirea legală comunicată corespunzător.
6. Verifică și consemnează efectul asupra D1, exporturilor, copiilor și restaurărilor.

Surse primare:
- https://www.edpb.europa.eu/sme/find-practical-info/faq_en
- https://www.edpb.europa.eu/system/files/documents/2025-09/right-of-access-guidelines-summary_en.pdf

## 6. Informarea din site și formulare — pentru versiunea locală nouă

Înainte de orice colectare publică, politica trebuie să conțină o secțiune **#newsletter** clară și efectiv afișată:
- cine este operatorul: **Bobeica Iulia-Alexandra**, persoană fizică, și contactul;
- scopul exact al abonării viitoare; absența mesajelor promoționale până la o aprobare ulterioară; diferența dintre DOI necesar și marketing;
- temeiul și caracterul facultativ al consimțământului (nebifat implicit); ce date și dovezi sunt colectate; sistemele Brevo/Cloudflare;
- durata/criteriile de retenție separate pentru abonament, DOI, suprimări și backup;
- destinatari/împuterniciți, transferuri, drepturi, retragerea facilă și plângerea la ANSPDCP;
- versiunea acordului, textul efectiv al căsuței și linkul funcțional către politică.

Nu publica o politică ce afirmă că nu există newsletter după activarea formularului. Nu publica un link #newsletter până când secțiunea există. Nu modifica vechile șabloane sau contacte pentru a „alinierea” sistemul nou.

## 7. Porți de activare (toate obligatorii)

- [x] Corecții verificate pe ramura separată de GitHub, fără atingerea producției.
- [x] Confirmare publică: /newsletter nu este activ acum.
- [ ] Sincronizarea versiunii Codex locale cu o ramură de test, fără suprascrierea modificărilor existente; rezolvarea atentă a conflictelor cu ramura juridică.
- [ ] Audit tehnic Preview: validare formular, mobil, consent nebifat, Turnstile, API, redirecționare DOI, acces și export/ștergere, fără mesaje reale sau înscrieri noi neaprobate.
- [ ] Verificarea efectivă a DPA/transferurilor/subprocesatorilor, a termenelor de retenție și a textului final GDPR, cu ajutor juridic calificat.
- [ ] Cheie Brevo nouă, valabilă, introdusă EXCLUSIV în secretele mediului aprobat; vechea cheie expusă nu se reutilizează.
- [ ] Confirmarea finală separată a Iuliei pentru publicarea codului, activarea colectării și trimiterea exclusiv a DOI necesar.
- [ ] După activare: dovada testului controlat aprobat, urmată de verificarea că welcome, promovarea, plățile și facturarea rămân OFF.

**Important:** Nu face deploy de producție, nu reactiva cheia veche, nu retrimite e-mailuri și nu șterge date reale pornind de la acest document.
