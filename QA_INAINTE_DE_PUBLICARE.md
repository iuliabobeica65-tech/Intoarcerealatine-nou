# Testare înainte de lansare – Întoarcerea la tine

Acesta este checklist-ul de verificare pentru versiunea din ramura `audit-gdpr-cookies-seo`. Pagina de producție rămâne pe `main` până la aprobarea testării.

## Vizual și funcțional
- [ ] Versiunea de previzualizare Netlify este accesibilă (Deploy Preview pentru PR #1).
- [ ] Fotografiei principale i se păstrează aspectul și se încarcă pe mobil/desktop.
- [ ] Titlul principal nu depășește ecranul la lățimi de 320, 360, 390 și 430 px.
- [ ] Linkurile interne către secțiuni funcționează.
- [ ] Butoanele către WhatsApp și Messenger deschid destinațiile așteptate.
- [ ] Întrebările FAQ se extind corect.
- [ ] Documentele legale sunt accesibile din subsol.
- [ ] Nu mai apare mesajul „PAGINĂ ÎN CURS DE FINALIZARE” și nu se afișează conținut vechi Systeme.io.
- [ ] Datele anunțate pentru LIVE sunt confirmate (luni 19:00-20:00, Jitsi).

## Cookies și date
- [ ] Testare în browser în mod incognito: Storage / Cookies, Network, solicitări către terți.
- [ ] Verificare dacă Netlify sau orice serviciu activ setează tehnologii neesențiale.
- [ ] Banner de consimțământ numai dacă auditul confirmă că este necesar; dacă da, blocare reală înainte de consimțământ.
- [ ] Politicile de confidențialitate/cookies completate pe baza serviciilor reale și verificate juridic.

## SEO și accesibilitate
- [ ] Metadatele pentru partajare și imaginea OG funcționează.
- [ ] robots.txt și sitemap.xml sunt accesibile.
- [ ] Linkuri externe securizate, titluri și alternative text.
- [ ] Contrast, navigare cu tastatura și zoom mobil.

**Nu se închide/unește PR #1 înainte de validarea punctelor critice.**
