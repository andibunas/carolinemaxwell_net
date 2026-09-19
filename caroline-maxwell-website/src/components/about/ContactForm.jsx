// Placeholder contact form. The real implementation is TBD -- likely an
// embedded Google Form <iframe>. Swapping it in later only requires editing
// this file: replace the <form> block below with the provided embed markup.
export default function ContactForm() {
  return (
    <div className="mt-8 max-w-lg">
      <p className="text-ink-soft text-sm mb-6">
        This form is a placeholder. Replace it with an embedded Google Form,
        or wire the fields below up to a form-handling service, once that
        decision is made.
      </p>
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
          Name
          <input
            type="text"
            name="name"
            className="bg-panel border border-line px-3 py-2 text-ink text-sm focus:border-gold outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
          Email
          <input
            type="email"
            name="email"
            className="bg-panel border border-line px-3 py-2 text-ink text-sm focus:border-gold outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
          Message
          <textarea
            name="message"
            rows={5}
            className="bg-panel border border-line px-3 py-2 text-ink text-sm focus:border-gold outline-none resize-none"
          />
        </label>
        <button
          type="submit"
          className="self-start mt-2 px-5 py-2 border border-gold text-gold-text text-sm hover:bg-gold hover:text-paper transition-colors"
        >
          Send message
        </button>
      </form>
    </div>
  );
}
