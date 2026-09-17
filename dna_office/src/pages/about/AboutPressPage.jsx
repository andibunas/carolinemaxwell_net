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

export default function AboutPressPage() {
  return (
    <div>
      <h2 className="font-display text-lg mb-4 text-ink">Press</h2>
      <ul className="text-ink-soft text-sm space-y-3">
        {PRESS.map((p, i) => (
          <li key={i}>
            <em>{p.title}</em>, <strong className="text-ink">{p.outlet}</strong>, {p.date}
          </li>
        ))}
      </ul>
    </div>
  );
}
