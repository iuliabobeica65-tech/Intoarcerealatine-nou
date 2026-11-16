# Resurse Brevo separate create, fără activare sau trimitere

Crearea a fost aprobată explicit în chat, după confirmarea proprietății și controlului asupra noii adrese, verificate anterior ca absentă în căutarea globală Brevo. Adresa este păstrată în registrul privat `.local/brevo-isolated-preparation-2026-11-15/resources-private.json`. Nu s-a creat/importat contactul. Aprobarea de creare nu autorizează activarea sau trimiterea.

Pregătirea a început la 14.11 și s-a finalizat la 15.11.2026; numele listei păstrează data inițială. S-au utilizat exclusiv controalele UI Brevo, fără extragere de cookie-uri/tokenuri sau modificarea conturilor Cloudflare/GitHub.

| Resursă | ID | Stare și rol |
|---|---:|---|
| Listă `ER | TEST UNIC DOI API | 2026-11-14` | 7 | Creată goală, zero contacte; nu a fost legată la vreun formular |
| Șablon DOI copiat din #2 | 12 | Inactive, conținutul și `params.DOIurl` păstrate |
| Șablon welcome copiat din #3 | 13 | Inactive, copie de sursă; nu constituie un sender suplimentar |
| Automatizare `ER | TEST UNIC DOI | LISTA 7 | INACTIV` | 2 | Inactive; duplicată din #1 și configurată numai în copia nouă |
| Mesajul welcome al automatizării noi | 14 | Brevo l-a copiat automat din mesajul workflowului sursă; separat de originalul #7 |

După duplicarea automatizării s-a constatat că Brevo creează propria copie de mesaj #14. Aceasta este acțiunea welcome unică a fluxului nou; #13 rămâne doar copia inactivă de șablon pregătită anterior. Nu s-au creat două acțiuni welcome și nu s-a șters copia #13.

În automatizarea #2 s-au salvat: trigger exclusiv `Contact added to list` pentru #7; ramura AND cu adresa exactă autorizată, DOUBLE_OPT-IN=Yes și Email campaigns subscriptions=Subscribed; ramura neeligibilă iese. Re-entry OFF, fără condiții restart adăugate. Triggerul precizează în UI că ia numai contactele adăugate după activare. Mesajul #14 păstrează conținutul welcome, expeditorul profesional și linkurile native existente. Niciun link de dezabonare/preferințe nu a fost executat.

Verificarea finală UI: All 2 / Active 0 / Paused 0 / Inactive 2, noua automatizare #2 cu zero contacte active/started/finished/suspended. Originalul #1 a rămas Inactive și cu ultima editare 11.11.2026. La ieșirea din editor s-a ales **Do it later**, nu Activate automation.

DOI #12 și copia #13 au fost create prin Duplicate din originale inactive și verificate Inactive în inventarul șabloanelor. Încercarea inițială de redenumire a #12 nu a fost persistată prin salvarea generală; inventarul l-a afișat în continuare cu numele sursei și sufix `_copy`. Identificatorul #12, nu numele propus, este referința de execuție. Originalele nu au fost editate.

## Starea păstrată

Zero trimiteri, activări, contacte create, teste reale sau teste locale repetate. Profilurile și consimțămintele existente, formularul public, lista #4, automatizarea #1 și mesajul #7 nu au fost modificate. Cloudflare rămâne OFF; nicio configurare/deployment nouă. Site-ul oficial, producția, GitHub, D1, Turnstile și backupurile nu au fost modificate. Lista nouă separă acest flux de destinația #4 a formularului public; nu se pretinde izolarea absolută a contului sau oprirea trimiterilor independente ale acelui formular.

## Înainte de test

Rămân verificările în citire ale autentificării expeditorului și Reply-to exact pentru mesajele dedicate, reconfirmarea absenței profilului nou și a mesajelor în așteptare, apoi aprobarea explicită unică pentru activare și maximum un DOI + un welcome către noua adresă. Aprobarea include crearea/confirmarea exclusiv a noului profil și apartenența la #7. Nu se activează sau modifică resursele originale. Nu se trimite separat #13.

Execuția propusă folosește adaptorul local existent cu TEST_MODE=true, ID listă #7 și DOI #12; welcome vine exclusiv din automatizarea #2 / mesaj #14. Cloudflare rămâne OFF. După test se dezactivează #2 și DOI #12 dacă au fost activate exclusiv pentru test și se verifică logurile/coada; nu se șterge și nu se dezabonează profilul nou automat. Testul web/D1 nu este inclus.

Dovadă vizuală salvată local: `.local/brevo-preparation-inactive-2026-11-15.jpg` — automatizarea nouă Inactive și re-entry OFF. Registrul privat include ID-urile și destinatarul, fără credențiale.
