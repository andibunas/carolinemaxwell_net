import { Link } from 'react-router-dom';
import { getNodeThumbnail } from '../../data/manifest';

export default function ChildCard({ node, to }) {
  const thumbnail = getNodeThumbnail(node);
  const isArtwork = node.type === 'artwork';
  const title = isArtwork ? node.title : node.name;
  const subtitle = isArtwork ? [node.medium, node.size].filter(Boolean).join(', ') : node.synopsis;

  return (
    <Link to={to} className="group block">
      {thumbnail && (
        <div className="overflow-hidden bg-panel">
          <img
            src={thumbnail.src}
            alt={thumbnail.alt}
            loading="lazy"
            className="w-full h-auto aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="mt-3">
        <p className="text-ink text-sm">{title}</p>
        {subtitle && <p className="text-ink-faint text-xs mt-0.5">{subtitle}</p>}
      </div>
    </Link>
  );
}
