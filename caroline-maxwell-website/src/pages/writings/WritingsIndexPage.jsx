import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWritingItems, getNodeThumbnail } from '../../data/manifest';

export default function WritingsIndexPage() {
  useEffect(() => {
    document.title = 'Caroline Maxwell — Writings';
  }, []);

  const items = getWritingItems();

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 py-14">
      <h1 className="font-display text-3xl text-ink mb-12">Writings</h1>
      <div className="flex flex-col gap-10 md:gap-14">
        {items.map((item) => {
          const thumbnail = getNodeThumbnail(item);
          return (
            <Link
              key={item.id}
              to={`/writings/${item.id}`}
              // Small viewports: stacked column with a divider under every item (even a single one).
              className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-10 pb-10 border-b border-ink/10 md:pb-0 md:border-b-0"
            >
              {thumbnail && (
                <div className="flex items-center justify-center h-64 md:w-80 md:shrink-0 overflow-hidden">
                  <img
                    src={thumbnail.src}
                    alt={thumbnail.alt}
                    loading="lazy"
                    className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-display text-xl text-ink group-hover:text-gold transition-colors">
                  {item.name}
                </p>
                {item.synopsis && (
                  <p className="text-ink-soft text-sm mt-1 max-w-md">{item.synopsis}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
