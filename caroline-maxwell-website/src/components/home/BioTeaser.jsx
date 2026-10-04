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
        className="inline-block mt-4 text-sm text-ink-soft hover:text-gold transition-colors"
      >
        View all collections
      </Link>
    </div>
  );
}
