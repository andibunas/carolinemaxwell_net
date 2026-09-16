#!/usr/bin/env bash
#
# Generates src/content/manifest.json by scanning public/artworks and
# public/writings. See scripts/MANIFEST_FORMAT.md for the manifest.md
# convention this script expects each folder to follow.
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUBLIC_DIR="$ROOT_DIR/public"
ARTWORKS_DIR="$PUBLIC_DIR/artworks"
WRITINGS_DIR="$PUBLIC_DIR/writings"
OUT_FILE="$ROOT_DIR/src/content/manifest.json"

if ! command -v jq >/dev/null 2>&1; then
  echo "error: jq is required (brew install jq)" >&2
  exit 1
fi

WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT
FAILFILE="$WORKDIR/FAILED"

# `fail` is often called from deep inside nested command substitutions
# ($(...)), each of which is its own subshell -- `exit` there only ends that
# subshell, not the whole script. Every caller that captures a function's
# output via $(...) must call `check_failed` right after, so the failure
# propagates outward one subshell at a time until it reaches the real script.
fail() {
  echo "error: $1" >&2
  : > "$FAILFILE"
  exit 1
}

check_failed() {
  if [ -f "$FAILFILE" ]; then
    exit 1
  fi
}

# ---------------------------------------------------------------------------
# manifest.md parsing
#
# Splits a manifest.md into a "front matter" of `Key: value` lines (everything
# before the first `## Heading`) plus one file per `## Heading` section.
# Returns the directory holding those pieces on stdout.
# ---------------------------------------------------------------------------
parse_manifest_md() {
  local file="$1"
  [ -f "$file" ] || fail "missing manifest.md at $file"
  local pdir; pdir="$(mktemp -d "$WORKDIR/parse.XXXXXX")"
  awk -v outdir="$pdir" '
    BEGIN { out = outdir "/_front.txt" }
    /^## / {
      slug = tolower($0)
      sub(/^## /, "", slug)
      gsub(/[^a-z0-9]+/, "_", slug)
      gsub(/^_+|_+$/, "", slug)
      out = outdir "/_section_" slug ".md"
      next
    }
    { print > out }
  ' "$file"
  printf '%s' "$pdir"
}

front_get() {
  local pdir="$1" key="$2" val=""
  if [ -f "$pdir/_front.txt" ]; then
    val="$(grep -m1 "^${key}:" "$pdir/_front.txt" 2>/dev/null | sed -E "s/^${key}:[[:space:]]*//")"
  fi
  printf '%s' "$val"
}

strip_leading_blank() {
  awk 'BEGIN{started=0} !started && /^[[:space:]]*$/ {next} {started=1; print}' "$1"
}

section_get() {
  local pdir="$1" name="$2"
  local slug; slug="$(printf '%s' "$name" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/_/g; s/^_+|_+$//g')"
  local f="$pdir/_section_${slug}.md"
  [ -f "$f" ] || { printf ''; return; }
  strip_leading_blank "$f"
}

# A folder's Write Up: `writeup.md` sitting next to manifest.md, if present,
# takes the whole file as the write-up in place of the `## Write Up` section.
write_up_get() {
  local dir="$1" pdir="$2"
  local f="$dir/writeup.md"
  if [ -f "$f" ]; then
    strip_leading_blank "$f"
  else
    section_get "$pdir" "Write Up"
  fi
}

# ---------------------------------------------------------------------------
# Ordering: subfolders are sorted by their own `Order: N` field (ascending),
# falling back to alphabetical among folders that don't set one.
# ---------------------------------------------------------------------------
ordered_children() {
  local dir="$1"
  local tmp; tmp="$(mktemp "$WORKDIR/order.XXXXXX")"
  : > "$tmp"
  local sub order o pdir
  while IFS= read -r sub; do
    order=999999
    if [ -f "$sub/manifest.md" ]; then
      pdir="$(parse_manifest_md "$sub/manifest.md")"; check_failed
      o="$(front_get "$pdir" Order)"
      if [[ "$o" =~ ^[0-9]+$ ]]; then
        order="$o"
      fi
    fi
    printf '%06d\t%s\n' "$order" "$sub" >> "$tmp"
  done < <(find "$dir" -mindepth 1 -maxdepth 1 -type d ! -name '.*' | sort)
  sort -t "$(printf '\t')" -k1,1 -k2,2 "$tmp" | cut -f2-
}

json_push() {
  # json_push <array-json> <element-json> -- appends and prints the result
  jq -c --argjson o "$2" '. + [$o]' <<<"$1"
}

