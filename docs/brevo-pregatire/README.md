# Pachet Brevo — infrastructura inițială, prioritară

Confirmare ulterioară, 9 noiembrie 2026: Iulia a confirmat „A sosit în Inbox” pentru testul COM-02, ID 3. Livrarea acestui singur mesaj de test este validată prin confirmarea destinatarei. Nu validează întregul flux DOI, preferințele, dezabonarea sau livrarea către alte adrese. Șabloanele și automatizările rămân inactive.

## Test editorial Brevo — 9 noiembrie 2026

După autorizarea adresei proprii de către Iulia, a fost inițiată o singură trimitere prin Preview & test → Send Test pentru COM-02, ID 3. Destinatar unic selectat; cealaltă adresă din lista de test a rămas nebifată. Butonul a devenit temporar indisponibil și apoi disponibil, fără confirmare explicită capturată. Acceptarea furnizorului și primirea în Inbox rămân neconfirmate; nu se retrimite automat. Afirmațiile istorice „0 e-mailuri” de mai jos descriu etapa anterioară.

Acesta este un test editorial; nu dovedește DOI, preferințe sau dezabonare funcționale. Nu s-a activat niciun șablon sau workflow și nu s-a schimbat abonarea unui contact. Celelalte teste de trimitere așteaptă rezultatul primului. Producția, Stripe live și facturarea rămân neactivate.


Aceste fișiere sunt sursele locale ale drafturilor. Niciun destinatar nu este inclus și nu se trimit mesaje. Regenerare: `node scripts/prepare-brevo-emails.mjs`. Linkul WhatsApp oficial din issue #81 este centralizat în `configuratie-publica.json`; la schimbare se regenerează HTML-ul și se revizuiesc șabloanele din cont. Starea observată a contului este păstrată separat în `stare-cont.json`, astfel încât regenerarea să nu piardă ID-urile verificate. Regenerarea nu sincronizează automat conținutul cu Brevo.

## Actualizare verificată — 9 noiembrie 2026

Conexiunea a fost recuperată. Sunt **cinci șabloane salvate în cont**, toate cu status **Inactive**, verificate în lista finală:

