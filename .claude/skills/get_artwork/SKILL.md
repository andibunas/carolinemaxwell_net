---
name: get_artwork
description: Import a new artwork/project into the site — point it at a folder of images and an optional writeup text file, and it copies the images into public/artworks and generates a manifest.md from whatever info is available. Use when the user says "add this artwork", "import these images", or names a folder of source images/writeup to bring into the portfolio.
---

# get_artwork

Imports a new artwork or project into `caroline-maxwell-website/public/artworks/` by
copying source images and generating a `manifest.md` in the format the site already
uses (see e.g. `public/artworks/DNA/manifest.md` or `public/artworks/GeomagTravel/manifest.md`).

## Inputs

Ask the user for (or infer from their message):

1. **Source folder** — a folder of images, and optionally a text/markdown file with a
   writeup (synopsis, description, medium, dates, per-piece notes, etc.).
2. **Target name** — the artwork/project folder name under `public/artworks/`
   (e.g. `Blackboard`, `GeomagTravel`). If not given, derive a reasonable
   PascalCase/CamelCase or short name from the source folder name or writeup title,
   but confirm with the user before creating it if it's ambiguous.
3. **Parent** — whether this is a top-level artwork/project, or a child of an
   existing project (e.g. `GeomagTravel/peru`). If a child, the target path nests
   under the parent's folder.

If any of this isn't clear from the request, ask a short clarifying question rather
than guessing silently.

## Steps

1. **Locate the repo.** The site lives in `caroline-maxwell-website/` at the repo
   root; artworks live in `caroline-maxwell-website/public/artworks/`.

2. **Create the target folder**: `public/artworks/<Name>/` (or nested under the
   parent for a child project). Don't overwrite an existing manifest.md without
   confirming with the user first — if the folder already exists, treat this as
   an update and merge rather than clobber.

3. **Copy the images.** Copy every image file (jpg/jpeg/png/gif/webp/svg) from the
   source folder into the target folder, preserving original filenames. Skip
   non-image files other than the writeup text file. If there are many images or
   subfolders of images (e.g. per-series folders), preserve that substructure only
   if it mirrors how existing multi-part projects are organized (see
   `GeomagTravel/` for an example of a project with image subfolders per child).

4. **Read the writeup**, if one was provided, and extract whatever is available:
   - Title/Name
   - Date (use the most specific date mentioned; format `YYYY-MM-DD` if a full date
     is known, otherwise `YYYY-01-01` for year-only — match the pattern seen in
     existing manifests)
   - Synopsis (a one-to-two sentence summary — write one if the source doesn't have
     a short version but has a longer writeup)
   - Full write-up text
   - Medium, and any per-image/per-piece breakdowns (title, medium, date, short
     description) if the writeup describes individual pieces — these become
     `## Artworks` sub-entries like in `DNA/manifest.md`

   If no writeup is provided, leave `Write Up`/`Synopsis` minimal or blank rather
   than inventing content, and tell the user what's missing.

5. **Pick a Thumbnail and Header Image**: default Thumbnail to the first copied
   image (or one the writeup calls out as representative); Header Image can be
   left blank unless the writeup specifies a hero/banner image or animated image.

6. **Write `manifest.md`** in the target folder using this exact field format
   (fields first, blank line, then `##` sections — copy the structure precisely):

   ```
   Name: <Title>
   Type: <artworks|projects>
   Date: <YYYY-MM-DD>
   Thumbnail: <filename>
   Header Image: <filename or blank>
   Layout: grid

   ## Synopsis

   <one-to-two sentence summary>

   ## Write Up

   <full writeup text, in markdown>
   ```

   If the writeup breaks down into individual pieces, append:

   ```
   ## Artworks

   ### <Piece title>
   Medium: <medium>
   Date: <date>
   Image: <filename>
   <short description>
   ```
   repeated per piece.

   `Type` is `projects` if this is a multi-part/ongoing body of work (has child
   projects or reads like a long-form project), `artworks` if it's a single work or
   flat collection of related pieces — infer from the writeup, default to
   `artworks` if unclear, and flag the choice to the user.

7. **If this is a child project**, add its folder name to the parent's
   `## Child Projects` list (see `GeomagTravel/manifest.md`), and add the new
   top-level name to `public/artworks/manifest.md`'s `## Child Projects` list if
   this is a new top-level artwork/project.

8. **Report back**: list what was copied, the manifest.md path, and call out any
   fields left blank or guessed (Type, Date, Layout, Thumbnail) so the user can
   correct them.

## Notes

- Don't invent biographical or descriptive content not present in the source
  material — leave fields sparse rather than fabricating detail.
- `Layout: grid` is the only layout value seen in the current site; keep it unless
  the user specifies otherwise.
- This only writes files under `public/artworks/`; it never touches site code.