# ---------------------------------------------------------------------------
# Artworks tree (public/artworks/): every folder is a "project". `Type:
# projects` recurses into subfolders; `Type: artworks` reads inline artwork
# entries from a `## Artworks` section (one `### Title` per image, living
# directly in this folder) instead of recursing. See MANIFEST_FORMAT.md.
# ---------------------------------------------------------------------------

# Splits a `## Artworks` section file into one artwork object per `### Title`
# subsection. Each subsection is `Key: value` lines (Medium/Size/Date/Image)
# followed by optional free-text write-up. Returns a JSON array.
parse_artwork_entries() {
  local section_file="$1" dir="$2"
  local entries_json="[]"
  [ -f "$section_file" ] || { printf '%s' "$entries_json"; return; }

  local edir; edir="$(mktemp -d "$WORKDIR/artentry.XXXXXX")"
  awk -v outdir="$edir" '
    BEGIN { n = 0; out = outdir "/_pre.md" }
    /^### / {
      n++
      title = $0
      sub(/^### /, "", title)
      print title > (outdir "/_title_" n ".txt")
      out = outdir "/_entry_" n ".md"
      next
    }
    { print > out }
  ' "$section_file"

  local rel; rel="${dir#"$PUBLIC_DIR"/}"
  local n=1 efile title medium size date image write_up slug
  while [ -f "$edir/_title_$n.txt" ]; do
    title="$(cat "$edir/_title_$n.txt")"
    efile="$edir/_entry_$n.md"
    medium="$(grep -m1 '^Medium:' "$efile" 2>/dev/null | sed -E 's/^Medium:[[:space:]]*//')"
    size="$(grep -m1 '^Size:' "$efile" 2>/dev/null | sed -E 's/^Size:[[:space:]]*//')"
    date="$(grep -m1 '^Date:' "$efile" 2>/dev/null | sed -E 's/^Date:[[:space:]]*//')"
    image="$(grep -m1 '^Image:' "$efile" 2>/dev/null | sed -E 's/^Image:[[:space:]]*//')"
    write_up="$(awk '
      BEGIN { skipping = 1 }
      /^(Medium|Size|Date|Image):/ { next }
      skipping && /^[[:space:]]*$/ { next }
      { skipping = 0; lines[++n] = $0 }
      END { last = n; while (last > 0 && lines[last] == "") last--; for (i = 1; i <= last; i++) print lines[i] }
    ' "$efile")"

    if [ -z "$image" ] || [ ! -f "$dir/$image" ]; then
      echo "warning: $dir/manifest.md artwork '$title' has missing/invalid Image '$image'" >&2
      n=$((n + 1))
      continue
    fi

    slug="$(printf '%s' "$title" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')"
    entries_json="$(json_push "$entries_json" "$(jq -n \
      --arg id "$slug" --arg title "$title" --arg medium "${medium:-}" --arg size "${size:-}" \
      --arg date "${date:-}" --arg src "/$rel/$image" --arg write_up "${write_up:-}" \
      '{id:$id, type:"artwork", title:$title, medium:$medium, size:$size, date:$date, write_up:$write_up,
        images:[{src:$src, alt:$title, is_primary:true}]}')")"
    n=$((n + 1))
  done
  printf '%s' "$entries_json"
}

# Ordered subfolder list for a `Type: projects` folder: an explicit
# `## Child Projects` list (one `- foldername` per line) if present,
# otherwise the same Order-field fallback as ordered_children().
ordered_child_projects() {
  local dir="$1" pdir="$2"
  local list_file="$pdir/_section_child_projects.md"
  if [ -f "$list_file" ] && grep -q '^-[[:space:]]' "$list_file"; then
    grep '^-[[:space:]]' "$list_file" | sed -E 's/^-[[:space:]]+//; s/[[:space:]]+$//' \
      | while IFS= read -r name; do printf '%s/%s\n' "$dir" "$name"; done
  else
    ordered_children "$dir"
  fi
}

# Ordered top-level list for public/artworks/ or public/writings/ itself (a
# container, not a project): an optional manifest.md sitting directly in it
# can carry a `## Child Projects` list, just like a `Type: projects` folder's,
# to order the top-level project folders; otherwise falls back to the same
# Order-field fallback as ordered_children().
ordered_top_level() {
  local dir="$1"
  if [ -f "$dir/manifest.md" ]; then
    local pdir; pdir="$(parse_manifest_md "$dir/manifest.md")"; check_failed
    local list_file="$pdir/_section_child_projects.md"
    if [ -f "$list_file" ] && grep -q '^-[[:space:]]' "$list_file"; then
      grep '^-[[:space:]]' "$list_file" | sed -E 's/^-[[:space:]]+//; s/[[:space:]]+$//' \
        | while IFS= read -r name; do printf '%s/%s\n' "$dir" "$name"; done
      return
    fi
  fi
  ordered_children "$dir"
}

