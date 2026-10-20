# VERIFICARE V2 — 19.10.2026
## Stare
**Pregătire exclusiv în GitHub pe ramura `pregatire-site-v2-cu-carusel-editor-2026-10-19`. Nu s-a făcut merge în main și nu s-a publicat pe Netlify.**
Site oficial: https://spontaneous-quokka-e0bede.netlify.app/

## Livrabile pregătite
- 7 pagini: acasa, metoda-clar, constelatii, lucram-impreuna, despre-mine, live, resurse.
- 7 imagini **originale, neschimbate** `assets/carusel-metoda/01.webp`–`07.webp`; caruselul din prima pagină rămâne în ramura V2.
- Secțiuni introductive empatice pe homepage; exemplu declarat ilustrativ; secțiune despre Iulia; calendar informativ.
- CSS comun mutat în `assets/site-base.css` și `assets/site-theme.css`, extras din stilurile care erau identice pe toate paginile, fără rescrierea regulilor. Stilurile specifice au rămas în pagină.
- Configurare Pages CMS: `.pages.yml`, `content/*.json`. Scriptul `assets/content-editor.js` citește JSON și nu folosește servicii externe. Textul HTML rămâne fallback dacă JSON nu se încarcă. Încă nu este o verificare reală a autentificării în CMS.
- 6 pagini interioare au câmpuri editabile: titlul, introducerea, primul titlu de secțiune. Pagina principală: titlu, subtitlu, fotografie, două butoane și textul de recunoaștere. Calendarul: listă de întâlniri.
- Pagina de resurse conține exemple editoriale, nu mărturii sau cazuri reale.

## Verificări efective ale codului GitHub
- Un singur H1 per pagină; zero ID-uri duplicate.
- Referințele relative către fișiere existente sunt valabile.
- Legăturile inter-pagini cu ancore au destinații existente.
- Scriptul CMS trece verificarea sintactică JavaScript.
- Nu au fost șterse fișiere din ramura principală; aceasta nu s-a modificat în timpul pregătirii V2.
- Cele șapte imagini există pe ramura V2.

## Limitări și verificări obligatorii înainte de publicare
1. **Nu există testare vizuală efectivă în browser pentru ramura V2.** E necesară verificarea la 320, 390, 768 și 1440 px, în special galeria și meniul mobil.
2. **Nu am verificat conectarea Pages CMS cu contul GitHub.** Utilizatoarea trebuie să autorizeze aplicația.
3. Testează explicit că schimbarea câmpurilor din CMS modifică pagina, iar modificările nu afectează sursa `main` fără aprobare.
4. Schimbarea fotografiei prin câmpul CMS trebuie verificată pe site-ul de previzualizare.
5. Verifică contrastul, cititoarele de ecran, cookie-urile/scripturile și documentele juridice înainte de lansare.
6. Verifică separat dacă Netlify mai permite deploy sau dacă este preferabil Cloudflare Pages; conectarea la producție numai la cererea utilizatoarei.
7. Imaginile din carusel pot conține texte cu afirmații metaforice/mai tari decât explicațiile prudente de pe site. Textul din imagini se verifică împreună cu utilizatoarea înainte de publicare. Textele originale de pe imagini nu au fost modificate.
8. Constelațiile sistemice sunt activitate separată, nu pas obligatoriu al Metodei CLAR. Nu promite rezultate.

## Regula de ton
Se aplică `REGULA_VOCE_BLANDA_IULIA.md`: blând, cald, personal, curios, fără marketing apăsat, fără asumarea durerii oricărei femei. Nu atribui Iuliei drept citate textele noi redactate de asistent.

## Plan de găzduire cu costuri reduse
- Netlify: păstrează site-ul oficial fără schimbări până la testare și aprobare; nu cumpăra abonament fără verificarea consumului real.
- Cloudflare Pages: GitHub poate publica aceleași pagini statice din ramura confirmată, fără compilare. Alegerea platformei și adăugarea domeniului sunt operațiuni ulterioare, după aprobarea utilizatoarei.
- Pages CMS permite editarea câmpurilor definite, dar nu este un editor vizual direct în pagină și **nu elimină necesitatea de redeploy**.

## ACTUALIZARE 19.10.2026 — VERIFICĂ RAPORTUL CEL MAI RECENT
Acest document a fost întocmit înainte de extinderea editorului și a optimizărilor ulterioare. Rezultatele noi și limitele actuale sunt consemnate în **`RAPORT_FINAL_PREGATIRE_SITE_19_10_2026.md`** și în **`EDITOR_PENTRU_IULIA_START_AICI.md`**. Cele șapte pagini au acum câmpuri suplimentare pentru texte și linkuri; nu confunda această versiune veche a verificării cu starea actuală. Nu există aprobarea lansării în producție.
