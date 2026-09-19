import { Link } from 'react-router-dom';
import { getLatestArtworkProjects, getNodeThumbnail } from '../../data/manifest';

const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

export default function LatestWork() {
  const projects = getLatestArtworkProjects(2);

  return (
    <section className="mt-20">
      <h2 className="font-display text-2xl text-ink mb-8">Latest work</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        {projects.map((project) => {
          const thumbnail = getNodeThumbnail(project);
          return (
            <Link key={project.id} to={`/artworks/${project.id}`} className="group block">
              {thumbnail && (
                <div className="overflow-hidden bg-panel">
                  <img
                    src={thumbnail.src}
                    alt={thumbnail.alt}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <p className="font-display text-xl text-ink group-hover:text-gold transition-colors">
                  {project.name}
                </p>
                <p className="text-ink-faint text-sm whitespace-nowrap">
                  {dateFormatter.format(new Date(project.date))}
                </p>
              </div>
              {project.synopsis && (
                <p className="text-ink-soft text-sm mt-1 max-w-md">{project.synopsis}</p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
