# Export lunar criptat — pregătire locală

Nu este activat un job extern și nu s-au exportat abonați reali. Instrumentul local `scripts/newsletter-backup.ps1` nu contactează Brevo, nu trimite e-mailuri, nu șterge exporturi și nu importă contacte. Necesită PowerShell 7.4+; verificat cu 7.6.9 numai pe fișiere sintetice. Rezultatul testului nou: trei categorii criptate și restaurate identic, parolă greșită respinsă, destinație publică respinsă, suprascriere respinsă. Testele vechi nu au fost repetate.

## 1. Export manual, lunar și înaintea unei modificări importante

După validarea politicii și activare, operatorul exportă din Brevo numai datele relevante listei #3. Lista #4 și contactele existente nu se mută și nu se reabonează. CSV-ul contactelor nu înlocuiește logurile DOI. Salvează separat:

- `contacts`: CSV cu e-mail, ID listă, stare, versiune, sursă și momentele existente ale solicitării; fără prenume sau alte câmpuri inutile.
- `doi`: logurile relevante DOI/confirmare, conținutul/versiunea mesajului și formularului; corelație cu ID-ul mesajului și datele confirmării efective. Include retragerile unde există în istoric. Nu considera deschiderile, data creării contactului sau parametrul paginii drept dovadă suficientă.
- `dezabonari`: suprimările și cererile de retragere/ștergere necesare prevenirii reabonării. Înregistrează și schimbările ulterioare backupului. Nu copia restul contului fără necesitate. Dacă nu există înregistrări, păstrează un fișier care consemnează explicit verificarea și lipsa înregistrărilor, fără a inventa evenimente.

Oprește opțiunea Brevo de trimitere a exportului prin e-mail. Descarcă în spațiul privat, apoi pregătește structura `.local/newsletter-private/incoming/AAAA-LL/{contacts,doi,dezabonari}`. Exporturile sunt în clar până la criptare: folosește un disc și o sesiune protejate, fără partajare publică. Nu pune fișierele în surse, GitHub sau chat. Retenția logurilor din Brevo trebuie să acopere intervalul dintre exporturi; dacă este mai scurtă de o lună, se ajustează înainte de lansare sau se revizuiește procedura. Nu se presupune că furnizorul păstrează automat toate dovezile.

## 2. Criptare portabilă, categorii separate

Din directorul proiectului, în PowerShell 7.4+, folosind o parolă lungă unică păstrată separat într-un manager de parole:

```powershell
$backupPassphrase = Read-Host 'Parola arhivei, păstrată separat' -AsSecureString
./scripts/newsletter-backup.ps1 -Action Protect `
  -InputPath "$PWD/.local/newsletter-private/incoming/AAAA-LL" `
  -OutputPath "$PWD/.local/newsletter-private/backups/AAAA-LL" `
  -Password $backupPassphrase
```

Înlocuiește `AAAA-LL` cu luna exportului. Directorul de ieșire trebuie să fie nou. Nu pune parola în argumente în clar, surse, nume de fișiere, variabile de mediu sau loguri. Instrumentul creează trei arhive independente `contacts.erbackup.json`, `doi.erbackup.json`, `dezabonari.erbackup.json`, cu AES-256-GCM și cheie derivată prin PBKDF2-SHA256 (600.000 iterații, salt și nonce aleatorii). Numele fișierelor exportate sunt în interiorul conținutului criptat. Manifestul separat are numai categoriile, numărul de fișiere, formatul, momentul și hashurile; nu include adrese.

Criptarea nu înlocuiește controlul accesului. Păstrează o copie criptată pe un suport protejat separat; parola se păstrează separat de arhive. Pierderea parolei împiedică restaurarea. După verificarea restaurării în carantină, operatorul poate elimina copiile temporare în clar conform politicii aprobate; scriptul nu le șterge automat și nu promite ștergere sigură pe SSD/backupuri sincronizate.

## 3. Verificare/restaurare numai în carantină privată

```powershell
./scripts/newsletter-backup.ps1 -Action Restore `
  -InputPath "$PWD/.local/newsletter-private/backups/AAAA-LL/contacts.erbackup.json" `
  -OutputPath "$PWD/.local/newsletter-private/quarantine/AAAA-LL-contacts" `
  -Password $backupPassphrase
```

Repetă cu arhiva `doi` și `dezabonari`, fiecare într-un director nou separat. Instrumentul verifică autenticitatea criptografică înaintea extracției, respinge parolele greșite, căile externe și suprascrierea. Compară fișierele și dovezile înainte de a considera backupul complet. Instrumentul nu certifică semantic că exportul Brevo conține toate evenimentele necesare.

Nu se importă automat nimic în Brevo. Retragerile, ștergerile și suprimările mai noi au prioritate față de arhivă. Nu se reintroduc persoanele șterse și nu se bifează opțiuni de reabonare. CSV-ul nu reconstruiește logurile istorice native; dovezile separate rămân documente confidențiale. Un import real necesită o operațiune distinctă aprobată și o metodă care păstrează aceste restricții.

## 4. Retenție și responsabilitate

Operatorul execută exportul lunar și verifică existența dovezilor înaintea unei modificări. Nu există scheduler instalat. Propunere pentru backupurile lunare: două generații, maximum 65 zile, pentru a acoperi lunile de 31 zile și verificarea copiei următoare; această rotație este separată de limita de 12 luni a listei în așteptare și trebuie validată juridic. Nu sunt activate ștergeri automate. O arhivă nu justifică prelungirea folosirii adresei în lista activă; la orice restaurare se reaplică retragerile și ștergerile.

Necesită validare înainte de colectare: identitatea completă/contactele operatorului, perioada separată pentru dovezi și suprimări, retenția efectivă Brevo, drepturile și procesul de ștergere, transferurile/DPA-urile și continuitatea păstrării cheilor de backup. Nu se transferă automat baza către un viitor SRL.
