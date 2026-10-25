# Integrare unică — cerințe 25.10.2026 (document de lucru)
## Bază protejată
- Deployment Cloudflare validat de utilizatoare: c16444da; commit GitHub bf3f385948665102bebafcc3bbb46ae96ef63d25.
- Backup: backup-site-validat-2026-10-25. Nu modifica această ramură.
- Integrare numai pe lucru-actualizari-2026-10-25. Nu publica înainte de verificarea tuturor paginilor.
- Cloudflare Pages exclusiv, nu Netlify. Păstrează versiunea aprobată, toate paginile, articolele, programele, URL-urile și fotografia principală validată; nu reintroduce fotografia neclară.
## Cerințe recuperate din conversațiile de azi
1. Site aerisit, elegant, feminin, profesional; categorii principale păstrate; structură ordonată, fără aglomerare.
2. Intensivul de 3 zile „Nu mai vreau așa. Dar de ce fac tot la fel?” vizibil și inclus între modalitățile de lucru; nu inventa date sau prețuri.
3. SEO pentru 28 de articole și paginile principale: titluri și descrieri bazate pe situații concrete din viața femeilor, fără schimbarea URL-urilor.
4. Direcția frică–merit–imagine de sine și relația frică/percepții polarizate/tipare repetitive, fără a impune unei cititoare o cauză prestabilită.
5. Articole: frica de respingere, abandon, eșec, judecata celorlalți; articol central despre frică și polarizarea percepțiilor; categoria „Frici și percepții polarizate”.
6. Verifică sitemap: 14 pagini + 28 articole în versiunea verificată anterior; inclusiv „Alegeri fără vinovăție”. Verifică din nou după integrare, nu presupune că numărul rămâne fix dacă se adaugă articole.
7. Exemple reale, o singură situație/durere/mesaj per piesă; fără diagnostice, soluții și întrebări metodologice nevalidate; nu prezenta sursele drept cazuri ale Iuliei.
8. Păstrează prima pagină și mesajele validate, fotografia cu pălărie, structura multipagină, servicii și programe; nu elimina conținut aprobat.
9. Un singur deployment final, numai după audit și aprobare.
## Ramuri de verificat, NU de îmbinat automat
- seo-probleme-reale-rebase-2026-10-25
- diagnostic-sitemap-gsc-2026-10-25
- oferta-clara-traseu-clienta-2026-10-25
- brand-elegant-modalitati-intensiv-20261025
- brand-sprijin-provocare-incredere-20261025
- audit-brand-navigare-intensiv-20261025
- pregatire-cloudflare-2026-10-20
## Atenție
Acest document este inventar de cerințe, nu dovada implementării. Ramurile au istoric divergent; compară fișierele și integrează selectiv în baza aprobată.
## Audit de ramuri — 25.10.2026, continuare
- Compararea GitHub confirmă că `lucru-actualizari-2026-10-25` are 11 commituri peste backup, cu modificări în paginile principale, articole, legi, resurse și sitemap. Acesta este progres real, NU validare editorială sau vizuală.
- `seo-probleme-reale-rebase-2026-10-25`: 6 commituri înainte / 11 în urmă față de backup; modifică 28+ JSON-uri editoriale, pagini și programul Nivel de merit. **Nu se face merge automat**: inventariază fiecare articol și păstrează URL-urile aprobate.
- `diagnostic-sitemap-gsc-2026-10-25`: schimbă scriptul de build și fluxul QA; verifică utilitatea fără a modifica configurația Cloudflare.
- `oferta-clara-traseu-clienta-2026-10-25`, `brand-elegant-modalitati-intensiv-20261025`, `brand-sprijin-provocare-incredere-20261025`, `audit-brand-navigare-intensiv-20261025`: ramuri divergente, cu alte structuri HTML; extrage doar textele/ideile aprobate, fără înlocuirea fișierelor întregi.
- Ramura `pregatire-cloudflare-2026-10-20` a primit modificări după deploymentul validat; rollback-ul Cloudflare **nu** a restaurat ramura GitHub. Nu o publica până la audit.

## Ordine de integrare și verificare (neexecutată integral)
1. Compară navigația, secțiunile și linkurile pentru fiecare pagină față de backupul `bf3f385`.
2. Verifică distinct cele 14 pagini, programele și cele 28 de articole generate; nu presupune că sunt intacte doar fiindcă există fișierele.
3. Integrează întâi textele aprobate în `lucru-actualizari-2026-10-25`, cu modificări punctuale, nu prin copierea paginilor complete de pe ramurile divergente.
4. Auditează SEO: sitemap, canonical, robots, articole și URL-uri existente.
5. Rulează buildul și verificările de navigare/mobil înainte de aprobarea publicării; păstrează backupul neatins.

## Status
**Pregătire / audit al surselor realizat; integrarea finală, testele și publicarea NU sunt confirmate.**
