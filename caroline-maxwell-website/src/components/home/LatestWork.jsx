import { Link } from 'react-router-dom';
import homeContent from '../../content/home.json';

// Recent projects are curated in content/home.json. Each entry links either
// internally (`to`) or to an external site (`href`).
function ProjectCard({ project, className }) {
  const body = (
    <>
      <div className="overflow-hidden aspect-[4/3]">
        <img
          src={project.image}
          alt={project.image_alt}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <p className="mt-4 font-display font-bold text-xl text-ink group-hover:text-gold transition-colors">
        {project.title}
      </p>
      {project.synopsis && (
        <p className="text-ink-soft text-sm mt-1 max-w-md">{project.synopsis}</p>
      )}
    </>
  );

  if (project.href) {
    return (
      <a href={project.href} target="_blank" rel="noopener noreferrer" className={`group block ${className}`}>
        {body}
      </a>
    );
  }
  return (
    <Link to={project.to} className={`group block ${className}`}>
      {body}
    </Link>
  );
}

export default function LatestWork() {
  return (
    <section className="mt-20">
      <h2 className="font-display text-2xl text-ink mb-8">{homeContent.recent_projects_heading}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        {homeContent.recent_projects.map((project, index) => (
          <ProjectCard
            key={project.title}
            project={project}
            className={index > 0 ? 'pt-10 border-t border-ink/10 sm:pt-0 sm:border-t-0' : ''}
          />
        ))}
      </div>
    </section>
  );
}
