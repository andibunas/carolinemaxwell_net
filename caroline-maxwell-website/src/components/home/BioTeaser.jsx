import homeContent from '../../content/home.json';

export default function BioTeaser() {
  return (
    <div>
      <p className="text-ink text-lg sm:text-xl leading-relaxed font-body">
        {homeContent.bio_teaser}
      </p>
    </div>
  );
}
