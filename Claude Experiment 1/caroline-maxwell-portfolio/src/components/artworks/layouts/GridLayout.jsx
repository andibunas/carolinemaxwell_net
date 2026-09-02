import ArtworkCard from '../ArtworkCard';

export default function GridLayout({ category, basePath }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 mt-12">
      {(category.artworks || []).map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} to={`${basePath}/${artwork.id}`} />
      ))}
    </div>
  );
}
