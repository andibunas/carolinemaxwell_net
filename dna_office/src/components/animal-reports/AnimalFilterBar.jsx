import { useQueryNav } from '../../hooks/useQueryNav';

export default function AnimalFilterBar({ categories, activeSlug }) {
  const { linkTo } = useQueryNav();

  return (
    <nav
      aria-label="Animal category"
      className="flex gap-2 overflow-x-auto chip-scroll flex-nowrap snap-x snap-mandatory py-1 -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap"
    >
      {categories.map((c) => {
        const isActive = c.id === activeSlug;
        return (
          <a
            key={c.id}
            {...linkTo({ section: 'animal-reports', category: c.id })}
            className={`shrink-0 snap-start px-3 py-1.5 text-xs sm:text-sm border rounded-full whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-ink text-paper border-ink'
                : 'bg-panel text-ink-soft border-line hover:border-line-strong hover:text-ink'
            }`}
          >
            {c.name}
          </a>
        );
      })}
    </nav>
  );
}
