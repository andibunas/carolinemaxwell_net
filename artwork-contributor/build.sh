#!/usr/bin/env bash
# Build the artwork-contributor packages.
#
#   ./artwork-contributor/build.sh            build both zips
#   ./artwork-contributor/build.sh plugin     build only the plugin zip
#   ./artwork-contributor/build.sh skill      build only the skill zip
#   ./artwork-contributor/build.sh clean      delete both zips
#
# Output goes to the repo root (gitignored):
#   artwork-contributor-plugin.zip   plugin: .claude-plugin/plugin.json at the archive root
#   artwork-contributor-skill.zip    skill:  SKILL.md at the archive root

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$HERE/.." && pwd)"
SKILL_DIR="$HERE/skills/artwork-contributor"
TARGET="${1:-all}"

case "$TARGET" in
  all|plugin|skill|clean) ;;
  *) echo "Usage: $0 [all|plugin|skill|clean]" >&2; exit 1 ;;
esac

clean() {
  rm -f "$REPO_ROOT/artwork-contributor-plugin.zip" "$REPO_ROOT/artwork-contributor-skill.zip"
  echo "Removed artwork-contributor-plugin.zip and artwork-contributor-skill.zip (if present)"
}

build_plugin() {
  local out="$REPO_ROOT/artwork-contributor-plugin.zip"
  rm -f "$out"
  (cd "$HERE" && zip -qr "$out" .claude-plugin README.md skills -x "*/__pycache__/*" "*.DS_Store")
  check_root "$out" ".claude-plugin/plugin.json"
  echo "Built $out"
}

build_skill() {
  local out="$REPO_ROOT/artwork-contributor-skill.zip"
  rm -f "$out"
  (cd "$SKILL_DIR" && zip -qr "$out" . -x "*/__pycache__/*" "*.DS_Store")
  check_root "$out" "SKILL.md"
  echo "Built $out"
}

# Fail if the required entry is not at the archive root (claude.ai rejects wrapped archives).
check_root() {
  local zipfile="$1" entry="$2"
  local listing
  listing="$(unzip -Z1 "$zipfile")"
  if ! grep -Fxq "$entry" <<<"$listing"; then
    echo "ERROR: $entry is not at the root of $(basename "$zipfile")" >&2
    exit 1
  fi
}

case "$TARGET" in
  all)    build_plugin; build_skill ;;
  plugin) build_plugin ;;
  skill)  build_skill ;;
  clean)  clean ;;
esac
