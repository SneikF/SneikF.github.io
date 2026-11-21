#!/usr/bin/env bash
# Construye el sitio y lo sube a la rama `pages` del repositorio en Codeberg.
# Uso: ./publicar.sh
set -euo pipefail

cd "$(dirname "$0")"
REMOTO="$(git remote get-url origin)"

rm -rf public
hugo --gc --minify

cd public
git init -q
git checkout -q -b pages
git add -A
git commit -q -m "Publicar $(date '+%Y-%m-%d %H:%M')"
git push -q -f "$REMOTO" pages
rm -rf .git

echo "Publicado. El webhook de Codeberg actualiza el sitio en unos segundos."
