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

## `public/artworks/` — Type: Category

```
Type: Category
Order: 1
Name: January Jones
Layout Type: featured
Date: 2026-06-01
Primary Artwork: frost-line

## Write Up

A series of small interiors painted over one January...
```

- `Layout Type`, `Date`, and `Primary Artwork` (the id of one of this
  category's own or nested artworks) are passed through as-is.
- Subfolders are either all `Category` (-> nested `child_categories`, for a
  category made of sub-categories like sketchbooks) or all `Artwork` (->
  `artworks`, the paintings/drawings themselves) — don't mix the two under
  one category.

## `public/artworks/` and `public/writings/` — Type: Artwork

```
Type: Artwork
Order: 1
Title: Frost Line
Medium: Oil on panel
Size: 24 x 30 in

## Images

- frost-line-1.svg | Frost Line, oil on panel | primary
- frost-line-2.svg | Frost Line, detail
```

- Each line in `## Images` is `filename | alt text | primary` (the third
  field is the literal word `primary` on exactly one line, or omit it).
- An artwork folder has no subfolders — only its manifest.md and image files.
- The same Artwork type is used both for artworks under `public/artworks/`
  and for artwork embedded inside `public/writings/` (e.g. process studies
  shown alongside an essay).

## `public/writings/` — Type: Category

```
Type: Category
Order: 1
Name: Notebooks

## Write Up

Short, dated entries written alongside the studio work.
```

- Subfolders can be any mix of `Category`, `Writing`, or `Artwork`.

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
