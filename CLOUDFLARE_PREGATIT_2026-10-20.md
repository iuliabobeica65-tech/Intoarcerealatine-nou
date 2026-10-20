# Cloudflare Pages — pregătire tehnică, 20 octombrie 2026

## Reper unic
- Site oficial EXISTENT, nemodificat: https://spontaneous-quokka-e0bede.netlify.app/
- Repository: iuliabobeica65-tech/Intoarcerealatine-nou
- Ramură V2 verificată anterior: pregatire-site-v2-cu-carusel-editor-2026-10-19
- **Ramură de publicare Cloudflare, separată**: pregatire-cloudflare-2026-10-20
- NU utiliza repository-ul separat „intoarcerea-la-tine-site” și NU utiliza pâlnia LIVE.

## Gata în cod, fără a publica
- HTML/CSS/JS static și JSON pentru editorul Pages CMS.
- 7 pagini principale, pagini juridice, portret și 7 imagini ale caruselului.
- Build Cloudflare: `node scripts/build-cloudflare.mjs` → `dist`.
- Build-ul copiază în dist numai pagini, active și JSON publice, NU documentație internă, workflow-uri, configurarea editorului, fișiere de QA ori prototipuri.
- Domeniul stabil SEO derivă automat din CF_PAGES_URL (ex. https://nume-proiect.pages.dev), fără hash-ul adresei de preview; dacă se folosește domeniul propriu deja activ, configurați `CF_SITE_URL` la originea HTTPS confirmată.
- Pentru dist, URL-urile Netlify din fișierele HTML/sitemap/robots și mențiunile din politicile referitoare la gazdă se transformă în Cloudflare **la build**, fără schimbarea surselor folosite pe Netlify.
- Antete simple de securitate și no-cache pentru JSON sunt scrise în `dist/_headers`.

## Prima configurare în Cloudflare Pages
1. În contul tău, deschide https://dash.cloudflare.com/ → Workers & Pages → Create application → Pages → Connect to Git / Import an existing Git repository.
2. Autorizează GitHub doar pentru `iuliabobeica65-tech/Intoarcerealatine-nou`.
3. Alege un nume disponibil de proiect și ramura de producție **`pregatire-cloudflare-2026-10-20`**. Păstrează `main` nealterat, pentru a nu relansa Netlify.
4. Framework preset: **None**; root directory: **/**; build command: `node scripts/build-cloudflare.mjs`; output directory: `dist`; fără variabile secrete sau abonament plătit.
5. La lansare, Cloudflare furnizează un domeniu gratuit `*.pages.dev`, care trebuie citit din cont (nu presupune că un nume de subdomeniu este disponibil).
6. După prima publicare efectivă, verifică homepage, meniu, pagini, portret, 7 imagini, politică cookies/confidențialitate, consola browserului, cod de răspuns, canonical și linkuri contact. Inspectează cookie-uri și servicii externe pe adresa Cloudflare reală înainte să distribui linkul.
7. Când domeniul propriu chiar este cumpărat/activ, adaptează `CF_SITE_URL` la adresa validă și configurează domeniul în Cloudflare. Nu inventa DNS.

## Economisirea publicărilor
- Nu mai face commit-uri în ramura Cloudflare după conectare decât după verificare. La conectarea GitHub, Cloudflare publică de regulă la push automat.
- Poți opri deploy-urile automate din setările proiectului → Build → Branch control → dezactivează automatic production deploys și automatic preview branches.
- Fă modificările în altă ramură și publică numai versiuni aprobate.

## Blocaje reale înainte de a declara lansarea finală
- Nu avem confirmarea unui cont Cloudflare legat, a numelui `pages.dev`, a primei publicări sau a rezultatelor de browser/cookies Cloudflare.
- Pages CMS mai necesită autentificarea proprietarei și un test practic.
- Politicile juridice rămân pentru validare pe funcționarea reală a gazdei.
- Nu există o aprobare pentru a modifica `main` ori Netlify.

## Stare
**Cod Cloudflare pregătit separat. Nu a fost creat proiectul Cloudflare și nu s-a făcut publicare din această sesiune.** 
