import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/layout/Breadcrumb';
import ArtworkDetail from '../../components/artworks/ArtworkDetail';
import WritingProjectLayout from '../../components/writings/layouts/WritingProjectLayout';
import WritingDetailLayout from '../../components/writings/layouts/WritingDetailLayout';
import { resolveWritingPath, writingDisplayName } from '../../data/manifest';
import NotFoundPage from '../NotFoundPage';

function buildTrail(ancestors) {
  const trail = [{ label: 'Writings', to: '/writings' }];
  const acc = [];
  ancestors.forEach((ancestor) => {
    acc.push(ancestor.id);
    trail.push({ label: ancestor.name, to: `/writings/${acc.join('/')}` });
  });
  return trail;
}

export default function WritingsNodePage() {
  const params = useParams();
  const segments = (params['*'] || '').split('/').filter(Boolean);
  const resolved = resolveWritingPath(segments);

  useEffect(() => {
    if (resolved) {
      document.title = `${writingDisplayName(resolved.node)} — Caroline Maxwell`;
    }
  }, [resolved]);

  if (!resolved) return <NotFoundPage />;

  const trail = buildTrail(resolved.ancestors);
  const basePath = `/writings/${segments.join('/')}`;
  const { node } = resolved;

  return (
    <div className="mx-auto max-w-3xl px-6 sm:px-8 py-14">
      <Breadcrumb trail={trail} current={writingDisplayName(node)} />

      {node.type === 'project' && (
        <>
          {node.write_up && (
            <p className="text-ink-soft text-base leading-relaxed max-w-2xl mt-4">
              {node.write_up}
            </p>
          )}
          <WritingProjectLayout node={node} basePath={basePath} />
        </>
      )}

      {node.type === 'writing' && <WritingDetailLayout node={node} />}

      {node.type === 'artwork' && <ArtworkDetail artwork={node} />}
    </div>
  );
}
