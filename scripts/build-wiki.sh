#!/usr/bin/env bash
# Builds the Obsidian vault in wiki/content into dist/melon-files with Quartz.
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
# Site icon (favicon and the circle next to the title)
cp "$ROOT/wiki/static/icon.png" "$ENGINE/quartz/static/icon.png"
# The ECE Edition's green print (its pages, home page and tab; components/MelonEditions.tsx)
cp "$ROOT/wiki/static/icon-ece.png" "$ENGINE/quartz/static/icon-ece.png"
# Link-preview image (replaces Quartz's default og-image.png)
cp "$ROOT/wiki/static/og-image.png" "$ENGINE/quartz/static/og-image.png"
# Lenis smooth scrolling, from the same package the main site uses
cp "$ROOT/node_modules/lenis/dist/lenis.min.js" "$ROOT/node_modules/lenis/dist/lenis.css" "$ENGINE/quartz/static/"
# GSAP, for the page-transition motion in MelonMotion.tsx (loaded on demand like Lenis)
cp "$ROOT/node_modules/gsap/dist/gsap.min.js" "$ENGINE/quartz/static/"
# three.js, for the 3D wire-web head on the home page (components/MelonHome.tsx, imported on demand)
cp "$ROOT/node_modules/three/build/three.module.min.js" "$ENGINE/quartz/static/"
# Delaunator, which triangulates the wire web on the home page (MelonHome.tsx)
cp "$ROOT/node_modules/delaunator/delaunator.min.js" "$ENGINE/quartz/static/"
mkdir -p "$ENGINE/quartz/components/custom"
cp "$ROOT"/wiki/components/*.tsx "$ENGINE/quartz/components/custom/"
mkdir -p "$ENGINE/quartz/plugins/custom"
cp "$ROOT"/wiki/plugins/*.ts "$ENGINE/quartz/plugins/custom/"

cd "$ENGINE"
npx quartz build -d "$ROOT/wiki/content" -o "$ROOT/dist/melon-files"

# Quartz always names its stylesheet, scripts, and icon index.css / prescript.js / postscript.js / icon.png,
# and Cloudflare tells browsers to cache them for hours, so a new design wouldn't show
# until that cache expired. Tag the links with this build's version so each deploy is fetched fresh.
VERSION="${CF_PAGES_COMMIT_SHA:-$(git -C "$ROOT" rev-parse --short HEAD 2>/dev/null || date +%s)}"
VERSION="${VERSION:0:12}"
find "$ROOT/dist/melon-files" -name "*.html" -exec \
  sed -i -E "s#(index\.css|prescript\.js|postscript\.js|icon\.png)\"#\1?v=$VERSION\"#g" {} +
