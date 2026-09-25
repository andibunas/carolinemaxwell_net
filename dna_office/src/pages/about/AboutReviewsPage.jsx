const REVIEWS = [
  { name: 'DNA interview on NPR', href: 'http://www.scpr.org/news/2009/08/23/city-animal-art/' },
  {
    name: 'DNA reviewed in OC art blog',
    href: 'http://theocartblog.typepad.com/the_oc_art_blog_contempor/2009/09/in-love-with-night-guggenheim-gallery-chapman-university.html',
  },
  { name: 'DNA reviewed in Green Prophet', href: 'http://www.greenprophet.com/2011/06/eco-lights-jerusalem-festival/' },
];

export default function AboutReviewsPage() {
  return (
    <div>
      <h2 className="font-display text-lg mb-4 text-ink">Reviews / Articles</h2>
      <ul className="text-ink-soft text-sm space-y-2">
        {REVIEWS.map((l, i) => (
          <li key={i}>
            <a href={l.href} target="_blank" rel="noreferrer" className="underline decoration-glow hover:text-glow">
              {l.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
