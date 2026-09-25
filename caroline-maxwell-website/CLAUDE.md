# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Scope discipline
Only read files I explicitly name or point to. Do not read additional files to "get context," "understand the project," or "see how things connect" unless I ask you to.
If you think reading more files would help, ask first. One sentence: "Want me to also read X?" Wait for my answer.
This applies to every task in this project. No exceptions for "just checking" or "quick look."

## Project Summary

A bespoke, responsive artist portfolio site for **Caroline Maxwell**, built with
React + React Router + Tailwind CSS. Content (artworks and writings) is driven
entirely by a JSON manifest (`src/content/manifest.json`) so the site owner can
add/edit work without touching code.

## Commands

```bash
npm run dev            # start Vite dev server (localhost:5173, HMR)
npm run build           # production build -> dist/
npm run build:static    # build, then crawl dist/ with a headless browser and
                         # write a static, pre-rendered copy per route to
                         # dist-static/ (see scripts/generate-static.mjs)
npm run preview         # serve the dist/ build locally
npm run lint             # oxlint
npm run build-manifest  # scripts/build-manifest.sh — regenerate/validate the manifest
npm run clean            # rm -rf dist dist-static
```

There is no test suite/script configured. Playwright is a devDependency used
only by `scripts/generate-static.mjs` to drive the static-crawl build, not for
tests.

## Architecture

### Content model: manifest-driven, not hardcoded
Everything under Artworks and Writings is one recursive tree in
`src/content/manifest.json` (`artworks.projects` / `writings.items`), and all
page components read it through the accessor functions in `src/data/manifest.js`
(`resolveArtworkPath`, `getLatestArtworkProjects`, `getNodeThumbnail`, etc.)
rather than importing the JSON directly. Nodes have a `type` of `project`,
`artwork`, or `writing`; `project` nodes can nest further `children`.

### Routing: URL fully encodes tree position
`src/App.jsx` defines the real routes (`/`, `/artworks`, `/writings`, `/about`
with `bio`/`cv`/`contact` sub-routes). Everything below `/artworks` and
`/writings` is a single catch-all route (`/artworks/*`, `/writings/*`) whose
page component splats the remaining path segments and resolves them against
the manifest tree via `resolveArtworkPath`/equivalent — so a project, sub-project,
or leaf artwork/writing is a bookmarkable URL, not client-only state.

### Layout types are pluggable per project node
A project's `layout_type` field (`grid`, `featured`, `stacked`, `carousel`, …)
selects which layout component renders its children. The mapping lives in
`src/components/artworks/layoutRegistry.js`, where each layout is
`React.lazy`-loaded for code-splitting. `resolveArtworkLayout()` forces the
`stacked` layout whenever a project's children are leaf artworks rather than
sub-projects (stacked shows image/medium/size/date/write-up inline, with no
click-through), unless `layout_type` is `carousel` (auto-rotating image
carousels grouped by each artwork's `carousel` field, delay from
`carousel_speed`, default 5s). To add a new layout: create the
component in `src/components/artworks/layouts/`, register it in
`layoutRegistry.js`, and reference its key from a project's `layout_type`.

### Per-route document titles
There's no `react-helmet-async` — each page component sets `document.title`
directly (see `src/pages/**/*.jsx`).

### Markdown content
Long-form content (Bio, CV, write-ups) is authored in Markdown and rendered
via `marked` in `src/components/about/MarkdownContent.jsx`, rather than being
written as JSX.

### Responsive nav breakpoint
The header's mobile hamburger (`MobileMenu.jsx`) vs. inline nav
(`NavMenu.jsx`) split is Tailwind's `md:` breakpoint.

## Known follow-ups (intentionally deferred)
- No `sitemap.xml`.
- Contact form (`src/components/about/ContactForm.jsx`) is a placeholder pending a Google Form embed or backend.
- Artwork images are placeholders pending real photography.
- No responsive `srcset`/image-optimization pipeline.
