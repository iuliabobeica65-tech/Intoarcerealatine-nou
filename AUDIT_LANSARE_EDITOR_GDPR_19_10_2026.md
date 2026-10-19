# AUDIT GDPR, COOKIE-URI ȘI EDITOR — PREGĂTIRE PENTRU LANSARE
Data: 19.10.2026 • Revizuire tehnică și operațională, NU aviz juridic

## Situație confirmată
- Site de prezentare static, pagini HTML/CSS/JavaScript locale și JSON local pentru textele editate.
- Fără formulare, conturi pentru vizitatori, checkout, newsletter, Meta Pixel ori Google Analytics în codul propriu al paginilor de prezentare.
- Contactul se face prin legături către WhatsApp, Messenger și e-mail; aceste platforme au prelucrări independente de date.
- Pages CMS este un editor extern, folosit de proprietara site-ului prin conectarea propriului cont GitHub; nu este încorporat în paginile vizitatorilor.
- Versiunea actuală se previzualizează prin Netlify; mutarea pe Cloudflare este doar o posibilitate de găzduire, încă neconfigurată.
- Domeniul `intoarcerealatine.ro` **nu este încă cumpărat**, conform confirmării utilizatoarei.

## Corecții efectuate
1. Politica de cookies recunoaște JavaScriptul local și nu susține în mod fals că absența unui tracker din cod probează absența tuturor cookie-urilor.
2. Politica de confidențialitate precizează că furnizorul de găzduire poate prelucra date tehnice, iar comunicarea prin WhatsApp, Messenger și e-mail este prin terți.
3. Nu introducem un banner fals care doar afișează „Accept”, dar nu blochează tehnologiile neesențiale.
4. Nu introducem sisteme de urmărire, captare leaduri sau plăți prin acest audit.
5. Editorul rămâne administrat prin GitHub, pe ramura de test; nu trimite datele vizitatorilor către Pages CMS.

## Obligatoriu înainte de lansare: test de browser real
**Nu există încă acces la browserul autentificat al proprietarei sau inspecție directă a antetelor HTTP și stocării locale. Fără aceste teste nu se poate susține că întregul site este conform GDPR/ePrivacy.**
- Fă o vizită într-o fereastră incognito, cu Developer Tools → Application/Storage → Cookies, localStorage și sessionStorage, înainte de orice clic.
- În Developer Tools → Network, verifică solicitările și antetele `Set-Cookie` pentru document, resurse și serviciul gazdă, în special înainte de interacțiuni.
- Notează fiecare cookie: nume, domeniu, furnizor, scop, durată, dacă este esențial; stabilește dacă necesită consimțământ conform normelor aplicabile.
- Confirmă că niciun serviciu de analiză, publicitate ori identificare neesențială nu se încarcă înainte de consimțământ. Dacă există, blochează-l în mod real până la accept și implementează refuz/retragere.
- Repetă testul pe **platforma finală de găzduire**; comportamentul preview-ului Netlify nu certifică automat Cloudflare.
- Verifică în pagina finală HTTPS valid, linkurile juridice, anteturile de securitate aplicabile și afișarea pe telefon.

## GDPR — informații de confirmat
- Identitatea și datele de contact ale operatorului, fără a atribui utilizatoarei firmă/PFA fără existența lui.
- Exact ce date sunt primite prin mesaje private, pentru ce scop, ce temei legal se aplică în context și dacă există obligații specifice pentru date sensibile primite spontan.
- Furnizorii reali de găzduire și comunicare; destinatari/împuterniciți și eventuale transferuri în afara SEE, cu garanțiile corespunzătoare.
- Criteriile realiste ale duratei de păstrare, modalitatea de exercitare a drepturilor și procedura de ștergere a datelor.
- Politicile afișate sunt **proiecte tehnice de informare** ce necesită verificare juridică atunci când găzduirea și operațiunile sunt definitive.

## Configurarea editorului Pages CMS
- `.pages.yml` este în repository, cu `settings.content.merge: true` pentru a păstra cheile JSON care nu apar în formulare.
- Listele fixe au limite pentru cele 3 oferte, 4 situații și 7 legende ale imaginilor.
- Fișierele cu texte și linkuri includ valori inițiale pentru păstrarea formatării până la prima editare.
- **Netestat practic**: instalarea/autorizarea aplicației GitHub de către proprietară, alegerea ramurii de test, încărcarea imaginii prin media picker, salvarea și afișarea imediată a unei modificări în preview.
- Pages CMS NU este editor de tip „apas direct pe site și scriu”; este editor de formulare cu câmpuri prietenoase. Paginile HTML rămân o rezervă dacă un fișier JSON nu se încarcă.

## Siguranța publicării
- Nu se modifică `main` până când proprietara verifică preview-ul și alege explicit gazda de producție.
- Nu configura cont Cloudflare Pages sau domeniu fără autorizarea proprietarei.
- Dacă se folosește Cloudflare Pages, setează ramura de producție **main**, directorul de output `/`, fără proces de build; verifică numele `pages.dev` înainte de creare; oprește auto-deployul de producție până la semnalul de lansare.
- Dacă rămânem pe Netlify, nu se efectuează merge fără credite suficiente/relansarea publicărilor.
- După confirmarea domeniului, actualizează toate URL-urile canonice, linkurile Open Graph, `sitemap.xml` și `robots.txt` pentru domeniul efectiv, înainte de lansarea finală.

## Confirmări din 19.10.2026
Utilizatoarea a confirmat cele două calificări deja afișate („Consilier pentru dezvoltare personală” și „Absolventă de Economie și Administrarea Afacerilor, specializarea Marketing”) și programul individual de patru luni; a aprobat mesajele din imaginile la care s-a referit și a cerut ca ultima imagine, despre creația conștientă, să devină prima. Imaginile originale nu se modifică; se schimbă doar ordinea caruselului.

## Referințe
- Pages CMS: https://pagescms.org/docs/configuration/
- Pages CMS merge behavior: https://pagescms.org/docs/configuration/settings/
- Cloudflare Pages Git: https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/
