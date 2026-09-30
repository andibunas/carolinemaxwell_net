---
name: verify
description: Build/launch/drive recipe for verifying caroline-maxwell-website changes in a real browser.
---

# Verify caroline-maxwell-website

1. If `public/**/manifest.md` or `scripts/build-manifest.sh` changed: `npm run build-manifest`.
2. Start an isolated dev server: `npx vite --port 5391 --strictPort` (background); poll `curl localhost:5391` until up.
3. Drive with Playwright (already a devDependency; only Chromium is installed).
   The script must live inside this folder so `import { chromium } from 'playwright'` resolves —
   write a temp `.verify-*.mjs` here, run with `node`, delete it after.
4. Routes: `/artworks/<FolderName>` for a top-level project (URL mirrors `public/artworks/` folders).
   Leaf-artwork projects always render `StackedLayout` (not `ArtworkDetail`) unless `Layout: carousel`.
5. Capture: full-page screenshot, `console`/`pageerror` events, DOM checks via `$$eval`.
   For `<video>`, check `readyState`/`error`/`duration`, then `muted = true; play()` to confirm playback.
6. Probe `build-manifest.sh` edge cases without touching the repo: copy the script into
   a temp dir as `scripts/build-manifest.sh` with a `public/artworks/<P>/manifest.md` beside it
   (the script resolves ROOT from its own location), run it, inspect `src/content/manifest.json` there.
7. `pkill -f "vite --port 5391"` when done.
