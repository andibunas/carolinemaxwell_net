export default function SiteFooter() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-ink-faint">
        <p>Department of Nocturnal Affairs — © {new Date().getFullYear()} Caroline Maxwell &amp; Tal Yizrael</p>
        <a href="mailto:mail@dnaoffice.org" className="hover:text-ink transition-colors">
          mail@dnaoffice.org
        </a>
      </div>
    </footer>
  );
}