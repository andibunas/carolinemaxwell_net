import { useQueryNav } from '../../hooks/useQueryNav';
import { getGalleryProjects } from '../../data/manifest';
import ChildCard from '../../components/layout/ChildCard';

export default function GalleryIndexPage() {
  const { linkTo } = useQueryNav();
  const projects = getGalleryProjects();

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 py-12">
      <h1 className="font-display text-2xl mb-2">Art Gallery</h1>
      <p className="text-ink-soft text-sm mb-10">
        Artworks created for the Department of Nocturnal Affairs by Tal Yizrael and Caroline Maxwell.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {projects.map((p) => (
          <ChildCard
            key={p.id}
            linkProps={linkTo({ section: 'gallery', project: p.id })}
            thumbnail={p.thumbnail ? { src: p.thumbnail, alt: p.name } : null}
            title={p.name}
            subtitle={p.synopsis}
          />
        ))}
      </div>
    </div>
  );
}
