import PageHero from "@/components/PageHero";
import Accordion, { AccordionItem } from "@/components/Accordion";
import Reveal from "@/components/Reveal";

const faqs: AccordionItem[] = [
  { question: "What are your service times?", answer: "1st Service at 7am, 2nd Service at 9am (interpreted in Hausa), and Midweek Service on Wednesdays at 5pm." },
  { question: "How do I join a cell or fellowship group?", answer: "Reach out through this contact form or speak with an usher after any service, and we'll connect you with a group near you." },
  { question: "How can I get prayed for?", answer: "Use the Prayer Request link in the menu, or speak with a minister after any service." },
];

export default function ContactPage() {
  return (
    <main>
      <PageHero eyebrow="Contact us" title="Get in" accentWord="touch" />

      <section className="container-content grid grid-cols-1 gap-10 pb-16 md:grid-cols-2">
        <Reveal>
          <form className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-paper-dim p-6">
            <input
              required
              placeholder="Full name"
              className="h-11 rounded-full border border-ink/15 bg-paper px-4 text-sm focus:outline-none focus:ring-2 focus:ring-red/30"
            />
            <input
              required
              type="email"
              placeholder="Email"
              className="h-11 rounded-full border border-ink/15 bg-paper px-4 text-sm focus:outline-none focus:ring-2 focus:ring-red/30"
            />
            <textarea
              required
              placeholder="Your message"
              rows={4}
              className="rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red/30"
            />
            <button
              type="submit"
              className="mt-1 h-11 rounded-full bg-red text-sm font-semibold text-paper transition hover:bg-red-deep"
            >
              Send message
            </button>
          </form>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide2 text-red">Frequently asked</p>
          <Accordion items={faqs} />
        </Reveal>
      </section>
    </main>
  );
}
