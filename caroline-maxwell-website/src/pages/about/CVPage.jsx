import { useEffect } from 'react';
import Breadcrumb from '../../components/layout/Breadcrumb';
import MarkdownContent from '../../components/about/MarkdownContent';
import cvSource from '../../content/cv.md?raw';

export default function CVPage() {
  useEffect(() => {
    document.title = 'CV — Caroline Maxwell';
  }, []);

  return (
    <div>
      {/* <Breadcrumb trail={[{ label: 'About', to: '/about' }]} current="CV" /> */}
      <div className="mt-6 max-w-2xl">
        <MarkdownContent source={cvSource} />
      </div>
    </div>
  );
}
