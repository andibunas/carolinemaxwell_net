import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWritingItems, getNodeThumbnail } from '../../data/manifest';

export default function WritingsIndexPage() {
  useEffect(() => {
    document.title = 'Writings — Caroline Maxwell';
  }, []);

  const items = getWritingItems();

  return (
    <div className="mx-auto max-w-3xl px-6 sm:px-8 py-14">
      <h1 className="font-display text-3xl text-ink mb-10">Writings</h1>
      <div className="divide-y divide-line">
        {items.map((item) => {
          const thumbnail = getNodeThumbnail(item);
          return (
            <Link
              key={item.id}
              to={`/writings/${item.id}`}
              className="group flex items-center justify-between gap-6 py-6 first:pt-0"
            >
              <div>
                <p className="font-display text-xl text-ink group-hover:text-gold transition-colors">
                  {item.name}
                </p>
                {item.synopsis && (
                  <p className="text-ink-soft text-sm mt-1 max-w-lg">{item.synopsis}</p>
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
    </div>
  );
}
