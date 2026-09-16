import { useQueryNav } from '../../hooks/useQueryNav';
import { getAnimalCategories, getAnimalCategory } from '../../data/manifest';
import AnimalFilterBar from '../../components/animal-reports/AnimalFilterBar';

export default function AnimalReportsPage() {
  const { params, linkTo } = useQueryNav();
  const categories = getAnimalCategories();
  const categorySlug = params.get('category') || categories[0]?.id;
  const category = getAnimalCategory(categorySlug);
  const activeItemId = params.get('item');
  const activeItem = category?.reports.find((r) => r.id === activeItemId) || category?.reports[0] || null;

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 py-12">
      <h1 className="font-display text-2xl mb-2">Animal Reports</h1>
      <p className="text-ink-soft text-sm mb-6">
        Reports of nocturnal wildlife sightings, filed by category.
      </p>

      <AnimalFilterBar categories={categories} activeSlug={categorySlug} />

      {!category && (
        <p className="text-ink-faint text-sm mt-10">No reports have been filed under that category yet.</p>
      )}

      {category && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-8">
          <div className="flex sm:flex-col gap-3 overflow-x-auto chip-scroll sm:overflow-visible -mx-6 px-6 sm:mx-0 sm:px-0">
            {category.reports.map((r) => (
              <a
                key={r.id}
                {...linkTo({ section: 'animal-reports', category: category.id, item: r.id })}
                className={`shrink-0 w-20 sm:w-full aspect-square overflow-hidden bg-panel border ${
                  activeItem?.id === r.id ? 'border-glow' : 'border-line'
                }`}
              >
                <img src={r.thumbnail} alt={r.label} loading="lazy" className="w-full h-full object-cover" />
              </a>
            ))}
          </div>

          <div>
            {activeItem ? (
              <figure>
                <div className="bg-panel overflow-hidden max-w-xl">
                  <img src={activeItem.image} alt={activeItem.label} className="w-full h-auto object-contain" />
                </div>
                <figcaption className="mt-3 text-ink-faint text-xs italic">{activeItem.label}</figcaption>
              </figure>
            ) : (
              <p className="text-ink-faint text-sm">Select a report to view it.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
