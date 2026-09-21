export default function SiteFooter() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-ink-faint">
        <p>© {new Date().getFullYear()} Caroline Maxwell</p>
        <a href="mailto:mail@carolinemaxwell.net" className="hover:text-ink transition-colors">
          mail@carolinemaxwell.net
        </a>
      </div>
    </footer>
  );
}