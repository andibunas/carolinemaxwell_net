import { useQueryNav } from '../../hooks/useQueryNav';
import { getFieldOffices } from '../../data/manifest';
import ChildCard from '../../components/layout/ChildCard';

export default function FieldOfficesIndexPage() {
  const { linkTo } = useQueryNav();
  const offices = getFieldOffices();

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 py-12">
      <h1 className="font-display text-2xl mb-2">D.N.A. Field Offices</h1>
      <p className="text-ink-soft text-sm mb-10">
        The Department of Nocturnal Affairs has opened field offices in public spaces around the world to collect
        reports of nocturnal wildlife sightings.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10">
        {offices.map((o) => (
          <ChildCard
            key={o.id}
            linkProps={linkTo({ section: 'field-offices', office: o.id })}
            thumbnail={o.thumbnail ? { src: o.thumbnail, alt: o.name } : null}
            title={o.name}
            subtitle={o.location}
          />
        ))}
      </div>
    </div>
  );
}
