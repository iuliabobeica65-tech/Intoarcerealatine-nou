> Decizia curentă newsletter: [colectare voluntară, numai DOI, fără welcome sau promovare](NEWSLETTER-COLECTARE-PREVIEW.md). Preview privat, colectare OFF; condițiile pentru activare sunt în raport.

# Finalizare tehnică — starea stabilă din 15.11.2026

Stare curentă autoritară pentru ramura `pregatire-infrastructura-email-plati`, proiectul `er-brevo-test-izolat`. Cod salvat local; fără push, merge sau modificări în producție. Notele istorice rămân dovezi, nu instrucțiuni de activare.

## 1. Complet implementat și verificat în limitele descrise

- Testul privat aprobat a reușit: browser → formular → API → Turnstile real → D1 → administrare. Un eveniment sintetic, un participant `example.invalid`, înscriere `confirmed`, afișare în administrare și anulare `cancelled`. Nu s-au repetat scenariile vechi de capacitate/concurență, Access sau DOI.
- Identitatea, proiectul, ramura, starea OFF, Access și lipsa operațiunilor concurente au fost verificate înaintea modificărilor. Exportul D1 și reperul Time Travel au fost salvate înaintea testului. Un deployment de validare și deploymentul obligatoriu OFF; nicio altă publicare.
- Restaurare completă în **155 secunde**, sub limita de 15 minute: configurația preview restaurată exact, fără binding D1 și fără secrete temporare; D1 restaurat, evenimentul/participantul testului eliminate, markerul rotit pentru blocarea deploymenturilor vechi. Starea anterioară de 2 înscrieri, 1 ofertă și 6 migrări este păstrată. Access activ. **154/154 hashuri OFF** și **3.845 fișiere de backup nemodificate**.
- Brevo: rezultatul DOI → confirmare → welcome deja validat este păstrat. Contactul testului precedent este Subscribed în lista #7; DOI #12 și welcome #14 au fost livrate. Automatizarea #2 și DOI #12 au fost dezactivate după acel test; nu s-au reactivat în această execuție. Cheia expusă este Deactivated și a fost eliminată din configurația privată; nu a fost reutilizată.
- Newsletter: formularul, acordul explicit, ledgerul HMAC/versiune/oră și adaptorul DOI sunt implementate. Confirmarea efectivă a consimțământului rămâne în Brevo, nu se deduce din redirect. Există un singur sender welcome prin automatizarea Brevo, fără welcome duplicat în outbox. Corecția redirectului izolat către pagina publică existentă `/live` este păstrată local, fără retrimitere.
- Corecții locale noi în formularul comun newsletter/evenimente: o singură cerere în curs; un token Turnstile vechi este invalidat la eroare; după trimitere este necesar un token proaspăt. Trei verificări locale noi au trecut; bundle-ul API final se compilează. Verificările istorice trecute sunt reutilizate, nu rerulate. Aceste corecții ulterioare testului privat sunt validate local, nu printr-un nou deployment.
- Înscrierile și administrarea existente sunt păstrate: capacitate, stări, participanți, anulare și controale administrative. Nu s-au rescris implementările validate. Scanare: 49 fișiere, zero secrete găsite. Zero e-mailuri noi, plăți, facturi sau operațiuni Brevo în această execuție.

## 2. Pregătit, dar inactiv

- Profilul OFF canonic: `docs/cloud-validation/isolated-current-off.json`. Toate comutatoarele sunt false, inclusiv noul comutator Google; fără secrete sau binding D1 în profil. Cloudflare este OFF, cu Access activ.
- Mapare Brevo unică: `docs/brevo-pregatire/activation-map.json`. Fluxul izolat validat: lista #7, DOI #12, automatizare #2, welcome #14. Formularul nativ existent rămâne pe #4/#8, nemodificat. API-ul public pregătit folosește lista #3; ID-urile DOI/automatizare/welcome publice necunoscute sunt `null`, nu sunt înlocuite cu cele de test. Automatizarea #1 nu este activată implicit. Fără modificarea profilurilor sau a consimțămintelor existente.
- Google Appointment Schedules: integrare locală prin link, fără API Calendar, motor nou, embed sau notificări duplicate Brevo. API-ul expune URL-ul numai cu `GOOGLE_APPOINTMENTS_ENABLED=true` și o destinație HTTPS validă pe domeniul Google permis. Butonul pregătit în `sedinte-individuale.html` rămâne ascuns, WhatsApp este păstrat. Vizitarea paginii nu contactează Google. Validarea URL-ului este comună serverului și browserului, fără două configurații divergente.
- Plăți: componentele Stripe de test, semnături webhook, idempotență și reconciliere sunt păstrate cu rezultatele locale existente. Fără tranzacții sau activare. Codul curent acceptă numai modul de test; plățile live necesită implementarea și validarea ulterioară a profilului live, după clarificări.
- Facturare: modele, validări și evidență pregătite; emiterea fiscală este blocată explicit. Transportul real al furnizorului nu este implementat până la alegerea modului și completarea datelor fiscale. Nu reprezintă facturare funcțională public.

