import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

/**
 * Auto-rotating image carousel. Advances every `speed` seconds while playing
 * and on screen. Clicking the left/right thirds steps back/forward and pauses
 * rotation; clicking the middle toggles play/pause.
 */
export default function ImageCarousel({ slides, speed }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(
    () => !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
  const [onScreen, setOnScreen] = useState(false);
  const rootRef = useRef(null);
  const count = slides.length;

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setOnScreen(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold: 0.25,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !onScreen || count < 2) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), speed * 1000);
    return () => clearTimeout(timer);
  }, [playing, onScreen, count, speed, index]);

  const step = (delta) => {
    setPlaying(false);
    setIndex((i) => (i + delta + count) % count);
  };

  if (count === 0) return null;
  const current = slides[index];

  return (
    <div ref={rootRef} className="max-w-4xl">
      <div className="group relative h-[50vh] md:h-[75vh] bg-panel select-none">
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            loading={i === 0 ? 'eager' : 'lazy'}
            aria-hidden={i !== index}
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="absolute inset-y-0 left-0 w-1/3 flex items-center justify-start pl-3 cursor-w-resize text-white/0 group-hover:text-white/80 focus-visible:text-white/80 transition-colors"
            >
              <ChevronLeft size={36} className="drop-shadow" />
            </button>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
              className="absolute inset-y-0 left-1/3 w-1/3 flex items-center justify-center cursor-pointer"
            >
              <span
                className={`rounded-full bg-black/40 p-3 text-white transition-opacity ${
                  playing ? 'opacity-0 group-hover:opacity-80' : 'opacity-80'
                }`}
              >
                {playing ? <Pause size={28} /> : <Play size={28} />}
              </span>
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="absolute inset-y-0 right-0 w-1/3 flex items-center justify-end pr-3 cursor-e-resize text-white/0 group-hover:text-white/80 focus-visible:text-white/80 transition-colors"
            >
              <ChevronRight size={36} className="drop-shadow" />
            </button>
          </>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4 text-sm">
        <p className="text-ink-soft">{current.title}</p>
        {count > 1 && (
          <p className="text-ink-faint tabular-nums">
            {index + 1} / {count}
          </p>
        )}
      </div>
    </div>
  );
}
