# Audit editorial – vocea Iuliei, cele șapte legi și constelații
Data: 24 octombrie 2026. Statut: C I O R N Ă, N E P U B L I C A T Ă, pentru validarea Iuliei.

## Reguli
- Site oficial actual: https://intoarcerealatine-nou.pages.dev/ (decizie 22.10.2026). Nu folosi vechiul Netlify ca link public.
- Nu atinge `main`, nu face merge în ramura de producție Cloudflare `pregatire-cloudflare-2026-10-20` și nu declanșa publicare fără acordul expres al Iuliei.
- Materialele Monicăi Ion rămân surse/inspirație, nu afirmații automat validate ale metodei Iuliei.
- Dictarea Iuliei e distinctă de sursele externe și de propunerile editoriale. Nu copia paragrafe din cărți/suporturi.
- Conform explicației explicite a Iuliei (arhiva Q67), **echilibrarea privește acțiunea vizibilă, NU semnificația; semnificația este verificată ulterior**.
- Constelațiile sunt opționale, la cerere, iar în carte sunt bonus separat. O constelație nu dovedește cauze transgeneraționale sau evenimente istorice.
- Situațiile familiale din rescrierile de site sunt toate ipotetice, nu cazuri de cliente. Nu atașa mesaje de „beneficiu” forțat la doliu/boală/abuz.

## Surse consultate în verificare
1. `Material_brut_Legi_Universale_Iulia_Bobeica_v0.1.docx` (arhivă în Library; material mixt, cu rubrici „SURSA”, „APLICAREA IULIEI”, „DE VERIFICAT”).
2. `01_Intoarcerea_la_tine_SURSE_SI_ARHIVE_BRUTE.pdf` și `Intoarcerea_la_tine_TOATE_7_DOCUMENTELE_UNICE_INTEGRAL.pdf` – dictare, clarificarea Iuliei din 09.10.2026 despre combinația Transformare + Sincronicitate + Dualitate.
3. `Arhiva_originala_intrebari_raspunsuri_Intoarcerea_la_tine(1).pdf`, Q67–Q68 – acțiunea observabilă, apoi verificarea semnificației.
4. `REGULA_VOCE_BLANDA_IULIA.md` – preferința validată 18.10.2026.
5. Articole și pagini actuale din ramura de producție Cloudflare, citite înaintea rescrierii.

## Cele șapte legi – corecții aplicate în ciorne
- Dualitate: beneficii/dezavantaje contextuale, fără pozitivism forțat; lucrăm cu fapte/acțiuni, nu cu etichete.
- Reflexie: trăsătură judecată sau admirată -> acțiune observabilă -> analogia în propria experiență, fără a atribui vina.
- Sincronicitate: sprijin și provocare căutate în același moment și pe aceeași temă, fără a inventa sprijin.
- Transformare: clarifică mai întâi pierderea concretă; verifică dacă o altă formă era deja prezentă la momentul inițial; explorează diferențele, după clarificarea dictată de Iulia. Excepție expresă: nu pretindem beneficii pentru moarte/doliu.
- Ordine: valorile înalte ca reper (obiecte, energie, timp, bani, ultimele luni); distinct de „ordinea” din constelații.
- Fractali: repetiții potențiale la diferite scări; exemplul părintelui care muncește mult este din sursă, NU diagnostic despre orice copil.
- Escalare eristică: observarea polarizării și a atașamentului față de rezultat; nu se afirmă cauzalități despre fertilitate, job, relații ca adevăruri.
Se păstrează explicit statutul celor șapte legi drept repere în cadrul dezvoltării personale, nu legi științifice demonstrate.

## Ce s-a schimbat în ramura de audit (nu în site-ul public)
- Pagina Acasă, pagina Metoda, Resurse și câmpurile CMS corespondente: exemple și formulări corectate, fără exerciții inventate.
- Șapte articole distincte despre legi – rescrise editorial, fiecare cu un scenariu ilustrativ de familie/relatii și fără un „exercițiu” artificial obligatoriu.
- Două articole despre constelații și articolul „Când a fi puternică...” – rescrise cu exemple de roluri familiale, separare, doliu, boală, fără interpretări cauzale inventate.
- S-au păstrat slug-urile pentru linkurile SEO. Nu au fost modificate alte materiale-sursă.

## Verificări și limitări
- Textele sunt C I O R N E, nu fragmente deja validate de Iulia.
- Legăturile cu cazurile exacte din materialele Academia ReGeneration necesită confruntare cu pagina/fragmentul-sursă înainte de a afirma detalii; de aceea au fost folosite exclusiv **scene ipotetice marcate clar**, nu cazuri atribuite.
- Site-ul mai conține alte articole cu secțiuni „Exercițiu”, care pot fi de asemenea invenții editoriale. **Nu au fost aprobate și trebuie auditate înainte de următoarea publicare**.
- Datele LIVE/format, programul de patru luni, oferta „Merit să primesc?” și eticheta „Metoda CLAR” încă necesită verificare contractuală/editorială în ansamblul site-ului. Nu modifica oferte/date fără decizia Iuliei.
- Atenție la dubla sursă HTML fallback și JSON CMS: înainte de publicare trebuie sincronizate pentru ca experiența fără JavaScript și SEO să nu afișeze vechile texte.

## Pașii de QA înaintea publicării
1. Confirmare Iulia pe voce, fidelitate, formulări și „Metoda CLAR”.
2. Audit restul articolelor și eliminarea/transformarea exercițiilor neverificate.
3. Aliniere HTML fallback cu JSON-urile actualizate.
4. Build local cu `node scripts/build-cloudflare.mjs`; verificări pe conținut, linkuri și mobil.
5. Publicare **o singură dată** doar după aprobare explicită.
