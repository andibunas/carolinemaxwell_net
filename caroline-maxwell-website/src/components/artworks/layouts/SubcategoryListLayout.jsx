import { Link } from 'react-router-dom';
import { getCategoryThumbnail } from '../../../data/manifest';

export default function SubcategoryListLayout({ category, basePath }) {
  const children = category.child_categories || [];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-12">
      {children.map((child) => {
        const thumbnail = getCategoryThumbnail(child);
        return (
          <Link key={child.id} to={`${basePath}/${child.id}`} className="group block">
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
            <p className="font-display text-xl text-ink mt-4">{child.name}</p>
            {child.synopsis && (
              <p className="text-ink-soft text-sm mt-1 max-w-md">{child.synopsis}</p>
            )}
          </Link>
        );
      })}
    </div>
  );
}
