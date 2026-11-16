# Primul deployment izolat — pregătit, neexecutat

Data: 11 noiembrie 2026. Țintă exclusivă: er-brevo-test-izolat, cont verificat b954dd025a008e1c784797b561e0d55f. Fără Git/push/merge. Eticheta Production din acest proiect separat nu reprezintă proiectul oficial; main din configurația proiectului gol nu este o comandă de modificare a ramurii Git main. Deploymentul propus va folosi ramura de test explicită pregatire-infrastructura-email-plati.

## Pachetul exact

Artefact local înghețat: `.local/brevo-2026-11-11/deployment-off-1794421697090/`, 154 fișiere, 4.340.530 bytes. Inventar complet cu dimensiuni și SHA-256: `.local/brevo-2026-11-11/deployment-manifest.json`. Configurație separată: `deployment-off.json` în același director părinte.

152 fișiere din buildul static existent: 101 HTML (pagini și articole), 18 JSON de conținut public, 3 JS, 5 CSS, 21 imagini, robots.txt, sitemap.xml, _headers și _redirects. Se adaugă Worker-ul API compilat `_worker.js` și `_routes.json` limitat la `/api/*`. Nu se publică repository-ul, docs, migrări, teste, .env, loguri, capturi sau credențiale. Scanarea semnăturilor de chei și a căilor private: 0 candidați; nu este o garanție universală împotriva tuturor tipurilor de informații confidențiale.

Numai în copia izolată: robots Disallow, X-Robots-Tag noindex/nofollow/noarchive, loaderul analytics nu poate porni colectarea. Sursele și SEO-ul oficial sunt nemodificate. Paginile păstrează unele linkuri către domeniul oficial, WhatsApp și politicile publice; testele nu le vor folosi pentru formulare sau contacte reale. Sitemapul/canonicalele existente rămân către domeniul oficial. Nu se modifică designul/meniurile sursă.

## Access și servicii

Configurații Access verificate separat: er-brevo-test-izolat.pages.dev și *.er-brevo-test-izolat.pages.dev, fiecare cu regula Include Emails numai pentru adresa proprie autorizată; fără Bypass/Service Auth observat. Configurația salvată nu înlocuiește testul real de acces după deployment. Niciun test de autentificare prin cod nu se inițiază automat în numele utilizatoarei.

Nu se accesează date sau API Brevo. Fără BREVO_API_KEY, DB, Turnstile, chei Stripe sau admin token. COMMUNITY_ENABLED, REGISTRATIONS_ENABLED, EMAIL_SEND_ENABLED, PAYMENTS_TEST_ENABLED, LIVE_PAYMENTS_ENABLED și INVOICING_ENABLED toate false; billing mock, invoice sender none, allowlist goală. TEST_MODE true, lista test 4 și template DOI 2 sunt doar identificatori configurați, neutilizați cât funcțiile sunt oprite. Nu se importă contacte și nu se activează șabloane/automatizări. Configurația nu trebuie să înlocuiască vreodată cea a proiectului oficial.

## Validare

Reutilizate: 28/28 teste locale, build și verificator trecute. În plus, testul direct al Worker-ului din pachet confirmă GET /api/config 200 cu funcții false, /api/events și POST community/register/checkout/stripe-webhook 503, admin/dispatch 403; 0 apeluri externe. Prima încercare a testului folosea greșit /api/stripe/webhook și a primit 404; ruta a fost corectată în verificare, fără schimbare de cod API. Rezultatul final: deployment-worker-checks.json local.

Înainte de publicare: reverificare cont, nume proiect, Access, absența bindings/secrets în mediul vizat și hashurile artefactului. Nu folosi configurații sau directoare implicite. Publicare numai după acord separat.

După publicare: verificarea buildului și URL-ului exact; solicitări fără cookie/autentificare la rădăcină și /api/config pe adresa principală și URL-ul unic/aliasul deploymentului trebuie să ceară autentificare, fără conținut protejat. Iulia finalizează personal loginul. După login: pagini/active/layout, noindex, absența analytics și apelurilor furnizorilor, API/config false, refuzurile de mai sus. Fără înscriere reală, webhook Stripe, import sau linkuri de dezabonare. Oprire imediată dacă Access nu protejează orice alias/API. DOI → welcome → preferințe → dezabonare nu este validat de acest deployment OFF.

## Revenire

Este primul deployment: nu există o versiune anterioară în acest proiect la care să facem rollback. Nu promitem revenire printr-un buton de rollback. Păstrăm Access, toate funcțiile OFF și fără secrete/DB. Dacă apare o problemă, oprim testarea și cerem aprobarea pentru înlocuirea cu o pagină inertă de mentenanță ori pentru eliminarea deploymentului. Nu ștergem proiectul/politicile și nu relaxăm Access automat. Nicio revenire nu atinge site-ul oficial sau alte proiecte. Codul și manifestul sunt păstrate local; această etapă nu a făcut push.

## Execuție aprobată, oprită înainte de deployment

Iulia a aprobat separat primul deployment exclusiv în er-brevo-test-izolat. Preflight local: TARGET_EXACT, FLAGS_OFF, 154_HASHES_VERIFIED. Configurația de deployment a fost copiată numai local în .local/brevo-2026-11-11/wrangler.json pentru auto-detectarea Wrangler, fără modificarea pachetului aprobat. Verificarea remote pages project list a eșuat înainte de orice scriere: Wrangler cere autentificare în mediul non-interactiv. whoami repetat confirmă AUTH_NOT_AVAILABLE; configurația OAuth nu a fost găsită în cele două locații standard verificate prin metadate. Loginul fusese confirmat în etapa anterioară, dar nu este disponibil acum; cauza persistenței nu este demonstrată. Nu se presupune revocare sau reautentificare reușită. Nu s-a executat pages deploy și nu există URL nou de deployment sau rezultate de test remote. Access și proiectele Cloudflare nu au fost modificate. Aprobarea de deployment nu autorizează folosirea unei chei globale sau extinderea permisiunilor.
