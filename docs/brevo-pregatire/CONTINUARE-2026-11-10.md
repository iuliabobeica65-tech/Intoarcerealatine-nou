# Continuare Brevo — 10 noiembrie 2026

## Actualizare verificată — 11 noiembrie 2026

După reconectare, același draft #1 este salvat cu numele **ER TEST | Bun venit după DOI | INACTIV**. Settings confirmă **Inactive** și **Allow contact re-entry after exit = OFF**. Triggerul indică exclusiv lista de test #4. Ramura A are trei condiții AND: adresa proprie autorizată (nepublicată în repository), **DOUBLE_OPT-IN = Yes** și **Email campaigns subscriptions = Subscribed**. Valoarea Yes a fost verificată în dialogul Edit al regulii salvate; rezumatul canvas o omite vizual. Ramura B merge la Exit; în prezent și ramura A merge la Exit, fără acțiune de e-mail. Nu s-au salvat schimbări în această verificare, nu s-a apăsat Test sau Activate.

Draftul nu mai este gol; paragraful de mai jos descrie starea inițială din 10 noiembrie. Editorul răspunde intermitent. Fluxul DOI API → atribut DOUBLE_OPT-IN nu a fost demonstrat printr-un test real și nu trebuie presupus. Mediul privat funcțional și configurarea securizată API lipsesc în continuare. Nu s-a trimis niciun mesaj nou și nu s-a modificat producția sau Preview-ul în această verificare. Modificările locale ale continuării nu sunt încă salvate pe GitHub.

## Implementare existentă păstrată

Solicitarea DOI API folosește șablonul #2 și params.DOIurl. #6 este alternativa pentru formularul nativ și nu a fost combinată cu API. Cele cinci șabloane nu au fost recreate. Expeditorul și domeniul au fost verificate în etapa anterioară; nu s-au modificat DNS sau identitatea. Testul editorial COM-02 primit în Inbox rămâne singura livrare confirmată de această lucrare.

## Modificări reale în cont

Creată și verificată lista goală #4 ER | TEST DOI isolat | 2026-11-10; lista comunității #3 a rămas cu 0 contacte, iar lista existentă #2 nu a fost modificată. Nu s-a importat și nu s-a mutat niciun contact. Lista de test #4 este distinctă de șablonul de preferințe #4 — coincidență de numerotare, obiecte diferite.

Deschis accesul la Automations din onboarding și creat draftul gol Automation #1, ID 1, verificat Saved și Inactive. Nu este un flux de bun venit funcțional: nu are trigger, filtre sau acțiuni configurate. Nu s-a apăsat Activate automation sau Test. Editorul a devenit instabil, iar reîncărcarea nu a permis continuarea sigură. S-a cerut Iuliei verificarea manuală a Settings. Nu s-a creat un al doilea draft ca înlocuitor.

Contul a afișat 2 contacte totale și un mesaj livrat, însă aceste agregate nu demonstrează abonare DOI. Nu au fost citite/exportate adresele altor contacte. Nu s-au creat chei API și nu s-au trimis mesaje reale în această continuare.

## Protecție locală nouă

Modul TEST_MODE=true cere acum TEST_BREVO_LIST_ID valid, diferit de 3. Modelul local indică 4, ID-ul verificat. Fără această valoare, solicitarea este respinsă înainte de scrieri D1 sau apeluri Turnstile/Brevo. În profilul normal, lista rămâne fix 3; un input din browser nu poate schimba destinația. La frontiera Brevo sunt respinse listele multiple, lista 3, alt ID decât cel configurat și orice excludeListIds, astfel încât testul să nu elimine contacte din alte liste. Protecția destinatarului unic și respingerea CC/BCC/bulk rămân în vigoare.

Această modificare nu activează testul. Toate flags din modele sunt false, fără adresă proprie sau secrete în Git. Lista 4 izolează apartenența la listă, dar nu creează un sandbox de cont: suprimările și istoricul contactului pot fi globale. Nu se șterge și nu se reabonează adresa pentru a fabrica scenarii de test.

## Validare și limite

27/27 teste locale trecute: inclusiv lista lipsă/invalidă/comunitate, lipsa apelurilor externe la refuz, amestecarea/excluderea listelor și păstrarea listei 3 în profilul normal. Furnizorii sunt simulați; acestea nu sunt teste Brevo reale. Rezultatele de build și verificator sunt păstrate în .local/brevo-2026-11-10/.