## 3. Ce mai lipsește pentru funcționarea publică

- Configurația publică aprobată pentru newsletter: lista finală și ID-urile DOI/welcome/automatizare, trigger strict după DOI și Subscribed, reentry OFF, fără alt sender sau formular care să dubleze welcome. Testul DOI izolat nu trebuie repetat.
- URL-ul și setările paginii Google existente; după furnizare, confirmarea destinației și, numai cu aprobare separată, o rezervare reală pentru verificarea notificărilor/reprogramării. Integrarea locală de link este pregătită, rezervarea reală nu este validată.
- Datele ofertelor publice, capacități, date/orar/fus, locații și prețuri; textele și ID-urile mesajelor operaționale și politica lor de programare. Nu există un scheduler extern instalat implicit.
- Configurarea autorizată a mediului public: origine, D1, Turnstile pentru domeniul public, secrete noi private, protecția administrării, monitorizare și restaurare. Mediul izolat rămâne privat; nu se dezactivează Access pentru a lansa formularele oficiale.
- Politici/confidențialitate și date juridice/fiscale aprobate; implementarea rămasă pentru transport fiscal și profilul de plată live, apoi validările lor autorizate. Nu există o eroare cunoscută rămasă din testul privat; aceste lipsuri sunt condiții reale pentru lansare, nu diagnostice de reluat.

## 4. Informații de furnizat

1. URL-ul oficial copiat din pagina de programări Google și confirmarea serviciului, duratei, disponibilității, bufferului, calendarului, fusului orar și notificărilor; păstrează plățile Google dezactivate. URL-ul pregătit trebuie să fie fără query sau fragment; dacă linkul copiat diferă, îl analizăm înainte de configurare. Nu trimite coduri de autentificare.
2. Aprobarea mapării publice Brevo #3 sau lista finală aleasă, ID-urile finale DOI/welcome/automatizare și textele aprobate. Expeditorul/Reply-To validate anterior: `contact@iuliabobeica.ro`.
3. O **cheie Brevo nouă**, numai în configurația privată `.local/brevo-isolated-preparation-2026-11-15/secrets-private.json`, câmpul `BREVO_API_KEY`, când este necesară o operațiune API autorizată. Nu în chat, fotografie, surse sau GitHub; vechea cheie rămâne interzisă. Configurația aceasta este privată, nu se publică.
4. Catalogul ofertelor și, pentru încasări/facturi, identitatea juridică, datele firmei/fiscale, furnizorul, TVA/serii/reguli și clarificările contabilului. Nu sunt completate valori fictive.

## 5. Aprobări obligatorii

Testul privat descris a fost aprobat, executat o singură dată și închis prin OFF. Nu mai este cerută aprobarea lui. Pregătirea locală este încheiată în limita informațiilor disponibile.

Orice deployment ulterior, modificare de resurse active, trimitere reală, rezervare reală sau activare publică necesită aprobare separată pentru configurația concretă. Plățile/facturile necesită clarificările și implementările din secțiunea 3 înaintea unei aprobări de test/activare. Nu există acum o cerere de activare publică incompletă sau o aprobare implicită pentru GitHub/producție.

## 6. Ce poate fi publicat ulterior

Codul formularelor, administrării și legăturii Google poate intra într-un pachet revizuit cu funcțiile OFF, după aprobarea publicării. Rezultatele existente susțin funcționarea izolată a înscrierilor/administrării și Brevo DOI/welcome; nu garantează configurația publică încă nespecificată. Nu se publică `.local`, exporturi D1, backupuri private, secrete sau fișiere administrative fără protecție. Activarea funcțională rămâne separată de publicarea codului. Nu recomandăm publicarea pachetului privat de validare drept site oficial.

## Punct sigur de reluare

- Stare: `docs/stare-infrastructura.json`, câmpul `currentReadiness`; țintă și OFF curent în `docs/cloud-validation/contract.json`.
- Dovezi: `.local/final-execution-2026-11-15/browser-result.json`, `off-final.json`, `backup-verification.json`, `final-verification.json`; capturi `registration-confirmed.png` și `administration-confirmed.png`. Exportul/reperul D1 sunt păstrate privat în același director. Nu publica logurile private.
- OFF curent: deployment `3fa0d41c-2fa6-4a16-83c7-67a23860fec0`, artefactul OFF original cu 154 hashuri este păstrat. Pachetul privat de 13 fișiere testat rămâne nemodificat ca dovadă.
- Arhivă locală stabilă fără configurații private: `.local/final-execution-2026-11-15/stable-sources.zip`, cu manifest și hash separat. Arhivele anterioare și cele 3.845 de fișiere din backupuri sunt intacte. Nu s-a efectuat commit/push sau modificare de ramură.
- Reluare: citește acest raport și maparea canonică; completează informațiile lipsă, păstrează OFF și rezultatele testelor, pregătește configurația concretă de lansare pentru aprobarea separată. Nu relansa testul deja trecut sau vechile scripturi de diagnostic.

Referință pentru integrarea Google prin link: [documentația oficială Google](https://support.google.com/calendar/answer/10733297?hl=en).
