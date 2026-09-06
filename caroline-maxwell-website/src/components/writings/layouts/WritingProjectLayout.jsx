import { Link } from 'react-router-dom';
import { writingDisplayName } from '../../../data/manifest';

export default function WritingProjectLayout({ node, basePath }) {
  const children = node.children || [];
  return (
    <div className="mt-12 divide-y divide-line">
      {children.map((child) => (
        <Link
          key={child.id}
          to={`${basePath}/${child.id}`}
          className="group flex items-baseline justify-between gap-6 py-6 first:pt-0"
        >
          <div>
            <p className="font-display text-xl text-ink group-hover:text-gold transition-colors">
              {writingDisplayName(child)}
            </p>
            {child.write_up && (
              <p className="text-ink-soft text-sm mt-1 max-w-lg">{child.write_up}</p>
            )}
          </div>
          <span className="text-ink-faint text-xs whitespace-nowrap">
            {child.type === 'project' ? 'Collection' : child.type === 'artwork' ? 'Artwork' : 'Writing'}
          </span>
        </Link>
      ))}
    </div>
  );
}
