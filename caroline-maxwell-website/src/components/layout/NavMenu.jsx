import { NavLink } from 'react-router-dom';
import { navItems } from './navItems';

export default function NavMenu() {
  return (
    <nav aria-label="Primary" className="hidden md:flex items-center gap-8">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `relative py-1 text-sm tracking-wide transition-colors ${
              isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'
            } after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px after:bg-gold after:origin-left after:transition-transform ${
              isActive ? 'after:scale-x-100' : 'after:scale-x-0'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
