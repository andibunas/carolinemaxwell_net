import { Link } from 'react-router-dom';
import homeContent from '../../content/home.json';

export default function BioTeaser() {
  return (
    <div>
      <p className="text-ink text-lg sm:text-xl leading-relaxed font-body">
        {homeContent.bio_teaser}
      </p>
      <Link
        to="/artworks"
        className="inline-block mt-4 font-display text-2xl text-ink underline underline-offset-2 hover:text-gold transition-colors"
      >
        View Artworks
      </Link>
    </div>
  );
}
