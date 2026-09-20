#!/usr/bin/env bash
#
# Generates src/content/manifest.json by scanning public/gallery,
# public/field-offices, and public/animal-reports. See
# scripts/MANIFEST_FORMAT.md for the manifest.md convention each folder
# follows. None of these trees nest -- every folder directly under a
# section root is one leaf entry.
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUBLIC_DIR="$ROOT_DIR/public"
GALLERY_DIR="$PUBLIC_DIR/gallery"
OFFICES_DIR="$PUBLIC_DIR/field-offices"
ANIMALS_DIR="$PUBLIC_DIR/animal-reports"
OUT_FILE="$ROOT_DIR/src/content/manifest.json"

if ! command -v jq >/dev/null 2>&1; then
  echo "error: jq is required (brew install jq)" >&2
  exit 1
fi

WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT
FAILFILE="$WORKDIR/FAILED"

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
  jq -c --argjson o "$2" '. + [$o]' <<<"$1"
}

# One entry object per `### Title` subsection of a section file. Fields
# read: Medium, Size, Image, Video (Medium/Size optional, used by gallery
# only; an entry needs at least one of Image/Video). Any text after the
# Key: value lines is that entry's own write-up.
parse_leaf_entries() {
  local section_file="$1" dir="$2" rel="$3"
  local entries_json="[]"
  [ -f "$section_file" ] || { printf '%s' "$entries_json"; return; }

  local edir; edir="$(mktemp -d "$WORKDIR/entry.XXXXXX")"
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

  local n=1 efile title medium size image video write_up slug
  local slugs_seen=" "
  while [ -f "$edir/_title_$n.txt" ]; do
    title="$(cat "$edir/_title_$n.txt")"
    efile="$edir/_entry_$n.md"
    medium="$(grep -m1 '^Medium:' "$efile" 2>/dev/null | sed -E 's/^Medium:[[:space:]]*//')"
    size="$(grep -m1 '^Size:' "$efile" 2>/dev/null | sed -E 's/^Size:[[:space:]]*//')"
    image="$(grep -m1 '^Image:' "$efile" 2>/dev/null | sed -E 's/^Image:[[:space:]]*//')"
    video="$(grep -m1 '^Video:' "$efile" 2>/dev/null | sed -E 's/^Video:[[:space:]]*//')"
    write_up="$(awk '
      BEGIN { skipping = 1 }
      /^(Medium|Size|Image|Video):/ { next }
      skipping && /^[[:space:]]*$/ { next }
      { skipping = 0; lines[++n] = $0 }
      END { last = n; while (last > 0 && lines[last] == "") last--; for (i = 1; i <= last; i++) print lines[i] }
    ' "$efile")"

    if [ -n "$image" ] && [ ! -f "$dir/$image" ]; then
      echo "warning: $dir/manifest.md entry '$title' has missing/invalid Image '$image'" >&2
      n=$((n + 1))
      continue
    fi
    if [ -n "$video" ] && [ ! -f "$dir/$video" ]; then
      echo "warning: $dir/manifest.md entry '$title' has missing/invalid Video '$video'" >&2
      n=$((n + 1))
      continue
    fi
    if [ -z "$image" ] && [ -z "$video" ]; then
      echo "warning: $dir/manifest.md entry '$title' has no Image or Video" >&2
      n=$((n + 1))
      continue
    fi

    local base_slug; base_slug="$(printf '%s' "$title" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')"
    slug="$base_slug"
    if printf '%s' "$slugs_seen" | grep -q " ${slug} "; then
      local suffix=2
      while printf '%s' "$slugs_seen" | grep -q " ${base_slug}-${suffix} "; do
        suffix=$((suffix + 1))
      done
      echo "warning: $dir/manifest.md has duplicate entry id '$slug' (title '$title'); disambiguating as '${base_slug}-${suffix}'" >&2
      slug="${base_slug}-${suffix}"
    fi
    slugs_seen="${slugs_seen}${slug} "
    local img_src="" video_src=""
    [ -n "$image" ] && img_src="/$rel/$image"
    [ -n "$video" ] && video_src="/$rel/$video"
    entries_json="$(json_push "$entries_json" "$(jq -n \
      --arg id "$slug" --arg title "$title" --arg medium "${medium:-}" --arg size "${size:-}" \
      --arg src "$img_src" --arg video "$video_src" --arg write_up "${write_up:-}" \
      '{id:$id, title:$title, medium:$medium, size:$size, image:$src, video:$video, write_up:$write_up}')")"
    n=$((n + 1))
  done
  printf '%s' "$entries_json"
}

