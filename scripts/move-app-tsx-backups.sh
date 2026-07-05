#!/usr/bin/env bash
set -euo pipefail

DEST="backups/app-tsx-backups"

find app -type f \( \
  -name "*.backup.tsx" -o \
  -name "*.old*.tsx" -o \
  -name "*.before-*.tsx" -o \
  -name "*backup*.tsx" -o \
  -name "*broken*.tsx" \
\) | while read -r file; do
  target="$DEST/$file"
  mkdir -p "$(dirname "$target")"
  mv "$file" "$target"
  echo "Moved: $file -> $target"
done
