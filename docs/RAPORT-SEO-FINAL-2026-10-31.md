# Raport final SEO — Iulia Bobeica — 31 octombrie 2026

## Ținta verificată

- Site oficial: https://iuliabobeica.ro/
- Sitemap public: https://iuliabobeica.ro/sitemap.xml
- Repository: iuliabobeica65-tech/Intoarcerealatine-nou
- Producție: pregatire-cloudflare-2026-10-20
- Referință inițială: e405abe55128f9cd50b5f8cc4c529e7e77b57967.
- Copie de siguranță păstrată: backup-seo-2026-10-31-e405abe.
- Commit SEO și pagini noi: 4e297bd367a39a69ccbd6fd5382aa04db675907b.
- Commit corecție linkuri: 1c2ed5ec093cd8fb6cee790fece6b3b82f42e56c.

## Articole verificate și optimizări

Au fost citite toate cele 77 de fișiere editoriale existente din ramura de producție, cele 16 pagini publice principale, generatorul articolelor, scriptul Cloudflare, sitemap.xml și robots.txt.

53 de articole aveau deja câmpuri seo_titlu și seo_descriere. Aceste metadate au fost păstrate integral. Celelalte 24 foloseau valori implicite. Au primit titluri SEO explicite, diferențiate după situația descrisă. Descrierile editoriale existente au fost păstrate și copiate în câmpul seo_descriere; nu sunt 24 de descrieri complet rescrise.

Au fost adăugate cinci articole distincte, la cererea autoarei, fiecare cu titlu, meta descriere, H1, canonical propriu și legături interne:

- https://iuliabobeica.ro/articole/rana-de-abandon
- https://iuliabobeica.ro/articole/rana-de-tradare
- https://iuliabobeica.ro/articole/rana-de-respingere
- https://iuliabobeica.ro/articole/rana-de-umilinta
- https://iuliabobeica.ro/articole/rana-de-nedreptate

Articolul comun despre cele cinci răni a rămas integral; la final s-a adăugat doar secțiunea de navigare către cele cinci pagini. Paginile noi sunt texte educative redactate în această etapă, bazate pe explicațiile și situațiile deja existente pe site. Nu reprezintă cazuri reale de cliente, rezultate sau componente noi validate ale metodei. Nu atribuie diagnostice sau cauze obligatorii.

Total rezultat: **82 de articole și 98 de pagini indexabile în sitemap**.

## Modificări tehnice

- Linkurile din HTML-ul generat către pagini cunoscute ale site-ului folosesc adresele finale fără .html, reducând redirecționările. Ancorele și parametrii se păstrează. Textele vizibile și stilurile nu sunt rescrise.
- Articolele au og:type=article; datele BlogPosting existente sunt păstrate.
- robots.txt din sursă indică acum domeniul oficial. robots.txt public era deja corectat de scriptul de construire.
- Sitemap-ul public era deja generat automat cu toate articolele; nu s-a reconstruit acest mecanism. Acum include și cele cinci pagini noi, în total 98 de adrese unice, canonice, fără extensia .html.
- Pe pagina Constelații, linkul către /acasa#calendar, secțiune inexistentă, a fost îndreptat către /lucram-impreuna#workshop-bacau.
- În catalogul programelor, linkul de prezentare al intensivului către /acasa#intensiv-noiembrie-2026, secțiune inexistentă, a fost îndreptat către pagina campaniei folosită deja de butonul de înscriere. Pagina campaniei a răspuns cu HTTP 200; conținutul sau găzduirea ei nu au fost modificate.

## Teste și publicare

- Construirea statică a trecut local pentru cele 82 de articole. Verificarea locală a acoperit partea SEO și navigarea; imaginile binare nu au fost descărcate în copia de lucru. În producție, ele sunt preluate de Cloudflare din repository, fără modificări.
- Pentru toate cele 98 de pagini generate: title și meta description prezente și unice; exact un H1; canonical către pagina proprie; linkuri interne către pagini existente; fără destinații HTML care necesită redirecționare.
- Fiecare articol are un obiect BlogPosting cu mainEntityOfPage corect și og:type=article.
- Sitemap local: 98 de adrese unice, exact paginile generate.
- Verificare ancore după corecții: zero ancore interne inexistente.
- Test de păstrare a surselor: niciun câmp editorial existent nu a fost modificat, cu excepția completării metadatelor lipsă și a adăugării secțiunii de linkuri la articolul comun. Titlurile vizibile și exemplele existente sunt păstrate.
- Cloudflare Pages: intoarcerealatine-nou a raportat success pentru ambele commituri de modificare.
- Verificare directă pe domeniul oficial după lotul SEO: **98/98 pagini cu HTTP 200, titlu, descriere și canonical conforme cu versiunea generată**.
- Sitemap-ul public a fost descărcat și confirmat: 98 de adrese unice, cu cele cinci răni separat.
- Ultimele două destinații de link au fost confirmate pe domeniul oficial după al doilea deployment; ancorele vechi nu mai apar în cele două pagini. Rezultatele sunt salvate în fișierul de verificări al auditului.
- Nu s-a efectuat un audit vizual complet pe telefon sau un test al tuturor serviciilor externe. Designul, CSS-ul și imaginile nu au fost modificate.

