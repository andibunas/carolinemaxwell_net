import { Link } from 'react-router-dom';
import { getNodeThumbnail } from '../../../data/manifest';

export default function WritingProjectLayout({ node, basePath }) {
  const children = node.children || [];
  return (
    <div className="mt-12 divide-y divide-line">
      {children.map((child) => {
        const thumbnail = getNodeThumbnail(child);
        return (
          <Link
            key={child.id}
            to={`${basePath}/${child.id}`}
            className="group flex items-center justify-between gap-6 py-6 first:pt-0"
          >
            <div>
              <p className="font-display text-xl text-ink group-hover:text-gold transition-colors">
                {child.name}
              </p>
              {child.synopsis && (
                <p className="text-ink-soft text-sm mt-1 max-w-lg">{child.synopsis}</p>
              )}
            </div>
            {thumbnail && (
              <div className="shrink-0 w-20 h-20 overflow-hidden bg-panel">
                <img
                  src={thumbnail.src}
                  alt={thumbnail.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
