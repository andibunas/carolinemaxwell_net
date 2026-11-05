"""Manifest builder for the Caroline Maxwell artworks site (current patterns).

Pure standard library. Shared by the MCP server (mcp/server.py) and the skill
scripts (build_package.py), so both produce identical output.

Patterns taken from the live public/artworks/**/manifest.md files:

    Name: <title>
    Type: artworks | projects
    Date: YYYY | YYYY-MM-DD | (blank)
    Thumbnail: <file in this folder>
    Header Image: <file in this folder | blank>
    Layout: grid | carousel
    Carousel Speed: <seconds>          (only when Layout is carousel)

    ## Synopsis                        (optional)
    ## Write Up                        (optional)
    ## Child Projects                  (projects only: "- folder" per child)
    ## Artworks                        (optional)
    ### <piece title>
    Medium: / Size: / Date:            (each only when known)
    Image: <file>   or   Video: <file>
    <description paragraph>            (optional, no heading)

Folder rule: a manifest lives in the folder it describes, with its images beside it.
A project's child folders sit inside it and carry their own manifest.md.
"""

from __future__ import annotations

import posixpath
import re

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}
VIDEO_EXTS = {".mp4", ".mov", ".webm"}
MEDIA_EXTS = IMAGE_EXTS | VIDEO_EXTS
VALID_TYPES = {"artworks", "projects"}
VALID_LAYOUTS = {"grid", "carousel"}
_DATE_YEAR = re.compile(r"^\d{4}$")
_DATE_FULL = re.compile(r"^\d{4}-\d{2}-\d{2}$")
_NAME = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_-]*$")


def safe_folder_name(title: str) -> str:
    """'Villa Mysteries' -> 'Villa_Mysteries' (matches existing folder names)."""
    name = re.sub(r"[^A-Za-z0-9_-]+", "_", (title or "").strip()).strip("_")
    return name or "Untitled"


def ext_of(name: str) -> str:
    return posixpath.splitext(name)[1].lower()


def normalize_date(value: str) -> str:
    """Blank stays blank. '2015' -> '2015-01-01' (year-only convention in the code), full dates pass."""
    value = (value or "").strip()
    if _DATE_YEAR.match(value):
        return f"{value}-01-01"
    return value


def item_path(item: dict) -> str:
    parent = (item.get("parent") or "").strip("/")
    name = item.get("name") or safe_folder_name(item.get("title", ""))
    return posixpath.join(parent, name) if parent else name


def _basename(path: str) -> str:
    return posixpath.basename(path.replace("\\", "/"))


def item_files(item: dict) -> list[str]:
    """Upload-relative paths this item will copy into its own folder."""
    files = list(item.get("files") or [])
    for art in item.get("artworks") or []:
        if art.get("file"):
            files.append(art["file"])
    return files


def validate_plan(plan: dict) -> list[str]:
    """Return human-readable problems. Empty list means the plan can be built."""
    errors = []
    items = plan.get("items") or []
    if not items:
        errors.append("plan has no items")
    paths = [item_path(i) for i in items]
    for dup in sorted({p for p in paths if paths.count(p) > 1}):
        errors.append(f"two items resolve to the same folder: {dup}")

    for i, item in enumerate(items, start=1):
        label = item.get("title") or f"item #{i}"
        if not (item.get("title") or "").strip():
            errors.append(f"{label}: title is required")
        name = item.get("name") or safe_folder_name(item.get("title", ""))
        if not _NAME.match(name):
            errors.append(f"{label}: folder name '{name}' may only contain letters, digits, _ and -")
        parent = (item.get("parent") or "").strip("/")
        if parent:
            bad = [seg for seg in parent.split("/") if not _NAME.match(seg)]
            if bad or ".." in parent.split("/"):
                errors.append(f"{label}: parent '{parent}' is not a valid site path")

        typ = item.get("type", "artworks")
        if typ not in VALID_TYPES:
            errors.append(f"{label}: type must be 'artworks' or 'projects'")
        layout = item.get("layout") or "grid"
        if layout not in VALID_LAYOUTS:
            errors.append(f"{label}: layout must be 'grid' or 'carousel'")
        speed = item.get("carousel_speed")
        if speed not in (None, ""):
            try:
                float(speed)
            except (TypeError, ValueError):
                errors.append(f"{label}: carousel_speed must be a number of seconds")
        date = (item.get("date") or "").strip()
        if date and not (_DATE_YEAR.match(date) or _DATE_FULL.match(date)):
            errors.append(f"{label}: date '{date}' must be YYYY or YYYY-MM-DD")

        basenames = set()
        for f in item_files(item):
            base = _basename(f)
            if ".." in f.replace("\\", "/").split("/") or f.startswith("/"):
                errors.append(f"{label}: file path '{f}' must be relative to the upload folder")
            if ext_of(base) not in MEDIA_EXTS:
                errors.append(f"{label}: '{base}' is not a supported image or video type")
            if base.lower() in {b.lower() for b in basenames}:
                errors.append(f"{label}: two files are named '{base}'")
            basenames.add(base)

        for art in item.get("artworks") or []:
            if not art.get("file"):
                errors.append(f"{label}: an artwork has no file")

        names = {_basename(f).lower() for f in item_files(item)}
        for field in ("thumbnail", "header_image"):
            value = (item.get(field) or "").strip()
            if value and _basename(value).lower() not in names:
                errors.append(f"{label}: {field} '{value}' is not one of this item's files")
    return errors


