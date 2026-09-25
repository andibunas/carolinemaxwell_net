import { Link } from 'react-router-dom';
import homeContent from '../../content/home.json';

export default function BioTeaser() {
  return (
    <div className="max-w-xl">
      <p className="text-ink text-lg sm:text-xl leading-relaxed font-body">
        {homeContent.bio_teaser}
      </p>
      <Link
        to="/about/bio"
        className="inline-block mt-4 text-sm text-gold-text border-b border-gold/40 hover:border-gold transition-colors"
      >
        {homeContent.bio_link_label}
      </Link>
    </div>
  );
}
