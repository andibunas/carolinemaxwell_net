import { Outlet } from 'react-router-dom';
import SubNav from '../../components/about/SubNav';

export default function AboutLayout() {
  return (
    <div className="mx-auto max-w-3xl px-6 sm:px-8 py-14">
      <h1 className="font-display text-3xl text-ink mb-8">About</h1>
      <SubNav />
      <Outlet />
    </div>
  );
}
