import { Routes, Route, Navigate } from 'react-router-dom';
import SiteHeader from './components/layout/SiteHeader';
import SiteFooter from './components/layout/SiteFooter';

import HomePage from './pages/HomePage';
import ArtworksIndexPage from './pages/ArtworksIndexPage';
import ArtworksCategoryPage from './pages/ArtworksCategoryPage';
import WritingsIndexPage from './pages/WritingsIndexPage';
import WritingsNodePage from './pages/WritingsNodePage';
import AboutLayout from './pages/AboutLayout';
import BioPage from './pages/BioPage';
import CVPage from './pages/CVPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/artworks" element={<ArtworksIndexPage />} />
          <Route path="/artworks/*" element={<ArtworksCategoryPage />} />

          <Route path="/writings" element={<WritingsIndexPage />} />
          <Route path="/writings/*" element={<WritingsNodePage />} />

          <Route path="/about" element={<AboutLayout />}>
            <Route index element={<Navigate to="bio" replace />} />
            <Route path="bio" element={<BioPage />} />
            <Route path="cv" element={<CVPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}
