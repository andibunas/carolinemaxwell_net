import { useQueryNav } from '../../hooks/useQueryNav';

const items = [
  { label: 'Bio', view: 'bio' },
  { label: 'Events', view: 'events' },
  { label: 'Press', view: 'press' },
  { label: 'Galleries', view: 'galleries' },
  { label: 'Reviews', view: 'reviews' },
  { label: 'Likes', view: 'likes' },
];

export default function AboutSubNav({ view }) {
  const { linkTo } = useQueryNav();

  return (
    <nav aria-label="About" className="flex flex-wrap gap-6 border-b border-line pb-4 mb-2">
      {items.map((item) => {
        const isActive = view === item.view;
        return (
          <a
            key={item.view}
            {...linkTo({ section: 'about', view: item.view })}
            className={`text-sm pb-1 ${
              isActive ? 'text-ink border-b border-glow' : 'text-ink-soft hover:text-ink'
            }`}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
