# artwork-contributor

A self-contained Claude skill (plus an MCP tool) for the Caroline Maxwell site.
A contributor uploads artwork folders in the chat. Claude asks questions, builds
the manifests in the site's current format, and gives the contributor a zip to
download. The site owner merges that zip into `public/artworks/`.

## Contents

```
SKILL.md                    workflow Claude follows
scripts/manifest_core.py    manifest format and plan validation (stdlib only)
scripts/scan_folder.py      inventory of the uploaded folders
scripts/build_package.py    plan.json + uploads -> zip (resizes images when Pillow is present)
mcp/server.py               MCP server: build_manifest, build_manifest_delta
```

The repo's `.claude/skills/get_artwork/SKILL.md` uses these same scripts to
import directly into `public/artworks/`.

## Use on claude.ai

1. Zip this folder so `SKILL.md` is at the top of the zip.
2. Upload it as a custom skill.
3. Contributors attach their folders in the chat. Claude asks questions, shows
   every manifest for confirmation, and returns the zip as a download.

Python 3 is enough. Pillow is optional. Without it, images are not resized, and
the output says so.

## Optional: MCP server (Claude Desktop / Claude Code)

```
pip install "mcp[cli]"      # Python 3.10+
python3 mcp/server.py
```

Add it as a stdio server in your client. The skill works without it.

## Output (the downloaded zip)

```
<Top>/manifest.md, <Top>/<media>, <Top>/<Child>/manifest.md
manifest-delta.md
```

Merge, by the site owner:

1. Unzip and copy each top-level folder into `caroline-maxwell-website/public/artworks/`.
2. For each section of `manifest-delta.md`, add the listed folders under that
   manifest's `## Child Projects` list. Create the heading if the file doesn't have one.
3. In `caroline-maxwell-website/`, run `npm run build-manifest`.

Never edit `src/content/manifest.json` by hand. `npm run build-manifest` is the
only correct way to update it.

## Run by hand

```
python3 -I scripts/scan_folder.py <upload_root>
python3 -I scripts/build_package.py <plan.json> <upload_root> <out_dir>
```

`plan.json` is documented at the top of `scripts/build_package.py`.
