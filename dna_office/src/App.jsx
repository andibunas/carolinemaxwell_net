import { useEffect } from 'react';
import SiteHeader from './components/layout/SiteHeader';
import SiteFooter from './components/layout/SiteFooter';
import { useQueryNav } from './hooks/useQueryNav';
import { getGalleryProject, getFieldOffice, getAnimalCategory, getAnimalCategories } from './data/manifest';

import HomePage from './pages/home/HomePage';
import GalleryIndexPage from './pages/gallery/GalleryIndexPage';
import GalleryProjectPage from './pages/gallery/GalleryProjectPage';
import FieldOfficesIndexPage from './pages/field-offices/FieldOfficesIndexPage';
import FieldOfficeDetailPage from './pages/field-offices/FieldOfficeDetailPage';
import TranscriptPage from './pages/field-offices/TranscriptPage';
import AnimalReportsPage from './pages/animal-reports/AnimalReportsPage';
import AboutLayout from './pages/about/AboutLayout';
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
      return <AboutLayout />;

    default:
      return <NotFoundPage />;
  }
}

const SITE_TITLE = 'Department of Nocturnal Affairs';

const SECTION_TITLES = {
  gallery: 'Gallery',
  'field-offices': 'Field Offices',
  'animal-reports': 'Animal Reports',
  about: 'About',
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Builds "Site · Section · Subsection" from the current query params.
function pageTitle(section, params) {
  const parts = [SITE_TITLE];
  if (SECTION_TITLES[section]) parts.push(SECTION_TITLES[section]);

  switch (section) {
    case 'gallery': {
      const project = params.get('project');
      if (project) parts.push(getGalleryProject(project)?.name || project);
      break;
    }
    case 'field-offices': {
      const office = params.get('office');
      if (office) {
        parts.push(getFieldOffice(office)?.name || office);
        if (params.get('view') === 'transcript') parts.push('Transcript');
      }
      break;
    }
    case 'animal-reports': {
      const slug = params.get('category') || getAnimalCategories()[0]?.id;
      const category = slug && getAnimalCategory(slug);
      if (category) parts.push(category.name);
      break;
    }
    case 'about':
      parts.push(capitalize(params.get('view') || 'bio'));
      break;
  }

  return parts.join(' · ');
}

export default function App() {
  const { section, params } = useQueryNav();
  const paramsKey = params.toString();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [paramsKey]);

  useEffect(() => {
    document.title = pageTitle(section, params);
  }, [section, params]);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">{renderSection(section, params)}</main>
      <SiteFooter />
    </div>
  );
}
