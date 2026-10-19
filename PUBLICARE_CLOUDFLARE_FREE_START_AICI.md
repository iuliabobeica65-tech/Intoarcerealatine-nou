# Publicare imediată pe Cloudflare Pages — fără domeniu propriu și fără abonament Netlify

Acest document este un **ghid pentru prima configurare**, nu o confirmare că pagina a fost deja publicată.

## Situația site-ului
- Site oficial actual: https://spontaneous-quokka-e0bede.netlify.app/ . Nu îl înlocuim până la verificarea unei alternative.
- Repository GitHub: `iuliabobeica65-tech/Intoarcerealatine-nou`.
- Ramura nouă, verificată în preview: `pregatire-site-v2-cu-carusel-editor-2026-10-19`.
- Netlify Deploy Preview: https://deploy-preview-3--spontaneous-quokka-e0bede.netlify.app/acasa.html
- Domeniul `intoarcerealatine.ro` nu este încă cumpărat. Nu modificăm nameserverele DataHost.

## Cum poate activa proprietara un cont Cloudflare Pages
1. Deschide https://dash.cloudflare.com/ și autentifică-te/creează gratuit un cont. Nu transmite parole în chat.
2. În meniul **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**, selectează GitHub.
3. Autorizează numai repository-ul **`iuliabobeica65-tech/Intoarcerealatine-nou`**.
4. Configurează un nume de proiect Pages (de exemplu `intoarcerealatine` dacă este disponibil). Nu e același lucru cu domeniul plătit.
5. **Production branch**: `pregatire-site-v2-cu-carusel-editor-2026-10-19` pentru a pune versiunea nouă, deja verificată, pe adresa gratuită `*.pages.dev`, FĂRĂ să faci merge în `main` și fără să afectezi Netlify. Cloudflare acceptă o ramură diferită ca ramură de producție. După stabilizarea lansării, putem decide dacă e utilă repoziționarea workflow-ului Git în `main`.
6. **Framework preset**: `None`; **Build command**: lasă gol; **Build output directory**: `.` (fișierele HTML sunt în rădăcina repository-ului), **Root directory**: rădăcina (implicită).
7. Înainte de a trimite o adresă publicului, verifică că site-ul răspunde la `/acasa.html`, că există `/politica-confidentialitate.html`, `/politica-cookies.html` și că se încarcă imaginile. **Verifică și SEO și politica juridică** pentru gazda efectivă.
8. După achiziția domeniului, îl putem atașa aceleiași aplicații Pages. Nu este nevoie de alt website.

**Atenție:** Cloudflare poate publica automat commituri suplimentare din ramura de producție. După ce conectăm ramura V2, orice modificare GitHub pe această ramură poate deveni vizibilă public. Alege momentul conectării după stabilirea și verificarea site-ului.

## SEO: ce este pregătit și ce lipsește
- Fiecare dintre cele șapte pagini are titlu unic, descriere, Open Graph, Twitter Card și URL canonical preliminar. Există `robots.txt` și `sitemap.xml`.
- Adresele `canonical`, `og:url`, `og:image` și sitemap indică încă vechiul Netlify. **La lansarea pe Cloudflare trebuie înlocuite cu adresa reală `https://nume-confirmat.pages.dev`**. Nu presupune că numele este disponibil; nu inventa URL.
- Când este cumpărat și activat `intoarcerealatine.ro`, SEO trebuie mutat la `https://intoarcerealatine.ro` și, dacă este cazul, direcționată/redirecționată adresa gratuită.
- Nu indexa pagini de preview private, proiecte experimentale sau directoarele editorului/fișierele de QA. Nu include adrese duplicate inutile în sitemap.
- Google Search Console poate fi configurat după confirmarea accesului la domeniu și după lansare.

## GDPR: condiție de publicare
- Politica de confidențialitate și cookies menționează în prezent Netlify. **Înlocuiește furnizorul din text cu Cloudflare** dacă site-ul de producție va fi găzduit acolo.
- Inspectează efectiv în browser cookie-urile site-ului `*.pages.dev`, antetele `Set-Cookie` și serviciile terțe înainte de lansare publică. Consultă `CHECKLIST_GDPR_COOKIES_LANSARE_2026-10-19.md`.
- Nu introdu Google Analytics, Meta Pixel, colectare de leaduri sau banner placebo fără o evaluare juridică și tehnică.

## Rolul editorului
- Pages CMS rămâne în repository (`.pages.yml`, `content/*.json`).
- Editarea poate fi făcută de proprietară după autorizarea contului GitHub la https://app.pagescms.org/ și selectarea ramurii corecte.
- Nu promite un editor WYSIWYG direct în pagină: se editează câmpurile pregătite și se salvează în GitHub.

## Ce este în afara acestei sesiuni
Fără acces la contul Cloudflare al proprietarei nu pot alege proiectul Pages, autoriza GitHub, configura DNS, demonstra o adresă `pages.dev` funcțională ori testa răspunsurile cookie de pe ea. Acestea sunt acțiuni concrete ce necesită autentificare sau confirmare în interfața proprietarei.
