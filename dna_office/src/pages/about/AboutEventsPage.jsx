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

export default function AboutEventsPage() {
  return (
    <div>
      <h2 className="font-display text-lg mb-4 text-ink">The D.N.A. has participated in the following events</h2>
      <ul className="text-ink-soft text-sm space-y-2">
        {EVENTS.map((e, i) => (
          <li key={i}>
            <span className="text-ink-faint">{e.year}</span> <strong className="text-ink">{e.name}</strong> -{' '}
            {e.place}
          </li>
        ))}
      </ul>
    </div>
  );
}
