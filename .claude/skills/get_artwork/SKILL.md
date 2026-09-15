---
name: get_artwork
description: Import a new artwork/project into the site — point it at a folder of images and an optional writeup text file, and it copies the images into public/artworks and generates a manifest.md from whatever info is available. Use when the user says "add this artwork", "import these images", or names a folder of source images/writeup to bring into the portfolio.
---

# get_artwork

Imports a new artwork or project into `caroline-maxwell-website/public/artworks/` by
copying source images and generating a `manifest.md` in the format the site already
uses (see e.g. `public/artworks/DNA/manifest.md` or `public/artworks/GeomagTravel/manifest.md`).

## Detect environment first

This skill runs in two different places, and the output differs accordingly:

- **Claude Code (CLI / VS Code / desktop app) with this repo open** — you have
  Bash/Read/Write/Edit tools with direct filesystem access to the actual
  `caroline-maxwell-website` repo on disk. This is the primary case: **write the
  files directly** into `public/artworks/` as described below.
- **claude.ai chat app** — you have no filesystem access to the user's repo. The
  user has instead uploaded images (and maybe a writeup) directly into the
  conversation. In this case:
  1. Generate the `manifest.md` content per the same rules below.
  2. If code execution / file-creation is available, bundle the uploaded images
     plus the generated `manifest.md` into a single downloadable `.zip`, named
     after the target artwork folder (e.g. `Blackboard.zip`), with the manifest
     and images at the top level of the zip (i.e. what should end up directly
     inside `public/artworks/<Name>/`). Tell the user to unzip it into
     `public/artworks/<Name>/` in their repo.
  3. If file-creation/code execution isn't available, fall back to: output the
     manifest.md content as a fenced code block the user can save themselves,
     plus plain-language instructions for where to save it and how to move the
     images they uploaded into `public/artworks/<Name>/`.

Check which situation you're in before starting — don't assume; if you have Bash/Write
tools and can see the repo, you're in the Claude Code case even if the user's phrasing
sounds like the chat-app case.

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

1. **Locate the repo** (Claude Code case only). The site lives in
   `caroline-maxwell-website/` at the repo root; artworks live in
   `caroline-maxwell-website/public/artworks/`.

2. **Create/stage the target folder.**
   - *Claude Code*: create `public/artworks/<Name>/` (or nested under the parent
     for a child project). Don't overwrite an existing manifest.md without
     confirming with the user first — if the folder already exists, treat this
     as an update and merge rather than clobber.
   - *Chat app*: no folder to create — the zip's top level stands in for this
     folder.

3. **Handle the images.**
   - *Claude Code*: copy every image file (jpg/jpeg/png/gif/webp/svg) from the
     source folder into the target folder, preserving original filenames. Skip
     non-image files other than the writeup text file. If there are many images
     or subfolders of images (e.g. per-series folders), preserve that
     substructure only if it mirrors how existing multi-part projects are
     organized (see `GeomagTravel/` for an example of a project with image
     subfolders per child).
   - *Chat app*: use the images the user uploaded as-is (same filenames) when
     building the zip.

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

6. **Write `manifest.md`** (in the target folder for Claude Code; as generated
   content to include in the zip/code-block for the chat app) using this exact
   field format (fields first, blank line, then `##` sections — copy the
   structure precisely):

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

7. **Update parent listings** (Claude Code only — the chat app has no repo access
   to edit these). If this is a child project, add its folder name to the
   parent's `## Child Projects` list (see `GeomagTravel/manifest.md`), and add
   the new top-level name to `public/artworks/manifest.md`'s `## Child Projects`
   list if this is a new top-level artwork/project. In the chat-app case, tell
   the user these lists need a manual one-line edit after they unzip, and show
   them the line to add.

8. **Report back.**
   - *Claude Code*: list what was copied, the manifest.md path, and call out any
     fields left blank or guessed (Type, Date, Layout, Thumbnail) so the user can
     correct them.
   - *Chat app*: hand over the zip (or manifest code block), state what's inside
     it, call out guessed/blank fields the same way, and give the exact target
     path (`public/artworks/<Name>/`) to unzip/save into.

## Notes

- Don't invent biographical or descriptive content not present in the source
  material — leave fields sparse rather than fabricating detail.
- `Layout: grid` is the only layout value seen in the current site; keep it unless
  the user specifies otherwise.
- This only writes/produces files for `public/artworks/`; it never touches site code.
- Never fabricate a filesystem you don't have — if you're in the chat app, don't
  pretend to have written files into the user's repo; produce a zip or a
  copy/paste bundle instead.
