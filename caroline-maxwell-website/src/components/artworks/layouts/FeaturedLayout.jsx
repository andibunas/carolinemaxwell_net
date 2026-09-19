import { Link } from 'react-router-dom';
import ChildCard from '../ChildCard';
import { getNodeThumbnail } from '../../../data/manifest';

export default function FeaturedLayout({ project, basePath }) {
  const children = project.children || [];
  const featured = children[0];
  const rest = children.slice(1);
  const featuredThumbnail = featured && getNodeThumbnail(featured);
  const isArtwork = featured?.type === 'artwork';
  const featuredTitle = isArtwork ? featured?.title : featured?.name;
  const featuredSubtitle = isArtwork
    ? [featured.medium, featured.size].filter(Boolean).join(', ')
    : featured?.synopsis;

  return (
    <div className="mt-12">
      {featured && featuredThumbnail && (
        <Link to={`${basePath}/${featured.id}`} className="group block mb-14">
          <div className="overflow-hidden bg-panel">
            <img
              src={featuredThumbnail.src}
              alt={featuredThumbnail.alt}
              className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.015]"
            />
          </div>
          <div className="mt-4 flex items-baseline justify-between gap-4">
            <p className="font-display text-xl text-ink">{featuredTitle}</p>
            {featuredSubtitle && (
              <p className="text-ink-faint text-sm whitespace-nowrap">{featuredSubtitle}</p>
            )}
          </div>
        </Link>
      )}

      {rest.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
          {rest.map((child) => (
            <ChildCard key={child.id} node={child} to={`${basePath}/${child.id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
