import { Link } from 'react-router-dom';

/**
 * trail: array of { label, to } for the section root and any ancestor
 * categories (all rendered as links). `current` is the plain, non-linked
 * name of the page itself, rendered as an H2.
 *
 * Renders e.g.  Artworks: Marginalia: January Jones
 *               ^link      ^link      ^plain H2
 */
export default function Breadcrumb({ trail, current }) {
  return (
    <h2 className="font-display text-2xl sm:text-3xl text-ink">
      {trail.map((crumb) => (
        <span key={crumb.to}>
          <Link to={crumb.to} className="text-ink-soft hover:text-gold transition-colors">
            {crumb.label}
          </Link>
          <span className="text-ink-faint">: </span>
        </span>
      ))}
      <span>{current}</span>
    </h2>
  );
}
