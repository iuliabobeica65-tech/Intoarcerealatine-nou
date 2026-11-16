# Variantă izolată propusă — numai pregătire

Nicio resursă externă creată, activată sau modificată. Zero trimiteri și teste repetate. Cloudflare rămâne OFF. Profilul actual al proprietarei, formularul public, lista #4, automatizarea #1 și mesajul #7 nu se modifică.

## Soluția minimă

În același cont Brevo: o listă nouă goală, neasociată niciunui formular; o adresă distinctă deținută și controlată de Iulia, verificată în citire ca absentă din Brevo; o automatizare nouă inactivă, cu trigger exclusiv lista nouă și filtre AND adresa exactă + DOUBLE_OPT-IN=Yes + Subscribed, re-entry/restart OFF și o singură acțiune welcome. Două copii dedicate de mesaje: șablon DOI din #2 și welcome din conținutul existent #7/#3, cu aceiași expeditor/conținut verificate. Nu se recreează textele sau infrastructura și nu se schimbă resursele istorice.

Sunt necesare **o listă, o automatizare și două mesaje dedicate**, plus adresa de test. ID-urile se atribuie numai după aprobare și creare; nu se presupun ID-uri disponibile. Niciun formular nou, cont nou, deployment, D1 sau Turnstile.

Adaptorul existent `requestDoi()` poate fi folosit local cu TEST_MODE=true, TEST_RECIPIENT_EMAIL=adresa distinctă, TEST_BREVO_LIST_ID=ID-ul noii liste și BREVO_DOI_TEMPLATE_ID=ID-ul copiei dedicate. Funcția doiList acceptă deja un ID de test diferit de #3; manifestul acestei execuții va exclude explicit #4 și celelalte liste existente. Nu se modifică configurațiile implicite sau istorice. Cheia Brevo rămâne privată; nu se creează o cheie nouă preventiv.

Brevo API acceptă includeListIds și templateId explicit; triggerul de automatizare se poate limita la o listă anume. Astfel, formularul actual, rămas pe #4/#8, nu are o cale configurată către lista nouă. Nu se publică ID-ul listei prin vreun formular. Aceasta este separare a fluxului în același cont, nu un sandbox de cont sau o listă cu ACL independentă: administratorii/API-urile autorizate pot în continuare modifica liste. Formularul public poate continua propriile trimiteri independente; testul nu pretinde că le suspendă.

## Condiții înainte de creare/activare

Iulia furnizează și autorizează adresa distinctă. Nu se inventează adresă sau alias. Dacă există deja profil/consimțământ/suprimare pentru adresa exactă, nu se șterge, nu se reabonează și nu se resetează: se cere altă adresă controlată. Adresa de test nu se înregistrează manual ca Subscribed; profilul nou rezultă din fluxul DOI. Confirmarea afectează numai profilul nou, nu adresa actuală a proprietarei.

Înainte de activare se verifică asocierea exactă a listei noi, lipsa altor automatizări care pot reacționa, copiile mesajelor, expeditorul autentificat/Reply-to, nicio confirmare finală suplimentară, lipsa mesajelor în așteptare și configurația re-entry OFF. Dacă limitele planului împiedică resursele, se oprește; nu se aprobă implicit upgrade.

## Aprobări separate

1. **Pregătire externă:** creare exclusiv a listei, automatizării și copiilor dedicate, toate fără activare sau trimitere. Inspecția adresei în citire este deja solicitată; aceasta nu autorizează importul/crearea manuală a contactului. Păstrează snapshoturi și ID-uri pentru un rezultat concret de aprobat.
2. **Execuție după configurația verificată:** activarea numai a resurselor noi, o singură solicitare DOI către adresa distinctă, click efectuat de Iulia și maximum un welcome; sunt aprobate crearea/confirmarea profilului nou și apartenența la lista nouă, fără efecte intenționate asupra profilului existent. Fără retry automat sau alte mesaje. Dezactivare imediată după rezultat, cu verificarea cozii/logurilor; mesajele deja trimise nu pot fi retrase. Consimțământul și istoricul noului profil se păstrează; fără dezabonare/ștergere automată.

Bugetul propus este de două mesaje ale acestui test, nu două mesaje pentru întregul cont în prezența formularului public independent. Dacă se cere izolare absolută la nivel de cont, este necesar un mediu Brevo separat cu expeditor verificat și aprobări suplimentare; nu este varianta minimă și nu se creează implicit.

## Acceptare și închidere

Un DOI solicitat; zero welcome înainte de confirmare; confirmare verificată în istoricul Brevo, atribut DOI și lista nouă; exact un welcome din noua automatizare. Nu se repetă scenarii deja validate. Închidere: noile resurse inactive, niciun mesaj nou programat neclar, Cloudflare neschimbat OFF, profilul vechi neatinș, toate dovezile și backupurile păstrate. Verificarea formularului web/D1 nu este inclusă.

Surse oficiale consultate pentru posibilitatea tehnică: https://developers.brevo.com/reference/create-doi-contact ; https://help.brevo.com/hc/en-us/articles/15476926804370-Welcome-message-Send-welcome-emails-to-onboard-new-contacts . Nu reprezintă validarea unei configurații încă necreate.
