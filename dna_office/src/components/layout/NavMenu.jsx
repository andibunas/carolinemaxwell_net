import { useQueryNav } from '../../hooks/useQueryNav';
import { navItems } from './navItems';

export default function NavMenu() {
  const { section, linkTo } = useQueryNav();
  return (
    <nav aria-label="Primary" className="hidden lg:flex items-center gap-6">
      {navItems.map((item) => {
        const isActive = section === item.section;
        return (
          <a
            key={item.section}
            {...linkTo({ section: item.section })}
            className={`relative py-1 text-sm tracking-wide transition-colors ${
              isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'
            } after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px after:bg-glow after:origin-left after:transition-transform ${
              isActive ? 'after:scale-x-100' : 'after:scale-x-0'
            }`}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
