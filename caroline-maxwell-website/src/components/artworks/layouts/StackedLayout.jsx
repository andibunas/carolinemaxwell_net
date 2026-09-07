import MarkdownContent from '../../about/MarkdownContent';

export default function StackedLayout({ project }) {
  const artworks = project.children || [];

  return (
    <div className="mt-12 flex flex-col gap-16">
      {artworks.map((artwork, index) => {
        const images = [...(artwork.images || [])].sort(
          (a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)
        );
        return (
          <div
            key={artwork.id}
            className={`max-w-3xl ${index > 0 ? 'pt-16 border-t border-ink/10' : ''}`}
          >
            <div className="flex flex-col gap-8">
              {images.map((img, i) => (
                <div key={i} className="bg-panel overflow-hidden">
                  <img src={img.src} alt={img.alt} className="w-full h-auto object-cover" />
                </div>
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
    </div>
  );
}
