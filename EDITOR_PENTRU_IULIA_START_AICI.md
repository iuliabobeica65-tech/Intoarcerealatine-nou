# EDITORUL SIMPLU — ÎNTOARCEREA LA TINE
Data: 19 octombrie 2026

## Ce am pregătit
Editorul este **Pages CMS**, o interfață de administrare a fișierelor GitHub, nu un editor direct peste fotografia site-ului.
Site oficial: https://spontaneous-quokka-e0bede.netlify.app/
Repository de conectat: `iuliabobeica65-tech/Intoarcerealatine-nou`

**IMPORTANT: până la aprobarea publicării, modificările se salvează NUMAI în ramura `pregatire-site-v2-cu-carusel-editor-2026-10-19` și NU în `main`.** Ramura `main` poate declanșa automat Netlify production deploy și cost de credite.

## Acces / activare de către proprietară
1. Intră pe https://app.pagescms.org/ în Chrome, pe laptop.
2. Alege **Sign in with GitHub** și conectează contul personal GitHub pe care este repository-ul.
3. La autorizarea Pages CMS, limitează accesul aplicației la repository-ul **Intoarcerealatine-nou** (nu la alte repository-uri). Nu transmite parole.
4. Alege repository-ul `iuliabobeica65-tech/Intoarcerealatine-nou`.
5. **Selectează ramura `pregatire-site-v2-cu-carusel-editor-2026-10-19`, nu `main`.** Dacă interfața nu permite schimbarea ramurii, **nu salva nimic**. Solicită o captură pentru verificare.
6. Caută secțiunile **Prima pagină**, **Calendar**, **Metoda CLAR**, **Constelații**, **Lucrăm împreună**, **Despre mine**, **LIVE**, **Resurse**. Fișierul de configurare `.pages.yml` este deja pregătit pe ramura V2.
7. Pentru prima verificare, fă o modificare mică doar în ramura de previzualizare, apoi deschide linkul Deploy Preview furnizat de Netlify; verifică atât telefonul, cât și desktopul. **Nu trece la `main` și nu apăsa «merge» pe pull request.**

## Ce poate modifica editorul pregătit
- Prima pagină: titlu, subtitlu, fotografia principală, cele două butoane și linkurile lor, introducere, 3 oferte, 4 situații, exemplul ilustrativ, prezentarea Iuliei, textele sub cele 7 imagini.
- Calendar: descrieri, date confirmate, locație și linkuri.
- Cele 6 pagini interioare: titlu principal, introducere și primul subtitlu.
- Fișierele foto încărcate pot fi selectate cu ajutorul interfeței media (după verificarea practică).
- Restul paragrafelor din interiorul paginilor, fotografii suplimentare și alte butoane necesită configurări adiționale înainte de a fi editate din interfață; nu pretindem că tot site-ul este deja editabil.

## Limitări / reguli importante
- Pages CMS salvează modificări în **GitHub**; Netlify este cel care publică. Editarea NU ocolește un deploy și costul lui de producție.
- Nu există formular de înscriere, plăți sau colectare de emailuri pe site.
- Nu se introduc în calendar date ori locații neconfirmate.
- Păstrează vocea Iuliei: caldă, naturală, blândă, fără formulări dramatice sau promisiuni de rezultate.
- Caruselul are **exact 7 imagini**. Editorul de mai sus modifică textele de sub ele, fără să înlocuiască fișierele originale.
- Nu schimba numărul ofertelor (3), al situațiilor (4), al paragrafelor din exemplu (3), al legendelor (7) până la extinderea template-ului.
- Înainte de lansare: verifică mobile, securitate, GDPR/cookie-uri, funcționalitatea editorului, linkurile, SEO și domeniul.

## Cum economisim credite
1. Lucrăm numai pe ramura de test și în Deploy Preview.
2. Finalizăm toate schimbările și verificările.
3. După aprobarea explicită, facem un singur merge spre `main`. Acesta ar trebui să genereze un singur deploy de producție, dacă configurația Netlify nu s-a schimbat.
4. Domeniul nou se adaugă la același site Netlify, fără a crea alt proiect.

Document tehnic: `VERIFICARE_SITE_V2_2026-10-19.md`.
