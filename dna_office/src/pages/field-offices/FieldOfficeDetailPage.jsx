import { useState } from 'react';
import { useQueryNav } from '../../hooks/useQueryNav';
import { getFieldOffice } from '../../data/manifest';
import MarkdownContent from '../../components/about/MarkdownContent';
import InlineMarkdown from '../../components/about/InlineMarkdown';
import ImageLightbox from '../../components/about/ImageLightbox';

export default function FieldOfficeDetailPage() {
  const { params, linkTo } = useQueryNav();
  const office = getFieldOffice(params.get('office'));
  const [lightboxIndex, setLightboxIndex] = useState(null);

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
          Read the transcript &raquo; {office.transcript.title}
        </a>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {office.images.map((img, i) => (
          <figure
            key={i}
            className={
              i > 0
                ? 'border-t border-ink-faint/20 pt-10 sm:[&:nth-child(-n+2)]:border-t-0 sm:[&:nth-child(-n+2)]:pt-0 lg:[&:nth-child(-n+3)]:border-t-0 lg:[&:nth-child(-n+3)]:pt-0'
                : ''
            }
          >
            {img.video ? (
              <video src={img.video} controls className="block w-full bg-panel" />
            ) : (
              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="block w-full bg-panel overflow-hidden cursor-zoom-in"
              >
                <img src={img.src} alt={img.alt} className="w-full h-auto object-cover" />
              </button>
            )}
            {img.caption && (
              <InlineMarkdown as="figcaption" source={img.caption} className="mt-2 text-ink-faint text-xs italic" />
            )}
            {img.body && (
              <InlineMarkdown as="p" source={img.body} className="mt-1 text-ink-faint text-xs leading-relaxed" />
            )}
          </figure>
        ))}
      </div>

      <ImageLightbox
        images={office.images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
