import SiteHeader from './components/layout/SiteHeader';
import SiteFooter from './components/layout/SiteFooter';
import { useQueryNav } from './hooks/useQueryNav';

import HomePage from './pages/home/HomePage';
import GalleryIndexPage from './pages/gallery/GalleryIndexPage';
import GalleryProjectPage from './pages/gallery/GalleryProjectPage';
import FieldOfficesIndexPage from './pages/field-offices/FieldOfficesIndexPage';
import FieldOfficeDetailPage from './pages/field-offices/FieldOfficeDetailPage';
import TranscriptPage from './pages/field-offices/TranscriptPage';
import AnimalReportsPage from './pages/animal-reports/AnimalReportsPage';
import AboutPage from './pages/about/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

function renderSection(section, params) {
  switch (section) {
    case 'home':
      return <HomePage />;

    case 'gallery':
      return params.get('project') ? <GalleryProjectPage /> : <GalleryIndexPage />;

    case 'field-offices':
      if (!params.get('office')) return <FieldOfficesIndexPage />;
      return params.get('view') === 'transcript' ? <TranscriptPage /> : <FieldOfficeDetailPage />;

    case 'animal-reports':
      return <AnimalReportsPage />;

    case 'about':
      return <AboutPage />;

    default:
      return <NotFoundPage />;
  }
}

export default function App() {
  const { section, params } = useQueryNav();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">{renderSection(section, params)}</main>
      <SiteFooter />
    </div>
  );
}
