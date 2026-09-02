# CLAUDE.md — Caroline Maxwell Artist Portfolio

Project memory / spec file. Read this before writing any code for this project.
**Status: FIRST BUILD COMPLETE.** This plan was approved and implemented — the
working app lives alongside this file. See `README.md` for setup/build
instructions and a list of what's still a placeholder (images, bio/CV copy,
contact form, SEO prerendering). Open questions from §9 below were resolved
with reasonable defaults during the build (noted inline); revisit them if you
want something different.

---

## 1. Project Summary

A bespoke, responsive artist portfolio site for **Caroline Maxwell**, built with
React + React Router + Tailwind CSS. Content (artworks and writings) is driven
entirely by a JSON manifest so the site owner can add/edit work without touching
code. Visual inspiration: trangtle.com and lisaknoop.com — both use large,
image-forward gallery grids, generous whitespace, minimal chrome, and quiet
typography that gets out of the way of the artwork. (Both sites block automated
fetching, so inspiration here is directional — layout rhythm, restraint, big
imagery — not a pixel copy.)

---

## 2. Tech Stack

- **React 18** + **Vite**
- **react-router-dom v6** (createBrowserRouter / nested routes)
- **Tailwind CSS** for all layout/styling
- **React.lazy + Suspense** for per-layout code-splitting (see §6)
- Markdown rendering (e.g. a small markdown lib) for long-form text (write-ups,
  Bio, CV) so content authors can write in Markdown instead of JSX
- `react-helmet-async` (or equivalent) for per-route `<title>`/meta tags, since
  SEO depends on distinct metadata per crawlable route
- Icon set: lucide-react (hamburger/close icons)

