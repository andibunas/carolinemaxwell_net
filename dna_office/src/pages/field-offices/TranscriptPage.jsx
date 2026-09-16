import { useQueryNav } from '../../hooks/useQueryNav';
import { getFieldOffice } from '../../data/manifest';
import MarkdownContent from '../../components/about/MarkdownContent';

export default function TranscriptPage() {
  const { params, linkTo } = useQueryNav();
  const office = getFieldOffice(params.get('office'));

  if (!office || !office.transcript) {
    return (
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-12">
        <p className="text-ink-soft text-sm">
          That transcript couldn't be found. <a {...linkTo({ section: 'field-offices' })} className="underline">Back to Field Offices</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 sm:px-8 py-12">
      <a {...linkTo({ section: 'field-offices', office: office.id })} className="text-sm text-ink-faint hover:text-ink">
        &laquo; {office.name}
      </a>
      <h1 className="font-display text-2xl mt-4 mb-8">{office.transcript.title}</h1>
      <MarkdownContent source={office.transcript.body} />
    </div>
  );
}
