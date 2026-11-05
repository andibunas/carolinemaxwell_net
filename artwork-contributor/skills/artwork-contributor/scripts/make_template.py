"""Write a fill-in CSV listing every image and video in an upload.

Folders are not included. The contributor only fills in the blank cells.

Usage:
    python3 -I make_template.py <upload_root> <out.csv>

Columns:
  kind         image | video (do not edit)
  path         path relative to <upload_root>, '/' separated (do not edit)
  title        prefilled: cleaned file name
  medium       media only
  size         media only
  date         YYYY-MM-DD, YYYY, or blank

Title cleaning: the file name without its extension, with every character that is
not a letter or digit replaced by a space, and runs of spaces collapsed.
"""

import csv
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from scan_folder import scan  # noqa: E402

COLUMNS = ["kind", "path", "title", "medium", "size", "date"]


def clean_title(filename: str) -> str:
    stem = os.path.splitext(filename)[0]
    spaced = re.sub(r"[^A-Za-z0-9]+", " ", stem)
    return spaced.strip()


def rows_for(info: dict) -> list[dict]:
    rows = []
    for kind, key in (("image", "images"), ("video", "videos")):
        for media in info[key]:
            rows.append({
                "kind": kind,
                "path": media["path"],
                "title": clean_title(media["filename"]),
            })
    return rows


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit("usage: make_template.py <upload_root> <out.csv>")
    root = os.path.abspath(sys.argv[1])
    if not os.path.isdir(root):
        sys.exit(f"not a folder: {root}")
    rows = rows_for(scan(root))
    with open(sys.argv[2], "w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=COLUMNS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)
    print(f"wrote {len(rows)} rows to {sys.argv[2]}")


if __name__ == "__main__":
    main()
