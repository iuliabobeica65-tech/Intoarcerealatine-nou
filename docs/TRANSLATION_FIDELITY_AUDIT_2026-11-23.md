# Revizie de fidelitate RO–EN — 23 noiembrie 2026

Ramură: `preview-integrare-bilingv-seo-2026-11-23`. Bază verificată: `daa4f93`. **Fără aprobare de publicare; fără merge sau deploy.**

## Traduceri verificate și corectate

- Au fost comparate integral cele **17 pagini și 82 de articole EN**, inclusiv versiunile de lucru ale metodei, legilor universale, constelațiilor și paginii „Lucrăm împreună”. 16 pagini și 82 articole sunt verificate în această revizie; pagina mărturiilor rămâne **NECONFIRMATĂ PARȚIAL**, exclusiv pentru fragmentul descris mai jos.
- Cele 10 pagini principale care aveau traduceri comprimate sau incomplete au fost corectate după structura HTML originală: toate secțiunile, cardurile, listele, întrebările, FAQ, exemplele, CTA și informațiile despre programe. Stilurile și resursele originale sunt reutilizate, fără redesign.
- Denumirea oficială **Echilibrarea rădăcinilor** este păstrată în toate cele 99 de documente EN, inclusiv în metadatele destinate publicului. URL-urile existente rămân aceleași.
- Au fost recuperate recomandările și CTA-urile originale în **6 articole**; au fost eliminate cele **82 de avertismente generice adăugate de traducere**, absente din original. Avertismentele scrise de autoare în corpul textelor sunt păstrate.
- Au fost restabilite data, tipul articolului și conținutul subsolului original. În **22 de carduri**, descrierea editorială a fost tradusă separat de descrierea SEO, în loc să fie înlocuită cu aceasta. Cele 4 legături rămase către articole RO au fost trecute la echivalentele EN existente.
- Textele vizibile din cele **7 imagini ale caruselului metodei** și din cele **13 fotografii ale mărturiilor** au corespondențe text EN; imaginile originale nu au fost editate. Formulările și relația dintre constelații, metodă și creația conștientă urmează exact sursele, inclusiv acolo unde sursele folosesc formulări diferite.
- Fișierele RO, sursele editoriale JSON, CSS/JS partajate, consimțământul, Calendar, formularele, newsletterul/Brevo și plățile nu au fost modificate sau activate. Au fost completate alternatele lingvistice lipsă pentru cele 6 articole mai vechi.

Lista celor 99 de corespondențe, starea fiecăreia și amprentele SHA-256 se găsesc în [registrul reviziei](TRANSLATION_REVIEW_LEDGER_2026-11-23.json). Starea „verificat” descrie această revizie, nu aprobarea editorială a Iuliei pentru producție.

## Build și teste statice

- Build static: reușit; **82 articole RO + 82 articole EN**, 17 pagini EN, **198 URL-uri** în sitemap.
- `scripts/check-bilingual.mjs`: trecut; Calendar, consimțământ și metadate bilingve păstrate.
- `scripts/check-seo-geo.mjs`: trecut, **0 erori și 0 avertismente**.
- `scripts/check-translation-parity.mjs`: trecut. Testul caută acum numele real al paginii generate a metodei, după redirectul deja existent; pragul testului nu a fost redus.
- `scripts/check-english-articles.mjs`: trecut pentru **toate cele 82 de articole**, nu doar cele două loturi noi. Verificarea acceptă și contactele din subsolul RO original, restaurat în EN.
- `scripts/check-remaining-translations.mjs`: trecut.
- `qa/check-translation-integrity.mjs`: trecut pentru **17 pagini + 82 articole**; ordine și niveluri de headinguri, unități structurale, CTA originale, imagini, stiluri originale, toate destinațiile și ancorele EN. Textele din imagini sunt verificate separat de paragrafele HTML originale.
- Corecția din testul SEO/GEO este de portabilitate: identificarea folderului `articole` funcționează și cu separatorul de cale Windows. Numărul așteptat de 82 de articole rămâne obligatoriu.

## Cookies și mobil

- Testul existent de consimțământ: trecut — afișare inițială, fără analiză înaintea acordului, refuz persistent, redeschidere, acceptare și retragere.
- Testul existent mobil/conversie: **28 de combinații**, 7 pagini × 4 lățimi, fără probleme.
- Testul existent `qa/browser-smoke.mjs`: **36 de combinații**, 9 pagini × 4 lățimi, fără probleme. Testul anunță că verificarea câmpului CMS `contact-title` este omisă deoarece selectorul nu există; nu a fost modificat pentru această revizie.
- Verificare EN suplimentară: **150 de combinații** (toate cele 82 articole la 390 px și cele 17 pagini la 320/390/768/1440 px), fără erori, depășire orizontală sau excepții JavaScript; galeria și legăturile Calendar funcționează.
- Verificare finală carusel: 4 lățimi, cu cele 7 texte EN deschise și asociate imaginilor originale.
- `qa/check-cms.py` nu poate fi rulat local: mediul Windows nu are un interpret Python utilizabil. Rezultatul său din GitHub Actions va fi raportat separat; nu este declarat trecut prin presupunere.

## Aspecte pentru decizia Iuliei

1. **NECONFIRMAT**: în mărturia din fotografia `marturie-10.jpg`, formularea „Și mi-a zis de la 1 este closer” nu permite stabilirea sigură a sensului lui „de la 1”. Fragmentul EN este păstrat literal, cu atribut intern `data-translation-status="unconfirmed"`; nu este prezentată o interpretare inventată. Este necesară clarificarea Iuliei.
2. Pagina programului de grup păstrează înscrierea până la **15 noiembrie 2026**, termen trecut la data reviziei. Nu am schimbat termenul, prețurile, duratele sau disponibilitatea din sursa RO. Actualizarea lor necesită decizia Iuliei.
3. Grafica originală a metodei folosește titlul „Întoarcerea la tine” și expresii despre „vindecare”, „energie” și „dinamică ascunsă”. Acestea au fost traduse fidel, fără atenuare automată sau afirmații adăugate. Orice armonizare cu textele actuale ale metodei este o decizie editorială separată; imaginile RO au rămas intacte.

Nu există alte omisiuni identificate în textele HTML și sursele editoriale comparate. Fragmentul de mărturie nu este declarat finalizat.

[Ramura de test](https://github.com/iuliabobeica65-tech/Intoarcerealatine-nou/tree/preview-integrare-bilingv-seo-2026-11-23) · [PR #85, draft](https://github.com/iuliabobeica65-tech/Intoarcerealatine-nou/pull/85). Fără merge sau publicare.
