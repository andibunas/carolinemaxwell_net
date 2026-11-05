"""Inventory an uploaded folder tree so the skill can plan the site structure.

Usage:
    python3 -I scan_folder.py <upload_root>

Prints JSON. Read-only. Paths are relative to <upload_root> and use '/'.
  folders   every directory (including the root as "."), with its own files
            and subfolder names, so the tree can be reconstructed
  images / videos / text_files / other_files   flat lists with paths
  duplicate_image_filenames   same basename in different folders (must be resolved)
"""

import json
import os
import sys

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}
VIDEO_EXTS = {".mp4", ".mov", ".webm"}
TEXT_EXTS = {".txt", ".md", ".markdown", ".rtf", ".csv", ".json"}
PREVIEW_CHARS = 4000


def scan(root: str) -> dict:
    folders, images, videos, texts, other = [], [], [], [], []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = sorted(d for d in dirnames if not d.startswith("."))
        rel_dir = os.path.relpath(dirpath, root).replace(os.sep, "/")
        rel_dir = "." if rel_dir == "." else rel_dir
        local_media = {"images": 0, "videos": 0}
        local_files = []
        for fname in sorted(filenames):
            if fname.startswith("."):
                continue
            full = os.path.join(dirpath, fname)
            rel = fname if rel_dir == "." else f"{rel_dir}/{fname}"
            ext = os.path.splitext(fname)[1].lower()
            size = os.path.getsize(full)
            entry = {"path": rel, "filename": fname, "bytes": size}
            if ext in IMAGE_EXTS:
                images.append(entry)
                local_media["images"] += 1
                local_files.append(fname)
            elif ext in VIDEO_EXTS:
                videos.append(entry)
                local_media["videos"] += 1
                local_files.append(fname)
            elif ext in TEXT_EXTS:
                with open(full, encoding="utf-8", errors="replace") as fh:
                    text = fh.read()
                texts.append({
                    "path": rel,
                    "bytes": size,
                    "chars": len(text),
                    "preview": text[:PREVIEW_CHARS],
                    "truncated": len(text) > PREVIEW_CHARS,
                })
            else:
                other.append(entry)
        folders.append({
            "path": rel_dir,
            "subfolders": list(dirnames),
            "images": local_media["images"],
            "videos": local_media["videos"],
            "files": local_files,
        })

    names = [i["filename"].lower() for i in images + videos]
    duplicates = sorted({n for n in names if names.count(n) > 1})
    return {
        "root": root,
        "folders": folders,
        "image_count": len(images),
        "video_count": len(videos),
        "images": images,
        "videos": videos,
        "text_files": texts,
        "other_files": other,
        "duplicate_image_filenames": duplicates,
    }


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit("usage: scan_folder.py <upload_root>")
    root = os.path.abspath(sys.argv[1])
    if not os.path.isdir(root):
        sys.exit(f"not a folder: {root}")
    print(json.dumps(scan(root), indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
