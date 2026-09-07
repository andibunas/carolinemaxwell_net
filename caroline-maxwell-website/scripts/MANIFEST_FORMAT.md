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
- Images are just files sitting in a folder — `.svg`, `.jpg`, `.png`, etc.
  The script doesn't inspect them; each tree's convention below says how an
  image file is pointed to and captioned.

## `public/artworks/` — every folder is a project

Every folder under `public/artworks/` is a **project**. A project either
holds more project folders, or holds artworks (images) directly — never
both. There is no separate "artwork folder" type; an image lives directly
in the folder of the project it belongs to, and is described inline in that
project's own `manifest.md`.

A project's `manifest.md` has up to three parts: **project info** (the
`Key: value` front matter plus `## Synopsis` / `## Write Up`), an optional
**`## Child Projects`** list, and an optional **`## Artworks`** list. Which
of the latter two you use is determined by `Type`.

### Project info (every manifest.md)

```
Name: January Jones
Type: artworks
Order: 1
Date: 2026-06-01
Thumbnail: thumbnail.svg
Header Image: header.svg
Layout: featured

## Synopsis

Small interiors from one January, painted hour by hour in a single
north-facing room.

## Write Up

A series of small interiors painted over one January...
```

- `Type` is `projects` (this folder's children are more project folders) or
  `artworks` (this folder's content is the images sitting directly in it,
  described under `## Artworks` below).
- `Order` is a plain integer controlling sibling order. Folders without one
  sort alphabetically after any that have one. It's redundant with a
  position in a parent's `## Child Projects` list — set one or the other,
  not both.
- `Thumbnail` and `Header Image` are filenames of images sitting directly in
  this project's own folder. `Thumbnail` is the small preview shown wherever
  this project appears among siblings; `Header Image` is the banner at the
  top of this project's own page. Both optional.
- `Layout` is passed through as-is (e.g. `grid`, `featured`).
- `Synopsis` is the short teaser shown next to the thumbnail in listings;
  `Write Up` is the longer text on the project's own page. Both can be
  plain text or Markdown.

### `## Child Projects` (only when `Type: projects`)

```
## Child Projects

- south-africa
- iceland
- peru
```

- One `- foldername` per line, naming a direct subfolder (which has its own
  `manifest.md`). List order is sibling order, and takes precedence over
  those folders' own `Order:` fields.
- Optional — omit the whole section to fall back to sorting subfolders by
  their own `Order:` field instead.

### `## Artworks` (only when `Type: artworks`)

```
## Artworks

### Frost Line
Medium: Oil on panel
Size: 24 x 30 in
Date: 2026-01-01
Image: frost-line-1.svg

### Frost Line, detail
Medium: Oil on panel
Image: frost-line-2.svg
```

- One `### Title` subsection per image. `Image` names a file sitting
  directly in this project's folder. `Medium`, `Size`, and `Date` are plain
  text/optional. Any text after the `Key: value` lines (down to the next
  `### `) is that artwork's write-up — optional, can be Markdown.
- List order is display order.
- A folder with `Type: artworks` has no subfolders — only its manifest.md
  and image files.

## `public/writings/` — Type: Artwork

`public/writings/` keeps its own, unchanged convention (below) — it isn't
part of the `public/artworks/` project/artworks model above.

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
- This Artwork type is used for artwork embedded inside `public/writings/`
  (e.g. process studies shown alongside an essay).

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
