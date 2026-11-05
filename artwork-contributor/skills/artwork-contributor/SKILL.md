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
the user to rename them, one question at a time, with a default. Do not rename silently.

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

Infer as much as possible and ask as little as possible. Only ask when a value
cannot be worked out from the upload.

Inference rules:

- **Title:** from a document in the folder (writeup, notes) if one names the work, otherwise from the folder name.
- **Folder names:** use the folder names as uploaded. Do not rename them.
- **Missing info:** leave the field blank in the generated manifest. Do not ask for it.
- **Synopsis and write-up:** infer which is which. The synopsis is a one-sentence string shown on the folder's image. The write-up is the text shown inside the full folder. If the synopsis would be longer than one sentence, shorten it to one sentence, or ask the user (see below).
- **Layout:** always `grid`, unless the user explicitly asks for `carousel`.
- **Image titles:** if no title is given anywhere, take the file name without its extension, replace special characters with spaces, and use that as the title.
- **Image fields (medium, size, date):** if none are given anywhere, use the fill-in form. It is an artifact in the account running this skill, so the contributor fills it in directly and nothing is shared. The form lists every image and video, one row each, with title, medium, size and date. Titles are prefilled from the file names. Do not ask about folders in the form: folder fields are asked in chat. Steps:

  0. Do not show the form automatically. First ask one question with AskUserQuestion, with these options (Leave blank is the default, first option):
     - "Leave blank (Default)": leave medium, size and date empty for every image.
     - "Same value for all": ask once for the value to use on every image (medium, size, date each, blank allowed).
     - "Show the form": go on to step 1.
     - "Something else": ask what they want, one question at a time.
     If they choose "Leave blank" or "Same value for all", skip the form and fill those values in the plan directly.

  1. Publish the form from `assets/artwork_form.html` as a new artifact, with the `db` capability (`capabilities: {"db": {}}`). Title it "Artwork Details Form". Only do this when the contributor chose "Show the form".
  2. Seed its database: one document per image or video in the `media` collection (`media/m001`, `media/m002`, …), with `path`, `title`, `medium`, `size` and `date` (the last three blank). Write them in batches of up to 50.
  3. Give the contributor the link. Then ask with AskUserQuestion, with these options (the first is the default):
     - "Done, read the form (Default)": read the `media` collection back and use the values in the plan.
     - "Still filling in": wait, and ask the same question again when the contributor returns.
     - "Something else": ask what they want, one question at a time.
  4. When they choose "Done", read the `media` collection back and use the values in the plan.
  5. Leave the form artifact in place. It belongs to the chat session and is removed with it. Do not delete it, and do not ask the contributor about deleting it.

  If the artifact tools or the database are not available, fall back to the CSV template instead: `python3 -I scripts/make_template.py <upload_root> <outputs_folder>/template.csv`, delivered as a download and read back once it is filled in.

When you must ask, ask **one question at a time**, wait for the answer, and give a
**default** that Enter accepts, for example `Default: Enter for "grid"`.
Say what the default means when it is not obvious.

Always use the AskUserQuestion tool for every question. Do not ask in the chat text.
Make the default the first option, labelled "(Default)", with the other likely answers
after it. Send only one question per tool call. Ask in chat only if the tool is missing.

When asking about the synopsis or write-up, explain the difference in one line: the
synopsis is a one-sentence string for the folder image, and the write-up is for inside the folder.

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
that zip and show its full text in the chat. List every warning. Then ask one question at a time: first "Confirm these manifests?" (Default: Enter to confirm), then ask about each correction the user raises, one at a time. This step is required.

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
- Form artifact: do not delete it. It is part of the contributor's chat session and goes away when that session is deleted. Explicit deletion would only alarm the contributor.

## Rules

- Do not change anything outside the plan, the zip, and the scratchpad or outputs folder.
- Never write a manifest by hand. Always generate it with the scripts, so the format stays current.
- Never edit `manifest.json` by hand. Rebuild it with `npm run build-manifest`.
- Keep the upload's own file names. Only the size of the files changes, and only for images above 2000px.
- Ask one question at a time. Wait for the answer. Every question shows its default, and an empty reply (Enter) accepts it.
