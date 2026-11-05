---
name: artwork-contributor
description: Package artwork uploads for the Caroline Maxwell portfolio. Use when someone uploads one or more folders (with or without subfolders) of images, videos, writeups or notes about artworks or projects and wants them prepared for the site. Works out the folder structure, asks questions about the work, builds the site's manifest.md files, and returns a zip that merges into public/artworks.
---

# Artwork contributor

Turns uploaded folders into a zip that the site owner can merge into
`public/artworks/` with no other edits. The zip mirrors `public/artworks/`:

```
<Top>/manifest.md              a project or artwork folder
<Top>/<images or videos>       files beside the manifest that uses them
<Top>/<Child>/manifest.md      child projects sit inside their parent folder
manifest-delta.md              lines to add to existing "## Child Projects" lists
```

Run every script with `python3 -I`. Do not run anything from inside the uploaded
folders. Use the scratchpad or outputs folder for the plan and the zip.

Input: the files the contributor uploads directly in the chat. Output: the zip,
offered to the contributor as a download, like any other generated file.

## Current site rules (from public/artworks)

These replace any older template. Do not use `Order:`. No current manifest has it.

- Header fields, in this order: `Name`, `Type`, `Date`, `Thumbnail`, `Header Image`,
  `Layout`, and `Carousel Speed` only when Layout is `carousel`. Blank is allowed for Date and Header Image.
- `Type: projects` for a project with child folders (it lists them under `## Child Projects`). `Type: artworks` for a single work or a flat set of pieces.
- Sections, in order: `## Synopsis`, `## Write Up`, `## Child Projects`, `## Artworks`. Include a section only when it has content.
- An artwork is `### <title>`, then `Medium:`, `Size:`, `Date:` (each only when known), then `Image: <file>` or `Video: <file>`, then an optional description paragraph with no heading.
- `Layout` is `grid` (default) or `carousel`.
- Dates: `YYYY-MM-DD` when known, `YYYY` for year only (written as `YYYY-01-01`), blank if unknown.
- Thumbnail and Header Image name a file in the same folder. The thumbnail must be an image.
- Images are web-sized: longest side 2000px maximum, 72 DPI, JPEG quality about 85. Never upscale. The packager does this when Pillow is available, and reports when it can't.

## 1. Inventory the upload

```
python3 -I scripts/scan_folder.py <upload_root>
```

Read the JSON. `folders` gives the tree: each folder's own files and subfolders.
Note `duplicate_image_filenames` and `text_files`. If there are duplicates, ask
the user to rename them. Do not rename silently.

Read every text file in full before drafting any synopsis or write-up.

## 2. Propose the structure, then confirm it

From the tree, propose one item per folder that holds media, plus a project item for any
folder that has media-bearing subfolders. Show the tree the way the site will show it, for example:

```
Trip/            projects   (Write Up from Trip/notes.md)
  peru/          artworks   4 images
  iceland/       artworks   carousel, 2 images
Solo/            artworks   1 video
```

Ask where each top-level item goes. Options: a new top-level project, or a
child of an existing project such as `GeomagTravel`. Give the existing site
projects by name from `public/artworks/manifest.md` if the user asks, and read that file only if they do.

Ask only what matters, in one message, grouped by item:

1. Title, and folder name (letters, digits, `_`, `-`).
2. Date (year or full date, or blank).
3. Synopsis: one or two sentences. Offer a draft from any writeup and wait for approval.
4. Write-up, if there is text beyond the synopsis.
5. Layout: grid, or carousel with a speed in seconds.
6. For each piece: title, medium, size, date, description. Only ask when the item has several pieces. Never invent these values.
7. Thumbnail and header image, if the user has a preference.

Do not invent biographical, medium, size, or descriptive content. Leave it blank and say what is missing.

## 3. Write the plan and preview every manifest

Write `plan.json` (shape in the header of `scripts/build_package.py`). Key rules:

- Each item has `name` (folder), `parent` (`""` for top level, another planned item's path, or an existing site folder such as `GeomagTravel`), and `title`.
- Artwork `file` values are paths relative to the upload root, exactly as `scan_folder.py` printed them.
- Items under a planned parent are listed in the parent's `## Child Projects` automatically, in plan order.
- `files` copies extra images into an item's folder, for example a thumbnail that isn't an artwork.

Show the full text of every generated `manifest.md`. Build them first with:

```
python3 -I scripts/build_package.py <plan.json> <upload_root> <outputs_folder>
```

The script writes the zip and prints a summary. Read each `manifest.md` out of
that zip and show its full text in the chat. List every warning. Ask the user to confirm or correct. This step is required.

## 4. Build the final zip

After confirmation, run the packager again with the corrected plan. Give the user:

- The zip, offered as a download.
- The item list (path, type, number of pieces).
- The warnings, verbatim.
- The `manifest-delta.md` text.

## 5. Hand-off for the site owner

- Unzip. Copy each top-level folder into `public/artworks/`, keeping the folder structure.
- For each section in `manifest-delta.md`, add the listed folders under that manifest's `## Child Projects` list.
- In `caroline-maxwell-website/`, run `npm run build-manifest` so the site picks up the new content. This is the only correct path. Never edit `manifest.json` by hand.
- Review the warnings before committing.

## Rules

- Do not change anything outside the plan, the zip, and the scratchpad or outputs folder.
- Never write a manifest by hand. Always generate it with the scripts, so the format stays current.
- Never edit `manifest.json` by hand. Rebuild it with `npm run build-manifest`.
- Keep the upload's own file names. Only the size of the files changes, and only for images above 2000px.