build_gallery_node() {
  local dir="$1" id name thumbnail_file thumbnail="" write_up synopsis rel artworks_json
  id="$(basename "$dir")"
  local pdir; pdir="$(parse_manifest_md "$dir/manifest.md")"; check_failed
  name="$(front_get "$pdir" Name)"
  rel="${dir#"$PUBLIC_DIR"/}"
  thumbnail_file="$(front_get "$pdir" Thumbnail)"
  [ -n "$thumbnail_file" ] && [ -f "$dir/$thumbnail_file" ] && thumbnail="/$rel/$thumbnail_file"
  write_up="$(section_get "$pdir" "Write Up")"
  synopsis="$(section_get "$pdir" "Synopsis")"
  artworks_json="$(parse_leaf_entries "$pdir/_section_artworks.md" "$dir" "$rel")"

  jq -n --arg id "$id" --arg name "$name" --arg thumbnail "$thumbnail" \
        --arg write_up "$write_up" --arg synopsis "$synopsis" --argjson artworks "$artworks_json" '
    {id:$id, name:$name, synopsis:$synopsis, write_up:$write_up, artworks:$artworks}
    + (if $thumbnail != "" then {thumbnail:$thumbnail} else {} end)
  '
}

build_office_node() {
  local dir="$1" id name location thumbnail_file thumbnail="" write_up rel images_json transcript_title transcript_json="null"
  id="$(basename "$dir")"
  local pdir; pdir="$(parse_manifest_md "$dir/manifest.md")"; check_failed
  name="$(front_get "$pdir" Name)"
  location="$(front_get "$pdir" Location)"
  rel="${dir#"$PUBLIC_DIR"/}"
  thumbnail_file="$(front_get "$pdir" Thumbnail)"
  [ -n "$thumbnail_file" ] && [ -f "$dir/$thumbnail_file" ] && thumbnail="/$rel/$thumbnail_file"
  write_up="$(section_get "$pdir" "Write Up")"

  local entries_json; entries_json="$(parse_leaf_entries "$pdir/_section_images.md" "$dir" "$rel")"
  images_json="$(jq -c '[.[] | {src: .image, video: .video, alt: .title, caption: .title, body: .write_up}
    | with_entries(select(.value != ""))]' <<<"$entries_json")"

  transcript_title="$(front_get "$pdir" Transcript)"
  if [ -n "$transcript_title" ] && [ -f "$dir/transcript.md" ]; then
    local body; body="$(strip_leading_blank "$dir/transcript.md")"
    transcript_json="$(jq -n --arg title "$transcript_title" --arg body "$body" '{title:$title, body:$body}')"
  fi

  jq -n --arg id "$id" --arg name "$name" --arg location "$location" --arg thumbnail "$thumbnail" \
        --arg write_up "$write_up" --argjson images "$images_json" --argjson transcript "$transcript_json" '
    {id:$id, name:$name, location:$location, write_up:$write_up, images:$images, transcript:$transcript}
    + (if $thumbnail != "" then {thumbnail:$thumbnail} else {} end)
  '
}

build_animal_node() {
  local dir="$1" id name rel reports_json entries_json
  id="$(basename "$dir")"
  local pdir; pdir="$(parse_manifest_md "$dir/manifest.md")"; check_failed
  name="$(front_get "$pdir" Name)"
  rel="${dir#"$PUBLIC_DIR"/}"

  entries_json="$(parse_leaf_entries "$pdir/_section_reports.md" "$dir" "$rel")"
  reports_json="$(jq -c '[.[] | {id: .id, label: .title, thumbnail: .image, image: .image}]' <<<"$entries_json")"

  jq -n --arg id "$id" --arg name "$name" --argjson reports "$reports_json" \
    '{id:$id, name:$name, reports:$reports}'
}

echo "Scanning $GALLERY_DIR ..." >&2
gallery_json="[]"
if [ -d "$GALLERY_DIR" ]; then
  while IFS= read -r sub; do
    node="$(build_gallery_node "$sub")"; check_failed
    gallery_json="$(json_push "$gallery_json" "$node")"
  done < <(ordered_children "$GALLERY_DIR")
  check_failed
fi

echo "Scanning $OFFICES_DIR ..." >&2
offices_json="[]"
if [ -d "$OFFICES_DIR" ]; then
  while IFS= read -r sub; do
    node="$(build_office_node "$sub")"; check_failed
    offices_json="$(json_push "$offices_json" "$node")"
  done < <(ordered_children "$OFFICES_DIR")
  check_failed
fi

echo "Scanning $ANIMALS_DIR ..." >&2
animals_json="[]"
if [ -d "$ANIMALS_DIR" ]; then
  while IFS= read -r sub; do
    node="$(build_animal_node "$sub")"; check_failed
    animals_json="$(json_push "$animals_json" "$node")"
  done < <(ordered_children "$ANIMALS_DIR")
  check_failed
fi

jq -n --argjson gallery "$gallery_json" --argjson fieldOffices "$offices_json" --argjson animalReports "$animals_json" \
  '{gallery:$gallery, fieldOffices:$fieldOffices, animalReports:$animalReports}' > "$OUT_FILE"

jq empty "$OUT_FILE" || fail "generated manifest is not valid JSON"

echo "Wrote $OUT_FILE" >&2