### SEO note (important, flagged for discussion)
A pure client-side SPA built with React Router does **not** guarantee full SEO
traversal on its own — crawlers must execute JS, and not all of them do it
reliably or completely. To honor the requirement that top-level pages ("do a
page navigate load... so SEO can easily traverse it") are easily crawlable, the
plan is:
- Every top-level route (`/`, `/artworks`, `/writings`, `/about/*`, and every
  category/artwork/writing route) is a real, distinct URL with its own
  `<title>` and meta description, generated from the manifest.
- Add a build-time **prerendering step** (e.g. `vite-plugin-ssg` or a simple
  headless-render script) that walks the manifest and emits static HTML for
  every route, so crawlers get real content without executing JS.
- Add a generated `sitemap.xml` from the same manifest walk.
- Server/hosting must be configured with an SPA fallback (all paths → index.html)
  for direct loads/bookmarks to work, *except* where prerendered static files
  exist.
This is a recommendation, not yet approved — flagging as an open decision (§9).

---

## 3. Navigation & Routing

### Top nav
- Left: "Caroline Maxwell" (text now; swappable for a logo image/component later
  — build as a `<SiteBrand />` component so swapping in a logo is a one-file change)
- Right: responsive nav — full inline links at desktop width, collapses to a
  hamburger menu at tablet/mobile breakpoints (Tailwind `md:` breakpoint as the
  default cutoff, confirm exact breakpoint in review)
- Items: **Home / Artworks / Writings / About**
- **About** has an in-page sub-nav: **CV / Bio / Contact**

### Routing model
Two tiers of navigation, per the requirements:

1. **Top-level routes** — real `<Route>` entries, each a distinct page:
   `/`, `/artworks`, `/writings`, `/about`
2. **Sub-routes (category/artwork/writing detail)** — nested dynamic routes
   using slug/ID params. These use React Router's client-side transitions
   (no full page reload) via lazily-loaded layout components, so browsing
   within Artworks/Writings feels instant, while the URL always fully
   describes the state — so a bookmark or shared link reproduces the exact
   view on load (breadcrumb, layout, content, all included).

Proposed route table:

```
/                                       Home
/artworks                               Artworks index (category list)
/artworks/:categoryPath*                Category page (layout_type-driven; supports nested child categories via a splat path, e.g. /artworks/paintings/january-jones)
/artworks/:categoryPath*/:artworkSlug   Individual artwork detail

/writings                               Writings index
/writings/:path*                        Recursive: resolves to a category, a writing, or an artwork node depending on manifest type at that path

/about                                  Redirects to /about/bio (or shows an About landing — confirm)
/about/cv                               CV page
/about/bio                              Bio page
/about/contact                          Contact page
```

Using a splat/catch-all param (`:categoryPath*`) lets categories nest to
arbitrary depth without adding new route definitions — the router resolves the
path against the manifest tree at render time. IDs/slugs come from an explicit
`id` (or `slug`) field on each manifest node (see §4) rather than being derived
from the display name, so URLs stay stable if a name is edited later.

### Breadcrumb convention
Every content page (Artworks, Writings, About sub-pages) uses the same header
pattern: `Section: Item Name`, where **Section is a link** back to that
section's index, and **Item Name is a plain H2**, not a link. Example:
`Artworks: January Jones`. For nested categories, extend this to a full trail,
e.g. `Artworks: Paintings: January Jones` (confirm whether every ancestor
should be a link, or only the root section — proposal: every ancestor level is
a clickable link except the current page).

---

## 4. Content Model — JSON Manifest

Single manifest file (or one file per top-level group — TBD, §9), conceptually:

```json
{
  "artworks": { "categories": [ /* Category[] */ ] },
  "writings": { "items": [ /* WritingNode[] */ ] }
}
```

### Artworks schema

**Category**
| field | type | notes |
|---|---|---|
| id | string | stable slug, used in URLs |
| name | string | display name |
| layout_type | string | key into the layout component registry (§6) |
| write_up | string (markdown) | optional long-form text |
| date | string (ISO) | used to sort "latest work" on Home |
| primary_artwork_id | string | which artwork is "primary" for this category (e.g. used as its cover on the Artworks index) |
| artworks | Artwork[] | optional |
| child_categories | Category[] | optional — same shape, recursive |

**Artwork**
| field | type | notes |
|---|---|---|
| id | string | stable slug |
| title | string | |
| medium | string | |
| size | string | |
| images | Image[] | |

**Image**
| field | type | notes |
|---|---|---|
| src | string | |
| alt | string | |
| is_primary | boolean | exactly one `true` per artwork |

### Writings schema

A **discriminated union** by `type`:

- **category**: `{ id, type: "category", name, write_up, children: (Category|Writing)[] }`
- **writing**: `{ id, type: "writing", name, write_up, writing }` — `writing` is
  the actual long-form text/body (markdown)
- **artwork**: same shape as the Artworks `Artwork` type above (for writings
  that reference/embed an artwork), tagged `type: "artwork"`

### Home page data needs
- Bio: short paragraph + link to `/about/bio` (short text can live directly on
  the Home route or in a small `home.json`/front-matter file — TBD, likely
  simplest to keep a tiny separate `home` content file distinct from the
  Artworks/Writings manifest, since it isn't a category or artwork)
- "Latest work": exactly 2 items, each showing name, primary image, and date —
  sourced by sorting all top-level Artwork categories by `date` descending and
  taking the top 2. (Requires `date` on Category, added above.)

### CV / Bio content
"Loads content from specific file" — plan: separate content files
(`content/cv.md`, `content/bio.md`), rendered through the same markdown
renderer used for write-ups, rather than being embedded in the artworks/writings
manifest (they aren't artworks or writings, they're site content).

### Contact
- Clickable `mailto:` email address shown at the top of the page.
- Form itself is TBD/placeholder — likely an embedded Google Form `<iframe>`.
  Build the page so the form area is a swappable component
  (`<ContactForm />`) so dropping in the real embed later is a one-file change.

---

## 5. Component Architecture (proposed)

```
src/
  main.tsx
  router.tsx                 route table (createBrowserRouter)
  content/
    manifest.json            artworks + writings data
    home.json                short bio blurb + tagline
    cv.md
    bio.md
  data/
    manifest.ts               loader + typed accessors:
                               getCategoryByPath(), getArtworkByPath(),
                               getLatestArtworkCategories(n),
                               resolveWritingNode(path), findAncestors(node)
  components/
    layout/
      SiteHeader.tsx          brand + nav
      SiteBrand.tsx           "Caroline Maxwell" (swappable for logo)
      NavMenu.tsx             desktop inline nav
      MobileMenu.tsx          hamburger/drawer nav
      Breadcrumb.tsx          "Section: Name" pattern, reused everywhere
      SiteFooter.tsx
    artworks/
      layouts/
        GridLayout.tsx
        FeaturedLayout.tsx
        SubcategoryListLayout.tsx
        (registry maps layout_type -> component, lazy-loaded)
      ArtworkCard.tsx
      ArtworkDetail.tsx
    writings/
      layouts/ ...            mirrors artworks, but text-forward
      WritingBody.tsx
    about/
      SubNav.tsx               CV / Bio / Contact
      ContactForm.tsx
    home/
      BioTeaser.tsx
      LatestWork.tsx
  pages/
    HomePage.tsx
    ArtworksIndexPage.tsx
    ArtworksCategoryPage.tsx    resolves path -> category -> layout component
    ArtworkDetailPage.tsx
    WritingsIndexPage.tsx
    WritingsNodePage.tsx
    AboutLayout.tsx             wraps CV/Bio/Contact with SubNav
    CVPage.tsx
    BioPage.tsx
    ContactPage.tsx
    NotFoundPage.tsx
```

---

## 6. Layout System

`layout_type` on a Category is a string key that maps directly to a component
via a registry object, e.g.:

```ts
const artworkLayouts = {
  grid: lazy(() => import('./layouts/GridLayout')),
  featured: lazy(() => import('./layouts/FeaturedLayout')),
  subcategory_list: lazy(() => import('./layouts/SubcategoryListLayout')),
};
```

The category page component looks up `layout_type` in the registry, lazy-loads
it, and passes the resolved category node (with its full `artworks` /
`child_categories` array) as props. Unrecognized `layout_type` values fall back
to a default grid layout with a console warning (dev-time safety net).

Proposed initial layout types (to confirm in review, §9):
- **grid** — even image grid of a category's artworks
- **featured** — one large hero artwork (the `primary_artwork_id`) + supporting grid
- **subcategory_list** — name + write-up + list of child categories (no direct artworks at this level)

---

## 7. Responsive Behavior

- Tailwind breakpoints drive all layout changes; no separate mobile/desktop
  components except the nav (`NavMenu` vs `MobileMenu`), which differ enough
  in interaction model (inline vs. drawer/hamburger) to warrant separate files.
- Image grids reflow via CSS grid/flex + Tailwind responsive column classes
  (e.g. 1 col mobile → 2 col tablet → 3–4 col desktop), exact counts TBD per
  layout in visual design pass.

---

## 8. What This Plan Does NOT Yet Cover (deliberately deferred)

- Visual/brand design details (type scale, color palette, spacing rhythm) —
  to be designed once architecture is approved, using trangtle.com/lisaknoop.com
  as tonal reference (large imagery, minimal chrome, quiet type)
- Image asset pipeline/optimization (responsive `srcset`, lazy loading, CDN vs.
  local `/public` assets)
- Final Google Form embed for Contact
- Accessibility pass details (focus management on route change, alt text
  policy, keyboard nav for hamburger menu) — will follow standard practices,
  called out explicitly during build
- Deployment target/hosting

---

## 9. Open Questions (resolved with defaults in the first build)

1. **SEO strategy**: shipped plain React Router with per-route `<title>`
   tags; prerendering/sitemap were **not** implemented yet (flagged as a
   follow-up in the README). Revisit if SEO matters before launch.
2. **Layout types**: shipped exactly the proposed set — `grid`, `featured`,
   `subcategory_list` — used respectively by the sample "Interior Weather",
   "January Jones", and "Marginalia" categories. Add more by following §6/§7
   of the README.
3. **Manifest structure**: went with a single `manifest.json` containing both
   `artworks` and `writings` top-level keys, per the original spec.
4. **`/about` landing**: `/about` redirects to `/about/bio` (no separate
   landing view).
5. **Nested breadcrumbs**: every ancestor category is a clickable link (e.g.
   `Artworks: Marginalia: Sketchbook I`, with "Artworks" and "Marginalia"
   both linked); only the current page name is plain.
6. **Content authoring**: shipped as hand-edited JSON/Markdown (see README
   §6) — no admin UI/CMS layer yet. The schema was kept CMS-friendly if that
   becomes worth building later.

---

## 10. Approval Gate

**No code will be written until this plan is explicitly approved (or revised
and re-approved).** Once approved, implementation order will be:
1. Scaffold project (Vite + Tailwind + React Router) and folder structure
2. Build manifest data layer + typed accessors with a small placeholder manifest
3. Build SiteHeader/nav (desktop + hamburger) and top-level routing shell
4. Build Home page (bio teaser + latest work)
5. Build Artworks index + one layout type end-to-end, then remaining layouts
6. Build Writings (mirrors Artworks)
7. Build About/CV/Bio/Contact
8. Responsive/accessibility pass, then SEO/prerendering pass
