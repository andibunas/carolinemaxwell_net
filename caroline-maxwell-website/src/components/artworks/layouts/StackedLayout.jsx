import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import MarkdownContent from '../../about/MarkdownContent';

export default function StackedLayout({ project }) {
  const artworks = project.children || [];
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    if (!lightboxImage) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage]);

  return (
    <div className="mt-12 flex flex-col gap-6">
      {artworks.map((artwork, index) => {
        const images = [...(artwork.images || [])].sort(
          (a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)
        );
        return (
          <div
            key={artwork.id}
            className={`max-w-3xl ${index > 0 ? 'pt-6 border-t border-ink/10' : ''}`}
          >
            <div className="flex flex-col gap-8">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxImage(img)}
                  className="bg-panel overflow-hidden cursor-zoom-in"
                >
                  <img src={img.src} alt={img.alt} className="w-full h-auto object-cover" />
                </button>
              ))}
            </div>
            <div className="mt-6">
              <p className="font-display text-xl text-ink">{artwork.title}</p>
              {artwork.medium && <p className="text-ink-soft text-sm mt-1">{artwork.medium}</p>}
              {artwork.size && <p className="text-ink-faint text-sm">{artwork.size}</p>}
              {artwork.date && <p className="text-ink-faint text-sm">{artwork.date}</p>}
              {artwork.write_up && (
                <MarkdownContent source={artwork.write_up} className="text-sm mt-4" />
              )}
            </div>
          </div>
        );
      })}

      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            aria-label="Close"
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X size={32} />
          </button>
          <img
            src={lightboxImage.src}
            alt={lightboxImage.alt}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
