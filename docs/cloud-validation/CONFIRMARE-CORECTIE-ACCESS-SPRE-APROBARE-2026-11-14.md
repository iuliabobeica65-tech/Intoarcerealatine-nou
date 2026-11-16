# Test unic de confirmare a corecției Access — pregătit, nepublicat

Ramură: `pregatire-infrastructura-email-plati`. Proiect: `er-brevo-test-izolat`, contul și Preview din `contract.json`. Nu se modifică alte proiecte sau Production.

## Reparat și verificat

Cauza confirmată local este opțiunea `redirect:'error'`, nesuportată de Workers și respinsă înaintea cererii JWKS. Corecția `redirect:'manual'` este deja aplicată în sursa locală; verificarea `response.ok` refuză în continuare redirecturile. URL-ul de echipă/JWKS, validarea criptografică, AUD și identitatea nu se modifică. Rezultatele existente workerd confirmă incompatibilitatea inițială și cele trei cazuri noi ale corecției; nu au fost rerulate.

Pachetul JSON de confirmare a fost compilat offline separat. `.local/access-confirmation-2026-11-14/current.txt` indică directorul nou, cu artefactul de trei fișiere, copia sursei și `manifest.json` (hashuri SHA-256, ținta exactă, limita de timp și referința restaurării OFF). Comparația cu Workerul publicat anterior este exact o singură înlocuire: `redirect: "error"` → `redirect: "manual"`. Fișierele de rutare și robots sunt copiate fără modificări. Nu conține credențiale, bindinguri D1 sau servicii de aplicație. Pachetul anterior și backupurile nu sunt suprascrise.

## Execuția propusă după aprobarea explicită

1. Preflight de siguranță numai pentru operațiunea aprobată: identitate/sesiune existentă, cont/proiect/ramură exacte; Access principal și wildcard numai pentru proprietară, AUD conform; snapshot complet al configurației; Preview OFF; zero bindinguri/secrete incompatibile; lipsa deploymenturilor active/concurente. Referința așteptată: șapte deploymenturi și OFF `aecd7d41-e6ad-42a4-ba69-3297fb442467`; orice diferență impune oprire și reconciliere, nu suprascriere.
2. Verifică hashurile pachetului nou și disponibilitatea celor 154 de fișiere OFF față de manifest. Pregătește cheia HMAC temporară locală și procedura de restaurare înainte de prima scriere. Sesiunea OAuth existentă poate fi reîmprospătată fără permisiuni suplimentare; nu se cere login nou preventiv.
3. Exclusiv Preview, setează temporar numai configurația minimă necesară verificării Access, toate cele șase flags externe false, fără DB sau chei de furnizori. Pornește monitorizarea restaurării înainte de activare. Expirare server la nouă minute; revenire automată anticipată la cinci minute, cu maximum 15 minute pentru întreaga activare/restaurare.
4. Publică **o singură dată** artefactul pregătit pe ramura permisă. Din Chrome cu sesiunea Access existentă, citește un singur GET pe rădăcina aliasului privat. Succesul cerut este JSON `{"authenticated":true}`; acesta confirmă întregul verificator Access pe această cerere, fără aplicație sau date de afaceri. Dacă este refuz, păstrează numai codul constant al etapei. Nu extrage cookie-uri/tokenuri, nu reiterează deploymentul, nu schimbă politici sau autentificare. Dacă browserul/autentificarea nu sunt disponibile, restaurează OFF și raportează limita.
5. După primul rezultat, restaurează imediat configurația inițială și republică obligatoriu artefactul OFF original. Verifică din nou 154/154 hashuri, Preview/Production egale snapshotului, eliminarea secretelor temporare, deployment OFF reușit și aliasul revenit, Access păstrat. Păstrează toate dovezile. La eșecul restaurării anunță imediat și oprește orice altă operațiune.

Sunt necesare în total **două deploymenturi aprobate: unul de confirmare și unul de restaurare OFF**, fără deploymenturi suplimentare. Scriptul vechii execuții are protecții împotriva reutilizării și baseline vechi; nu se rulează ca atare pentru testul nou. Procedura de execuție trebuie să consume manifestul nou și snapshotul proaspăt, nu contextul vechi.

## Ce lipsește efectiv

Pentru acest blocaj lipsește numai confirmarea reală cu pachetul corectat. Nu există un blocaj extern demonstrat care să necesite reautorizarea contului sau schimbarea Access. Succesul acestui test închide blocajul Access; nu certifică automat fluxurile funcționale externe încă nevalidate, consemnate în rapoartele existente. Acestea nu sunt reluate sau autorizate implicit prin acest test.

OFF nu a fost modificat în această etapă. Niciun deployment, apel API administrativ, reautorizare, modificare de date, Brevo, D1, Turnstile, producție sau GitHub. Au fost efectuate numai citiri locale, compilarea pachetului și comparația locală a diferenței.
