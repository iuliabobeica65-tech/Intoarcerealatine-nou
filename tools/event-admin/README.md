# Interfață de administrare — previzualizare locală

Pornire din rădăcina proiectului: `npm run preview:admin`, apoi `http://127.0.0.1:4179/`. Oprire: Ctrl+C în terminal. În unele medii sandbox, accesul la loopback necesită executarea locală autorizată în afara izolării de rețea; nu se deschide accesul în rețea și nu se modifică firewallul.

Scop: verificarea în română a ecranelor pentru evenimente, locuri disponibile, înscrieri (cu filtrul anulate și paginare), coada mesajelor și evidența plăților. Previzualizarea arată avertizarea pentru revizie veche și mențiunea de revizuire contabilă. Toate persoanele, datele, sumele și evenimentele sunt sintetice, fără corespondență cu o ofertă reală.

Interfața folosește forma răspunsurilor API-ului administrativ existent, printr-un adaptor exclusiv pentru citire. Nu este conectată la API, D1, Brevo, Stripe, Calendar sau la o bază de date reală. Nu există formular de token, stocare localStorage/sessionStorage, apel fetch în aplicație, trimitere sau modificare de date. Nu este un panou live instalat. Nu se înlocuiește backendul existent și nu se construiește un sistem de programări.

Serverul se leagă numai la 127.0.0.1, validează Host, servește cinci fișiere prestabilite, refuză POST și API-uri și trimite no-store/noindex. CSP include connect-src 'none' și form-action 'none'. Acesta este un server pentru demonstrație locală, nu autentificare de administrator pentru date reale. Orice conectare ulterioară cere o etapă aprobată separat și păstrarea Cloudflare Access, tokenului server-side și originii verificate; nu se introduce secret în pagina publică sau URL.

Fișierele tools/event-admin nu sunt incluse de scripts/build-cloudflare.mjs; nu au fost copiate în dist sau în pachetul publicat. API-ul real și migrațiile rămân exact cele pregătite anterior.

Verificări: `npm run test:admin-view` — 6/6 PASS, inclusiv server loopback, refuz scrieri/Host neautorizat/rute necunoscute, paginare, filtrare, date sintetice și prezentare financiară. Navigarea eveniment→înscrieri, pagina 2, filtrul anulări, previzualizarea unui mesaj cu revizie veche și evidența financiară au fost verificate și manual în browser. Nu au fost reluate testele Cloudflare sau cele 26 de cazuri ale etapei anterioare.

Dovadă locală: .local/implementation-2026-11-12/admin-view.png. La finalul verificării, serverul temporar a fost oprit; comanda de mai sus îl pornește din nou.

## Stare nouă: panou local funcțional pe API + SQLite

Fluxul curent este `npm run admin:local` → http://127.0.0.1:4180/. Acesta utilizează API-ul existent și schema D1 0001–0006 într-o bază SQLite sintetică; permite administrarea locală a ciornelor, datelor/capacității/stării evenimentelor, anulărilor, pregătirea mesajelor și backup/restaurare. Trimiterile și serviciile comerciale sunt blocate. Serverul de verificare a fost oprit. Detalii și limite: docs/PANOU-LOCAL-SARCINA-RECUPERARE-2026-11-12.md.

Secțiunile anterioare despre portul 4179 descriu previzualizarea statică păstrată, nu panoul funcțional curent. protected-reader.mjs rămâne adaptor OFF pentru o viitoare conectare privată în cloud, netestat pe servicii reale. Nu este utilizat de runtime-ul local. Nu se publică serverul Node ca înlocuitor al Workers.
