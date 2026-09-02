import { useEffect } from 'react';
import BioTeaser from '../components/home/BioTeaser';
import LatestWork from '../components/home/LatestWork';

export default function HomePage() {
  useEffect(() => {
    document.title = 'Caroline Maxwell';
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 py-14">
      <BioTeaser />
      <LatestWork />
    </div>
  );
}
