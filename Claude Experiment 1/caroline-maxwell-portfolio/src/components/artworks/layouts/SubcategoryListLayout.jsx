import { Link } from 'react-router-dom';
import { getCategoryCoverImage } from '../../../data/manifest';

export default function SubcategoryListLayout({ category, basePath }) {
  const children = category.child_categories || [];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-12">
      {children.map((child) => {
        const cover = getCategoryCoverImage(child);
        return (
          <Link key={child.id} to={`${basePath}/${child.id}`} className="group block">
            {cover && (
              <div className="overflow-hidden bg-panel">
                <img
                  src={cover.src}
                  alt={cover.alt}
                  loading="lazy"
                  className="w-full h-auto aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            )}
            <p className="font-display text-xl text-ink mt-4">{child.name}</p>
            {child.write_up && (
              <p className="text-ink-soft text-sm mt-1 max-w-md">{child.write_up}</p>
            )}
          </Link>
        );
      })}
    </div>
  );
}
