export default function WritingDetailLayout({ node }) {
  const paragraphs = (node.writing || '').split('\n\n').filter(Boolean);
  return (
    <div className="mt-10 max-w-2xl">
      {node.write_up && (
        <p className="text-ink-soft text-base italic mb-8 border-l-2 border-line-strong pl-4">
          {node.write_up}
        </p>
      )}
      <div className="prose-writing text-ink text-[17px] leading-relaxed font-body">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
