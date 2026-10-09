#!/usr/bin/env bash
# Builds the Obsidian vault in wiki/content into dist/wiki with Quartz.
# The Quartz engine is cloned into .quartz (gitignored) at a pinned version;
# only our config, layout, and styles live in this repo.
set -euo pipefail

QUARTZ_VERSION="v4.5.2"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENGINE="$ROOT/.quartz"

if [ ! -f "$ENGINE/.version" ] || [ "$(cat "$ENGINE/.version")" != "$QUARTZ_VERSION" ]; then
  rm -rf "$ENGINE"
  git clone --quiet --depth 1 --branch "$QUARTZ_VERSION" https://github.com/jackyzha0/quartz.git "$ENGINE"
  (cd "$ENGINE" && npm ci --no-audit --no-fund --loglevel=error)
  echo "$QUARTZ_VERSION" > "$ENGINE/.version"
fi

cp "$ROOT/wiki/quartz.config.ts" "$ROOT/wiki/quartz.layout.ts" "$ENGINE/"
cp "$ROOT/wiki/custom.scss" "$ENGINE/quartz/styles/custom.scss"

cd "$ENGINE"
npx quartz build -d "$ROOT/wiki/content" -o "$ROOT/dist/wiki"
