const LIKES = [
  { name: 'Artist - Lauren Strohacker', href: 'http://www.animalrevival.org/' },
  { name: 'International Dark-Sky Association', href: 'http://www.darksky.org/' },
  {
    name: 'Let There Be Night: Testimony on Behalf of the Dark',
    href: 'http://www.amazon.com/Let-There-Be-Night-Testimony/dp/0874173280',
  },
  { name: "Joel Robinson: D.N.A.'s Orange County Animal Specialist", href: 'http://naturalist-for-you.org/' },
  { name: 'Eaton Canyon Nature Center: Moonlight Hikes', href: 'http://www.ecnca.org/programs/moonlight_walks.html' },
  { name: 'Griffith Observatory: Weekly Night Sky Reports', href: 'http://www.griffithobservatory.org/skyreport.html' },
];

export default function AboutLikesPage() {
  return (
    <div>
      <h2 className="font-display text-lg mb-4 text-ink">The D.N.A. likes...</h2>
      <ul className="text-ink-soft text-sm space-y-2">
        {LIKES.map((l, i) => (
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
