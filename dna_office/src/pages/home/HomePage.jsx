import { useQueryNav } from '../../hooks/useQueryNav';

export default function HomePage() {
  const { linkTo } = useQueryNav();
  return (
    <div className="mx-auto max-w-3xl px-6 sm:px-8 py-16">
      <h1 className="font-display text-3xl mb-4">Department of Nocturnal Affairs</h1>
      <p className="text-ink-soft leading-relaxed mb-8">
        A collaborative installation and performance project by Caroline Maxwell and Tal Yizrael, collecting reports
        of nocturnal wildlife sightings from field offices opened in public spaces around the world.
      </p>
      <div className="flex flex-wrap gap-4 text-sm">
        <a {...linkTo({ section: 'field-offices' })} className="underline decoration-glow hover:text-glow">
          Visit the Field Offices
        </a>
        <a {...linkTo({ section: 'animal-reports' })} className="underline decoration-glow hover:text-glow">
          Browse Animal Reports
        </a>
        <a {...linkTo({ section: 'gallery' })} className="underline decoration-glow hover:text-glow">
          View the Art Gallery
        </a>
      </div>
    </div>
  );
}
