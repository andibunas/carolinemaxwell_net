import { NavLink } from 'react-router-dom';

const items = [
  { label: 'Bio', to: '/about/bio' },
  { label: 'CV', to: '/about/cv' },
  { label: 'Contact', to: '/about/contact' },
];

export default function SubNav() {
  return (
    <nav aria-label="About" className="flex gap-6 border-b border-line pb-4 mb-2">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `text-sm pb-1 ${
              isActive ? 'text-ink border-b border-gold' : 'text-ink-soft hover:text-ink'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