## Suprapuneri și probleme rămase

Nu s-a șters, combinat sau redirecționat niciun articol către alt articol. Toate au canonical propriu. Titlurile și descrierile finale sunt unice, dar unicitatea metadatelor nu elimină suprapunerea de conținut.

Perechi care tratează situații foarte apropiate și merită urmărite în Search Console:

| Temă | Articole apropiate |
|---|---|
| Tricou și ghiozdan | cand-te-pui-mereu-pe-ultimul-loc; cand-te-pui-pe-ultimul-loc; de-ce-ma-simt-vinovata-cand-ma-aleg-pe-mine |
| Ajutor refuzat | cand-refuzi-ajutorul-dar-te-doare-ca-nu-l-primesti; cand-refuzi-ajutorul |
| Nevoie de aprobare | cand-ceri-aprobare-inainte-sa-decizi; cand-ceri-aprobare |
| Blocaj după încercări | de-ce-ma-simt-blocata-desi-stiu-ce-vreau-sa-schimb; cand-te-simti-blocata-dupa-multe-incercari |
| Abandon | frica-de-abandon-in-relatii; frica-de-abandon-cand-celalalt-se-indeparteaza; cand-te-temi-sa-fii-parasita; rana-de-abandon |
| Respingere | frica-de-respingere-si-limite; frica-de-respingere-cand-nu-spui-ce-vrei; rana-de-respingere |
| Rușine și expunere | rusinea-de-a-fi-vazuta-asa-cum-esti; frica-de-critica-si-expunere; frica-de-judecata-si-vizibilitate; rana-de-umilinta |

Cele cinci pagini noi explică separat denumirile; articolele anterioare rămân centrate pe situațiile cotidiene. Această diferențiere nu garantează că Google le va indexa separat.

Generatorul existent semnalează multe texte scurte și finaluri repetitive. Sunt observații editoriale interne, nu erori de construire și nu o regulă Google privind un număr minim de cuvinte. Nu am lungit artificial textele și nu am rescris automat informațiile validate. O eventuală revizie de fond trebuie făcută separat de auditul tehnic SEO.

Proiectul Cloudflare separat intoarcerea-la-tine-campanii a raportat build failure pentru commiturile repository-ului, deși pagina de campanie existentă răspunde cu HTTP 200. Nu s-au modificat configurarea acelui proiect, pagina de campanie, Netlify sau alte ramuri. Eșecul acelui build trebuie investigat separat; nu este succesul deployment-ului site-ului oficial.

## Google Search Console — următorul pas

Nu am accesat proprietatea Search Console. Nu declar un număr de pagini indexate sau poziții în căutări.

1. Deschide proprietatea pentru iuliabobeica.ro la https://search.google.com/search-console/ .
2. La Sitemaps verifică https://iuliabobeica.ro/sitemap.xml : stare Success, data ultimei citiri și numărul de pagini descoperite. Dacă sitemap-ul este deja trimis, verifică-l înainte de retrimitere.
3. Folosește URL Inspection pentru cele cinci pagini rana-de-..., apoi Test live URL. Verifică accesibilitatea, permisiunea de indexare și adresa canonică declarată. Solicită indexarea paginilor noi dacă testul este în regulă.
4. Verifică Pages/Page indexing: Discovered – currently not indexed, Crawled – currently not indexed, Duplicate și canonical selectat de Google. Compară în special perechile din tabel.
5. În Performance urmărește separat interogările «rana de abandon», «rana de trădare», «rana de respingere», «rana de umilință», «rana de nedreptate». Verifică dacă două pagini concurează pentru aceeași interogare și dacă atrag vizite relevante.

Publicarea și accesibilitatea sunt confirmate prin teste. Indexarea, alegerea snippetului și pozițiile rămân de verificat în Google.

## Documente salvate

- INVENTAR-SEO-2026-10-31.md — toate cele 98 de pagini și starea metadatelor.
- INVENTAR-SEO-2026-10-31.csv — inventar complet cu titlu, descriere și canonical.
- VERIFICARI-SEO-2026-10-31.json — rezultate de verificare publică și ancore.

Referințe metodologice: https://developers.google.com/search/docs/appearance/title-link ; https://developers.google.com/search/docs/appearance/snippet ; https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap .
