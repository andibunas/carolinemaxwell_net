import { useMemo } from 'react';
import { marked } from 'marked';

// Content here is our own static Markdown (manifest write-ups/transcripts),
// not user-submitted input, so rendering the parsed HTML directly is safe.
export default function MarkdownContent({ source, className = '' }) {
  const html = useMemo(() => marked.parse(source || ''), [source]);
  return (
    <div
      className={`prose-content text-ink-soft leading-relaxed [&_h2]:font-display [&_h2]:text-ink [&_h2]:text-xl [&_h2]:mt-10 [&_h2]:mb-3 [&_h2:first-child]:mt-0 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2 [&_p]:mb-4 [&_em]:text-ink ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
