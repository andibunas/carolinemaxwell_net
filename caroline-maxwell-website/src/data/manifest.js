import manifest from '../content/manifest.json';

// ---------- Artworks ----------

export function getArtworkProjects() {
  return manifest.artworks.projects;
}

export function getNodeThumbnail(node) {
  if (node.thumbnail) {
    return { src: node.thumbnail, alt: node.type === 'artwork' ? node.title : node.name };
  }
  if (node.type === 'artwork' && node.images.length > 0) {
    const img = node.images.find((i) => i.is_primary) || node.images[0];
    return { src: img.src, alt: img.alt };
  }
  if (node.type === 'writing' && node.header_image) {
    return { src: node.header_image, alt: node.name };
  }
  return null;
}

export function getHeaderImage(node) {
  return node.header_image ? { src: node.header_image, alt: node.name } : null;
}

/**
 * Resolve a splat path (array of slug segments) against the artworks tree.
 * Returns { kind: 'project' | 'artwork', node, ancestors } or null if not found.
 * ancestors is the array of Project nodes from top-level down to (but not
 * including) the resolved node.
 */
export function resolveArtworkPath(segments) {
  if (!segments || segments.length === 0) return null;
  let level = manifest.artworks.projects;
  const ancestors = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const isLast = i === segments.length - 1;
    const node = level.find((n) => n.id === seg);
    if (!node) return null;

    if (isLast) {
      return { kind: node.type, node, ancestors };
    }
    if (node.type !== 'project') return null;
    ancestors.push(node);
    level = node.children || [];
  }
  return null;
}

export function getLatestArtworkProjects(n = 2) {
  return [...manifest.artworks.projects]
    .filter((c) => !!c.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, n);
}

// ---------- Writings ----------

export function getWritingItems() {
  return manifest.writings.items;
}

/**
 * Resolve a splat path against the writings tree (project / writing / artwork
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
    if (node.type !== 'project') return null; // can't descend further
    ancestors.push(node);
    level = node.children || [];
  }
  return null;
}
