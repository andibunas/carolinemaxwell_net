<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*
[ npx doctoc README.md --maxlevel 3]

- [carolinemaxwell_net](#carolinemaxwell_net)
  - [dna_office](#dna_office)
  - [caroline-maxwell-website](#caroline-maxwell-website)
  - [all_dna](#all_dna)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# carolinemaxwell_net

## dna_office
- React 19 + Vite + Tailwind v4 static site for Caroline Maxwell's "Department of Nocturnal Affairs" content (gallery, field offices, animal reports, about).
- Content is authored as `manifest.md` files under `public/` and compiled into `src/content/manifest.json` via `npm run build-manifest`.
- No router library — navigation is query-string based (`?section=...`) so it works without SPA server rewrites.

## caroline-maxwell-website
- React Router + Tailwind v4 artist portfolio site for Caroline Maxwell (artworks, writings, about/bio/CV/contact).
- Content model is a single manifest tree (`src/content/manifest.json`) with pluggable per-project layout types (grid/featured/stacked).
- Includes a `build:static` step that pre-renders routes to `dist-static/` for hosts without SPA fallback support.

## all_dna
- Legacy classic ASP.NET / static HTML site ("Department of Nocturnal Affairs") using an old frameset layout (`leftNav.html` + `home.html`).
- Contains the original galleries, animal reports, and field office pages that `dna_office` is the modern React rebuild of.
- Kept for reference/migration source material, not actively developed.
