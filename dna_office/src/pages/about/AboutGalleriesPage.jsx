const GALLERIES = [
  { name: 'DNA at Modified Arts Gallery', href: 'http://modifiedarts.org/events-and-exhibitions/the-end-of-wild/' },
  { name: 'DNA at Project 210 Gallery', href: 'http://www.project210.org/DNA.html' },
  { name: 'DNA at Jerusalem Festival of Light and Art', href: 'http://en.lightinjerusalem.org.il/2011/node/103' },
  {
    name: "DNA at Santa Monica's Glow Festival",
    href: 'http://glowsantamonica.org/gallery/caroline-maxwell-and-tal-yizrael/',
  },
];

export default function AboutGalleriesPage() {
  return (
    <div>
      <h2 className="font-display text-lg mb-4 text-ink">Galleries / Art Festivals</h2>
      <ul className="text-ink-soft text-sm space-y-2">
        {GALLERIES.map((l, i) => (
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
