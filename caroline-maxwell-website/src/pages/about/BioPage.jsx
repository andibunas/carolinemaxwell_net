import { useEffect } from 'react';
import MarkdownContent from '../../components/about/MarkdownContent';
import bioSource from '../../content/bio.md?raw';

export default function BioPage() {
  useEffect(() => {
    document.title = 'Caroline Maxwell — Bio';
  }, []);

  return (
    <div>
      <div className="mt-6 max-w-2xl">
        <MarkdownContent source={bioSource} />
      </div>
    </div>
  );
}
