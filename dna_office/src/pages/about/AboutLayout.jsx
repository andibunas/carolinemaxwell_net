import { useQueryNav } from '../../hooks/useQueryNav';
import AboutSubNav from '../../components/about/AboutSubNav';
import AboutBioPage from './AboutBioPage';
import AboutEventsPage from './AboutEventsPage';
import AboutPressPage from './AboutPressPage';
import AboutGalleriesPage from './AboutGalleriesPage';
import AboutReviewsPage from './AboutReviewsPage';
import AboutLikesPage from './AboutLikesPage';

const VIEWS = {
  bio: AboutBioPage,
  events: AboutEventsPage,
  press: AboutPressPage,
  galleries: AboutGalleriesPage,
  reviews: AboutReviewsPage,
  likes: AboutLikesPage,
};

export default function AboutLayout() {
  const { params } = useQueryNav();
  const view = params.get('view') || 'bio';
  const View = VIEWS[view] || AboutBioPage;

  return (
    <div className="mx-auto max-w-2xl px-6 sm:px-8 py-12">
      <h1 className="font-display text-2xl mb-8">About the D.N.A.</h1>
      <AboutSubNav view={view} />
      <div className="mt-8">
        <View />
      </div>
    </div>
  );
}
