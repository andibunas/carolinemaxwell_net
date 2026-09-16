#!/usr/bin/env bash
# One-off helper for authoring an animal-reports manifest.md: given a
# category folder already containing images, prints a `## Reports` section
# with one `### <Label> N` / `Image: <file>` block per image, in filename
# order. Paste the output under the folder's Name/Order front matter.
set -euo pipefail
dir="$1"
label="$2"

echo "## Reports"
echo
n=1
for f in "$dir"/*.jpg "$dir"/*.jpeg "$dir"/*.png; do
  [ -f "$f" ] || continue
  echo "### $label $n"
  echo "Image: $(basename "$f")"
  echo
  n=$((n + 1))
done
