import { Link } from 'react-router-dom';
import { getNodeThumbnail } from '../../data/manifest';

// `indexStyle` matches the Artworks index cards: fixed-height contained thumbnail,
// display-font title with gold hover. `className` lets the parent add dividers.
export default function ChildCard({ node, to, indexStyle = false, className = '' }) {
  const thumbnail = getNodeThumbnail(node);
  const isArtwork = node.type === 'artwork';
  const title = isArtwork ? node.title : node.name;
  const subtitle = isArtwork ? [node.medium, node.size].filter(Boolean).join(', ') : node.synopsis;

  if (indexStyle) {
    return (
      <Link to={to} className={`group block ${className}`}>
        {thumbnail && (
          <div className="flex items-center justify-center h-64 overflow-hidden">
            <img
              src={thumbnail.src}
              alt={thumbnail.alt}
              loading="lazy"
              className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        )}
        <p className="mt-4 flex items-baseline gap-3">
          <span className="font-display text-xl text-ink group-hover:text-gold transition-colors">
            {title}
          </span>
          {!isArtwork && <span className="text-sm text-ink-soft">View collection</span>}
        </p>
        {subtitle && <p className="text-ink-soft text-sm mt-1 max-w-md">{subtitle}</p>}
      </Link>
    );
  }

  return (
    <Link to={to} className={`group block ${className}`}>
      {thumbnail && (
        <div className="overflow-hidden bg-panel">
          <img
            src={thumbnail.src}
            alt={thumbnail.alt}
            loading="lazy"
            className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="mt-3">
        <p className="flex items-baseline gap-2">
          <span className="text-ink text-sm">{title}</span>
          {!isArtwork && <span className="text-xs text-ink-soft">View collection</span>}
        </p>
        {subtitle && <p className="text-ink-faint text-xs mt-0.5">{subtitle}</p>}
      </div>
    </Link>
  );
}
