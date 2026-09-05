import { useEffect } from 'react';
import Breadcrumb from '../../components/layout/Breadcrumb';
import ContactForm from '../../components/about/ContactForm';

const EMAIL = 'mail@carolinemaxwell.net';

export default function ContactPage() {
  useEffect(() => {
    document.title = 'Contact — Caroline Maxwell';
  }, []);

  return (
    <div>
      {/* <Breadcrumb trail={[{ label: 'About', to: '/about' }]} current="Contact" /> */}
      <p className="mt-6 text-ink-soft text-sm">
        For studio visits, commissions, or press inquiries, write directly to{' '}
        <a href={`mailto:${EMAIL}`} className="text-gold border-b border-gold/40 hover:border-gold transition-colors">
          {EMAIL}
        </a>
        .
      </p>
      <ContactForm />
    </div>
  );
}
