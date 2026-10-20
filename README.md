# Întoarcerea la tine — site oficial (Iulia Bobeica)

**Un singur repository pentru site-ul oficial:** `iuliabobeica65-tech/Intoarcerealatine-nou`.

- Netlify oficial (producție, NU modifica fără acord): https://spontaneous-quokka-e0bede.netlify.app/
- Versiune nouă pentru verificare: https://deploy-preview-3--spontaneous-quokka-e0bede.netlify.app/acasa.html
- Ramură de lucru: `pregatire-site-v2-cu-carusel-editor-2026-10-19`
- Solicitare GitHub de verificare: PR #3 (draft, fără merge în `main`).
- Domeniu avut în vedere: `intoarcerealatine.ro` — se configurează după confirmarea activării de către proprietară.
- Alternativa Cloudflare Pages rămâne opțională, nu configurată în acest repository.

## Cum modificăm site-ul

1. Modificările de conținut și cod se fac **doar pe ramura de lucru**.
2. Editorul vizual de formulare este **Pages CMS**, configurat de `.pages.yml` și `content/*.json`. Nu eliminăm editorul.
3. JavaScriptul de citire a datelor este `assets/content-editor.js`; paginile HTML au text de rezervă.
4. Verificăm funcționarea și aspectul pe telefon și laptop în Deploy Preview.
5. Numai după acordul proprietarei și verificarea platformei de hosting se face un singur merge în `main`, dacă Netlify rămâne furnizorul de producție.

## Conținut și reguli

- Pagini: Acasă, Metoda CLAR, Constelații, Lucrăm împreună, Despre mine, Resurse, LIVE; separat termenii și politicile de confidențialitate/cookies.
- Carusel: 7 imagini originale `assets/carusel-metoda/01.webp` – `07.webp`; **nu edita imaginile originale fără aprobarea proprietarei**.
- Fotografia de profil: portretul autentic deja inclus în repository.
- Constelațiile sistemice sunt activitate distinctă, nu un pas obligatoriu din CLAR.
- Vocea editorială: vezi `REGULA_VOCE_BLANDA_IULIA.md`.
- Fără plăți, formulare automate, mărturii inventate sau promisiuni de rezultate.
- Verificările și limitele: `VERIFICARE_SITE_V2_2026-10-19.md`.
- Instrucțiuni editor pentru proprietară: `EDITOR_PENTRU_IULIA_START_AICI.md`.

**Nu ștergem proiectele sau arhivele separate fără cerere explicită.** Vechea variantă de site și pâlnia LIVE reprezintă proiecte diferite, nu surse de publicare pentru site-ul oficial.

## De făcut înainte de lansare

- Activare și testare practică Pages CMS cu autentificare GitHub pe ramura de test.
- Verificare efectivă pe mobil, linkuri, cookie-uri și corectitudinea paginilor legale.
- După alegerea domeniului final, schimbarea URL-urilor provizorii Netlify din `canonical`, `og:url`, `og:image`, `robots.txt` și `sitemap.xml`.
- Validare explicită a formulelor din imagini și a condițiilor programului individual de patru luni.
