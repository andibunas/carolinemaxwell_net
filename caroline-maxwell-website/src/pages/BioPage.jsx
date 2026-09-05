import { useEffect } from 'react';
import Breadcrumb from '../components/layout/Breadcrumb';
import MarkdownContent from '../components/about/MarkdownContent';
import bioSource from '../content/bio.md?raw';

export default function BioPage() {
  useEffect(() => {
    document.title = 'Bio — Caroline Maxwell';
  }, []);

  return (
    <div>
      {/* <Breadcrumb trail={[{ label: 'About', to: '/about' }]} current="Bio" /> */}
      <div className="mt-6 max-w-2xl">
        <MarkdownContent source={bioSource} />
      </div>
    </div>
  );
}
