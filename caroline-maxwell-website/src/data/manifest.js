import manifest from '../content/manifest.json';

// ---------- Artworks ----------

export function getArtworkCategories() {
  return manifest.artworks.categories;
}

export function getCategoryThumbnail(category) {
  return category.thumbnail ? { src: category.thumbnail, alt: category.name } : null;
}

export function getCategoryHeaderImage(category) {
  return category.header_image ? { src: category.header_image, alt: category.name } : null;
}

/**
 * Resolve a splat path (array of slug segments) against the artworks tree.
 * Returns { kind: 'category' | 'artwork', node, ancestors } or null if not found.
 * ancestors is the array of Category nodes from top-level down to (but not
 * including) the resolved node.
 */
export function resolveArtworkPath(segments) {
  if (!segments || segments.length === 0) return null;
  let levelCategories = manifest.artworks.categories;
  const ancestors = [];
  let current = null;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const isLast = i === segments.length - 1;

    const category = levelCategories.find((c) => c.id === seg);
    if (category) {
      if (isLast) {
        return { kind: 'category', node: category, ancestors };
      }
      ancestors.push(category);
      levelCategories = category.child_categories || [];
      current = category;
      continue;
    }

    // Not a category at this level — check if it's an artwork within the
    // most recently matched category (must be the last segment).
    if (isLast && current) {
      const artwork = (current.artworks || []).find((a) => a.id === seg);
      if (artwork) {
        return { kind: 'artwork', node: artwork, ancestors };
      }
    }
    return null;
  }
  return null;
}

export function getLatestArtworkCategories(n = 2) {
  return [...manifest.artworks.categories]
    .filter((c) => !!c.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, n);
}

// ---------- Writings ----------

export function getWritingItems() {
  return manifest.writings.items;
}

/**
 * Resolve a splat path against the writings tree (category / writing / artwork
 * discriminated union). Returns { node, ancestors } or null.
 */
export function resolveWritingPath(segments) {
  if (!segments || segments.length === 0) return null;
  let level = manifest.writings.items;
  const ancestors = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const isLast = i === segments.length - 1;
    const node = level.find((n) => n.id === seg);
    if (!node) return null;

    if (isLast) {
      return { node, ancestors };
    }
    if (node.type !== 'category') return null; // can't descend further
    ancestors.push(node);
    level = node.children || [];
  }
  return null;
}

export function writingDisplayName(node) {
  return node.type === 'artwork' ? node.title : node.name;
}