Un trigger generic Contact added to list nu dovedește singur DOI; Brevo îl poate declanșa și pentru adăugări manuale sau import. Nici atributul de consimțământ declarat de client nu este dovada confirmării. Draftul de welcome trebuie să verifice sursa DOI, eligibilitatea curentă, adresa de test exactă și absența reînscrierii repetate. Datele oferite prin redirectul comunitate?confirmare=brevo nu sunt dovadă pe server. Dacă nu se poate demonstra sursa DOI pentru API, nu se activează automatizarea și nu se inventează o confirmare.

Documentația oficială arată posibilitatea filtrării triggerelor și avertizează despre diferitele căi de adăugare în listă: [trigger și filtre](https://help.brevo.com/hc/en-us/articles/21203352470034-Use-a-trigger-to-start-an-automation), [trigger de listă](https://help.brevo.com/hc/en-us/articles/15445989568402-Available-triggers-actions-and-rules-in-an-automation). Nu s-a confirmat încă în cont un trigger potrivit DOI API.

## Următorii pași necesari

1. Restabilirea editorului; inventar actual al expeditorului/domeniului și șabloanelor, apoi configurarea aceluiași draft #1, fără activare. Nu se cer chei/parole în chat.
2. Verificarea eligibilității și a filtrelor DOI reale pentru API; re-entry oprit și excluderea contactelor suprimate, cu o singură trimitere de welcome după confirmare. Nu activa un trigger doar pe lista #4 dacă nu poate demonstra confirmarea. Dacă UI nu oferă condiția necesară, soluția se proiectează separat, fără webhook nesemnat sau încredere în date furnizate de browser.
3. Mediu server izolat și protejat verificat, DB separat/migrat, Turnstile și secrete configurate numai în locul securizat al proiectului. Preview-ul public existent rămâne OFF. Nu există încă un astfel de mediu funcțional; lista de test nu îl înlocuiește.
4. După pregătirea concretă, prezentarea activărilor și trimiterea controlată numai către adresa proprie autorizată, cu verificare DOI → welcome unic → preferințe → dezabonare → suprimare. Nicio trimitere către comunitate. Testele încă nu au fost executate în cont.
5. Verificări de siguranță înainte de actualizarea GitHub și Preview, fără merge sau publicare pe producție. Raportul final precizează dacă schimbările acestei continuări au fost împinse sau sunt numai locale.

Protecție suplimentară: deoarece atributele contactului sunt comune întregului cont Brevo, solicitarea în TEST_MODE=true nu transmite PRENUME sau atributele de consimțământ ale profilului normal. Dovada solicitării de test rămâne în DB izolată. În profilul normal, prenumele omis nu este trimis gol, astfel încât să nu șteargă valoarea existentă. Validarea locală actualizată este 28/28; aceasta nu certifică maparea reală a atributelor în cont.

### Mesaj de bun venit salvat — 11 noiembrie

Cu ajutorul Iuliei la deschiderea Add message, a fost reutilizat șablonul #3 COM-02. Brevo a creat mesajul independent #7 pentru pasul #3 al automatizării #1; șablonul original nu a fost modificat. Designul și acțiunea sunt salvate. Structura verificată: ramura A → Send an email → Exit; ramura B → Exit. Expeditor și Reply-to: contact@iuliabobeica.ro, nume Iulia Bobeica – Echilibrarea Rădăcinilor. Subiectul existent este păstrat. CC/BCC, UTM, atașamente și intervale de trimitere sunt oprite; formularul Default update profile form este selectat. Nu s-a demonstrat prin aceasta absența trackingului global de deschideri/clickuri.

Conținutul include WhatsApp voluntar, linkurile native update_profile și unsubscribe și politica de confidențialitate. Rezolvarea lor pentru un destinatar real rămâne netestată. UI confirmă Saved și Inactive; nu s-a apăsat Test sau Activate, nu s-a trimis niciun mesaj. Această actualizare înlocuiește mențiunea anterioară că acțiunea de e-mail lipsește. Dovada vizuală este păstrată numai local, deoarece include adresa proprie în filtru. Mediul privat, maparea atributului DOI API și testul complet rămân necesare înainte de activare. Niciun push/deploy efectuat în această etapă.
