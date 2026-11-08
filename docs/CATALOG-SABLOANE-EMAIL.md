# Catalog de șabloane e-mail

Toate textele sunt drafturi, neaprobate și neactivate. Catalogul JSON conține corpul complet, variabilele, CTA, destinatarii, temeiul, triggerul, opririle și testele fiecărui șablon. Sursele sunt în infrastructure/templates.mjs; regenerare: node scripts/export-email-catalogue.mjs.

COM-01 se implementează prin șablonul DOI Brevo, cu linkul special params.DOIurl. COM-02, COM-04 și COM-05 necesită configurarea fluxurilor și linkurilor personale în cont; pagina locală nu furnizează un endpoint fals de confirmare/dezabonare. Marketingul editorial și mesajele despre tranșe sunt blocate până la completare/aprobare. Nu există eșalonări active. FIN nu emite și nu trimite facturi reale.

| ID | Subiect | Tip | Stare |
|---|---|---|---|
| COM-01 | Confirmă adresa de e-mail | operațional/abonare | draft neaprobat |
| COM-02 | Bun venit în comunitate | operațional/abonare | draft neaprobat |
| COM-03 | Invitație WhatsApp | marketing | draft neaprobat |
| COM-04 | Preferințe | operațional/abonare | draft neaprobat |
| COM-05 | Dezabonare | operațional/abonare | draft neaprobat |
| LIVE-01 | Confirmarea înscrierii | operațional/abonare | draft neaprobat |
| LIVE-02 | Invitație LIVE | marketing | draft neaprobat |
| LIVE-03 | Reminder LIVE | operațional/abonare | draft neaprobat |
| LIVE-04 | După LIVE | operațional/abonare | draft neaprobat |
| LIVE-05 | Modificarea întâlnirii | operațional/abonare | draft neaprobat |
| LIVE-06 | Anulare LIVE | operațional/abonare | draft neaprobat |
| WEB-01 | Confirmarea înscrierii | operațional/abonare | draft neaprobat |
| WEB-02 | Reminder webinar | operațional/abonare | draft neaprobat |
| WEB-03 | Modificare webinar | operațional/abonare | draft neaprobat |
| WEB-04 | După webinar | operațional/abonare | draft neaprobat |
| WEB-05 | Anulare webinar | operațional/abonare | draft neaprobat |
| WRK-01 | Rezervarea înregistrată | operațional/abonare | draft neaprobat |
| WRK-02 | Detalii despre plată | operațional/abonare | draft neaprobat |
| WRK-03 | Acces la întâlnire | operațional/abonare | draft neaprobat |
| WRK-04 | Reminder workshop | operațional/abonare | draft neaprobat |
| WRK-05 | Anulare workshop | operațional/abonare | draft neaprobat |
| WRK-06 | După workshop | operațional/abonare | draft neaprobat |
| WRK-07 | Modificare workshop | operațional/abonare | draft neaprobat |
| PRG-01 | Înscriere în program | operațional/abonare | draft neaprobat |
| PRG-02 | Detalii despre plată | operațional/abonare | draft neaprobat |
| PRG-03 | Acces la program | operațional/abonare | draft neaprobat |
| PRG-04 | Calendarul programului | operațional/abonare | draft neaprobat |
| PRG-05 | Informații despre tranșe | operațional/abonare | draft neaprobat |
| PRG-06 | Finalizarea programului | operațional/abonare | draft neaprobat |
| PRG-07 | Modificare program | operațional/abonare | draft neaprobat |
| PRG-08 | Anulare program | operațional/abonare | draft neaprobat |
| SES-01 | Programarea ședinței | operațional/abonare | draft neaprobat |
| SES-02 | Reminder ședință | operațional/abonare | draft neaprobat |
| SES-03 | Reprogramarea ședinței | operațional/abonare | draft neaprobat |
| SES-04 | Anularea ședinței | operațional/abonare | draft neaprobat |
| PAY-01 | Confirmarea plății | operațional/abonare | draft neaprobat |
| PAY-02 | Plată nereușită | operațional/abonare | draft neaprobat |
| PAY-03 | Plată în așteptare | operațional/abonare | draft neaprobat |
| PAY-04 | Rambursare | operațional/abonare | draft neaprobat |
| PAY-05 | Informații despre tranșe | operațional/abonare | draft neaprobat |
| PAY-06 | Verificarea plății | operațional/abonare | draft neaprobat |
| FIN-01 | Factura | operațional/abonare | draft neaprobat |
| FIN-02 | Corecția facturii | operațional/abonare | draft neaprobat |
| FIN-03 | Problemă la facturare | operațional/abonare | draft neaprobat |
| MKT-01 | Newsletter | marketing | draft neaprobat |
| MKT-02 | Lansare | marketing | draft neaprobat |
| MKT-03 | Invitație | marketing | draft neaprobat |
| MKT-04 | Noutăți | marketing | draft neaprobat |
| OPS-01 | Livrare eșuată | operațional/abonare | draft neaprobat |
| OPS-02 | Dezabonare înregistrată | operațional/abonare | draft neaprobat |
| OPS-03 | Duplicat detectat | operațional/abonare | draft neaprobat |
| OPS-04 | Eroare operațională | operațional/abonare | draft neaprobat |

Automatizări pregătite în cod: confirmare înscriere, reminder administrativ la apelul schedulerului, schimbare/anulare/finalizare pe revizii, statusuri de plată verificate prin webhook și job facturare. Nu există scheduler instalat, workflow Brevo creat sau campanie trimisă. După o livrare incertă, operatorul verifică jurnalul furnizorului înainte de retry.
