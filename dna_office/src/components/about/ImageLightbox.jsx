import { useEffect, useCallback } from 'react';

export default function ImageLightbox({ images, index, onClose, onNavigate }) {
  const goTo = useCallback(
    (delta) => {
      if (!images.length) return;
      onNavigate((index + delta + images.length) % images.length);
    },
    [images.length, index, onNavigate]
  );

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goTo(1);
      if (e.key === 'ArrowLeft') goTo(-1);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, goTo]);

  useEffect(() => {
    if (index == null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [index]);

  if (index == null) return null;
  const img = images[index];
  if (!img) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-5 text-white/80 hover:text-white text-3xl leading-none"
      >
        &times;
      </button>

      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goTo(-1);
          }}
          aria-label="Previous image"
          className="absolute left-2 sm:left-6 text-white/80 hover:text-white text-4xl leading-none px-2"
        >
          &lsaquo;
        </button>
      )}

      <figure
        className="max-w-[80vw] max-h-[80vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.src}
          alt={img.alt}
          className="max-w-[80vw] max-h-[75vh] w-auto h-auto object-contain"
        />
        {img.caption && (
          <figcaption className="mt-3 text-white/80 text-xs italic text-center">{img.caption}</figcaption>
        )}
      </figure>

      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goTo(1);
          }}
          aria-label="Next image"
          className="absolute right-2 sm:right-6 text-white/80 hover:text-white text-4xl leading-none px-2"
        >
          &rsaquo;
        </button>
      )}
    </div>
  );
}
