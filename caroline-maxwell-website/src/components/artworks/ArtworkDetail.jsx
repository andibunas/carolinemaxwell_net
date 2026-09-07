export default function ArtworkDetail({ artwork }) {
  const images = [...artwork.images].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));
  return (
    <div className="mt-10">
      <div className="flex flex-col gap-8 max-w-3xl">
        {images.map((img, i) => (
          <div key={i} className="bg-panel overflow-hidden">
            <img src={img.src} alt={img.alt} className="w-full h-auto object-cover" />
          </div>
        ))}
      </div>
      <div className="mt-6 max-w-3xl">
        <p className="text-ink-soft text-sm">{artwork.medium}</p>
        {artwork.size && <p className="text-ink-faint text-sm">{artwork.size}</p>}
        {artwork.date && <p className="text-ink-faint text-sm">{artwork.date}</p>}
        {artwork.write_up && <p className="text-ink-soft text-sm mt-4">{artwork.write_up}</p>}
      </div>
    </div>
  );
}
