import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Caroline Maxwell — Page not found';
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 sm:px-8 py-24 text-center">
      <h1 className="font-display text-3xl text-ink mb-4">Page not found</h1>
      <p className="text-ink-soft mb-8">
        There's nothing here — the piece you're looking for may have moved or
        never existed at this address.
      </p>
      <Link to="/" className="text-gold border-b border-gold/40 hover:border-gold transition-colors">
        Back to home
      </Link>
    </div>
  );
}
