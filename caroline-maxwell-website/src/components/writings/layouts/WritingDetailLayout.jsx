import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import MarkdownContent from '../../about/MarkdownContent';
import { splitWritingSegments, extractGridContent } from '../writingImages';

function ImageGrid({ images, columns, onSelect }) {
  if (images.length === 0) return null;
  return (
    <div className="grid gap-4 my-8" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {images.map((img, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(img)}
          className="bg-panel overflow-hidden cursor-zoom-in"
        >
          <img src={img.src} alt={img.alt} className="w-full h-auto object-cover" />
        </button>
      ))}
    </div>
  );
}

export default function WritingDetailLayout({ node }) {
  const [lightboxImage, setLightboxImage] = useState(null);
  const images = node.images || [];
  const layout = node.layout || 'simple';
  const columns = node.grid_columns || 3;
  const writeUp = node.write_up || '';

  useEffect(() => {
    if (!lightboxImage) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage]);

  const gridContent = layout !== 'simple' ? extractGridContent(writeUp, images) : null;

  return (
    <div className="mt-10 max-w-2xl">
      {layout === 'simple' && (
        <div className="prose-writing text-ink text-[17px] leading-relaxed font-body">
          {splitWritingSegments(writeUp, images).map((seg, i) =>
            seg.type === 'image' ? (
              <button
                key={i}
                type="button"
                onClick={() => setLightboxImage(seg.image)}
                className="block bg-panel overflow-hidden cursor-zoom-in my-8"
              >
                <img src={seg.image.src} alt={seg.image.alt} className="w-full h-auto object-cover" />
              </button>
            ) : (
              <MarkdownContent key={i} source={seg.text} />
            )
          )}
        </div>
      )}

      {layout === 'grid-top' && gridContent && (
        <div className="prose-writing text-ink text-[17px] leading-relaxed font-body">
          <ImageGrid images={gridContent.images} columns={columns} onSelect={setLightboxImage} />
          {gridContent.text && <MarkdownContent source={gridContent.text} />}
        </div>
      )}

      {layout === 'grid-bottom' && gridContent && (
        <div className="prose-writing text-ink text-[17px] leading-relaxed font-body">
          {gridContent.text && <MarkdownContent source={gridContent.text} />}
          <ImageGrid images={gridContent.images} columns={columns} onSelect={setLightboxImage} />
        </div>
      )}

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
