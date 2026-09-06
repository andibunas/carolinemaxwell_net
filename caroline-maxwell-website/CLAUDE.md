




# Scope discipline
Only read files I explicitly name or point to. Do not read additional files to "get context," "understand the project," or "see how things connect" unless I ask you to.
If you think reading more files would help, ask first. One sentence: "Want me to also read X?" Wait for my answer.
This applies to every task in this project. No exceptions for "just checking" or "quick look."


## 1. Project Summary

A bespoke, responsive artist portfolio site for **Caroline Maxwell**, built with
React + React Router + Tailwind CSS. Content (artworks and writings) is driven
entirely by a JSON manifest so the site owner can add/edit work without touching code.
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
2. **Sub-routes (project/artwork/writing detail)** — nested dynamic routes
   using slug/ID params. These use React Router's client-side transitions
   (no full page reload) via lazily-loaded layout components, so browsing
   within Artworks/Writings feels instant, while the URL always fully
   describes the state — so a bookmark or shared link reproduces the exact
   view on load (breadcrumb, layout, content, all included).




