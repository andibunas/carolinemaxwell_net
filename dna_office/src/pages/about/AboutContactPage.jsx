export default function AboutContactPage() {
  return (
    <div>
      <h2 className="font-display text-lg mb-4 text-ink">Contact</h2>
      <p className="text-ink-soft text-sm">
        Reach us at{' '}
        <a href="mailto:mail@dnaoffice.org" className="underline decoration-glow hover:text-glow">
          mail@dnaoffice.org
        </a>
        .
      </p>
    </div>
  );
}
