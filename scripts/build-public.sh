#!/usr/bin/env bash
# Construieste varianta PUBLICA a site-ului; nu exporta arhiva interna, documentele,
# fisierele CMS, notele de marketing, fisierele de test sau preview-urile tehnice.
set -euo pipefail
cd "$(dirname "$0")/.."
output="${1:-public-site}"
case "$output" in
  ""|"/"|"."|".."|".git"|".github") echo "Cale de iesire nesigura" >&2; exit 2 ;;
esac
rm -rf -- "$output"
mkdir -p "$output/assets/carusel-metoda" "$output/Intoarcerea_la_tine_files" "$output/content"

# Pagini de prezentare + trei politici; index este pagina de intrare.
for file in index.html acasa.html metoda-clar.html constelatii.html \
   lucram-impreuna.html despre-mine.html resurse.html live.html \
   politica-confidentialitate.html politica-cookies.html termeni-utilizare.html \
   robots.txt sitemap.xml; do
  test -f "$file" || { echo "Lipseste $file" >&2; exit 1; }
  cp "$file" "$output/$file"
done

# Doar codul, imaginile si datele necesare in browser.
for file in assets/site-base.css assets/site-theme.css assets/content-editor.js; do
  test -f "$file" || { echo "Lipseste $file" >&2; exit 1; }
  cp "$file" "$output/$file"
done
for img in assets/carusel-metoda/{01..07}.webp; do
  test -f "$img" || { echo "Lipseste $img" >&2; exit 1; }
  cp "$img" "$output/assets/carusel-metoda/"
done
portrait="Intoarcerea_la_tine_files/6ad1278ba01de7.05166081_9d2529da-d079-4183-89d4-6b674ef83217.jpg"
test -f "$portrait" || { echo "Lipseste portretul" >&2; exit 1; }
cp "$portrait" "$output/Intoarcerea_la_tine_files/"

for f in content/*.json; do
  test -f "$f" || { echo "Lipseste continut JSON" >&2; exit 1; }
  cp "$f" "$output/content/"
done

# Dosarul de iesire NU trebuie sa contina documente de dezvoltare si configuratii interne.
if find "$output" -type f \( -name '*.md' -o -name '.pages.yml' -o -name '*preview*' \) | grep -q .; then
  echo "Au fost exportate fisiere interne. Oprire!" >&2; exit 1
fi
echo "Site public pregatit la $output (fara documente interne)."
