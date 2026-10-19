# GDPR și cookies — verificare înainte de prima publicare
Data: 19.10.2026 · Site: „Întoarcerea la tine” · **document tehnic de control, nu aviz juridic**

## Confirmat în codul V2
- Site de prezentare HTML/CSS/JavaScript; editorul Pages CMS este o aplicație separată de administrare și nu introduce autentificare vizitatorilor pe site.
- JavaScriptul propriu încarcă JSON local (texte, contacte, calendar), afișează elementele din carusel și citește configurația. În codul controlat în repository nu au fost integrate explicit Google Analytics, Meta Pixel, formulare, plăți, newsletter, tracking sau identificatori publicitari.
- Butoanele WhatsApp/Messenger/email sunt linkuri către servicii externe; folosirea lor implică alte servicii și propriile lor politici.
- Paginile `politica-confidentialitate.html`, `politica-cookies.html` și `termeni-utilizare.html` există și sunt accesibile în subsol.
- **Faptul că nu se văd cookie-uri în codul propriu NU dovedește absența cookie-urilor furnizorului de găzduire.** Bannerul de consimțământ nu trebuie adăugat doar decorativ.

## De verificat efectiv în browser, înainte de publicare
1. În browser privat/incognito, deschide pagina de start pe adresa FINALĂ de găzduire, înainte de clicuri pe WhatsApp/Messenger. În DevTools > Application/Storage > Cookies, examinează toate cookie-urile site-ului; în Network urmărește orice `Set-Cookie` transmis în răspunsuri, cereri către terți și eventuale date în Local Storage.
2. Repetă verificarea pe paginile principale, pe paginile juridice și după interacțiunea cu meniul și caruselul.
3. Pentru fiecare cookie/tehnologie: furnizor, denumire, scop, categorie (strict necesar sau nu), durată, justificarea legală, politica aplicabilă. Dacă există tehnologii neesențiale care cer consimțământ, blochează-le înainte de acord și oferă Refuz/Accept/Preferințe înainte de lansare.
4. Compară rezultatul cu textul din `politica-cookies.html` și `politica-confidentialitate.html`. Corectează afirmațiile care nu corespund gazdei alese.
5. Verifică politica de confidențialitate cu privire la identitatea persoanei care administrează site-ul, scopuri, temeiuri, destinatari, retenție, transferuri în afara SEE, drepturi și contact. Nu inventa CUI, adresă de firmă ori statut PFA.
6. Verifică HTTPS, toate linkurile de contact, legăturile din subsol și accesibilitatea politicilor juridice de pe domeniul ales.
7. Pentru lansare pe Cloudflare Pages, actualizează referințele Netlify din documentele legale **înainte de lansare**. Dacă rămânem pe Netlify, păstrează doar informațiile confirmate despre Netlify.
8. După publicare, repetă auditul pe domeniul propriu și la fiecare adăugare de analytics, pixeli, formulare sau instrumente noi.

## De ce nu pot marca verificarea juridică «finalizată» acum
- Furnizorul definitiv nu este încă stabilit (Netlify vs Cloudflare).
- Domeniul `intoarcerealatine.ro` nu este cumpărat încă.
- Nu avem în acest context un browser conectat la contul proprietarei pentru a inspecta cookie-urile efective și nici o evaluare juridică profesionistă.

## Reguli de publicare
- Nu introduce din proprie inițiativă pixeli, analytics, pluginuri de marketing, formulare sau procesatori de plăți.
- Nu lansa dacă sunt identificate tehnologii neesențiale fără un mecanism real și funcțional de consimțământ.
- Păstrează versiunile legale și istoricul modificărilor în GitHub.