build_artworks_node() {
  local dir="$1"
  local id; id="$(basename "$dir")"
  local pdir; pdir="$(parse_manifest_md "$dir/manifest.md")"; check_failed
  local type; type="$(front_get "$pdir" Type)"
  local name layout date write_up synopsis
  name="$(front_get "$pdir" Name)"
  layout="$(front_get "$pdir" Layout)"
  date="$(front_get "$pdir" Date)"
  write_up="$(write_up_get "$dir" "$pdir")"
  synopsis="$(section_get "$pdir" "Synopsis")"

  local rel thumbnail_file header_file thumbnail="" header_image=""
  rel="${dir#"$PUBLIC_DIR"/}"
  thumbnail_file="$(front_get "$pdir" Thumbnail)"
  if [ -n "$thumbnail_file" ]; then
    if [ -f "$dir/$thumbnail_file" ]; then
      thumbnail="/$rel/$thumbnail_file"
    else
      echo "warning: $dir/manifest.md references missing thumbnail '$thumbnail_file'" >&2
    fi
  fi
  header_file="$(front_get "$pdir" "Header Image")"
  if [ -n "$header_file" ]; then
    if [ -f "$dir/$header_file" ]; then
      header_image="/$rel/$header_file"
    else
      echo "warning: $dir/manifest.md references missing header image '$header_file'" >&2
    fi
  fi

  local children_json
  case "$type" in
    projects)
      children_json="[]"
      local sub node
      while IFS= read -r sub; do
        node="$(build_artworks_node "$sub")"; check_failed
        children_json="$(json_push "$children_json" "$node")"
      done < <(ordered_child_projects "$dir" "$pdir")
      check_failed
      ;;
    artworks)
      children_json="$(parse_artwork_entries "$pdir/_section_artworks.md" "$dir")"
      ;;
    *)
      fail "$dir/manifest.md has Type '$type' (expected projects or artworks)"
      ;;
  esac

  jq -n --arg id "$id" --arg name "$name" --arg layout "$layout" --arg date "$date" \
        --arg write_up "$write_up" --arg synopsis "$synopsis" \
        --arg thumbnail "$thumbnail" --arg header_image "$header_image" \
        --argjson children "$children_json" '
    {id:$id, type:"project", name:$name, layout_type:$layout, date:$date, write_up:$write_up, synopsis:$synopsis}
    + (if $thumbnail != "" then {thumbnail:$thumbnail} else {} end)
    + (if $header_image != "" then {header_image:$header_image} else {} end)
    + {children:$children}
  '
}

# ---------------------------------------------------------------------------
# Writings tree only: a `writing` leaf's own image list. Every file sitting
# directly in the folder (besides manifest.md and the Header Image file, if
# any) becomes an entry; alt text falls back to the writing's Name. Order
# matches directory listing order -- the Write Up's own [filename] markers
# are what actually control display order/placement, not this array.
# ---------------------------------------------------------------------------
build_writing_images() {
  local dir="$1" name="$2" header_file="$3"
  local rel; rel="${dir#"$PUBLIC_DIR"/}"
  local images_json="[]" fpath fn obj
  while IFS= read -r fpath; do
    fn="$(basename "$fpath")"
    if [ -n "$header_file" ] && [ "$fn" = "$header_file" ]; then
      continue
    fi
    obj="$(jq -n --arg src "/$rel/$fn" --arg alt "$name" '{src:$src, alt:$alt}')"
    images_json="$(json_push "$images_json" "$obj")"
  done < <(find "$dir" -maxdepth 1 -type f ! -name 'manifest.md' ! -name '.*' | sort)
  printf '%s' "$images_json"
}

