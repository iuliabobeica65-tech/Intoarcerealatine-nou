# Versiune completă locală — 16 noiembrie 2026

## Actualizare: sincronizare sigură autorizată (17 noiembrie 2026, ora locală)

Iulia a aprobat explicit excluderea temporară a unei singure ramuri. Configurația Cloudflare a fost salvată și recitită: `preview_deployment_setting=custom`, includere `*`, excludere exactă `codex/newsletter-complet-gdpr-2026-11-16`. Excluderea rămâne până la aprobare separată; nu se reactivează automat.

Comparația configurației înainte/după confirmă că ramura și regulile de producție, domeniile, configurația de build și mediile sunt neschimbate. Access rămâne activ pe proiectul izolat. Lista deploymenturilor nu s-a schimbat înainte de push. Site-ul public răspunde HTTP 200; conținutul este stabil după normalizarea exclusivă a codificării hex dinamice Cloudflare pentru adresele de e-mail.

Versiunea funcțională conservată este commitul `5612e66a669d4d3dca501a98b6d57f46a9969444`; commitul curent adaugă numai această actualizare de control. Destinația autorizată este [ramura GitHub de test](https://github.com/iuliabobeica65-tech/Intoarcerealatine-nou/tree/codex/newsletter-complet-gdpr-2026-11-16). Niciun merge, PR, deployment manual sau e-mail nu este inclus în această sincronizare.

Excluderile explicite au prioritate față de includere, conform [documentației Cloudflare](https://developers.cloudflare.com/pages/configuration/branch-build-controls/). Rezultatele verificărilor după push, SHA-ul final și backupurile sunt consemnate în punctul privat de reluare `.local/git-gdpr-integration-2026-11-16/RESUME.json`. Secțiunea de blocaj de mai jos descrie starea istorică de dinaintea aprobării. Colectarea publică, DOI în producție, welcome, promovarea, automatizările, plățile și facturarea rămân OFF.

Ramură: `codex/newsletter-complet-gdpr-2026-11-16`.
Punct local de plecare: `07791384cb869f18c168277a94ae3288b7c0ba7e`.
Comparație read-only cu `verificare-gdpr-2026-11-16`, commit `765973e6e8780320fd023a765acd643171cb4138`.

## Integrare selectivă

- Identitatea confirmată: **Bobeica Iulia-Alexandra**, persoană fizică; contact profesional `contact@iuliabobeica.ro`. Denumirea publică rămâne Iulia Bobeica – Echilibrarea rădăcinilor.
- Corecțiile compatibile de contact și identitate au fost preluate în paginile existente, termeni, configurația editorială și politica de cookies. Politica de cookies descrie GA4 după consimțământ și stocarea locală a opțiunii.
- Politica locală de confidențialitate, mai nouă și cu secțiunea newsletter, este păstrată integral. Auditul GDPR remote este păstrat ca referință datată, subordonată configurației locale actuale.
- Nu s-au importat alte funcționalități, pagini de programe, workflowuri sau schimbări de sitemap din ramura remote. Nu s-a făcut merge general peste lucrările locale.
- Toate cele 128 de fișiere originale modificate/neurmărite sunt păstrate cu hashurile originale în workspace și în backup privat. Versiunea Git separată anonimizează adresa reală de test din raport; contactul public profesional este păstrat.

## Verificări locale relevante

Configurația păstrează lista **#3**, DOI **#15**, consimțământ nebifat implicit și ancora politicii `/politica-confidentialitate#newsletter`. Formularul nativ, lista #4 și contactele existente nu au fost modificate. Implementările newsletter/Brevo și JavaScript-ul formularului sunt identice cu sursele locale deja validate; testele istorice nu au fost repetate.

Colectarea publică, welcome, promovarea, automatizările și plățile rămân OFF. DOI #15 este consemnat inactiv în dovezile existente; nu s-a apelat Brevo, nu s-a folosit cheia revocată și nu s-a trimis niciun e-mail. JSON-urile, consistența identității și a configurației, integritatea surselor și generarea exclusiv locală a pachetului Preview au fost verificate. Pachetul nu conține secrete sau legătură D1; toate cererile API de înscriere sunt blocate.

## Blocaj concret pentru sincronizare

Verificarea Cloudflare în citire a confirmat identitatea contului și protecția Access: ambele adrese ale proiectului izolat returnează 302 spre domeniul Access configurat.

Totuși, proiectul `intoarcerealatine-nou`, conectat la același repository și la domeniul oficial, are `preview_deployment_setting=all`, fără excluderi. Ramura nouă ar declanșa un build/deployment Preview. **Nu s-a efectuat push**, deoarece cererea interzice publicarea/deploymentul. Nu s-au schimbat setările Cloudflare, producția sau GitHub.

Pentru sincronizare este necesară aprobarea unei excluderi exacte a ramurii `codex/newsletter-complet-gdpr-2026-11-16` din buildurile Preview ale proiectelor conectate, urmată de reverificare. Nu este necesară schimbarea ramurii de producție sau dezactivarea globală a previewurilor. O eventuală publicare Preview protejată necesită aprobare separată.

## Înainte de activarea publică

Rămân validarea juridică a politicii, termenelor efective pentru dovezile DOI și dezabonări, retenției furnizorului, DPA/transferurilor și procedurii de exercitare a drepturilor; confirmarea monitorizării adresei profesionale; o cheie Brevo nouă în configurația privată și aprobarea finală separată a activării/publicării. Identitatea și amplasarea formularului sunt deja aprobate. Retenția la 6/12 luni rămâne propunere, fără ștergeri automate. Nicio mutare/reabonare de contacte și nicio presupunere privind transferul automat către o firmă viitoare.
