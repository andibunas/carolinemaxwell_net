import { useState } from 'react';
import { useQueryNav } from '../../hooks/useQueryNav';
import { getGalleryProject } from '../../data/manifest';
import MarkdownContent from '../../components/about/MarkdownContent';
import ImageLightbox from '../../components/about/ImageLightbox';

export default function GalleryProjectPage() {
  const { params, linkTo } = useQueryNav();
  const project = getGalleryProject(params.get('project'));
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (!project) {
    return (
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-12">
        <p className="text-ink-soft text-sm">
          That gallery entry couldn't be found. <a {...linkTo({ section: 'gallery' })} className="underline">Back to the Art Gallery</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 py-12">
      <a {...linkTo({ section: 'gallery' })} className="text-sm text-ink-faint hover:text-ink">&laquo; Art Gallery</a>
      <h1 className="font-display text-2xl mt-4 mb-2">{project.name}</h1>
      {project.write_up && <MarkdownContent source={project.write_up} className="max-w-2xl mb-10" />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        {project.artworks.map((art, i) => (
          <figure
            key={art.id}
            className={i > 0 ? 'sm:[&:nth-child(-n+2)]:border-t-0 border-t border-ink-faint/20 pt-10' : ''}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="block w-full bg-panel overflow-hidden cursor-zoom-in"
            >
              <img src={art.image} alt={art.title} className="w-full h-auto object-cover" />
            </button>
            <figcaption className="mt-3 text-sm">
              <p className="italic text-ink">{art.title}</p>
              {(art.medium || art.size) && (
                <p className="text-ink-faint text-xs mt-0.5">{[art.medium, art.size].filter(Boolean).join(', ')}</p>
              )}
              {art.write_up && <p className="text-ink-soft text-xs mt-2 leading-relaxed">{art.write_up}</p>}
            </figcaption>
          </figure>
        ))}
      </div>

      <ImageLightbox
        images={project.artworks.map((art) => ({ src: art.image, alt: art.title, caption: art.title }))}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
