import { useQueryNav } from '../hooks/useQueryNav';

export default function NotFoundPage() {
  const { linkTo } = useQueryNav();
  return (
    <div className="mx-auto max-w-2xl px-6 sm:px-8 py-16 text-center">
      <p className="text-ink-soft text-sm">
        Nothing filed under that report. <a {...linkTo({})} className="underline">Return to the office</a>.
      </p>
    </div>
  );
}
