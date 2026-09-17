import { useEffect, useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useQueryNav } from '../../hooks/useQueryNav';
import { navItems } from './navItems';
import { getAnimalCategories } from '../../data/manifest';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const { section, linkTo } = useQueryNav();
  const categories = getAnimalCategories();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="p-2 -mr-2 text-ink"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          className="fixed inset-x-0 top-[57px] bottom-0 z-40 bg-paper border-t border-line overflow-y-auto"
        >
          <nav aria-label="Primary" className="flex flex-col px-6 py-8 gap-6">
            {navItems.map((item) => {
              if (item.section !== 'animal-reports') {
                return (
                  <a
                    key={item.section}
                    {...linkTo({ section: item.section })}
                    onClick={(e) => {
                      linkTo({ section: item.section }).onClick(e);
                      setOpen(false);
                    }}
                    className={`font-display text-2xl ${section === item.section ? 'text-glow' : 'text-ink'}`}
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <div key="animal-reports">
                  <button
                    type="button"
                    onClick={() => setReportsOpen((v) => !v)}
                    aria-expanded={reportsOpen}
                    className={`flex items-center gap-2 font-display text-2xl ${
                      section === 'animal-reports' ? 'text-glow' : 'text-ink'
                    }`}
                  >
                    {item.label}
                    <ChevronDown size={18} className={`transition-transform ${reportsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {reportsOpen && (
                    <div className="mt-3 ml-2 flex flex-col gap-3 border-l border-line pl-4">
                      <a
                        {...linkTo({ section: 'animal-reports' })}
                        onClick={(e) => {
                          linkTo({ section: 'animal-reports' }).onClick(e);
                          setOpen(false);
                        }}
                        className="text-sm text-ink-soft"
                      >
                        All categories
                      </a>
                      {categories.map((c) => (
                        <a
                          key={c.id}
                          {...linkTo({ section: 'animal-reports', category: c.id })}
                          onClick={(e) => {
                            linkTo({ section: 'animal-reports', category: c.id }).onClick(e);
                            setOpen(false);
                          }}
                          className="text-sm text-ink-soft"
                        >
                          {c.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
