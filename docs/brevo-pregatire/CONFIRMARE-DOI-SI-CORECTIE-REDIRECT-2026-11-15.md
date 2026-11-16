# DOI confirmat în Brevo; redirectul izolat corectat local

## Confirmare efectivă

Verificarea UI Brevo a listei #7 afișează un contact: adresa nouă autorizată, profil #3. Profilul este Subscribed și are apartenență la lista de test #7. Istoricul arată DOI trimis/livrat la 11:24 și click DOI la 11:25, 15.11.2026, în orele afișate de interfață. Welcome-ul este trimis și livrat la 11:25; există o singură înregistrare de trimitere welcome în istoricul citit, urmată de deschideri și click. Deschiderile/clickurile repetate nu sunt tratate ca mesaje noi. Nu s-a cerut sau executat o retrimitere.

Înainte de click, citirea API salvată în `status-before-confirmation-private.json` arăta contact inexistent și nicio listă. După confirmarea declarată de Iulia și redirectul către Access, contactul există în #7 și welcome-ul este livrat. Deci confirmarea DOI a fost înregistrată efectiv în Brevo; autentificarea Cloudflare este pe navigarea ulterioară către destinația configurată. Nu este o condiție pentru confirmarea în Brevo și nu anulează confirmarea. Nu s-a capturat traficul autentificării Access pentru a pretinde un timestamp exact al interstițialului; ordinea rezultă din starea Brevo, istoricul aferent și rolul redirectionUrl.

Nu s-a fabricat un atribut de confirmare și nu s-au schimbat manual consimțăminte. Valoarea exactă DOUBLE_OPT-IN nu a fost recitită separat prin API după blocajul instrumentului; verdictul de confirmare se bazează pe noul contact, apartenența în lista inclusă după DOI și welcome-ul trimis prin fluxul cu condițiile deja verificate.

## Cauza redirectului privat

Adaptorul `requestDoi()` construia redirectionUrl ca `${origin}/comunitate?confirmare=brevo`. Execuția locală a folosit originea privată din contract, corectă pentru izolarea aplicației. Acea origine a fost folosită și ca destinație după DOI; Access activ a cerut autentificare la navigarea ulterioară. Nu este o eroare de DOI, de cheie JWT sau de protecție Access.

[Brevo DOI API](https://developers.brevo.com/reference/create-doi-contact) definește redirectionUrl drept pagina la care este trimis utilizatorul după clickul DOI. Destinația este stabilită în solicitarea API, nu în linkul static al șablonului, care păstrează `params.DOIurl`.

## Corecție strict pentru testul izolat

În `infrastructure/brevo.mjs` s-a adăugat suportul opțional **numai când TEST_MODE=true** pentru `TEST_DOI_REDIRECTION_URL`. Valoarea acceptată este exact `https://iuliabobeica.ro/live`; alte valori sunt refuzate înainte de rețea. Configurația locală a testului este `.local/brevo-single-test-2026-11-15/redirect-config.json`, consumată de runnerul său. Originea aplicației rămâne privată, validarea destinatarului/listei rămâne activă, iar comportamentul modului normal nu se schimbă. Nimic nu a fost publicat sau încărcat în cloud/GitHub.

Pagina publică `/live` a fost verificată în browser ca accesibilă fără Cloudflare Access. Este o pagină existentă de informații despre întâlnirile comunității, nu o pagină nouă de mulțumire și nu o dovadă server-side de abonare. Pagina `/comunitate` de pe domeniul oficial redirecționează în prezent la `/acasa`, deci nu s-a presupus că versiunea locală a comunității este publicată. Site-ul oficial a fost doar citit, nu modificat.

Trei verificări locale NOI ale corecției au trecut, cu zero cereri externe: destinația publică exactă în test și lista/template păstrate; destinație neaprobată refuzată înainte de apel; destinația modului normal neschimbată chiar în prezența variabilei de test. Nu s-au repetat suitele validate și nu s-a efectuat un nou DOI real. Dovezi: `.local/brevo-redirect-fix-2026-11-15/verification.json` și scriptul `verify.mjs`. Copiile sursei și runnerului de dinaintea corecției sunt păstrate în același director; toate backupurile existente rămân intacte.

E-mailul deja trimis păstrează destinația stabilită la expediere. Această corecție nu îi modifică retroactiv linkul. Blocajul de trimitere unică (`send-attempt.json`) a fost păstrat, iar un nou test real necesită aprobare nouă.

## Închidere și limite operaționale

Automatizarea #2 a fost dezactivată și UI a confirmat Inactive (ultima salvare afișată 16:49). DOI #12 a fost dezactivat și UI a confirmat Inactive (16:51). Nu s-a modificat starea contactului pentru închidere; consimțământul și istoricul nou rămân păstrate.

**Închiderea imediată după confirmarea inițială nu a fost realizată.** Revizuirea automată a blocat următoarea comandă API din cauza limitei de utilizare a serviciului de aprobare, nu din cauza unei determinări că citirea era nesigură. Resursele erau încă active la reluarea ulterioară și au fost închise atunci prin UI. Nu se declară o durată scurtă de activare sau respectarea promisiunii de închidere imediată. Citirea API respinsă nu a fost executată și nu a fost ocolită printr-o comandă shell alternativă. Verificările UI cerute ulterior și închiderea obligatorie au fost realizate separat prin interfața aplicației.

Nu există în această etapă o verificare API finală a întregii cozi sau comparația finală automată a profilurilor vechi. Nu s-au executat operațiuni de modificare pe acele profiluri. Cloudflare Access nu a fost schimbat, Cloudflare rămâne OFF conform stării existente, fără deploymenturi noi. Producția, site-ul oficial, GitHub, D1, Turnstile și backupurile nu au fost modificate. Nu au fost trimise mesaje suplimentare.
