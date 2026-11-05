"""Build the upload-ready zip from a plan covering one or more folders and subfolders.

Usage:
    python3 -I build_package.py <plan.json> <upload_root> <out_dir>

plan.json:
{
  "items": [
    {
      "name": "Fires",                  folder name (default: title with _ for spaces)
      "parent": "",                     "" = top level of artworks/, or a site path
                                        such as "GeomagTravel" (an existing project)
                                        or "NewTrip" (another item in this plan)
      "title": "Fires",
      "type": "artworks",               "projects" is forced when items sit under it
      "date": "2015",                   YYYY, YYYY-MM-DD, or blank
      "description": "...",             Synopsis
      "write_up": "...",
      "thumbnail": "AfterEaton_1.jpeg", a file in this folder (default: first artwork)
      "header_image": "",
      "layout": "grid",                 "grid" or "carousel"
      "carousel_speed": "",             seconds, carousel only
      "files": ["sub/extra.jpg"],       extra images to copy into this folder (paths
                                        relative to upload_root), e.g. a thumbnail
      "artworks": [
        {"file": "sub/AfterEaton_1.jpeg", "title": "", "medium": "", "size": "",
         "date": "", "description": ""}
      ]
    }
  ]
}

Zip layout mirrors public/artworks, so it merges by copying folders across:
    <Top>/manifest.md, <Top>/<images>, <Top>/<Child>/manifest.md, ...
    manifest-delta.md   lines to add to existing "## Child Projects" lists
"""

import json
import os
import shutil
import sys
import tempfile
import zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import manifest_core as mc  # noqa: E402

MAX_EDGE = 2000     # memory: web images max 2000px on the longest side
JPEG_QUALITY = 85   # memory: ~85 quality
DPI = (72, 72)      # memory: 72 DPI


def resolve_source(upload_root: str, rel: str) -> str:
    full = os.path.normpath(os.path.join(upload_root, rel))
    if os.path.commonpath([upload_root, full]) != upload_root or not os.path.isfile(full):
        raise FileNotFoundError(f"not found in upload: {rel}")
    return full


def prepare_image(path: str) -> str:
    """Resize in place to the web standard. Never upscales. Returns a note."""
    try:
        from PIL import Image
    except ImportError:
        return "not checked (Pillow missing); confirm longest side <= 2000px"
    ext = os.path.splitext(path)[1].lower()
    if ext not in (".jpg", ".jpeg", ".png"):
        return "left as is (format not resized)"
    with Image.open(path) as im:
        w, h = im.size
        if max(w, h) <= MAX_EDGE:
            return f"{w}x{h}, no resize needed"
        scale = MAX_EDGE / max(w, h)
        new = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
        fmt = "JPEG" if ext in (".jpg", ".jpeg") else "PNG"
        if fmt == "JPEG" and new.mode not in ("RGB", "L"):
            new = new.convert("RGB")
        save_kwargs = {"dpi": DPI}
        if fmt == "JPEG":
            save_kwargs.update(quality=JPEG_QUALITY, optimize=True)
        new.save(path, fmt, **save_kwargs)
        return f"{w}x{h} resized to {new.size[0]}x{new.size[1]}"


def main() -> None:
    if len(sys.argv) != 4:
        sys.exit("usage: build_package.py <plan.json> <upload_root> <out_dir>")
    plan_path = sys.argv[1]
    upload_root = os.path.abspath(sys.argv[2])
    out_dir = os.path.abspath(sys.argv[3])

    with open(plan_path, encoding="utf-8") as fh:
        plan = json.load(fh)

    errors = mc.validate_plan(plan)
    if errors:
        sys.exit("invalid plan:\n- " + "\n- ".join(errors))

    items = plan["items"]
    warnings, prep_notes = [], {}
    os.makedirs(out_dir, exist_ok=True)
    zip_path = os.path.join(out_dir, "artwork_package.zip")

    with tempfile.TemporaryDirectory() as stage:
        for item in items:
            path = mc.item_path(item)
            folder = os.path.join(stage, *path.split("/"))
            os.makedirs(folder, exist_ok=True)

            # copy this item's files into its own folder
            for rel in mc.item_files(item):
                src = resolve_source(upload_root, rel)
                dest = os.path.join(folder, os.path.basename(rel))
                shutil.copy2(src, dest)
                if mc.ext_of(dest) in mc.IMAGE_EXTS:
                    prep_notes[f"{path}/{os.path.basename(rel)}"] = prepare_image(dest)

            kids = [mc.item_path(k).split("/")[-1] for k in mc.children_of(plan, path)]
            typ = mc.effective_type(plan, item)
            with open(os.path.join(folder, "manifest.md"), "w", encoding="utf-8") as fh:
                fh.write(mc.build_item_manifest(item, kids, typ))

            # warnings for fields the site normally has
            label = path
            if not (item.get("description") or "").strip():
                warnings.append(f"{label}: Synopsis is blank")
            if not (item.get("write_up") or "").strip():
                warnings.append(f"{label}: Write Up is blank")
            if not (item.get("date") or "").strip():
                warnings.append(f"{label}: Date is blank")
            if item.get("thumbnail") and mc.ext_of(item["thumbnail"]) in mc.VIDEO_EXTS:
                warnings.append(f"{label}: thumbnail is a video; pick an image")
            for art in item.get("artworks") or []:
                if not (art.get("title") or "").strip():
                    warnings.append(f"{label}/{mc._basename(art['file'])}: title is blank (file name used)")
                for field in ("medium", "size", "date"):
                    if not (art.get(field) or "").strip():
                        warnings.append(f"{label}/{mc._basename(art['file'])}: {field} is blank")

        delta = mc.build_delta(plan)
        with open(os.path.join(stage, "manifest-delta.md"), "w", encoding="utf-8") as fh:
            fh.write(delta)

        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for dirpath, _, filenames in os.walk(stage):
                for fname in sorted(filenames):
                    full = os.path.join(dirpath, fname)
                    zf.write(full, os.path.relpath(full, stage).replace(os.sep, "/"))

    print(json.dumps({
        "zip": zip_path,
        "items": [
            {"path": mc.item_path(i), "type": mc.effective_type(plan, i),
             "artworks": len(i.get("artworks") or []),
             "children": len(mc.children_of(plan, mc.item_path(i)))}
            for i in items
        ],
        "image_prep": prep_notes,
        "delta": delta,
        "warnings": warnings,
    }, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
