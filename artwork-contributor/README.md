# artwork-contributor

A Claude package for the Caroline Maxwell site. A contributor uploads artwork
folders in the chat. Claude asks questions, builds the manifests in the site's
current format, and gives the contributor a zip to download. The site owner merges
that zip into `public/artworks/`.

The same source builds two uploadable packages:

- **Plugin** (`artwork-contributor-plugin.zip`): skill plus scripts. Upload this to claude.ai as a plugin.
- **Skill only** (`artwork-contributor-skill.zip`): the same skill and scripts, as a plain skill.

## Layout

```
.claude-plugin/plugin.json                       plugin manifest (required for the plugin package)
README.md                                        this file (not needed by Claude)
skills/artwork-contributor/SKILL.md              the workflow Claude follows
skills/artwork-contributor/scripts/manifest_core.py   manifest format and plan validation (stdlib only)
skills/artwork-contributor/scripts/scan_folder.py     inventory of the uploaded folders
skills/artwork-contributor/scripts/build_package.py   plan.json + uploads -> zip (resizes when Pillow is present)
skills/artwork-contributor/mcp/server.py              MCP tools: build_manifest, build_manifest_delta
```

The repo's `.claude/skills/get_artwork/SKILL.md` is a separate, self-contained skill.
It does not use these scripts.

## Build the packages

Run from the repo root:

```
./artwork-contributor/build.sh          # build both zips
./artwork-contributor/build.sh plugin   # plugin zip only
./artwork-contributor/build.sh skill    # skill zip only
./artwork-contributor/build.sh clean    # delete both zips
```

The script checks that each zip has its required file at the root and fails if not.
The manual commands it runs are below.

```
# plugin package: plugin root contents, with .claude-plugin/plugin.json at the archive root
cd artwork-contributor && zip -r ../artwork-contributor-plugin.zip .claude-plugin README.md skills -x "*/__pycache__/*" && cd ..

# skill-only package: the skill folder's contents, with SKILL.md at the archive root
cd artwork-contributor/skills/artwork-contributor && zip -r ../../../artwork-contributor-skill.zip . -x "*/__pycache__/*" && cd ../../..
```

Both zips are gitignored. Check the archive root before uploading: the plugin
zip needs `.claude-plugin/plugin.json` at its top level, and the skill zip needs
`SKILL.md` at its top level. Neither should be wrapped in a folder.

## Use on claude.ai

1. Build the package you want (above).
2. Upload the zip to claude.ai as a plugin (plugin zip) or a skill (skill zip).
3. Contributors attach their folders in the chat. Claude asks questions, shows
   every manifest for confirmation, and returns the zip as a download.

Python 3 is enough. Pillow is optional. Without it, images are not resized, and the
output says so.

## Optional: MCP server (Claude Code only)

`skills/artwork-contributor/mcp/server.py` exposes the same manifest builder as MCP tools.
It is not part of either package: MCP servers that run from a local command, like this one,
do not work in the Claude Desktop app.

```
pip install "mcp[cli]"      # Python 3.10+
python3 artwork-contributor/skills/artwork-contributor/mcp/server.py
```

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

## Run the scripts by hand

```
python3 -I skills/artwork-contributor/scripts/scan_folder.py <upload_root>
python3 -I skills/artwork-contributor/scripts/build_package.py <plan.json> <upload_root> <out_dir>
```

`plan.json` is documented at the top of `build_package.py`.
