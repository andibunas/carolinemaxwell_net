# manifest.md format

`npm run build-manifest` scans `public/artworks/` and `public/writings/` and
writes `src/content/manifest.json` from what it finds. Each folder in those
trees describes itself with a `manifest.md` file; the folder name is used as
the item's `id`, so keep folder names as the slug you want in URLs.

Run the script again any time you add, edit, or reorder folders.

## Common rules

- Every folder needs a `manifest.md`, except the top-level `public/artworks/`
  and `public/writings/` folders themselves, which are just containers. Each
  of those root folders can still have its own `manifest.md` with just a
  `## Child Projects` list (see below) to order its top-level project
  folders — no `Type`/`Name`/other front matter needed there.
- The first line(s) of `manifest.md` are `Key: value` pairs. Below those,
  `## Section Name` headings hold longer, multi-line, Markdown content.
- `Type:` picks which fields apply (see below) — required on every
  `manifest.md`.
- `Order: N` (a plain integer) controls sibling order within a folder.
  Folders without an `Order` sort alphabetically after any that have one.
- Images are just files sitting in a folder — `.svg`, `.jpg`, `.png`, etc.
  The script doesn't inspect them; each tree's convention below says how an
  image file is pointed to and captioned.
- `writeup.md`, if present next to a `manifest.md`, is used whole as that
  folder's Write Up in place of its `## Write Up` section. Useful when the
  write-up is long enough to want its own file. Applies to any folder with a
  `manifest.md` — artwork projects, writing projects, and individual
  writings alike.

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
- The top-level `public/artworks/` folder works the same way: an optional
  `manifest.md` directly inside it can carry a `## Child Projects` list to
  order the top-level project folders. It needs no other front matter
  (`Type`, `Name`, etc. are ignored there since the root isn't a project
  itself). Omit it to fall back to sorting top-level folders by their own
  `Order:` field.

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

## `public/writings/` — every folder is a project or a writing

`public/writings/` mirrors the `public/artworks/` project model: every
folder is a **project** (holds more project folders) or a **writing** (a
single piece, with any number of images sitting directly in its folder) —
never both. There's no separate "artwork folder" type here; an image used by
a writing lives directly in that writing's own folder and is placed by name
from within its `Write Up` text.

### Type: projects

```
Type: projects
Order: 1
Name: Process
Thumbnail: thumbnail.svg
Header Image: header.svg

## Synopsis

Studies, drawings, and working notes that sit alongside the finished paintings.

## Write Up

Studies, drawings, and working notes that sit alongside the finished
paintings, kept as a record of how each piece was worked out.
```

- `Thumbnail` and `Header Image` are filenames of images sitting directly in
  this project's own folder. `Thumbnail` is the small preview shown wherever
  this project appears among siblings; `Header Image` is the banner at the
  top of this project's own page. Both optional.
- `Synopsis` is the short teaser shown next to the thumbnail in listings;
  `Write Up` is the longer text on the project's own page. Both optional,
  both can be Markdown.
- Subfolders can be any mix of `projects` and `writing`, ordered the same
  way as `public/artworks/` (by each subfolder's own `Order:` field).
- The top-level `public/writings/` folder works the same way as
  `public/artworks/`: an optional `manifest.md` directly inside it can carry
  a `## Child Projects` list to order the top-level folders, with no other
  front matter needed. Omit it to fall back to sorting by each folder's own
  `Order:` field.

### Type: writing

```
Type: writing
Order: 1
Name: Studies for Frost Line
Layout: simple
Thumbnail: thumbnail.svg
Header Image: header.svg
Grid Columns: 2

## Synopsis

Two graphite studies made before painting Frost Line.

## Write Up

Graphite on paper, 11 x 14 in each.

[process-studies-1.svg]

A first study, working out the fall of light across the sill.

[process-studies-2.svg]

A second study, closer in on the corner where the frost line breaks.
```

- A `writing` folder has no subfolders. Any image file sitting directly in
  it (besides `manifest.md` and the `Header Image` file, if any) is
  available to be placed in the `Write Up` by writing its filename in square
  brackets — `[process-studies-1.svg]` — either bare or without its
  extension (`[process-studies-1]`). Anywhere in the text, start, middle, or
  end.
- `Synopsis` is the short teaser shown in listings; `Write Up` is the full
  piece, with image placement markers as above. Both optional, both can be
  Markdown.
- `Thumbnail` is an optional filename used as this writing's small preview
  wherever it appears among siblings (e.g. in its project's listing). It can
  point at a file directly in this folder or at a path further inside it,
  and can be the same file used inline in `Write Up`.
- `Header Image` is an optional filename for a banner image; it no longer
  renders anywhere in the writing views but is still recognized so it isn't
  swept into the writing's image list.
- `Layout` controls how images referenced in `Write Up` are placed:
  - `simple` (default) — each image appears inline exactly where its marker
    is in the text.
  - `grid-top` — every referenced image is pulled out of the flow and shown
    together as a grid above the text (its markers are removed from the
    text). If `Write Up` has no markers at all, every image in the folder is
    used.
  - `grid-bottom` — same as `grid-top`, but the grid is shown below the text.
  - `Grid Columns` (optional integer, default 3) sets how many images per
    row for `grid-top` / `grid-bottom`. Ignored for `simple`.
