import { Link } from 'react-router-dom';

export default function ArtworkCard({ artwork, to, image }) {
  const img = image || artwork.images.find((i) => i.is_primary) || artwork.images[0];
  return (
    <Link to={to} className="group block">
      <div className="overflow-hidden bg-panel">
        <img
          src={img.src}
          alt={img.alt}
          loading="lazy"
          className="w-full h-auto aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-3">
        <p className="text-ink text-sm">{artwork.title}</p>
        <p className="text-ink-faint text-xs mt-0.5">{artwork.medium}</p>
        {artwork.size && <p className="text-ink-faint text-xs">{artwork.size}</p>}
      </div>
    </Link>
  );
}
