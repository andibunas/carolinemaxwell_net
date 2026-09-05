import { Link } from 'react-router-dom';
import ArtworkCard from '../ArtworkCard';

export default function FeaturedLayout({ category, basePath }) {
  const artworks = category.artworks || [];
  const featured = artworks[0];
  const rest = artworks.filter((a) => a.id !== featured?.id);
  const featuredImage = featured?.images.find((i) => i.is_primary) || featured?.images[0];

  return (
    <div className="mt-12">
      {featured && (
        <Link to={`${basePath}/${featured.id}`} className="group block mb-14">
          <div className="overflow-hidden bg-panel">
            <img
              src={featuredImage.src}
              alt={featuredImage.alt}
              className="w-full h-auto max-h-[70vh] object-cover transition-transform duration-700 group-hover:scale-[1.015]"
            />
          </div>
          <div className="mt-4 flex items-baseline justify-between gap-4">
            <p className="font-display text-xl text-ink">{featured.title}</p>
            <p className="text-ink-faint text-sm whitespace-nowrap">
              {featured.medium}
              {featured.size ? `, ${featured.size}` : ''}
            </p>
          </div>
        </Link>
      )}

      {rest.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
          {rest.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} to={`${basePath}/${artwork.id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
