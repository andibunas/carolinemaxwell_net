import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWritingItems, writingDisplayName } from '../../data/manifest';

export default function WritingsIndexPage() {
  useEffect(() => {
    document.title = 'Writings — Caroline Maxwell';
  }, []);

  const items = getWritingItems();

  return (
    <div className="mx-auto max-w-3xl px-6 sm:px-8 py-14">
      <h1 className="font-display text-3xl text-ink mb-10">Writings</h1>
      <div className="divide-y divide-line">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/writings/${item.id}`}
            className="group flex items-baseline justify-between gap-6 py-6 first:pt-0"
          >
            <div>
              <p className="font-display text-xl text-ink group-hover:text-gold transition-colors">
                {writingDisplayName(item)}
              </p>
              {item.write_up && (
                <p className="text-ink-soft text-sm mt-1 max-w-lg">{item.write_up}</p>
              )}
            </div>
            <span className="text-ink-faint text-xs whitespace-nowrap">
              {item.type === 'project' ? 'Collection' : item.type === 'artwork' ? 'Artwork' : 'Writing'}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
