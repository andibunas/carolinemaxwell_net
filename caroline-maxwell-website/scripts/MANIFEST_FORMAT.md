# manifest.md format

`npm run build-manifest` scans `public/artworks/` and `public/writings/` and
writes `src/content/manifest.json` from what it finds. Each folder in those
trees describes itself with a `manifest.md` file; the folder name is used as
the item's `id`, so keep folder names as the slug you want in URLs.

Run the script again any time you add, edit, or reorder folders.

## Common rules

- Every folder needs a `manifest.md`, except the top-level `public/artworks/`
  and `public/writings/` folders themselves, which are just containers.
- The first line(s) of `manifest.md` are `Key: value` pairs. Below those,
  `## Section Name` headings hold longer, multi-line, Markdown content.
- `Type:` picks which fields apply (see below) — required on every
  `manifest.md`.
- `Order: N` (a plain integer) controls sibling order within a folder.
  Folders without an `Order` sort alphabetically after any that have one.
- Images are just files sitting in the folder — `.svg`, `.jpg`, `.png`, etc.
  The script doesn't inspect them; it lists whatever files it finds. Use an
  `## Images` section (see the Artwork type below) to give alt text or mark
  which one is primary, or skip it entirely to have every image included with
  the artwork's title as its alt text and the first one as primary.

## `public/artworks/` — Type: Project

```
Type: Project
Order: 1
Name: January Jones
Layout Type: featured
Date: 2026-06-01
Thumbnail: thumbnail.svg
Header Image: header.svg

## Synopsis

Small interiors from one January, painted hour by hour in a single
north-facing room.

## Write Up

A series of small interiors painted over one January...
```

- `Layout Type` and `Date` are passed through as-is.
- `Thumbnail` and `Header Image` are filenames of images sitting directly in
  this project's own folder (not one of its artworks' images).
  `Thumbnail` is the small preview shown wherever this project appears
  among siblings (the Artworks index, a parent's sub-project list, Home's
  "Latest work"). `Header Image` is the banner shown at the top of this
  project's own page. Both are optional — omit either and nothing renders
  in its place.
- `Synopsis` is the short teaser shown next to the thumbnail in listings;
  `Write Up` is the longer text shown on the project's own page. Both can
  be Markdown-free plain text or Markdown.
- Subfolders can be any mix of `Project` (a sub-project, like a sketchbook)
  and `Artwork` (a painting/drawing) — both live together in one ordered
  `children` list. A listing layout doesn't care which is which; it just
  follows each child's own link.

## `public/artworks/` and `public/writings/` — Type: Artwork

```
Type: Artwork
Order: 1
Title: Frost Line
Medium: Oil on panel
Size: 24 x 30 in
Thumbnail: thumbnail.svg

## Images

- frost-line-1.svg | Frost Line, oil on panel | primary
- frost-line-2.svg | Frost Line, detail
```

- Each line in `## Images` is `filename | alt text | primary` (the third
  field is the literal word `primary` on exactly one line, or omit it).
- `Thumbnail` is an optional filename, sitting directly in this artwork's own
  folder, used as its preview wherever it appears among siblings (an
  Artworks listing page). Omit it and the primary image is used instead.
- An artwork folder has no subfolders — only its manifest.md and image files.
- The same Artwork type is used both for artworks under `public/artworks/`
  and for artwork embedded inside `public/writings/` (e.g. process studies
  shown alongside an essay).

## `public/writings/` — Type: Project

```
Type: Project
Order: 1
Name: Notebooks

## Write Up

Short, dated entries written alongside the studio work.
```

- Subfolders can be any mix of `Project`, `Writing`, or `Artwork`.

## `public/writings/` — Type: Writing

```
Type: Writing
Order: 1
Name: On Slowness

## Write Up

A short entry on why the January Jones paintings took a full year to finish.

## Writing

The paintings in this room took longer than any I have made...
```

- `Write Up` is the short teaser shown in listings; `Writing` is the full
  piece. Both can be Markdown.
- A `Writing` folder has no subfolders or images.
