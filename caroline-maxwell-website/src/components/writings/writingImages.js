// Write Up text can place a writing's own images inline with markers like
// [filename.svg] or [filename] (extension optional). This resolves those
// markers against a node's `images` array for the two layout styles.

const MARKER_RE = /\[([^[\]\n]+)]/g;

function basename(src) {
  return src.split('/').pop();
}

function stem(src) {
  return basename(src).replace(/\.[^.]+$/, '');
}

function matchImage(images, token) {
  const norm = token.trim().toLowerCase();
  return (
    images.find((img) => basename(img.src).toLowerCase() === norm) ||
    images.find((img) => stem(img.src).toLowerCase() === norm) ||
    null
  );
}

// 'simple' layout: ordered text/image segments, splitting only at markers
// that resolve to a real image so stray `[...]` text is left untouched.
export function splitWritingSegments(writeUp, images) {
  const text = writeUp || '';
  const segments = [];
  let lastIndex = 0;
  MARKER_RE.lastIndex = 0;
  let match;
  while ((match = MARKER_RE.exec(text))) {
    const image = matchImage(images, match[1]);
    if (!image) continue;
    if (match.index > lastIndex) {
      segments.push({ type: 'text', text: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'image', image });
    lastIndex = MARKER_RE.lastIndex;
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', text: text.slice(lastIndex) });
  }
  return segments;
}

// 'grid-top' / 'grid-bottom' layouts: markers are stripped from the text and
// their resolved images (first-appearance order) become the grid. Falls
// back to every image in the folder when no marker resolves.
export function extractGridContent(writeUp, images) {
  const text = writeUp || '';
  const seen = new Set();
  const gridImages = [];
  let strippedText = text.replace(MARKER_RE, (full, token) => {
    const image = matchImage(images, token);
    if (!image) return full;
    if (!seen.has(image.src)) {
      seen.add(image.src);
      gridImages.push(image);
    }
    return '';
  });
  strippedText = strippedText.replace(/\n{3,}/g, '\n\n').trim();
  return { text: strippedText, images: gridImages.length > 0 ? gridImages : images };
}
