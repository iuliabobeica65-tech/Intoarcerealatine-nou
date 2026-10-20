# Extindere viitoare în magazin — fără activare comercială
Data: 20 octombrie 2026

## Decizie confirmată
Site-ul actual rămâne un site de prezentare, articole și resurse. Se păstrează GitHub, Pages CMS, Cloudflare Pages și Netlify; fără formulare de plată, magazin activ sau colectare comenzi înainte de decizia și organizarea legală a activității.

## Compatibilitatea tehnică
Site-ul HTML/CSS/JS static poate fi păstrat ca frontend și conectat ulterior la un procesator de plăți și un sistem de comenzi. Pentru produse digitale simple se poate integra checkout extern; pentru produse fizice, stocuri, variante, transport, retururi și facturare sunt necesare componente de comerț suplimentare (de exemplu, o platformă specializată). Cloudflare Pages nu gestionează singur comenzile, stocurile, facturarea ori încasările. Planul de găzduire poate necesita extindere în funcție de trafic/funcții. Magazinul nu este implementat în această etapă.

## Arhitectură recomandată
- Menținem prezentarea, pagina Metoda CLAR, constelațiile, serviciile și articolele ca pagini distincte.
- Produsele viitoare vor avea URL-uri proprii, descrieri și SEO propriu.
- Separăm conținutul editorial de datele despre produse și de datele clienților.
- Nu stocăm în JSON public, GitHub sau Pages CMS date personale de comandă ori date bancare.
- Plățile, procesarea comenzilor, facturile și eventualele autentificări vor necesita furnizori sau backend cu controale de acces.
- Nu modificăm politica GDPR, termenii și funcționalitățile până când sunt confirmate forma de activitate, produsele, furnizorii și obligațiile legale.

## Situația editorului în această versiune
- Editorul Pages CMS pentru articole a fost testat efectiv: create/update pe ramura de Cloudflare; fișierul de test a fost șters.
- A fost adăugat un editor pentru blocuri noi de text, fotografie, galerie și buton pe 7 pagini, cu lista de secțiuni inițial goală. Nicio pagină aprobată nu a fost înlocuită.
- **Nu s-a testat încă încărcarea unei fotografii și salvarea unui bloc nou prin interfața Pages CMS**; confirmarea practică este obligatorie înainte de lansare.

## Înainte de Cloudflare
Verificări obligatorii: schema Pages CMS și încărcarea media; construirea pachetului Cloudflare; funcționarea paginilor și articolelor; meniu desktop/mobil; text, galerie și buton; SEO/canonical; date juridice și comportamentul cookie real al noului host. Nu se declară conformitate GDPR doar pe baza codului.

## Continuitate Netlify
Ramura `main` rămâne neatinsă; la reînnoirea creditelor Netlify actualizarea se face numai după aprobare și sincronizare controlată, nu automat din ramura Cloudflare.
