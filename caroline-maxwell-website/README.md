# Caroline Maxwell — Artist Portfolio

A manifest-driven artist portfolio site. React + React Router + Tailwind CSS
(v4), built with Vite. See `CLAUDE.md` at the project root for the full
design/architecture notes this was built from.

This is a **working first build** of the plan: real navigation, real routing,
sample content, and all the layout types described in the plan — but with
placeholder artwork images (generated SVGs) and placeholder bio/CV copy for
Caroline Maxwell, ready to be replaced with real content.

---

## 1. Requirements

- Node.js 20 or newer (Node 22 LTS recommended)
- npm 10+ (comes with Node)

Check your versions:
```bash
node -v
npm -v
```

## 2. Install & run locally

```bash
cd caroline-maxwell-website
npm install
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`). Open it in a
browser. The dev server supports hot reload — edits to any file under `src/`
appear immediately.

## 3. Production build

```bash
npm run build
```

This outputs a static, deployable site to `dist/`. To preview that production
build locally before deploying:

```bash
npm run preview
```

## 4. Deploying

`dist/` is a plain static site and can be hosted anywhere that serves static
files (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3 + CloudFront, etc).

**Important:** because this is a client-side-routed single-page app, your
host must be configured with an **SPA fallback** — every path that isn't a
real file should serve `dist/index.html` — or direct loads/bookmarks/refreshes
of URLs like `/artworks/january-jones/frost-line` will 404. Netlify and
Vercel do this automatically for Vite projects; other hosts may need a
`_redirects` or rewrite rule (e.g. Netlify: `/* /index.html 200` in a
`public/_redirects` file).

## 5. Project structure

```
src/
  content/
    manifest.json      <- ALL artwork + writing content lives here
    home.json           short bio blurb shown on the home page
    bio.md / cv.md       long-form About content
  data/
    manifest.js          accessor functions that read the manifest
                          (path resolution, latest-work sorting, etc.)
  components/
    layout/               header, nav, hamburger menu, breadcrumb, footer
    artworks/              artwork card, artwork detail, and the three
                            layout components (grid / featured / subproject)
    writings/               writings-specific layout components
    home/                   bio teaser + latest work section
    about/                  About sub-nav, contact form, markdown renderer
  pages/                    one file per route (see App.jsx for the route
                            table)
public/
  images/artworks/          artwork image files referenced from manifest.json
```

## 6. Editing content (no code changes required)

### Adding or editing an artwork
Open `src/content/manifest.json`, find the relevant project under
`artworks.projects`, and edit its `artworks` array. Each artwork needs:
```json
{
  "id": "unique-url-slug",
  "title": "Artwork Title",
  "medium": "Oil on canvas",
  "size": "24 x 30 in",
  "images": [
    { "src": "/images/artworks/your-image.jpg", "alt": "Description", "is_primary": true }
  ]
}
```
Exactly one image per artwork should have `"is_primary": true`. Drop the
actual image file into `public/images/artworks/` and reference it with a path
starting `/images/artworks/...`.

### Adding a new artwork project
Add a new object to `artworks.projects` (or to a project's
`child_projects` array, for nesting):
```json
{
  "id": "unique-url-slug",
  "name": "Project Name",
  "layout_type": "grid",
  "date": "2026-01-01",
  "write_up": "A sentence or two about this body of work.",
  "primary_artwork_id": "id-of-one-artwork-in-this-project",
  "artworks": []
}
```
`layout_type` must be one of the registered layouts: `grid`, `featured`, or
`subproject_list`. See §7 below to add a new one.

### Writings
Same file, under `writings.items`. Each node needs a `type` of `project`,
`writing`, or `artwork` — see the existing examples in the manifest for the
shape of each.

### Bio / CV
Edit `src/content/bio.md` and `src/content/cv.md` directly — plain Markdown,
rendered automatically on the About pages.

### Contact
`src/components/about/ContactForm.jsx` currently renders a placeholder form.
Replace its contents with your Google Form `<iframe>` embed code (or wire the
existing fields to a form backend) when that decision is made. The contact
email shown at the top of the page is set in `src/pages/ContactPage.jsx`.

## 7. Adding a new artwork layout type

1. Create a new component in `src/components/artworks/layouts/`, following
   the shape of `GridLayout.jsx` (it receives `project` and `basePath` props).
2. Register it in `src/components/artworks/layoutRegistry.js`.
3. Reference its key from `layout_type` in the manifest.

## 8. Known follow-ups (not yet implemented)

These were flagged in `CLAUDE.md` as deferred until this first build was
approved — worth revisiting next:

- **SEO prerendering**: routes are real, distinct URLs with per-page
  `<title>` tags, but there's no build-time prerendering/SSG step yet, so a
  crawler that doesn't execute JavaScript would only see the initial HTML
  shell. Adding a prerender step (or moving to a framework with SSR/SSG) is
  the natural next step if SEO on launch matters.
- No `sitemap.xml` yet.
- Contact form is a non-functional placeholder (see §6).
- Artwork images are generated placeholders — swap in real photography.
- No image optimization pipeline (responsive `srcset`, compression) yet.
