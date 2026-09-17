import { useQueryNav } from '../../hooks/useQueryNav';
import { getAnimalCategories, getAnimalCategory } from '../../data/manifest';
import AnimalFilterBar from '../../components/animal-reports/AnimalFilterBar';

export default function AnimalReportsPage() {
  const { params, navigate } = useQueryNav();
  const categories = getAnimalCategories();
  const categorySlug = params.get('category') || categories[0]?.id;
  const category = getAnimalCategory(categorySlug);
  const activeItemId = params.get('item');
  const activeItem = category?.reports.find((r) => r.id === activeItemId) || category?.reports[0] || null;
  const activeIndex = category?.reports.findIndex((r) => r.id === activeItem?.id) ?? -1;

  const goToItem = (item) => {
    if (!item) return;
    navigate({ section: 'animal-reports', category: category.id, item: item.id });
  };

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
        <div className="mt-8">
          <div className="flex items-center justify-left gap-2 mb-6 flex-nowrap">
            <button
              type="button"
              onClick={() => goToItem(category.reports[0])}
              disabled={activeIndex <= 0}
              aria-label="Jump to first"
              className="shrink-0 px-2 py-1.5 text-sm border border-line rounded disabled:opacity-30 hover:border-line-strong disabled:hover:border-line"
            >
              &laquo;
            </button>
            <button
              type="button"
              onClick={() => goToItem(category.reports[activeIndex - 1])}
              disabled={activeIndex <= 0}
              aria-label="Jump back one"
              className="shrink-0 px-2 py-1.5 text-sm border border-line rounded disabled:opacity-30 hover:border-line-strong disabled:hover:border-line"
            >
              &lsaquo;
            </button>

            <select
              aria-label="Jump to report"
              value={activeItem?.id || ''}
              onChange={(e) => goToItem(category.reports.find((r) => r.id === e.target.value))}
              className="shrink min-w-0 max-w-[40vw] sm:max-w-[220px] truncate px-3 py-1.5 text-sm border border-line rounded bg-panel text-ink"
            >
              {category.reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => goToItem(category.reports[activeIndex + 1])}
              disabled={activeIndex === -1 || activeIndex >= category.reports.length - 1}
              aria-label="Jump forward one"
              className="shrink-0 px-2 py-1.5 text-sm border border-line rounded disabled:opacity-30 hover:border-line-strong disabled:hover:border-line"
            >
              &rsaquo;
            </button>
            <button
              type="button"
              onClick={() => goToItem(category.reports[category.reports.length - 1])}
              disabled={activeIndex === -1 || activeIndex >= category.reports.length - 1}
              aria-label="Jump to last"
              className="shrink-0 px-2 py-1.5 text-sm border border-line rounded disabled:opacity-30 hover:border-line-strong disabled:hover:border-line"
            >
              &raquo;
            </button>
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
