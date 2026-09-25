import ImageCarousel from '../ImageCarousel';

const DEFAULT_SPEED = 5;

/**
 * Groups artworks by their `carousel` field, in order of first appearance,
 * with artworks that don't set one collected into a final ungrouped carousel.
 */
function groupSlides(artworks) {
  const groups = new Map();
  const ungrouped = [];
  artworks.forEach((artwork) => {
    const img = (artwork.images || []).find((i) => i.is_primary) || artwork.images?.[0];
    if (!img) return;
    const slide = { src: img.src, alt: img.alt, title: artwork.title };
    if (artwork.carousel) {
      if (!groups.has(artwork.carousel)) groups.set(artwork.carousel, []);
      groups.get(artwork.carousel).push(slide);
    } else {
      ungrouped.push(slide);
    }
  });
  const result = [...groups.entries()].map(([key, slides]) => ({ key, slides }));
  if (ungrouped.length > 0) result.push({ key: '__ungrouped', slides: ungrouped });
  return result;
}

export default function CarouselLayout({ project }) {
  const speed = project.carousel_speed > 0 ? project.carousel_speed : DEFAULT_SPEED;
  const groups = groupSlides(project.children || []);

  return (
    <div className="mt-12 flex flex-col gap-16">
      {groups.map((group) => (
        <ImageCarousel key={group.key} slides={group.slides} speed={speed} />
      ))}
    </div>
  );
}
