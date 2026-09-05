import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArtworkCategories, getCategoryThumbnail } from '../../data/manifest';

export default function ArtworksIndexPage() {
  useEffect(() => {
    document.title = 'Artworks — Caroline Maxwell';
  }, []);

  const categories = getArtworkCategories();

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 py-14">
      <h1 className="font-display text-3xl text-ink mb-12">Artworks</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {categories.map((category) => {
          const thumbnail = getCategoryThumbnail(category);
          return (
            <Link key={category.id} to={`/artworks/${category.id}`} className="group block">
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
              <p className="font-display text-xl text-ink mt-4 group-hover:text-gold transition-colors">
                {category.name}
              </p>
              {category.synopsis && (
                <p className="text-ink-soft text-sm mt-1 max-w-md">{category.synopsis}</p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
