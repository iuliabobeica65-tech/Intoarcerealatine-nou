# Diagnostic — oprire înainte de deployment, 13.11.2026

Verificări numai în citire: ramura permisă, proiectul exact, Preview OFF, zero bindinguri D1; root și alias redirecționează 302 către Access. Artefactul OFF de restaurare are 154/154 hashuri valide. Cel mai recent Preview rămâne 41f0a85f-770a-4cce-a424-f2502684abfb, cinci deploymenturi în total. Zero deploymenturi/configurări/mesaje executate în această etapă.

Blocaj de autorizare: procedura de revenire completă la artefactul OFF propusă anterior presupune republicarea lui; aceasta este încă un deployment. Noua aprobare permite strict unul și interzice alte deploymenturi. Preview nu este țintă de rollback nativ Pages; nu folosim rollback Production. Nu se tratează expirarea diagnosticului drept restaurare a artefactului anterior. Solicitarea anterioară a agentului nu explicita suficient numărul total.

Execuția este oprită înaintea publicării. Pentru metoda deja pregătită sunt necesare aprobări explicite pentru un deployment de diagnostic și unul de revenire OFF, fără iterații suplimentare. Alternativa cu un singur artefact care se transformă automat în OFF ar necesita proiectare și validare locală separată; nu este pachetul aprobat și nu este publicată implicit. Cauza exactă a access_required rămâne neidentificată.

Sursă oficială: https://developers.cloudflare.com/pages/configuration/rollbacks/ .
