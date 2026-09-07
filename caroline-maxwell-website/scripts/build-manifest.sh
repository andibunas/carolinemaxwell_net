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

section_get() {
  local pdir="$1" name="$2"
  local slug; slug="$(printf '%s' "$name" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/_/g; s/^_+|_+$//g')"
  local f="$pdir/_section_${slug}.md"
  [ -f "$f" ] || { printf ''; return; }
  awk 'BEGIN{started=0} !started && /^[[:space:]]*$/ {next} {started=1; print}' "$f"
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

build_artworks_node() {
  local dir="$1"
  local id; id="$(basename "$dir")"
  local pdir; pdir="$(parse_manifest_md "$dir/manifest.md")"; check_failed
  local type; type="$(front_get "$pdir" Type)"
  local name layout date write_up synopsis
  name="$(front_get "$pdir" Name)"
  layout="$(front_get "$pdir" Layout)"
  date="$(front_get "$pdir" Date)"
  write_up="$(section_get "$pdir" "Write Up")"
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
# Writings tree only: Artwork node with Title / Medium / Size + an image list
# built from the folder's own image files, optionally annotated by a
# `## Images` section of the form
#   - filename.ext | alt text | primary
# Any image file present on disk but not listed in that section is appended
# automatically (alt text falls back to the artwork's title). If no image is
# marked "primary", the first one is used.
# ---------------------------------------------------------------------------
build_artwork_node() {
  local dir="$1"
  local id; id="$(basename "$dir")"
  local pdir; pdir="$(parse_manifest_md "$dir/manifest.md")"; check_failed
  local type; type="$(front_get "$pdir" Type)"
  [ "$type" = "Artwork" ] || fail "$dir/manifest.md has Type '$type' (expected Artwork)"
  local title medium size rel
  title="$(front_get "$pdir" Title)"
  medium="$(front_get "$pdir" Medium)"
  size="$(front_get "$pdir" Size)"
  rel="${dir#"$PUBLIC_DIR"/}"

  local thumbnail_file thumbnail=""
  thumbnail_file="$(front_get "$pdir" Thumbnail)"
  if [ -n "$thumbnail_file" ]; then
    if [ -f "$dir/$thumbnail_file" ]; then
      thumbnail="/$rel/$thumbnail_file"
    else
      echo "warning: $dir/manifest.md references missing thumbnail '$thumbnail_file'" >&2
    fi
  fi

  local names=() alts=() primaries=() have_primary=0
  local declared="$pdir/_section_images.md"
  if [ -f "$declared" ]; then
    local line fn alt flag found n
    while IFS= read -r line; do
      [[ "$line" =~ ^-[[:space:]] ]] || continue
      line="${line#-}"
      IFS='|' read -r fn alt flag <<<"$line"
      fn="$(printf '%s' "$fn" | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//')"
      alt="$(printf '%s' "${alt:-}" | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//')"
      flag="$(printf '%s' "${flag:-}" | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//')"
      if [ ! -f "$dir/$fn" ]; then
        echo "warning: $dir/manifest.md references missing image '$fn'" >&2
        continue
      fi
      names+=("$fn")
      if [ -z "$alt" ]; then alt="$title"; fi
      alts+=("$alt")
      if [ "$flag" = "primary" ]; then
        primaries+=("true")
        have_primary=1
      else
        primaries+=("false")
      fi
    done < "$declared"
  fi

  local fpath fn found n
  while IFS= read -r fpath; do
    fn="$(basename "$fpath")"
    found=0
    for n in "${names[@]:-}"; do
      if [ "$n" = "$fn" ]; then
        found=1
        break
      fi
    done
    if [ "$found" = 1 ]; then
      continue
    fi
    names+=("$fn")
    alts+=("$title")
    primaries+=("false")
  done < <(find "$dir" -maxdepth 1 -type f ! -name 'manifest.md' ! -name '.*' | sort)

  if [ "$have_primary" = 0 ] && [ "${#names[@]}" -gt 0 ]; then
    primaries[0]="true"
  fi

  local images_json="[]" i obj
  for i in "${!names[@]}"; do
    obj="$(jq -n --arg src "/$rel/${names[$i]}" --arg alt "${alts[$i]}" --argjson primary "${primaries[$i]}" \
      '{src:$src, alt:$alt, is_primary:$primary}')"
    images_json="$(json_push "$images_json" "$obj")"
  done

  jq -n --arg id "$id" --arg title "$title" --arg medium "$medium" --arg size "$size" \
        --arg thumbnail "$thumbnail" --argjson images "$images_json" \
    '{id:$id, type:"artwork", title:$title, medium:$medium, size:$size, images:$images}
    + (if $thumbnail != "" then {thumbnail:$thumbnail} else {} end)'
}

# ---------------------------------------------------------------------------
# Writings tree: a Project holds a mix of Project / Writing / Artwork
# children under `children`; Writing and Artwork are leaves.
# ---------------------------------------------------------------------------
build_writings_node() {
  local dir="$1"
  local id; id="$(basename "$dir")"
  local pdir; pdir="$(parse_manifest_md "$dir/manifest.md")"; check_failed
  local type; type="$(front_get "$pdir" Type)"

  case "$type" in
    Project)
      local name write_up; name="$(front_get "$pdir" Name)"; write_up="$(section_get "$pdir" "Write Up")"
      local children_json="[]" sub node
      while IFS= read -r sub; do
        node="$(build_writings_node "$sub")"; check_failed
        children_json="$(json_push "$children_json" "$node")"
      done < <(ordered_children "$dir")
      check_failed
      jq -n --arg id "$id" --arg name "$name" --arg write_up "$write_up" --argjson children "$children_json" \
        '{id:$id, type:"project", name:$name, write_up:$write_up, children:$children}'
      ;;
    Writing)
      local name write_up writing
      name="$(front_get "$pdir" Name)"
      write_up="$(section_get "$pdir" "Write Up")"
      writing="$(section_get "$pdir" "Writing")"
      jq -n --arg id "$id" --arg name "$name" --arg write_up "$write_up" --arg writing "$writing" \
        '{id:$id, type:"writing", name:$name, write_up:$write_up, writing:$writing}'
      ;;
    Artwork)
      build_artwork_node "$dir"; check_failed
      ;;
    *)
      fail "$dir/manifest.md has Type '$type' (expected Project, Writing or Artwork)"
      ;;
  esac
}

echo "Scanning $ARTWORKS_DIR ..." >&2
projects_json="[]"
if [ -d "$ARTWORKS_DIR" ]; then
  while IFS= read -r sub; do
    node="$(build_artworks_node "$sub")"; check_failed
    projects_json="$(json_push "$projects_json" "$node")"
  done < <(ordered_children "$ARTWORKS_DIR")
  check_failed
fi

echo "Scanning $WRITINGS_DIR ..." >&2
items_json="[]"
if [ -d "$WRITINGS_DIR" ]; then
  while IFS= read -r sub; do
    node="$(build_writings_node "$sub")"; check_failed
    items_json="$(json_push "$items_json" "$node")"
  done < <(ordered_children "$WRITINGS_DIR")
  check_failed
fi

jq -n --argjson projects "$projects_json" --argjson items "$items_json" \
  '{artworks:{projects:$projects}, writings:{items:$items}}' > "$OUT_FILE"

jq empty "$OUT_FILE" || fail "generated manifest is not valid JSON"

echo "Wrote $OUT_FILE" >&2
