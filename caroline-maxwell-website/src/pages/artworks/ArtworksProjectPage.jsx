import { Suspense, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/layout/Breadcrumb';
import ArtworkDetail from '../../components/artworks/ArtworkDetail';
import MarkdownContent from '../../components/about/MarkdownContent';
import { resolveArtworkPath, getHeaderImage } from '../../data/manifest';
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

export default function ArtworksProjectPage() {
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

  const project = resolved.node;
  const LayoutComponent = resolveArtworkLayout(project);
  const headerImage = getHeaderImage(project);

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 py-14">
      <Breadcrumb trail={trail} current={project.name} />
      {headerImage && (
        <div className="flex justify-center mt-6">
          <img
            src={headerImage.src}
            alt={headerImage.alt}
            className="w-auto h-auto max-w-full max-h-[50vh] object-contain"
          />
        </div>
      )}
      {project.write_up && (
        <MarkdownContent source={project.write_up} className="max-w-2xl mt-4" />
      )}
      <Suspense fallback={<p className="text-ink-faint text-sm mt-12">Loading…</p>}>
        <LayoutComponent project={project} basePath={basePath} />
      </Suspense>
    </div>
  );
}
