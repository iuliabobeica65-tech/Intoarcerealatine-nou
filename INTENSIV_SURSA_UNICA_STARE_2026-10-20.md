# CAMPANIA „ÎNTOARCEREA LA TINE” — SURSA UNICĂ DE CONTINUITATE
Actualizare: 20 octombrie 2026. Acest fișier este reperul tehnic/comercial din GitHub pentru continuarea campaniei. Nu înlocuiește și nu modifică sursele metodei.

## Decizii stabilite cu utilizatoarea
- Campania este dedicată intensivului **„Nu mai vreau așa. Dar de ce fac tot la fel?”**.
- Scop: atragerea femeilor care se simt blocate, prin conținut Facebook cu cârlige concrete, spre o **pagină de înscriere separată pe Cloudflare**, care conduce **direct către un grup WhatsApp** al intensivului.
- Brand: **Întoarcerea la tine**, Iulia Bobeica, ton direct/profund/jucăuș, fără povești/testimoniale inventate.
- Format propus/acceptat pentru implementare: ediție-pilot gratuită, trei întâlniri online; zilele/orele exacte nu sunt încă confirmate; fără plăți sau formulare.
- Creația conștientă începe de la observarea și explorarea percepțiilor, nu doar la final.
- Separare strictă față de pâlnia LIVE și față de site-ul oficial Netlify. Nu modifica ramura de producție ori site-ul principal fără verificare și publicare deliberată.
- Postările trebuie să trimită către **URL-ul Cloudflare verificat al paginii**, nu direct la GitHub, iar pagina să trimită la grup WhatsApp.
- Utilizatoarea a semnalat pierderea repetată a linkului WhatsApp și a contextului; **nu se mai cere reconfirmarea deciziilor de mai sus**.

## Ce este salvat pe ramura curentă
- `intensiv.html`: pagină separată, mobile-first, cu design crem/auriu/roz, portret real, trei întâlniri, explicații și CTA.
- `scripts/build-cloudflare.mjs`: configurat să copieze `intensiv.html` în `dist/`.
- `campanie-intensiv-postari-V1.md`: postări integrale cu cârlige pentru 21 oct–6 nov. (nouă postări în total).
- `CAMPANIE_INTENSIV_20-22_OCT_2026.md`: texte suplimentare de lansare, story, descriere propusă grup și setări.
- Reminder programat în ChatGPT: postări alternative 27 oct–6 nov, o dată la două zile la 09:00 (ora României). Alte remindere deja existente nu trebuie duplicate mecanic.
- NIMIC din această ramură feature nu a fost declarată publicată pe Cloudflare.
- Reper producție Cloudflare pregătită: `pregatire-cloudflare-2026-10-20`.

## Singurele date externe încă nerecuperate / neconfirmate la 20 octombrie
1. **LINK GRUP WHATSAPP**: este necesar URL-ul complet real `https://chat.whatsapp.com/...`. Utilizatoarea spune că l-a trimis de mai multe ori; la verificarea contextului recuperabil și a fișierelor GitHub nu a fost găsit URL-ul exact. **Nu inventa niciodată un URL de grup**. În momentul în care apare în mesaj, salvează-l IMEDIAT în acest document și integrează-l în `intensiv.html`, verifică destinația și confirmă explicit utilizatoarei valoarea salvată. Înlocuiește CTA de conversație `wa.me` cu CTA de intrare directă în grup.
2. URL-ul public Cloudflare final trebuie citit și verificat după deploy; nu inventa `*.pages.dev`.
3. Data/orele întâlnirilor: nu sunt confirmate, nu fixa ca fapt.

## Următorii pași de execuție după primirea URL-ului grupului
1. Salvează linkul real în acest fișier (sursă unică) și în CTA-urile din `intensiv.html` pe aceeași ramură de lucru.
2. Adaptează explicațiile de pe pagină pentru **intrare directă în grup**, nu conversație privată. Menține transparența: ceilalți membri pot vedea numerele de telefon, participare voluntară.
3. Verifică build local și linkurile, diacriticele, vizualizarea pe mobil.
4. Publică pe Cloudflare într-o manieră controlată, fără a declanșa Netlify. Ia în considerare că push pe ramura conectată la Cloudflare poate declanșa deploy imediat; menține ramura feature până la publicare intenționată.
5. Citește și verifică **URL-ul real al paginii publicate**; actualizează în postările documentate CTA-ul final spre pagina Cloudflare. Nu trimite publicului link spre fișierul GitHub sau spre mesageria directă dacă pagina și grupul funcționează.
6. Testează traseul întreg: postare → pagină → buton WhatsApp grup → ecran de intrare în grup.
7. Păstrează un tabel simplu cu vizualizări/clickuri/cereri/interes, fără date personale inutile.

## REGULĂ DE CONTINUITATE
La fiecare revenire, citește ACEST document înainte să întrebi ce s-a decis. Nu înlocui „grup” cu „chat privat” ca variantă finală. Nu anunța „gata/publicat” până când deploy și destinațiile sunt verificate efectiv.