| Șablon | ID real | Utilizare |
|---|---|---|
| COM-01-API | [2](https://app.brevo.com/templates/email/edit/2) | DOI prin API, params.DOIurl |
| COM-02 | [3](https://app.brevo.com/templates/email/edit/3) | bun venit după DOI, WhatsApp opțional |
| COM-04 | [4](https://app.brevo.com/templates/email/edit/4) | preferințe și dezabonare |
| COM-05 | [5](https://app.brevo.com/templates/email/edit/5) | confirmare numai după dezabonare reală; preferabil mesaj în pagină |
| COM-01-FORM | [6](https://app.brevo.com/templates/email/edit/6) | alternativă pentru formularul nativ, doubleoptin |

Toate folosesc expeditorul contact@iuliabobeica.ro și identitatea Iuliei. Conținutul a fost verificat în previzualizarea editorului; nu au fost accesate linkurile DOI/pref/unsubscribe ca și cum ar reprezenta un test real. Parametrii speciali sunt nereali în previzualizare și necesită generarea lor în fluxul corect. Nu s-a intrat în WhatsApp.

Formularul implicit de profil a fost selectat pentru bun venit; pentru ID 4 asocierea `Default update profile form` a fost reverificată și salvată explicit. Trackingul UTM nu a fost activat. Nu s-au trimis e-mailuri, configurat credențiale, activat șabloane/workflowuri, creat formular public sau schimbat runtime-ul site-ului.

În timpul configurării, o navigare încă nefinalizată a făcut ca metadatele viitorului draft să fie aplicate temporar ID-ului 4. Eroarea a fost detectată la verificarea ID-ului: numele, subiectul și preheaderul ID 4 au fost restabilite, conținutul de preferințe a rămas intact, formularul de profil a fost reasociat și salvat; confirmarea de dezabonare a fost apoi creată separat ca ID 5. Lista finală confirmă denumirile distincte și starea inactivă. Niciun mesaj nu a fost trimis în acest proces.

Starea de la 8 noiembrie de mai jos este păstrată pentru trasabilitate; absența șabloanelor descrie inventarul anterior, nu starea curentă.

## Stare verificată în cont la 8 noiembrie 2026

- Free, 300 de e-mailuri disponibile în ziua afișată; fără upgrade sau achiziții.
- contact@iuliabobeica.ro Verified, domeniu Authenticated, DMARC configured. Fără schimbări DNS.
- Lista principală #3, Comunitatea Echilibrarea Rădăcinilor, 0 contacte. Nu a fost populată.
- Create și verificate ca Text: PRENUME, CONSENT_VERSION, CONSENT_REQUESTED_AT, CONSENT_SOURCE. Nu s-au modificat valorile contactelor.
- Campania existentă `test email ib`, Draft #1, neatinsă. Niciun șablon e-mail salvat la momentul auditului.
- Nu există formular nativ de abonare sau pagină personalizată de dezabonare salvate. Există Default update profile form, 0 submits, fără validare end-to-end.
- Automations afișează onboarding și `0 contacts can enter Automations`. Nu se presupune că planul permite welcome automation; trebuie clarificată limita în cont/suport. Nu se creează o campanie ca înlocuitor și nu se cumpără upgrade.
- Conexiunea browserului a devenit intermitentă, apoi navigările către editor au expirat. Nu se raportează un șablon creat până la verificarea în lista salvată.
- Iulia a reîncărcat Brevo și a confirmat că pagina răspunde. Reluarea a permis citirea paginii, dar navigarea a expirat din nou și controlul s-a deconectat. Nu s-a salvat sau activat niciun șablon după această încercare; blocajul privește conexiunea de control, nu lipsa autentificării în cont.

## Pașii de configurare sigură

1. Reia inventarul înainte de salvare, pentru a detecta eventuale schimbări concurente ale proprietarei.
2. Creează un șablon nou, fără suprascrierea campaniei existente, cu numele/subiectul/expeditorul din manifest. Importă HTML prin editorul oficial. Păstrează Inactive/draft și nu folosi Send/test send fără o adresă de test autorizată.
3. Folosește **COM-01-API** pentru codul site-ului actual: tag `optin`, link `{{ params.DOIurl }}`, fără personalizare cu atribute ale contactului și fără link WhatsApp în mesajul de confirmare.
4. **COM-01-FORM** este alternativă exclusiv pentru un formular nativ Brevo: link `{{ doubleoptin }}`. Nu interschimba cele două sintaxe. Formularul public al site-ului nu este rescris sau publicat.
5. Notează ID-urile reale numai după salvare verificată. În runtime, `BREVO_DOI_TEMPLATE_ID` se configurează privat doar după aprobarea conținutului și a activării; în această etapă rămâne neconfigurat. Nu activa doar pentru a forța un test.
6. COM-02 bun venit este eligibil exclusiv după DOI dovedit, o singură dată. Intrarea în lista 3 prin import/manual nu dovedește singură DOI. Confirmă triggerul de confirmare și istoricul; păstrează suprimările. Dacă planul nu permite automatizarea, documentează pasul manual sau o soluție server-side aprobată, fără a pretinde că rulează deja.
7. Verifică linkurile personale `{{ update_profile }}` și `{{ unsubscribe }}` printr-un test autorizat; nu înlocui cu URL-uri fictive. Formularul implicit trebuie verificat și, dacă este nevoie, personalizat separat, fără modificarea datelor contactelor.
8. COM-05 se folosește preferabil ca mesaj în pagina de confirmare a dezabonării. Nu trimite e-mail către un contact blocat doar ca să anunți dezabonarea și nu afirma succesul înainte de actualizarea reală.
9. Nu trimite campanii, nu activează workflowuri și nu contactează clientele în această pregătire. Textele comerciale rămân supuse aprobării Iuliei.

## Probe reale încă necesare

Adresă de test autorizată; șablon DOI aprobat/activat controlat; API configurat fără chei în chat/repo; test nou/existent/dezabonat, duplicat, eroare, DOI, dovada confirmării, preferințe și retragere, suprimare după unsubscribe. Testele locale ale codului nu sunt livrare reală. Nu se poate închide această listă doar prin previzualizarea HTML-ului.

Linkul WhatsApp este inclus în draftul de bun venit conform issue #81; nu a fost accesat și nu s-a solicitat intrarea în grup. Ședințele individuale rămân pentru Google Calendar Appointment Schedules conform issue #82; nu se configurează confirmări duplicate în Brevo.

Surse oficiale consultate: [DOI API](https://developers.brevo.com/reference/create-doi-contact), [DOI pentru formularul nativ](https://help.brevo.com/hc/en-us/articles/360019540880-Create-a-custom-double-opt-in-DOI-email-template-for-a-sign-up-form-created-in-Brevo), [limbaj și linkuri personale](https://help.brevo.com/hc/en-us/articles/4402386448530--Manual-Personalize-your-messages-with-dynamic-content-Brevo-Template-Language).
