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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
        {items.map((item, index) => {
          const thumbnail = getNodeThumbnail(item);
          // Divider only on items not in the first row, which depends on the column count.
          const divider = [
            index > 0 && 'pt-10 border-t border-ink/10',
            index < 2 && 'sm:pt-0 sm:border-t-0',
            index < 3 && 'lg:pt-0 lg:border-t-0',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <Link
              key={item.id}
              to={`/writings/${item.id}`}
              className={`group block ${divider}`}
            >
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
              <p className="font-display text-xl text-ink mt-4 group-hover:text-gold transition-colors">
                {item.name}
              </p>
              {item.synopsis && (
                <p className="text-ink-soft text-sm mt-1 max-w-md">{item.synopsis}</p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
