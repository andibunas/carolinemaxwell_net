# manifest.md format

`npm run build-manifest` scans `public/gallery/`, `public/field-offices/`,
and `public/animal-reports/` and writes `src/content/manifest.json` from
what it finds. Each folder in those trees is one entry, described by its own
`manifest.md`; the folder name is used as the entry's `id` (URL slug), so
keep folder names as the slug you want.

None of these three trees nest (unlike the website project's Artworks) —
every folder directly under a section root is one leaf entry.

## Common rules

- The first line(s) of `manifest.md` are `Key: value` pairs. Below those,
  `## Section Name` headings hold longer Markdown content.
- `Order: N` (integer) controls display order; folders without one sort
  alphabetically after any that have one.
- Images are files sitting directly in the entry's folder.

## `public/gallery/<slug>/manifest.md` — one per exhibition/series

```
Name: D.N.A. @ Project 210 Gallery
Order: 1
Thumbnail: oenothera_field.jpg

## Synopsis

Short teaser shown in the gallery grid.

## Write Up

Longer artist-statement text for this series' own page.

## Artworks

### Oenothera Field
Medium: color transparency
Size: 5" x 7"
Image: oenothera_field.jpg

Optional free-text write-up for this specific piece.

### Oenothera
Medium: glow in the dark photo
Image: oenothera.jpg
```

One `### Title` block per image. `Medium`/`Size` optional. Any text after
the `Key: value` lines is that piece's own write-up.

## `public/field-offices/<slug>/manifest.md` — one per office

```
Name: Jerusalem
Location: St. James Street Field Office — Festival of Light and Art, 2011
Order: 5
Thumbnail: DNAjerusalem_titleimg.jpg
Transcript: Daily reports from the Festival...

## Write Up

Description of this office shown on its own page.

## Images

### The D.N.A. Office on St. James Street
Image: office.JPG

### 300 pairs of glowing animal eyes
Image: dnaeyes.jpg
```

`Transcript:`, if present, is the title shown on the "Read the transcript"
link and on the transcript's own page; its body comes from a sibling
`transcript.md` file (plain Markdown) in the same folder. Omit both the
`Transcript:` field and the file for an office with no transcript.

## `public/animal-reports/<category-slug>/manifest.md` — one per animal

```
Name: Bat
Order: 1

## Reports

### Bat 1
Image: bat1_sm.jpg

### Bat 2
Image: bat2_sm.jpg
```

One `### Label` block per report scan — labels can be as generic as the
source material ("Bat 3") since that's what these are. `Image` is the only
field used per entry (no Medium/Size here).
