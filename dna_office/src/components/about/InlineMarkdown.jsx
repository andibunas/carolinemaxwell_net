import { useMemo } from 'react';
import { marked } from 'marked';

// Like MarkdownContent, but for short inline text (captions, per-entry
// write-ups) that shouldn't be wrapped in a <p>. Source is our own static
// Markdown, not user input, so the parsed HTML is safe to render directly.
export default function InlineMarkdown({ source, as: Tag = 'span', className = '' }) {
  const html = useMemo(() => marked.parseInline(source || ''), [source]);
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
