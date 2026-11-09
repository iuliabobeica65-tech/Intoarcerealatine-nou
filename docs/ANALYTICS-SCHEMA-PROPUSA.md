# Analytics — schemă propusă, fără tracking nou

9 noiembrie 2026. Implementarea existentă assets/analytics-consent.js încarcă GA4 după allow; ID G-DCLDSBZ2S8. Nu există aici evenimente de conversie personalizate și nu există filtru de hostname în cod. Acceptarea pe un preview poate contamina aceeași proprietate. Configurația proprietății, enhanced measurement și asocierea streamului trebuie reverificate în cont; nu s-au modificat.

| Indicator/eveniment propus | Semnificație | Sursă și parametri permiși |
|---|---|---|
| page_view existent | vizualizare, nu persoană unică | GA4; verifică page_location și query înainte de orice extindere |
| service_view | interes pentru serviciu | client după consimțământ; service_id din listă fixă |
| contact_click | click spre WhatsApp, Messenger, e-mail | channel din whatsapp/messenger/email; fără URL sau text |
| booking_click | click spre programare | provider=google_calendar, placement din listă fixă |
| testimonial_click | click către testimoniale | placement din listă fixă |
| community_click | click către opțiunea de comunitate | channel=email/whatsapp |
| subscription_requested | solicitare acceptată, nu confirmare | număr agregat din evidența server; deduplicarea nu e solicitare nouă |
| subscription_confirmed | DOI demonstrat | Brevo; număr agregat, nu eveniment client dedus din redirect |
| event_registration_confirmed | înscriere eligibilă | D1, excluzând anulări, rezervări neplătite și teste |
| appointment_confirmed | rezervare reală | Google Calendar, cu anulări/reprogramări distincte |
| payment_confirmed | încasare verificată | furnizor, excluzând testele; refund separat |

Acestea sunt denumiri propuse; nu au fost adăugate în site sau trimise la GA4. Confirmările din servicii rămân agregate în raport până la aprobarea unui mecanism de măsurare; nu se instalează Measurement Protocol sau tracking server-side automat. Vizitatorii sunt estimări GA4; solicitările reale necesită evidență separată, fără citirea conversațiilor. Nu se poate atribui fiecărei vizitatoare un abandon doar comparând totalurile.

Fără nume, e-mail, telefon, conținut WhatsApp/Messenger, tokenuri, ID-uri de înregistrare, linkuri personale, query strings sau date de plată în schema nouă. Paginile de întoarcere de la furnizori se verifică înainte de trimiterea page_view; codul existent folosește config implicit, deci nu se garantează deja curățarea tuturor URL-urilor. Orice corecție de tracking necesită aprobare, fără schimbare SEO/design.

Verificare propusă: refuz → zero încărcări GA; acceptare → o încărcare; retragere → blocare și reîncărcare; confirmări citite exclusiv din sursa de adevăr; excluderea hostname-urilor de preview și testelor; aceeași perioadă și același fus orar. Testul local nou folosește un script GA inert și blochează celelalte servicii externe, nu verifică serverele Google.

Raport: MODEL-RAPORT-SAPTAMANAL.md; trafic, pagini de interes, clickuri de contact/programare, înscrieri, programări și plăți distinct. N/D pentru măsurări absente, nu 0. Nu există date verificate pentru două săptămâni complete comparabile în această continuare, deci nu se inventează evoluții și nu se programează o automatizare.
