---
name: get_artwork
description: Import one or more artwork folders (with or without subfolders) and an optional writeup into caroline-maxwell-website/public/artworks, write the manifest.md files in the current site format, and rebuild the site manifest. Use when the user says "add this artwork", "import these images", or names source folders or a writeup to bring into the portfolio.
---

# get_artwork

Imports artwork or projects into `caroline-maxwell-website/public/artworks/` by
copying media and writing `manifest.md` files in the format the live site uses
(see `public/artworks/GeomagTravel/manifest.md` for a project with children,
`public/artworks/GeomagTravel/peru/manifest.md` for a child,
`public/artworks/Blackboard/manifest.md` for a carousel, and
`public/artworks/TheStoryteller/manifest.md` for videos).

Requires filesystem access to the repo (Bash, Read, Write, Edit).

## Current site format

Do not use `Order:`. No current manifest has it.

Header fields, in this order, one per line:

```
Name: <title>
Type: <artworks|projects>
Date: <YYYY-MM-DD, YYYY, or blank>
Thumbnail: <file in this folder>
Header Image: <file in this folder, or blank>
Layout: <grid|carousel>
Carousel Speed: <seconds>        (only when Layout is carousel)
```

Then a blank line, then these sections, each included only when it has content, in this order:

- `## Synopsis`: one or two sentences.
- `## Write Up`: the longer text.
- `## Child Projects`: one `- <folder name>` per child, in display order. Used when Type is `projects`.
- `## Artworks`: one block per piece:

```
### <piece title>
Medium: <only when known>
Size: <only when known>
Date: <only when known>
Image: <file>          (or Video: <file> for a video)

<optional description paragraph, no heading>
```

Rules:

- `Type: projects` for a folder with child folders. `Type: artworks` for a single work or a flat set of pieces.
- Date: `YYYY-MM-DD` when known. A year alone is written as `YYYY-01-01`. Blank when unknown.
- Thumbnail must be an image file in the same folder, never a video.
- Images are web-sized: longest side 2000px maximum, 72 DPI, JPEG quality about 85. Never upscale. Use Pillow if it is installed; if not, tell the user the sizes were not checked.
- A project's child folders sit inside its folder, and each child has its own `manifest.md`.

## Never edit by hand

- Never edit `src/content/manifest.json`. Only `npm run build-manifest` updates it.
- After any change under `public/artworks/`, run `npm run build-manifest` in `caroline-maxwell-website/`. Report any error verbatim.

## Inputs

1. **Source folder(s):** one or more folders of media, with or without subfolders. Optional writeup text or markdown.
2. **Placement:** a new top-level project, or a child of an existing project (for example `GeomagTravel`). Check existing names in `public/artworks/manifest.md`.
3. **Names:** folder names with letters, digits, `_` and `-` only, matching existing folders (for example `Villa_Mysteries`). Confirm when unclear.

If anything here is unclear, ask one short question before writing.

## Steps

1. **Inventory.** List every folder and file under the source, including subfolders. Note duplicate image filenames and resolve them with the user before copying.

2. **Read every writeup in full** before drafting any text.

3. **Propose the structure.** Show a tree with each item's type, its pieces, and where it will go. For example:

   ```
   Trip/          projects   (Write Up from notes.md)
     peru/        artworks   4 images
     iceland/     artworks   carousel, 2 images
   Solo/          artworks   1 video
   ```

   Confirm it before writing anything.

4. **Ask only what matters**, grouped by item, in one message: title, date, synopsis, write-up, layout (grid, or carousel with a speed in seconds), per-piece title/medium/size/date/description when there are several pieces, and thumbnail or header preferences. Never invent biographical, medium, size, date or descriptive content. Leave blanks and say what is missing.

5. **Copy the media** into each item's folder with original filenames. Resize images over 2000px per the rules above.

6. **Write each `manifest.md`** following the format above. Write child folders' manifests inside their parent's folder. Show every manifest's full text to the user and get confirmation before going further.

7. **Update parent lists.** For a new top-level item, add its folder name under `## Child Projects` in `public/artworks/manifest.md`. For a new child of an existing project, add it under that project's `## Child Projects`. Create the heading if the file has none. These list lines are the only manual edits allowed in existing manifests.

8. **Rebuild.** In `caroline-maxwell-website/`, run `npm run build-manifest`. Report any errors verbatim.

9. **Report.** List the folders and manifests created, the lists changed, the fields left blank, and every guessed value (Type, Date, Thumbnail, Layout), so the user can correct them.

## Notes

- Do not touch site code (`src/`) or any file outside `public/artworks/`, apart from the list edits in step 7.
- Do not commit. Commit only when the user asks, and confirm the message first.
