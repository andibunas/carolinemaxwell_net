const EVENTS = [
  { year: '2008', name: 'GLOW Festival', place: 'Santa Monica, California' },
  { year: '2008', name: 'Pasadena Art Night (October)', place: 'Pasadena, California' },
  {
    year: '2009',
    name: 'In Love With Night (curated by Ciara Ennis and Max King Cap)',
    place: 'Guggenheim Gallery, Chapman University',
  },
  { year: '2009', name: 'D.N.A.', place: 'Project 210 Gallery, Pasadena, California' },
  { year: '2011', name: 'Jerusalem Festival of Light and Art', place: 'Jerusalem, Israel' },
  { year: '2011', name: 'Nisuy Kelim Festival', place: 'Tel Aviv, Israel' },
  { year: '2012', name: 'The End of Wild', place: 'Modified Arts, Phoenix, AZ, USA' },
  {
    year: '2014',
    name: 'Navee Navee - Prophet Prophet',
    place: 'Manofim Contemporary Arts Festival, Jerusalem, Israel',
  },
  { year: '2015', name: 'Wandering Event (curated by Nina Schwartz)', place: 'Hansen House, Jerusalem, Israel' },
  { year: '2016', name: "The Art Cube Artist's Studio", place: 'Tel Aviv, Israel' },
  {
    year: '2017',
    name: 'Fresh Paint Art Fair, Special Project',
    place: 'Zoological Museum, University of Tel Aviv, Israel',
  },
  { year: '2018', name: 'MaidenLA Festival', place: 'Row DTLA, Los Angeles' },
  {
    year: '2020',
    name: "Resident Artists, Sholem Asch House Museum",
    place: 'Bat Yam, Israel',
  },
];

const GALLERIES = [
  { name: 'DNA at Modified Arts Gallery', href: 'http://modifiedarts.org/events-and-exhibitions/the-end-of-wild/' },
  { name: 'DNA at Project 210 Gallery', href: 'http://www.project210.org/DNA.html' },
  { name: 'DNA at Jerusalem Festival of Light and Art', href: 'http://en.lightinjerusalem.org.il/2011/node/103' },
  {
    name: "DNA at Santa Monica's Glow Festival",
    href: 'http://glowsantamonica.org/gallery/caroline-maxwell-and-tal-yizrael/',
  },
];

const REVIEWS = [
  { name: 'DNA interview on NPR', href: 'http://www.scpr.org/news/2009/08/23/city-animal-art/' },
  {
    name: 'DNA reviewed in OC art blog',
    href: 'http://theocartblog.typepad.com/the_oc_art_blog_contempor/2009/09/in-love-with-night-guggenheim-gallery-chapman-university.html',
  },
  { name: 'DNA reviewed in Green Prophet', href: 'http://www.greenprophet.com/2011/06/eco-lights-jerusalem-festival/' },
];

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

const PRESS = [
  {
    title: 'Santa Monica Glows All Night',
    outlet: 'Santa Monica Mirror (Vol. 10, Issue 7)',
    date: 'July 24-30, 2008',
  },
  {
    title: 'Artists document city-animal encounters',
    outlet: 'KPCC, by Adolfo Guzman-Lopez',
    date: 'Aug. 23, 2008',
  },
  { title: 'In Love With Night', outlet: 'O.C. Art Blog', date: 'September 9, 2009' },
  {
    title: 'Jerusalem Festival of Light Brings Eco-Art to the Holy City',
    outlet: 'greenprophet.com',
    date: 'June 20, 2011',
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 sm:px-8 py-12">
      <h1 className="font-display text-2xl mb-8">About the D.N.A.</h1>
      <div className="text-ink-soft leading-relaxed space-y-4 text-sm">
        <p>
          <a
            href="http://carolinemaxwell.net"
            target="_blank"
            rel="noreferrer"
            className="text-ink font-bold underline decoration-glow hover:text-glow"
          >
            Caroline Maxwell
          </a>{' '}
          received her MFA degree in Studio Practice from
          Claremont Graduate University in 2006, as well as an M.A. and B.A. in Art History from Cal State
          University, Northridge. She has studied privately with South African/Italian artist duo Rosenclaire since
          1995, and has participated in artist residencies and workshops in Italy, South Africa, and San Francisco.
          Her paintings have been exhibited in Los Angeles, New York, San Francisco, Berlin, Italy, and the Czech
          Republic. In 2008 she founded the Department of Nocturnal Affairs (D.N.A.) with Israeli artist Tal
          Yizrael. She lives and works in Los Angeles.
        </p>
        <p>
          <a
            href="http://talyizrael.com"
            target="_blank"
            rel="noreferrer"
            className="text-ink font-bold underline decoration-glow hover:text-glow"
          >
            Tal Yizrael
          </a>{' '}
          is an experimental photographer and installation artist.
          Her current work deals with light phenomena and the absence of light; past work constructs ephemeral
          realities out of fragile materials — bubbles, ice, and pomegranate seeds. She earned a degree in
          photography and digital media from Hadassah College in Jerusalem (1998) and an MFA (2006) at Claremont
          Graduate University. She has exhibited her work in Israel, Los Angeles, and Taiwan, and lives and works in
          Tel Aviv.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-lg mb-4 text-ink">The D.N.A. has participated in the following events</h2>
        <ul className="text-ink-soft text-sm space-y-2">
          {EVENTS.map((e, i) => (
            <li key={i}>
              <span className="text-ink-faint">{e.year}</span>{' '}
              <strong className="text-ink">{e.name}</strong> - {e.place}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-lg mb-4 text-ink">Press</h2>
        <ul className="text-ink-soft text-sm space-y-3">
          {PRESS.map((p, i) => (
            <li key={i}>
              <em>{p.title}</em>, <strong className="text-ink">{p.outlet}</strong>, {p.date}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-lg mb-4 text-ink">Galleries / Art Festivals</h2>
        <ul className="text-ink-soft text-sm space-y-2">
          {GALLERIES.map((l, i) => (
            <li key={i}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-glow hover:text-glow"
              >
                {l.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-lg mb-4 text-ink">Reviews / Articles</h2>
        <ul className="text-ink-soft text-sm space-y-2">
          {REVIEWS.map((l, i) => (
            <li key={i}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-glow hover:text-glow"
              >
                {l.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-lg mb-4 text-ink">The D.N.A. likes...</h2>
        <ul className="text-ink-soft text-sm space-y-2">
          {LIKES.map((l, i) => (
            <li key={i}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-glow hover:text-glow"
              >
                {l.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
