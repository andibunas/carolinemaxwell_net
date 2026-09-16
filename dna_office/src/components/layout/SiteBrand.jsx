import { useQueryNav } from '../../hooks/useQueryNav';

export default function SiteBrand() {
  const { linkTo } = useQueryNav();
  return (
    <a {...linkTo({})} className="font-display text-base sm:text-lg text-ink tracking-tight">
      D.N.A. <span className="text-ink-faint text-xs sm:text-sm">Department of Nocturnal Affairs</span>
    </a>
  );
}
