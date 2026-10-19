# Plan de implementare SITE V2 — 19 octombrie 2026

## Stare reală
- Site oficial (PĂSTRAT): https://spontaneous-quokka-e0bede.netlify.app/
- Repo: iuliabobeica65-tech/Intoarcerealatine-nou
- Ramura de lucru: pregatire-site-v2-vocea-iuliei-editor-2026-10-19
- Copie site actual: arhiva-site-inainte-adaptare-ton-2026-10-18
- Imaginile 01.webp…07.webp au fost recuperate fără transformare din feature/carousel-7-mesaje-site. Erau și în repo-ul istoric, dar NU în main al site-ului oficial.
- Galeria pregătită în acasa.html (ramura de lucru); cele 7 imagini NU sunt publicate automat.
- În `main` NU se schimbă nimic fără aprobare.
- Repository separat LIVE: iuliabobeica65-tech/intoarcerea-la-tine-live; nu se confundă cu fostul site din repo-ul `intoarcerea-la-tine-site`.

## Implementat în V2 (în GitHub)
1. Prima pagină: situații prezente concrete (decizii, limite, tipare, a face loc pentru sine), formulate fără a atribui cititoarei o cauză.
2. Parcursul metodei explicat la nivel introductiv în trei repere flexibile, fără a înlocui descrierea detaliată.
3. Galeria originală cu 7 imagini de creație conștientă (scroll pe telefon, fără script sau biblioteci externe).
4. Constelații: secțiune de întâlniri viitoare cu dată NEANUNȚATĂ, link WhatsApp, fără formulare.
5. Regulă editorială pentru toate modificările viitoare.

## De continuat, fără a strica paginile actuale
1. Validare de către Iulia a noilor formulări; comparație cu textele validate în dictări.
2. Reorganizarea detaliată, nu doar retușarea titlurilor, pentru fiecare pagină (Despre mine / Metoda CLAR / Program / Constelații / LIVE).
3. Bibliotecă de resurse proprii, cu un prim exercițiu validat explicit din metodă; nu reproduceri neautorizate din cursuri.
4. Calendar de evenimente alimentat de fișier editabil. Nu inventa evenimente sau locuri.
5. Editor de conținut simplu: evaluare Pages CMS vs Sveltia CMS. Pentru a funcționa, trebuie separat conținutul din HTML de layout, plus autentificarea GitHub și permisiuni; acest pas NU este încă implementat. Nu promite editare WYSIWYG direct pe pagină.
6. Audit CSS: pagina conține multe blocuri repetate; consolidare cu verificare vizuală pe mobil și desktop înainte de înlocuiri.
7. Actualizarea secțiunilor SEO și sharing, dar numai după verificarea legală și a imaginilor disponibile.
8. Alegere domeniu și configurare Netlify ori alt hosting DOAR după verificare, aprobare și acces.
9. Verificarea tehnică în browser (mobil 320/390px, desktop 1440px), a linkurilor și a politicilor înainte de publicare.

## Strategie pentru costuri
- Netlify Free: 300 credite/lună (limita lunară).
- Netlify Personal: 9 USD/lună, 1.000 credite/lună. Sursă oficială: https://www.netlify.com/pricing/
- Atenție la opțiunea de reîncărcare automată a creditelor; neactivată implicit pe Personal.
- Domeniul este separat de abonamentul Netlify.
- Nu cunoaștem soldul real al contului și data exactă de resetare; sunt vizibile doar în dashboardul utilizatoarei.
- Dacă alegem Cloudflare Pages, întâi testăm migrarea pe copie, fără a deconecta domeniul/site-ul actual.

## Publicare
Nu face merge în main și nici deploy fără revizuirea și aprobarea Iuliei.
