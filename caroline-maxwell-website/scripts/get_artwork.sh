#!/usr/bin/env bash
#
# Copies all images from a source folder into a new artwork project folder
# (named after the source folder) created inside a target container, and
# generates a `Type: artworks` manifest.md listing them, per the convention
# in scripts/MANIFEST_FORMAT.md.
#
# Usage: get_artwork.sh <source> <target-container>
set -u

usage() {
  echo "Usage: $(basename "$0") [-f] <source> <target-container>" >&2
  echo "  <target-container>/<source-folder-name>/ is created and filled in" >&2
  echo "  -f  overwrite an existing manifest.md there" >&2
  exit 1
}

FORCE=0
while getopts ":f" opt; do
  case "$opt" in
    f) FORCE=1 ;;
    *) usage ;;
  esac
done
shift $((OPTIND - 1))

[ $# -eq 2 ] || usage
SOURCE="$1"
CONTAINER="$2"

[ -d "$SOURCE" ] || { echo "error: source folder '$SOURCE' not found" >&2; exit 1; }

SOURCE_NAME="$(basename "$SOURCE")"
TARGET="$CONTAINER/$SOURCE_NAME"

MANIFEST="$TARGET/manifest.md"
if [ -f "$MANIFEST" ] && [ "$FORCE" -ne 1 ]; then
  echo "error: $MANIFEST already exists (use -f to overwrite)" >&2
  exit 1
fi

mkdir -p "$TARGET"

# Image extensions to copy, case-insensitive.
IMAGE_EXTS="jpg jpeg png gif webp svg tif tiff bmp heic"

# Prettifies a filename into a title: strips the extension, replaces - and _
# with spaces, collapses repeated spaces, and capitalizes the first letter of
# each word.
prettify_title() {
  local base="$1"
  base="${base%.*}"
  base="${base//[-_]/ }"
  base="$(printf '%s' "$base" | tr -s '[:space:]' ' ')"
  printf '%s' "$base" | awk '{
    for (i = 1; i <= NF; i++) {
      $i = toupper(substr($i, 1, 1)) substr($i, 2)
    }
    print
  }'
}

# Collect matching image filenames from SOURCE (top-level only), sorted.
IMAGES=()
while IFS= read -r fpath; do
  IMAGES+=("$(basename "$fpath")")
done < <(
  find "$SOURCE" -maxdepth 1 -type f \( -false $(printf -- '-o -iname *.%s ' $IMAGE_EXTS) \) | sort
)

if [ "${#IMAGES[@]}" -eq 0 ]; then
  echo "warning: no images found in '$SOURCE'" >&2
fi

for fn in "${IMAGES[@]}"; do
  cp "$SOURCE/$fn" "$TARGET/$fn"
done

THUMBNAIL=""
[ "${#IMAGES[@]}" -gt 0 ] && THUMBNAIL="${IMAGES[0]}"

{
  echo "Name: $(prettify_title "$SOURCE_NAME")"
  echo "Type: artworks"
  echo "Order: "
  echo "Date: "
  echo "Thumbnail: $THUMBNAIL"
  echo "Header Image: "
  echo "Layout: "
  echo
  echo "## Synopsis"
  echo
  echo
  echo "## Write Up"
  echo
  echo
  echo "## Artworks"
  echo

  for fn in "${IMAGES[@]}"; do
    echo "### $(prettify_title "$fn")"
    echo "Medium: "
    echo "Size: "
    echo "Date: "
    echo "Image: $fn"
    echo
  done
} > "$MANIFEST"

echo "Copied ${#IMAGES[@]} image(s) to $TARGET" >&2

echo "Wrote $MANIFEST" >&2
