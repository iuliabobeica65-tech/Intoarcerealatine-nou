# MASTER — Infrastructura digitala Echilibrarea Radacinilor
Versiune: V1 — plan de implementare, NU validare comerciala sau metodologica.
Data: 2026-11-08
Proprietar: Iulia Bobeica
Domeniu: https://iuliabobeica.ro/
Expeditor Brevo testat: contact@iuliabobeica.ro

## Reguli de protectie — obligatorii
- Productie Cloudflare: ramura `pregatire-cloudflare-2026-10-20`; NU se modifica direct.
- Ramura documentatie/lucru: `pregatire-infrastructura-email-plati`.
- Nu se face merge, push pe productie, publicare, modificare de DNS, modificare Brevo sau trimitere catre clienti fara aprobare explicita.
- Inainte de orice merge: se actualizeaza ramura de lucru din ultima productie, se revizuiesc conflictele, se ruleaza build-ul si testele, se face snapshot/backup si se obtine aprobare.
- Nu se pun tokenuri, chei API, date ale clientilor sau informatii sensibile in repository.
- Se conserva toate paginile, articolele, SEO-ul, stilurile, imaginile si modificarile ulterioare ale proprietarei.
- Numele actual: Echilibrarea Radacinilor. Nu se reintroduce vechiul brand in materiale noi.

## Constatari verificabile din audit partial GitHub
- Repo: `iuliabobeica65-tech/Intoarcerealatine-nou`; default branch `main`, distinct de ramura Cloudflare de productie.
- Scriptul `scripts/build-cloudflare.mjs` produce `dist` din lista explicita de pagini si genereaza sitemap, redirects, articole. Orice pagina noua trebuie integrata in build si sitemap fara a strica SEO.
- `live.html`, `acasa.html` si `politica-confidentialitate.html` folosesc contact WhatsApp/mailto; in paginile verificate nu apare un formular Brevo.
- Acesta este audit partial; nu presupunem ca alte componente nu exista.

## Etapa A — comunitate si comunicare (prioritatea lansarii)
1. Inventariere liste, contacte, formulare, campanii, automatizari existente in Brevo. Fara stergeri.
2. Model unic de contact cu email, prenume optional, sursa, interes declarat, preferinte, data/versiunea consimtamantului, status abonare. Fara date sensibile din sesiuni.
3. Formular cu double opt-in pentru newsletter/comunitate, text clar despre marketing si dezabonare.
4. Pagina 'Comunitatea Echilibrarea Radacinilor' cu doua cai independente: abonare email si intrare voluntara in WhatsApp. Link WhatsApp numai dupa confirmarea celui corect.
5. Fluxuri Brevo: confirmare abonare; bun venit; invitatii la LIVE gratuit; remindere; mesaj dupa eveniment; newsletter; oferte numai catre contacte cu temei legal.
6. LIVE-urile gratuite trebuie sa poata fi accesate si fara abonare comerciala; orele/datele se confirma inaintea fiecarei campanii.
7. Teste cu adrese de test, inclusiv Gmail/Yahoo, dezabonare si tratarea erorilor.

## Etapa B — inscrieri si evenimente
- Webinarii gratuite: inscriere, confirmare, schimbare data, reminder, post-eveniment.
- Workshopuri online/offline: cerere/rezervare, disponibilitate, confirmare, detalii logistice, reminder, anulare/reprogramare.
- Sesiuni individuale: solicitare, confirmare manuala/automata dupa aprobare, reminder, reprogramare.
- Programe de grup: inscriere, confirmare, acces, calendar, notificari de sedinte, incheiere.
- Separare mesaje administrative de mesaje promotionale.
- Evitarea dublurilor; evidenta evenimentelor si a statusurilor.

## Etapa C — Stripe si facturare (doar sandbox pana la activarea legala)
- Catalog de oferte si preturi aprobat explicit; nu se inventeaza.
- Stripe Checkout in mod test; webhook semnat verificat pe server; statusul platii nu se deduce din pagina de succes.
- Evidenta operationala separata a comenzilor, participantilor, tranzactiilor si evenimentelor, cu idempotenta.
- Plati reusite, esuate, in asteptare, rambursari, transe daca sunt aprobate.
- E-mailuri tranzactionale: confirmare plata, acces, plata esuata, rambursare, modificari.
- Integrarea cu un furnizor de facturare se alege dupa cerintele legale/fiscale; nu se emite factura falsa.
- In productie: date juridice/fiscale, verificare Stripe, cont bancar, politici comerciale, verificare facturare si teste finale.

## Biblioteca de mesaje — de redactat si aprobat
COM-01 confirmare email; COM-02 bun venit; COM-03 invitatie WhatsApp; COM-04 preferinte/dezabonare.
LIVE-01 confirmare; LIVE-02 invitatie; LIVE-03 reminder; LIVE-04 post-eveniment.
WEB-01..05 confirmare/remindere/modificare/post-eveniment.
WRK-01..06 rezervare/plata/detalii/reminder/anulare/post-workshop.
PRG-01..07 inscriere/plata/acces/calendar/transe/finalizare.
SES-01..04 confirmare/reminder/reprogramare/administrativ.
PAY-01..06 confirmare/esec/asteptare/rambursare/transe/eroare.
FIN-01..03 factura/corectie/problema.
MKT-01..04 newsletter/lansare/invitatie/revenire.
OPS-01..04 bounce/dezabonare/duplicat/eroare.

Fiecare sablon necesita: scop, trigger, destinatari, consimtamant/temei, subiect, preheader, corp complet, variabile, CTA, criterii de oprire, test si aprobare.

## Separarea responsabilitatilor
ChatGPT: arhitectura, mesaje, validarea logicii si documentatie, audit read-only.
Codex: implementarea tehnica in ramura izolata, teste, PR pentru revizuire; fara merge autonom.
Brevo: liste, formulare, automatizari, livrabilitate (necesita acces sau configurare asistata).
WhatsApp: comunitate si link de invitatie creat de proprietara.
Stripe: configurare test si verificare la activarea reala.

## Decizii si acces in asteptare
- Inventar real Brevo si nivelul planului (limite automatizari).
- Confirmarea structurii comunitatii WhatsApp si linkului de invitatie.
- Oferte, preturi, politici de rambursare si tipuri de plata.
- Furnizor facturare, calendar/programari si solutie de evidenta comenzi.
- Texte legale, consimtamant, retentie date si procesare GDPR.
- Acces tehnic autorizat la Brevo/Stripe pentru implementare; nu se cer secrete in chat.

## Criterii de acceptare
- Zero schimbari neaprobate in productie.
- Build si navigatie, SEO, articole si pagini existente intacte.
- Inscriere/confirmare/dezabonare functionale si logate.
- Remindere doar pentru evenimente corecte, fara duplicari.
- Teste plati reusite/esec/rambursare si webhook idempotent.
- Verificarea accesului si livrarii e-mailurilor.
- PR revizuit si aprobat explicit inainte de lansare.