def children_of(plan: dict, path: str) -> list[dict]:
    return [i for i in plan.get("items", []) if (i.get("parent") or "").strip("/") == path]


def effective_type(plan: dict, item: dict) -> str:
    """Projects that contain other planned items are always 'projects'."""
    if children_of(plan, item_path(item)):
        return "projects"
    return item.get("type", "artworks")


def build_item_manifest(item: dict, child_names: list[str] | None = None, typ: str | None = None) -> str:
    """Render one manifest.md. child_names: folder names of child projects, in order."""
    child_names = child_names or []
    typ = typ or item.get("type", "artworks")
    layout = item.get("layout") or "grid"
    thumb = _basename(item.get("thumbnail") or "")
    header = _basename(item.get("header_image") or "")
    if not thumb:
        arts = item.get("artworks") or []
        if arts:
            thumb = _basename(arts[0]["file"])

    lines = [
        f"Name: {item['title'].strip()}",
        f"Type: {typ}",
        f"Date: {normalize_date(item.get('date', ''))}".rstrip(),
        f"Thumbnail: {thumb}",
        f"Header Image: {header}",
        f"Layout: {layout}",
    ]
    if layout == "carousel" and str(item.get("carousel_speed") or "").strip():
        lines.append(f"Carousel Speed: {str(item['carousel_speed']).strip()}")
    lines.append("")

    if (item.get("description") or "").strip():
        lines += ["## Synopsis", "", item["description"].strip(), ""]
    if (item.get("write_up") or "").strip():
        lines += ["## Write Up", "", item["write_up"].strip(), ""]
    if child_names:
        lines += ["## Child Projects", ""] + [f"- {n}" for n in child_names] + [""]

    arts = item.get("artworks") or []
    if arts:
        lines += ["## Artworks", ""]
        for art in arts:
            fname = _basename(art["file"])
            piece = (art.get("title") or "").strip() or posixpath.splitext(fname)[0]
            lines.append(f"### {piece}")
            for label, key in (("Medium", "medium"), ("Size", "size"), ("Date", "date")):
                value = (art.get(key) or "").strip()
                if value:
                    lines.append(f"{label}: {value}")
            kind = "Video" if ext_of(fname) in VIDEO_EXTS else "Image"
            lines.append(f"{kind}: {fname}")
            lines.append("")
            desc = (art.get("description") or "").strip()
            if desc:
                lines += [desc, ""]
    return "\n".join(lines).rstrip("\n") + "\n"


def build_delta(plan: dict) -> str:
    """Lines to add under '## Child Projects' in existing manifests, grouped by target file.

    Top-level items go to artworks/manifest.md. Items placed under an existing site
    project (not part of this plan) go to that project's manifest. Items placed under
    a planned parent are already in the generated parent manifest, so they are skipped.
    """
    planned = {item_path(i) for i in plan.get("items", [])}
    targets: dict[str, list[str]] = {}
    for item in plan.get("items", []):
        parent = (item.get("parent") or "").strip("/")
        if parent in planned:
            continue
        target = posixpath.join(parent, "manifest.md") if parent else "manifest.md"
        targets.setdefault(target, []).append(item.get("name") or safe_folder_name(item["title"]))
    if not targets:
        return "# manifest-delta.md\n\nNo changes to existing manifests.\n"

    out = [
        "# manifest-delta.md",
        "",
        "Add each listed folder under the '## Child Projects' heading of the manifest named above.",
        "If that manifest has no Child Projects heading yet, add one, then the list.",
        "",
    ]
    for target, names in targets.items():
        out += [f"## artworks/{target}", ""] + [f"- {n}" for n in names] + [""]
    return "\n".join(out)
