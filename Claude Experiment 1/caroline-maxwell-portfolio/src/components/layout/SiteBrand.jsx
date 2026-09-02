import { Link } from 'react-router-dom';

// Kept as its own component so a future custom logo (image or SVG mark) can
// replace the text treatment here without touching SiteHeader.
export default function SiteBrand() {
  return (
    <Link
      to="/"
      className="font-display text-lg sm:text-xl tracking-tight text-ink hover:text-gold transition-colors"
    >
      Caroline Maxwell
    </Link>
  );
}
