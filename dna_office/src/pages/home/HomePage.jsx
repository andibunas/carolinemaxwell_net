import { useQueryNav } from '../../hooks/useQueryNav';

export default function HomePage() {
  const { linkTo } = useQueryNav();
  return (
    <div className="mx-auto max-w-3xl px-6 sm:px-8 py-16">
      <img src="/home/stamps2.jpg" alt="DNA stamps" className="w-full h-auto object-cover mb-10" />

      <h1 className="font-display text-3xl mb-4">Department of Nocturnal Affairs (D.N.A.)</h1>
      <p className="text-ink-soft leading-relaxed mb-8">
        is a creative project by artists Caroline Maxwell and Tal Yizrael.
Envisioned as both a work of installation and performance art, the DNA
functions as a speculative bureaucracy and a precarious archive.
The DNA has opened field offices in various public spaces around Los Angeles
and the world to collect reports of nocturnal wildlife encounters.
      </p>

      <p className="text-ink-soft leading-relaxed mb-8">
In addition to the ongoing collection of reports, the DNA
creates artworks that respond to the issues of light pollution
and the important presence of darkness in our worlds and lives

      </p>

      <img src="/home/glow_DNA.jpg" alt="Glow DNA" className="w-full h-auto object-cover mb-10" />

      <div className="flex flex-wrap gap-4 text-sm">
        <a {...linkTo({ section: 'field-offices' })} className="underline decoration-glow hover:text-glow">
          Visit the Field Offices
        </a>
        <a {...linkTo({ section: 'animal-reports' })} className="underline decoration-glow hover:text-glow">
          Browse Animal Reports
        </a>
        <a {...linkTo({ section: 'gallery' })} className="underline decoration-glow hover:text-glow">
          View the Art Gallery
        </a>
      </div>
    </div>
  );
}
