"""MCP server: build manifest.md text in the current site format.

Tools:
  build_manifest(title, description, artworks, ...) -> one manifest.md
  build_manifest_delta(plan_json) -> the manifest-delta.md text for a whole plan

Run locally (stdio):   python3 server.py       (needs: pip install "mcp[cli]")
The logic lives in ../scripts/manifest_core.py, the same code build_package.py uses.
"""

from __future__ import annotations

import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "scripts"))
import manifest_core as mc  # noqa: E402

from mcp.server.fastmcp import FastMCP  # noqa: E402

mcp = FastMCP("caroline-artwork-manifest")


@mcp.tool()
def build_manifest(
    title: str,
    description: str,
    artworks: list[dict],
    write_up: str = "",
    date: str = "",
    type: str = "artworks",
    folder: str = "",
    thumbnail: str = "",
    header_image: str = "",
    layout: str = "grid",
    carousel_speed: str = "",
    child_projects: list[str] | None = None,
) -> str:
    """Build manifest.md text in the current site format.

    title: project or artwork name (Name:).
    description: short synopsis, written under ## Synopsis.
    artworks: one dict per piece. Keys: file (required, e.g. 'DSC_0088.jpg' or
      'Greyhounds.mp4' for a video), title, medium, size, date, description.
      Leave keys out when unknown. Do not invent values.
    write_up: longer text under ## Write Up.
    date: YYYY, YYYY-MM-DD, or blank.
    type: 'artworks' for a single work or flat collection, 'projects' for a
      project whose children are child_projects.
    folder: folder name if different from the title.
    thumbnail / header_image: a file name from artworks. Thumbnail defaults to the first.
    layout: 'grid' or 'carousel'. carousel_speed (seconds) applies to carousel only.
    child_projects: folder names of child projects, in display order.
    """
    item = {
        "title": title,
        "name": folder or mc.safe_folder_name(title),
        "description": description,
        "write_up": write_up,
        "date": date,
        "type": type,
        "thumbnail": thumbnail,
        "header_image": header_image,
        "layout": layout,
        "carousel_speed": carousel_speed,
        "artworks": artworks,
    }
    errors = mc.validate_plan({"items": [item]})
    if errors:
        return "ERROR: " + "; ".join(errors)
    return mc.build_item_manifest(item, child_projects or [], type)


@mcp.tool()
def build_manifest_delta(plan_json: str) -> str:
    """Return manifest-delta.md text for a plan (JSON string, same shape as build_package.py's plan).

    Lists the folders that need adding under '## Child Projects' in existing manifests.
    """
    try:
        plan = json.loads(plan_json)
    except json.JSONDecodeError as exc:
        return f"ERROR: plan_json is not valid JSON: {exc}"
    errors = mc.validate_plan(plan)
    if errors:
        return "ERROR: " + "; ".join(errors)
    return mc.build_delta(plan)


if __name__ == "__main__":
    mcp.run()
