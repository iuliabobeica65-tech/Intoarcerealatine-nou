# Salvare sigură fără deploy — 8 noiembrie 2026

## Actualizare: salvare GitHub și Preview autorizate

Cele 9 commituri până la c2f41b5 sunt acum salvate pe GitHub în ramura de test; Cloudflare a creat Preview-ul, cu operațiunile externe oprite. Vezi PUBLICARE-RAMURA-TEST-2026-11-09.md pentru dovezi și limitări. Formulările anterioare despre lipsa push-ului rămân istoric. Producția nu a fost ținta operațiilor.

## Decizie

**NU se face push. Modificările noi nu sunt salvate pe GitHub.** Se salvează un commit local, un bundle Git complet și un ZIP cu sursele comise, în `.local/backups/2026-11-08/`. Aceste copii sunt pe același calculator; nu reprezintă backup off-site. Transferul lor către o locație externă se face ulterior, cu autorizare, fără conectare la publicarea site-ului.

## Dovezi verificate

- Repository: `iuliabobeica65-tech/Intoarcerealatine-nou`.
- Ramură exclusivă: `pregatire-infrastructura-email-plati`.
- La începutul acestei etape: worktree curat și HEAD local `b25d0e2ec9227b6f5d219aa41ebed4c4693e5582`.
- Head GitHub de lucru: `91b84a094bfe93982f30609aa1e214775dce4fd9`.
- Head GitHub producție cunoscută: `b64af72153794881e9ee5c5b434da62c3f97656f`; aceeași ramură confirmată anterior de Iulia: `pregatire-cloudflare-2026-10-20`.
- Nicio modificare remote nouă față de auditul anterior; issues #81 și #82 conțin decizii, nu editări concurente de fișiere. Nu se integrează alte lucrări.

Pentru commitul remote `91b84a0`, API-ul GitHub `commits/pregatire-infrastructura-email-plati/check-runs` arată:

| Integrare | Rezultat observat | Dovadă |
|---|---|---|
| Cloudflare Pages: intoarcerealatine-nou | Deployed successfully; URL unic și alias de branch preview | [Cloudflare deploy ebe4a10c](https://dash.cloudflare.com/?to=/b954dd025a008e1c784797b561e0d55f/pages/view/intoarcerealatine-nou/ebe4a10c-ed9a-4156-9993-39a7c48e2c15) |
| Cloudflare Pages: intoarcerea-la-tine-campanii | Build failed; o a doua integrare a încercat deployment | [Cloudflare build f3deef38](https://dash.cloudflare.com/?to=/b954dd025a008e1c784797b561e0d55f/pages/view/intoarcerea-la-tine-campanii/f3deef38-abac-4d7a-a0ee-f415b3db170a) |

Primul check raportează aliasul `pregatire-infrastructura-ema.intoarcerealatine-nou.pages.dev`. Nu s-a accesat previewul, nu s-a verificat Cloudflare Access și nu se afirmă că este protejat. Existența lui arată că push-ul nu poate fi tratat drept simplă stocare Git fără deploy. Pentru al doilea proiect nu s-a confirmat Production branch sau dacă un viitor build reușit ar publica alt site. Un build eșuat anterior nu garantează eșecul următorului.

Workflowul local `.github/workflows/qa-site-v2.yml` declanșează QA la push pe ramura de producție, la PR pentru căile indicate și manual. Nu publică site-ul. Integrarea nativă Cloudflare observată în checks este separată de acest workflow; faptul că YAML nu conține un deploy nu îl împiedică.

Nu există acces API conectat la setările acestor proiecte Cloudflare. Nu s-au inspectat setările curente din dashboard, deploy hooks, mapări de domeniu sau toate integrările contului; nu se poate garanta exact comportamentul următorului push. Dovezile istorice sunt suficiente pentru a opri push-ul conform instrucțiunii Iuliei.

## Ce lipsește pentru push fără publicare

Proprietara sau un administrator autorizat trebuie să verifice **toate** proiectele conectate la acest repository, inclusiv cele două de mai sus:

1. Production branch și domeniile fiecărui proiect: ramura de lucru nu trebuie să fie producție pentru niciunul. Nu modifica ramura de producție.
2. Configurația previewurilor: păstrează regulile existente pentru celelalte lucrări și exclude exact `pregatire-infrastructura-email-plati` din buildurile automate, printr-o schimbare aprobată separat. Nu dezactiva global previewurile altor ramuri.
3. Alte integrări/deploy hooks/Workers Builds: confirmă că nu există încă un consumator care publică acest branch.
4. Furnizează confirmarea setărilor efective sau acces read-only autorizat pentru verificare. Nu trimite tokenuri/parole în chat.
5. Numai după verificare se poate face push exclusiv pe ramura de lucru, fără force, după încă o comparație cu headul remote. Nu se face PR, merge sau deploy. Dacă excluderea nu este posibilă, este necesară o decizie explicită a Iuliei privind o altă destinație de backup fără găzduire; nu se creează automat un repository nou sau un release.

Documentația oficială [Cloudflare Branch deployment controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/) descrie opțiunile All non-Production branches / None / Custom și excluderea unui nume exact. Setările sunt per proiect. Nu au fost schimbate în această lucrare.

## Conținut și restaurare

Bundleul conține obiectele Git și toate referințele disponibile local (`--all`), inclusiv implementarea inițială, documentele MASTER, activarea, catalogul și rapoartele de test, plus actualizarea issues #81/#82. ZIP-ul surselor conține arborele complet al commitului final, fără metadate Git. Nu se includ `.env` reale, credențiale, node_modules sau date de cliente. Fișierele ignorate de lucru nu fac parte din istoria Git; capturile QA sunt păstrate separat într-un ZIP de dovezi, dacă sunt prezente.

Manifestul `MANIFEST.json` din directorul de backup consemnează SHA-ul complet al commitului final, hashurile SHA-256 ale arhivelor și rezultatele verificării. Se verifică `git bundle verify`, apoi o clonare locală fără checkout într-un director nou și egalitatea SHA-ului commitului și a arborelui. Aceasta nu este un push și nu accesează GitHub.

Restaurare într-un director nou, niciodată peste proiectul existent:

```text
git clone --branch pregatire-infrastructura-email-plati <cale-catre-bundle> <director-nou>
git -C <director-nou> rev-parse HEAD
```

Compară SHA-ul cu MANIFEST.json. La reluare nu face `git push` către originea implicită a clonei din bundle. Configurează destinația GitHub numai după rezolvarea riscului de deploy și aprobarea pașilor necesari. Starea noilor decizii WhatsApp/Google Calendar este documentară; nu s-au modificat pagini, setări de servicii sau rezervări.
