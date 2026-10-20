# Pregătire editor + articole + SEO — 20.10.2026

## Realizat exclusiv pe ramura Cloudflare
- Meniul celor 7 pagini originale are acum și „Articole”; pagina articole.html folosește aceeași identitate vizuală.
- Pages CMS are colecția „Articole — scrie, salvează, publică” (titlu, rezumat, dată, categorie, imagine opțională, conținut rich-text Markdown, SEO individual, comutator Publică).
- Articolele au pagini individuale generate la build, index public, titlu/metadescriere și URL canonical. Fără articole fictive: lista afișează invitația către Resurse.
- Fișierele editoriale JSON rămân în GitHub; doar articolele cu publicat=true sunt generate în public-site/ ori dist/. Ciornele nu sunt copiate în output.
- Scriptul generator este comun Netlify și Cloudflare; codul public nu include MASTER-ul sau relatările clientelor.
- Titlurile și descrierile SEO pentru cele 7 pagini sunt adaptate problemelor generale identificate în cercetarea avatarului: blocaj, repetarea alegerilor, lipsa de timp pentru sine, limite, apreciere și nevoia de explicații concrete. Fără citate atribuite, identități, rezultate sau detalii de caz.
- Netlify pe main rămâne nemodificat; această ramură nu trebuie combinată încă în main.

## Verificare logică fără publicare
- Codurile JavaScript ale generatorului și construirii pachetului au fost verificate pentru sintaxă.
- Simulare în memorie cu articol publicat și ciornă: s-a generat pagina publicată, ciorna nu a fost expusă, conținutul Markdown a fost formatat, sitemap și canonical au primit articolul.
- Nu s-a executat un build Cloudflare real și nu s-a realizat autentificare Pages CMS. Aceste teste au rămas explicit de făcut.
- Textele CSS și aspectul în browser nu sunt încă validate după extinderea meniului.

## Înainte de publicarea reală
1. Verifică autentificarea Pages CMS pe ramura `pregatire-cloudflare-2026-10-20` și posibilitatea de creare / editare a unui articol Ciornă. Nu salva date sensibile.
2. Testează o pagină de articol de probă într-un preview izolat (nu public), apoi șterge articolul de probă din ramura de lucru.
3. Test automat în browser pe build Cloudflare: 7 pagini existente + articole, meniu mobil, imagine, links, SEO, fișiere publice, coduri HTTP și cookie-uri.
4. Actualizează ghidurile editorului după primele validări practice și asigură-te că salvările Pages CMS nu publică automat fără aprobare.
5. Dacă ramura Cloudflare este aleasă ca producție, fiecare commit poate declanșa publicare automată. Nu apăsa Deploy până când testele relevante sunt satisfăcătoare.
6. La revenirea Netlify, conținutul nou poate fi mutat controlat într-un singur merge după aprobarea proprietarei; nu modifica site-ul oficial fără aprobare.

**Stare: implementat la nivel de cod; funcționarea și lansarea efectivă nu sunt validate.**
