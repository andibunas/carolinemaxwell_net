import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/layout/Breadcrumb';
import MarkdownContent from '../../components/about/MarkdownContent';
import WritingProjectLayout from '../../components/writings/layouts/WritingProjectLayout';
import WritingDetailLayout from '../../components/writings/layouts/WritingDetailLayout';
import { resolveWritingPath } from '../../data/manifest';
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
      document.title = `${resolved.node.name} — Caroline Maxwell`;
    }
  }, [resolved]);

  if (!resolved) return <NotFoundPage />;

  const trail = buildTrail(resolved.ancestors);
  const basePath = `/writings/${segments.join('/')}`;
  const { node } = resolved;

  return (
    <div className="mx-auto max-w-3xl px-6 sm:px-8 py-14">
      <Breadcrumb trail={trail} current={node.name} />

      {node.type === 'project' && (
        <>
          {node.write_up && <MarkdownContent source={node.write_up} className="max-w-2xl mt-4" />}
          <WritingProjectLayout node={node} basePath={basePath} />
        </>
      )}

      {node.type === 'writing' && <WritingDetailLayout node={node} />}
    </div>
  );
}
