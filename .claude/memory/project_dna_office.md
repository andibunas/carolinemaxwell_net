---
name: project-dna-office
description: "dna_office subproject basics — stack, content pipeline, routing"
metadata: 
  node_type: memory
  type: project
  originSessionId: b4497515-2de2-4098-832a-10cfa0a2972b
  modified: 2026-09-18T21:34:24.523Z
---

`dna_office/` is a subproject inside carolinemaxwell_net: React 19 + Vite + Tailwind v4, static single-page site with no router library (query-string-based routing via `src/hooks/useQueryNav.js`). Content (gallery/field-offices/animal-reports) is authored as `manifest.md` files under `public/`, compiled to `src/content/manifest.json` via `npm run build-manifest` (needs `jq`). No test suite. CLAUDE.md was generated for it on 2026-09-18 via the `init` skill.

**Why:** documented so future work in this subproject doesn't need to re-derive the manifest pipeline or routing scheme from scratch.
**How to apply:** when asked to touch dna_office content or pages, remember to re-run `build-manifest` after editing `public/**/manifest.md`, and that navigation goes through `useQueryNav`, not a router.
