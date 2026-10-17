# Audit tehnic – Netlify (18.10.2026)

## Stare
Pagina publicată nu a fost modificată. Corecțiile de navigare și SEO sunt în ramura `audit-gdpr-cookies-seo`, nu în `main`.

## Confirmat din index.html
- Pagina nu include formulare HTML.
- Butoanele Messenger și WhatsApp sunt linkuri externe.
- Există 3 fișiere JavaScript locale exportate din Systeme.io (runtime, page, vendors) și 3 scripturi inline de inițializare. Atributul `data-cookieconsent="ignore"` NU este dovada unui sistem funcțional de consimțământ.
- În HTML nu apare un banner propriu de consimțământ și nu apar apeluri explicite `document.cookie` sau `localStorage`. Acest lucru NU dovedește că scripturile externe ori platforma nu setează cookie-uri.
- Linkurile pentru „Termeni de utilizare” și „Mențiuni legale și contact” indică încă pagini Systeme.io.
- În subsol există un mesaj că politica de confidențialitate și cea de cookies sunt în curs de finalizare.
- Metadatele SEO și ancorele navigării au fost corectate pe ramura de lucru. Imaginea OG rămâne de configurat.

## Înainte de publicare
1. Verifică în browser, pe Netlify, cookie-urile și cererile de rețea la prima vizită, fără consimțământ (inclusiv scripturile Systeme.io și resursele CloudFront).
2. Decide pe baza auditului dacă trebuie blocare preventivă a scripturilor neesențiale și banner cu Acceptă / Refuză / Preferințe. Un banner fără blocare nu rezolvă problema.
3. Redactează documentele legale folosind doar date confirmate despre operator, scopuri, destinatari, retenție, drepturi și contacte. Nu presupune existența unui PFA sau a unor servicii cu plată.
4. Publică documentele pe același domeniu și schimbă linkurile din subsol.
5. Alege o imagine publică pentru `og:image`, verifică navigarea și afișarea mobilă.
6. Testează într-un preview Netlify înainte de unirea ramurii cu `main`.

## Limitări
Acest fișier este un audit al codului, nu o confirmare de conformitate juridică sau o inspecție a cookie-urilor în browser.
