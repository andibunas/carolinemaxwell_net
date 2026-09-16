import { useQueryNav } from '../../hooks/useQueryNav';
import { getFieldOffice } from '../../data/manifest';
import MarkdownContent from '../../components/about/MarkdownContent';

export default function FieldOfficeDetailPage() {
  const { params, linkTo } = useQueryNav();
  const office = getFieldOffice(params.get('office'));

  if (!office) {
    return (
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-12">
        <p className="text-ink-soft text-sm">
          That field office couldn't be found. <a {...linkTo({ section: 'field-offices' })} className="underline">Back to Field Offices</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 py-12">
      <a {...linkTo({ section: 'field-offices' })} className="text-sm text-ink-faint hover:text-ink">&laquo; Field Offices</a>
      <h1 className="font-display text-2xl mt-4 mb-1">{office.name}</h1>
      {office.location && <p className="text-ink-faint text-sm mb-6">{office.location}</p>}
      {office.write_up && <MarkdownContent source={office.write_up} className="max-w-2xl mb-8" />}

      {office.transcript && (
        <a
          {...linkTo({ section: 'field-offices', office: office.id, view: 'transcript' })}
          className="inline-block mb-10 text-sm italic underline decoration-glow text-ink hover:text-glow"
        >
          Read the transcript &raquo;
        </a>
      )}

      <div className="flex gap-6 overflow-x-auto chip-scroll pb-2 -mx-6 px-6 sm:mx-0 sm:px-0">
        {office.images.map((img, i) => (
          <figure key={i} className="shrink-0 w-64 sm:w-80">
            <div className="bg-panel overflow-hidden">
              <img src={img.src} alt={img.alt} className="w-full h-auto object-cover" />
            </div>
            {img.caption && <figcaption className="mt-2 text-ink-faint text-xs italic">{img.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </div>
  );
}
