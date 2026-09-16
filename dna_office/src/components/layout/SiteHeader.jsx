import SiteBrand from './SiteBrand';
import NavMenu from './NavMenu';
import MobileMenu from './MobileMenu';

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-paper/95 border-b border-line">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 h-[57px] flex items-center justify-between">
        <SiteBrand />
        <NavMenu />
        <MobileMenu />
      </div>
    </header>
  );
}
