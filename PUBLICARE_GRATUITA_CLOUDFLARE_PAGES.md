# Publicarea rapidă a site-ului — Cloudflare Pages Free
Data: 19 octombrie 2026

## De ce
- Site-ul este alcătuit din HTML/CSS/JS și JSON, fără server propriu.
- Netlify Free are producția oprită din cauza creditelor până la reînnoirea lunară sau upgrade.
- Proprietara dorește să publice cât mai repede fără a plăti un abonament de găzduire.
- Domeniul `intoarcerealatine.ro` NU a fost încă achiziționat. Site-ul poate fi publicat mai întâi la o adresă gratuită `*.pages.dev`; domeniul se leagă ulterior.

## Protecție
**NU șterge Netlify, NU schimba DNS, NU modifica `main` și NU migra pâlnia LIVE în acest proiect.**
Editorul Pages CMS rămâne bazat pe GitHub. Autorizarea contului Cloudflare și a contului GitHub revine exclusiv proprietarei.

## Flux recomandat după acordul proprietarei
1. Deschide https://dash.cloudflare.com/ → Workers & Pages → Create application → Pages → Connect to Git (denumirile pot varia).
2. Autorizează accesul Cloudflare exclusiv la repository-ul GitHub:
   `iuliabobeica65-tech/Intoarcerealatine-nou`.
3. **Nu alege o publicare automată direct din `main` până la verificarea finală.** Selectează ca ramură de producție ramura V2:
   `pregatire-site-v2-cu-carusel-editor-2026-10-19`
   numai când proprietara autorizează explicit prima publicare.
4. Alege numele proiectului `intoarcerealatine` dacă este disponibil. Numele adresei `pages.dev` nu se poate presupune disponibil înainte de creare.
5. Setări build pentru proiect static:
   - Framework preset: None
   - Build command: `bash scripts/build-public.sh`
   - Build output directory: `public-site`
   - Root directory: / (repository root)
   - Environment variables: niciuna necesară
6. Verifică versiunea publicată pe URL-ul efectiv atribuit de Cloudflare (nu presupune URL-ul înainte de confirmarea din dashboard).
7. Odată ce Cloudflare a creat prima adresă, configurează în GitHub ramura oficială de actualizare și editorul Pages CMS pentru acea ramură. Folosirea ramurii V2 este temporară până la decizia de lansare definitivă.
8. Înainte ca adresa Cloudflare să devină destinația principală de promovare, actualizează metadatele canonice SEO (`canonical`, `og:url`, `og:image`, `robots.txt`, `sitemap.xml`) la domeniul valid al versiunii publicate.
9. După cumpărarea domeniului, conectează-l în Cloudflare Pages → Custom domains și urmează instrucțiunile DNS reale din interfață. **Nu inventa nameservere.**

## Atenție la publicări repetate
Dacă ramura conectată este editată și opțiunea Git integration / automatic deploys rămâne activă, Cloudflare Pages va publica automat commiturile următoare. Folosește testarea înainte de fiecare salvare și evită modificările nesupravegheate.

## Verificări înainte de a anunța lansarea
- GitHub Actions, `QA site V2`: testele Chromium și schema CMS trebuie să fie verzi.
- Primul test real Pages CMS după autentificarea proprietarei: editează un text de test, salvează, verifică pagina, revino la textul aprobat.
- Vezi `CHECKLIST_GDPR_COOKIES_LANSARE_2026-10-19.md`: inspecția browserului pe gazda Cloudflare, înainte și după prima publicare.
- Verifică toate cele 7 imagini în carusel; ordinea aprobată: `07.webp, 01.webp, 02.webp, 03.webp, 04.webp, 05.webp, 06.webp`.
- Verifică accesibilitatea și toate butoanele pe mobil.
- Nu activa formulare sau plăți. În situația actuală, site-ul trimite vizitatorii către WhatsApp, Messenger și LIVE.

## Ce este gata în repository
- `scripts/build-public.sh` creează `public-site/` numai cu conținut public. Astfel, fișiere precum README, briefuri, QA, note interne, Pages CMS și arhiva de proiect NU devin URL-uri accesibile din greșeală.
- `netlify.toml` folosește același folder de publicare pentru Netlify după reluarea deploy-urilor.
- `.github/workflows/qa-site-v2.yml` testează prin Chromium pachetul exact care ar fi publicat.

## Limite clare
Acest ghid nu înseamnă că proiectul Cloudflare a fost creat sau că adresa este activă. Primul pas care cere contul proprietarei este conectarea Cloudflare–GitHub. Nu publica fără acceptarea ei, mai ales că schimbările de gazdă și domeniu pot afecta continuitatea site-ului.
