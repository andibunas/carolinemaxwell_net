import { Suspense, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/layout/Breadcrumb';
import ArtworkDetail from '../../components/artworks/ArtworkDetail';
import { resolveArtworkPath, getCategoryHeaderImage } from '../../data/manifest';
import { resolveArtworkLayout } from '../../components/artworks/layoutRegistry';
import NotFoundPage from '../NotFoundPage';

function buildTrail(ancestors) {
  const trail = [{ label: 'Artworks', to: '/artworks' }];
  const acc = [];
  ancestors.forEach((ancestor) => {
    acc.push(ancestor.id);
    trail.push({ label: ancestor.name, to: `/artworks/${acc.join('/')}` });
  });
  return trail;
}

export default function ArtworksCategoryPage() {
  const params = useParams();
  const segments = (params['*'] || '').split('/').filter(Boolean);
  const resolved = resolveArtworkPath(segments);

  useEffect(() => {
    if (resolved) {
      const name = resolved.kind === 'artwork' ? resolved.node.title : resolved.node.name;
      document.title = `${name} — Caroline Maxwell`;
    }
  }, [resolved]);

  if (!resolved) return <NotFoundPage />;

  const trail = buildTrail(resolved.ancestors);
  const basePath = `/artworks/${segments.join('/')}`;

  if (resolved.kind === 'artwork') {
    const artwork = resolved.node;
    return (
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-14">
        <Breadcrumb trail={trail} current={artwork.title} />
        <ArtworkDetail artwork={artwork} />
      </div>
    );
  }

  const category = resolved.node;
  const LayoutComponent = resolveArtworkLayout(category.layout_type);
  const headerImage = getCategoryHeaderImage(category);

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 py-14">
      <Breadcrumb trail={trail} current={category.name} />
      {headerImage && (
        <div className="overflow-hidden bg-panel mt-6">
          <img
            src={headerImage.src}
            alt={headerImage.alt}
            className="w-full h-auto max-h-[50vh] object-cover"
          />
        </div>
      )}
      {category.write_up && (
        <p className="text-ink-soft text-base leading-relaxed max-w-2xl mt-4">
          {category.write_up}
        </p>
      )}
      <Suspense fallback={<p className="text-ink-faint text-sm mt-12">Loading…</p>}>
        <LayoutComponent category={category} basePath={basePath} />
      </Suspense>
    </div>
  );
}
