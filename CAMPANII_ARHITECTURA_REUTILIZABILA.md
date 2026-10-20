# Arhitectura campaniilor — hotărâre de implementare
20 octombrie 2026 · reper pentru Codex/ChatGPT · ramura de lucru `feature/intensiv-whatsapp-2026-10-20`

## Recomandare implementată în cod
**Un singur proiect Cloudflare Pages destinat tuturor campaniilor**, separat de site-ul oficial. Fiecare campanie nouă primește **o pagină cu URL propriu și stabil**, dar reutilizează stilul, fotografia și infrastructura. Aceasta este soluția cu cele mai puține setări și costuri suplimentare.

- Site-ul oficial: repository-ul/ramura și proiectul Cloudflare deja existente. **NU îl modifica**.
- Microsite-ul campaniilor: un **al doilea proiect Cloudflare Pages**, conectat la ramura de campanii `feature/intensiv-whatsapp-2026-10-20` din repository-ul existent `iuliabobeica65-tech/Intoarcerealatine-nou`; doar fișierele exportate în `dist-campanii` ajung pe acest al doilea proiect.
- Build command: `node scripts/build-campaigns.mjs`
- Output directory: `dist-campanii`
- Framework: None; Root directory: `/`.
- Campania actuală: `campanii/nu-mai-vreau-asa/index.html` → pe Cloudflare public la `/nu-mai-vreau-asa/`.
- Stilul reutilizabil: `campanii/assets/campaign.css`.
- Link grup: `https://chat.whatsapp.com/Jc7JR8fdItK82QeTleS732?s=cl&p=a&mlu=4&ilr=4`. Salvat și inclus în butonul campaniei.
- Rădăcina microsite-ului redirecționează vizitatorul spre campania activă; paginile vechi păstrează permalink-ul fără redirecționări obligatorii.
- Pentru o viitoare campanie: se face un folder nou `campanii/<slug>/index.html`, se adaugă slug în lista `folders` a build-ului, se verifică și se publică separat. Nu se rescrie campania precedentă decât pentru corecturi.
- Politici juridice din repository sunt copiate la build și adaptate nominal pentru Cloudflare. Ele necesită verificare finală în contextul proiectului efectiv, mai ales vizibilitatea numărului de telefon în grupul WhatsApp.

## De ce nu o singură pagină suprascrisă pentru toate
O campanie încheiată poate continua să aibă vizitatori din postări vechi. Păstrarea fiecărei pagini la propriul URL evită ca o reclamă/postare veche să conducă neașteptat la altă campanie. Noul microsite nu necesită proiect Cloudflare nou pentru fiecare campanie, deci este simplu de administrat.

## Atenție la publicare
- Noul proiect Cloudflare **nu este creat prin acest commit**. Este necesară crearea/legarea în contul Cloudflare al utilizatoarei, acces neacordat acestei sesiuni.
- **Nu comasa** această ramură în ramura de producție a site-ului oficial, deoarece acolo ar introduce modificări ale build-ului principal deja aflate în ramura feature.
- **Nu pretinde** că `/nu-mai-vreau-asa/` este public până nu există URL `*.pages.dev` verificat.
- Evită publicări dese: pregătește în această ramură, verifică tot, apoi fă un singur deploy de lansare. Ulterior actualizează exclusiv microsite-ul.
- Pentru următoarele campanii, ideal de separat definitiv codul într-un repository GitHub exclusiv de campanii, ca să nu existe deloc riscul modificării site-ului principal. Codul este deja structurat sub `campanii/`, dar **separarea repo-ului este un pas viitor neefectuat**, nu o stare deja realizată.
- Pentru a utiliza într-adevăr proiect Cloudflare independent din **același repository**, configurează proiectul campaniilor pe ramura `feature/intensiv-whatsapp-2026-10-20`, cu build-ul de mai sus, iar site-ul oficial să rămână conectat numai la ramura sa oficială. Verifică setările actuale înainte să legi noul proiect.

## Status
Sursa HTML, stilurile și scriptul build dedicate campaniilor sunt în GitHub. **Lansarea live, URL-ul Cloudflare și verificările browser după publicare sunt încă de efectuat.**
