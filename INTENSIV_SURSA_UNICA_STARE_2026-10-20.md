# CAMPANIA „ÎNTOARCEREA LA TINE” — SURSA UNICĂ DE CONTINUITATE
Actualizare: 20 octombrie 2026, ora 17:18 (România). Acest fișier este reperul tehnic/comercial din GitHub pentru continuarea campaniei. Nu înlocuiește și nu modifică sursele metodei.

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
- Linkul grupului a fost furnizat de utilizatoare ca URL complet și este introdus în `intensiv.html`, butonul „INTRĂ ÎN GRUPUL WHATSAPP”.
- NIMIC din această ramură feature nu a fost încă declarat publicat pe Cloudflare.
- Reper producție Cloudflare pregătită: `pregatire-cloudflare-2026-10-20`.

## Link grup WhatsApp — RECUPERAT și SALVAT (confirmat de utilizatoare)
- **Numele grupului:** Întoarcerea la tine | Intensiv
- **URL COMPLET EXACT primit:** https://chat.whatsapp.com/Jc7JR8fdItK82QeTleS732?s=cl&p=a&mlu=4&ilr=4
- Utilizatoarea a furnizat atât o captură din WhatsApp, cât și acest URL copiat direct în conversație.
- Captura arată că **la momentul capturii nu este obligatorie aprobarea administratorului** pentru intrare.
- Linkul este destinat distribuirii prin pagina publică a campaniei; păstrează informația că membrii pot vedea numerele de telefon.
- Nu mai cere niciodată utilizatoarei să retransmită acest URL cât timp linkul este valid. Dacă se resetează invitația, noul URL înlocuiește explicit pe cel vechi.
- URL-ul Cloudflare al paginii /intensiv trebuie obținut prin verificare publică reală după deploy.
- **Date încă deschise:** data și orele evenimentului; nu se inventează.

## Următorii pași de execuție după primirea URL-ului grupului
1. ÎNDEPLINIT: linkul real este salvat aici și în butonul CTA din `intensiv.html`. Nu mai cere din nou linkul.
2. ÎNDEPLINIT: pagina folosește intrarea directă în grup, nu conversația privată. Menține transparența: ceilalți membri pot vedea numerele de telefon, participare voluntară.
3. Verifică build local și linkurile, diacriticele, vizualizarea pe mobil.
4. Publică pe Cloudflare într-o manieră controlată, fără a declanșa Netlify. Ia în considerare că push pe ramura conectată la Cloudflare poate declanșa deploy imediat; menține ramura feature până la publicare intenționată.
5. Citește și verifică **URL-ul real al paginii publicate**; actualizează în postările documentate CTA-ul final spre pagina Cloudflare. Nu trimite publicului link spre fișierul GitHub sau spre mesageria directă dacă pagina și grupul funcționează.
6. Testează traseul întreg: postare → pagină → buton WhatsApp grup → ecran de intrare în grup.
7. Păstrează un tabel simplu cu vizualizări/clickuri/cereri/interes, fără date personale inutile.

## REGULĂ DE CONTINUITATE
La fiecare revenire, citește ACEST document înainte să întrebi ce s-a decis. Nu înlocui „grup” cu „chat privat” ca variantă finală. Nu anunța „gata/publicat” până când deploy și destinațiile sunt verificate efectiv.
