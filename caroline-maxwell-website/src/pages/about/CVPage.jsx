import { useEffect } from 'react';
import MarkdownContent from '../../components/about/MarkdownContent';
import cvSource from '../../content/cv.md?raw';

export default function CVPage() {
  useEffect(() => {
    document.title = 'CV — Caroline Maxwell';
  }, []);

  return (
    <div>
      <div className="mt-6 max-w-2xl">
        <MarkdownContent source={cvSource} />
      </div>
    </div>
  );
}
