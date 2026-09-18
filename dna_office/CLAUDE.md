# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build
- `npm run lint` — oxlint (rules: `react/rules-of-hooks`, `react/only-export-components`)
- `npm run build-manifest` — regenerate `src/content/manifest.json` from `public/gallery/`, `public/field-offices/`, `public/animal-reports/` (requires `jq`); run this after adding/editing any `manifest.md` or content folder
- `npm run clean` — remove `dist/`

There is no test suite configured.

## Architecture

React 19 + Vite + Tailwind v4, deployed as a single static `index.html` with no server-side routing.

**Content pipeline**: `scripts/build-manifest.sh` scans three flat (non-nested) content trees under `public/` — `gallery/`, `field-offices/`, `animal-reports/` — and compiles each subfolder's `manifest.md` into `src/content/manifest.json`. The folder name becomes the entry's `id`/URL slug. `manifest.md` format: leading `Key: value` front matter (`Name`, `Order`, `Thumbnail`, etc.) followed by `## Section Name` Markdown blocks; within a section, `### Title` blocks are individual leaf entries (artwork/image/report) with their own `Key: value` fields (`Medium`, `Size`, `Image`, `Video`) plus free-text write-up. Full format is documented in `scripts/MANIFEST_FORMAT.md`. `src/data/manifest.js` is the only code that reads `manifest.json`, exposing lookup functions (`getGalleryProject(slug)`, `getFieldOffice(slug)`, `getAnimalCategory(slug)`) — components should go through this module rather than importing the JSON directly. Since manifest.json is generated, always re-run `build-manifest` after touching content under `public/`.

**Routing**: there is no router library. Because the hosting environment has no SPA rewrite rule, the whole app is one physical page and every "route" is a query string on it (e.g. `?section=gallery&project=foo`), so a refresh or typed URL always resolves. `src/hooks/useQueryNav.js` implements this: a module-level `URLSearchParams` snapshot plus a `useSyncExternalStore` subscriber set, since `pushState` doesn't fire `popstate` and a plain per-component `useState` can't stay in sync across the multiple call sites (App, SiteHeader, pages) that all read/write nav state. Use `useQueryNav()`'s `navigate()` for programmatic nav and `linkTo()` to build `<a>` props (real `href` plus a click-intercepting `onClick`, so new-tab/middle-click still work). `src/App.jsx`'s `renderSection()` is the top-level switch on `section` (and secondary params like `office`/`project`/`view`) that picks which page component to render.

**Sections**: `home`, `gallery` (index + per-project page), `field-offices` (index + detail + transcript), `animal-reports`, `about` (its own sub-nav in `AboutLayout`/`AboutSubNav` across bio/press/reviews/events/galleries/likes/contact).
