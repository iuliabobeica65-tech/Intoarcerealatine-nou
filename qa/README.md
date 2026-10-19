# QA pentru site-ul „Întoarcerea la tine” — fără publicare în producție

## Teste deja pregătite
- `browser-smoke.mjs`: Chromium + server local pentru cele 7 pagini, la lățimile 320, 390, 768 și 1440 px.
- Verifică: încărcarea fiecărei pagini, titlul, un singur H1, `main`, eventuale erori JavaScript, imagini esențiale, depășirea orizontală și ordinea galeriei cu `07.webp` prima.
- Testează modificarea câmpului `contact_titlu` din JSON prin simularea răspunsului serverului, fără modificarea documentelor originale.
- Produce capturi ecran și rapoarte JSON în folderul `qa-artifacts/` dacă testul este executat.
- Opțional, vizitează Deploy Preview și înregistrează observabilele cookie-urilor și antetele Set-Cookie.

## Rulare pe un laptop cu Node.js și Chromium / din GitHub Actions
```bash
npm install --no-save playwright@1.56.1
npx playwright install chromium
python3 -m http.server 4173
# Intr-un al doilea terminal:
SITE_URL=http://127.0.0.1:4173 PREVIEW_URL=https://deploy-preview-3--spontaneous-quokka-e0bede.netlify.app/acasa.html node qa/browser-smoke.mjs
```
Pe Windows, variabilele de mediu se setează diferit; este mai simplu să rulezi workflow-ul GitHub Actions.

## GitHub Actions
Workflow: `.github/workflows/qa-site-v2.yml`. El **nu face publicare**, nu face merge și nu modifică `main`. Dacă GitHub Actions sunt activate, raportul apare în Actions > QA site V2 (fara publicare) > Artifacts. Dacă nu apare nicio rulare, **nu considerăm testarea Chromium efectuată**.

## Important pentru auditul cookie
Observațiile de browser sunt un inventar tehnic, nu certificare GDPR. Un cookie poate fi strict necesar, poate fi furnizat de gazdă sau de o protecție antiboți. Scopul și temeiul legal necesită evaluare; un banner fără blocarea tehnologiilor neesențiale nu rezolvă nimic. Rularea locală nu demonstrează comportamentul viitorului domeniu.

## Verificări statice realizate separat în GitHub
- Fișierele HTML și referințele relative (inclusiv ancore) au fost enumerate; nu există ținte inexistente în scanarea sursei.
- Cele 16 fișiere JSON ale editorului sunt parsabile și referințele către resurse locale din ele există.
- Cele șapte fișiere de pagină respectă unicitatea titlului H1; ordinea caruselului este 07, 01, 02, 03, 04, 05, 06.

## Ce nu poate fi substituit de acest test
- Autentificarea reală în Pages CMS și salvarea modificării în GitHub, pe ramura sigură.
- Testare vizuală cu aprecierea proprietarei a aspectului și tonului.
- Verificarea cookie-urilor pe gazda finală (Netlify sau Cloudflare) și a documentelor juridice pentru acea gazdă.
- Conectarea contului Cloudflare și prima lansare: proprietara trebuie să autorizeze accesul la repository.