# ---------------------------------------------------------------------------
# Writings tree: a `projects` folder holds a mix of `projects` / `writing`
# children under `children`; `writing` is a leaf (see build_writing_images
# above for how its images are collected).
# ---------------------------------------------------------------------------
build_writings_node() {
  local dir="$1"
  local id; id="$(basename "$dir")"
  local pdir; pdir="$(parse_manifest_md "$dir/manifest.md")"; check_failed
  local type; type="$(front_get "$pdir" Type)"
  local rel; rel="${dir#"$PUBLIC_DIR"/}"

  case "$type" in
    projects)
      local name synopsis write_up thumbnail_file header_file thumbnail="" header_image=""
      name="$(front_get "$pdir" Name)"
      synopsis="$(section_get "$pdir" "Synopsis")"
      write_up="$(write_up_get "$dir" "$pdir")"
      thumbnail_file="$(front_get "$pdir" Thumbnail)"
      if [ -n "$thumbnail_file" ]; then
        if [ -f "$dir/$thumbnail_file" ]; then
          thumbnail="/$rel/$thumbnail_file"
        else
          echo "warning: $dir/manifest.md references missing thumbnail '$thumbnail_file'" >&2
        fi
      fi
      header_file="$(front_get "$pdir" "Header Image")"
      if [ -n "$header_file" ]; then
        if [ -f "$dir/$header_file" ]; then
          header_image="/$rel/$header_file"
        else
          echo "warning: $dir/manifest.md references missing header image '$header_file'" >&2
        fi
      fi

      local children_json="[]" sub node
      while IFS= read -r sub; do
        node="$(build_writings_node "$sub")"; check_failed
        children_json="$(json_push "$children_json" "$node")"
      done < <(ordered_children "$dir")
      check_failed

      jq -n --arg id "$id" --arg name "$name" --arg synopsis "$synopsis" --arg write_up "$write_up" \
            --arg thumbnail "$thumbnail" --arg header_image "$header_image" --argjson children "$children_json" '
        {id:$id, type:"project", name:$name, synopsis:$synopsis, write_up:$write_up}
        + (if $thumbnail != "" then {thumbnail:$thumbnail} else {} end)
        + (if $header_image != "" then {header_image:$header_image} else {} end)
        + {children:$children}
      '
      ;;
    writing)
      local name synopsis write_up layout grid_columns header_file header_image="" thumbnail_file thumbnail=""
      name="$(front_get "$pdir" Name)"
      synopsis="$(section_get "$pdir" "Synopsis")"
      write_up="$(write_up_get "$dir" "$pdir")"
      layout="$(front_get "$pdir" Layout)"
      [ -n "$layout" ] || layout="simple"
      grid_columns="$(front_get "$pdir" "Grid Columns")"
      thumbnail_file="$(front_get "$pdir" Thumbnail)"
      if [ -n "$thumbnail_file" ]; then
        if [ -f "$dir/$thumbnail_file" ]; then
          thumbnail="/$rel/$thumbnail_file"
        else
          echo "warning: $dir/manifest.md references missing thumbnail '$thumbnail_file'" >&2
        fi
      fi
      header_file="$(front_get "$pdir" "Header Image")"
      if [ -n "$header_file" ]; then
        if [ -f "$dir/$header_file" ]; then
          header_image="/$rel/$header_file"
        else
          echo "warning: $dir/manifest.md references missing header image '$header_file'" >&2
          header_file=""
        fi
      fi

      local images_json; images_json="$(build_writing_images "$dir" "$name" "$header_file")"

      jq -n --arg id "$id" --arg name "$name" --arg synopsis "$synopsis" --arg write_up "$write_up" \
            --arg layout "$layout" --arg grid_columns "${grid_columns:-}" \
            --arg thumbnail "$thumbnail" --arg header_image "$header_image" \
            --argjson images "$images_json" '
        {id:$id, type:"writing", name:$name, synopsis:$synopsis, write_up:$write_up, layout:$layout, images:$images}
        + (if $grid_columns != "" then {grid_columns:($grid_columns|tonumber)} else {} end)
        + (if $thumbnail != "" then {thumbnail:$thumbnail} else {} end)
        + (if $header_image != "" then {header_image:$header_image} else {} end)
      '
      ;;
    *)
      fail "$dir/manifest.md has Type '$type' (expected projects or writing)"
      ;;
  esac
}

echo "Scanning $ARTWORKS_DIR ..." >&2
projects_json="[]"
if [ -d "$ARTWORKS_DIR" ]; then
  while IFS= read -r sub; do
    node="$(build_artworks_node "$sub")"; check_failed
    projects_json="$(json_push "$projects_json" "$node")"
  done < <(ordered_top_level "$ARTWORKS_DIR")
  check_failed
fi

echo "Scanning $WRITINGS_DIR ..." >&2
items_json="[]"
if [ -d "$WRITINGS_DIR" ]; then
  while IFS= read -r sub; do
    node="$(build_writings_node "$sub")"; check_failed
    items_json="$(json_push "$items_json" "$node")"
  done < <(ordered_top_level "$WRITINGS_DIR")
  check_failed
fi

jq -n --argjson projects "$projects_json" --argjson items "$items_json" \
  '{artworks:{projects:$projects}, writings:{items:$items}}' > "$OUT_FILE"

jq empty "$OUT_FILE" || fail "generated manifest is not valid JSON"

echo "Wrote $OUT_FILE" >&2
