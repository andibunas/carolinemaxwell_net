import { Routes, Route, Navigate } from 'react-router-dom';
import SiteHeader from './components/layout/SiteHeader';

import HomePage from './pages/home/HomePage';
import ArtworksIndexPage from './pages/artworks/ArtworksIndexPage';
import ArtworksProjectPage from './pages/artworks/ArtworksProjectPage';
import WritingsIndexPage from './pages/writings/WritingsIndexPage';
import WritingsNodePage from './pages/writings/WritingsNodePage';
import AboutLayout from './pages/about/AboutLayout';
import BioPage from './pages/about/BioPage';
import CVPage from './pages/about/CVPage';
import ContactPage from './pages/about/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/artworks" element={<ArtworksIndexPage />} />
          <Route path="/artworks/*" element={<ArtworksProjectPage />} />

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
    </div>
  );
}
