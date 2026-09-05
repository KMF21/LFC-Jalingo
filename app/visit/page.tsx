import PageHero from "@/components/PageHero";
import PlanVisitForm from "@/components/PlanVisitForm";
import Accordion, { AccordionItem } from "@/components/Accordion";
import Reveal, { RevealGroup, revealItemVariants } from "@/components/Reveal";
import Link from "next/link";
import { motion } from "motion/react";
import { safeSanityFetch } from "@/sanity/lib/safe-fetch";
import { SITE_SETTINGS_QUERY, SiteSettings, FALLBACK_SITE_SETTINGS } from "@/sanity/lib/queries";


const expectFaqs: AccordionItem[] = [
  { question: "How long is a service?", answer: "Services typically run about 2 hours, with worship, the word, and ministration." },
  { question: "What should I wear?", answer: "Come as you are — there's no dress code. Many members dress in their Sunday best, but you're welcome exactly as you come." },
  { question: "What about my children?", answer: "Children are welcome in the main service, and we're happy to help you settle in with your family." },
];

export default async function VisitPage() {
  const siteSettings = await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, FALLBACK_SITE_SETTINGS);
  const services = siteSettings.serviceTimes || FALLBACK_SITE_SETTINGS.serviceTimes!;
  const address = siteSettings.address || FALLBACK_SITE_SETTINGS.address!;

  return (
    <main>
      <PageHero
        eyebrow="This weekend"
        title="Plan a"
        accentWord="visit"
        description="We welcome you to join us in the environment you're most comfortable in — whether you're new to church or looking for a home."
      />

      <section className="bg-ink py-14">
        <div className="container-content">
          <Reveal>
            <p className="text-center text-xs font-semibold uppercase tracking-wide2 text-coral">You're invited</p>
            <h2 className="mt-2 text-center font-display text-2xl font-bold text-paper">Service times</h2>
          </Reveal>
          <RevealGroup className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {services.map((s) => (
              <motion.div
                key={s.label}
                variants={revealItemVariants}
                className="rounded-2xl bg-paper p-6 text-center"
              >
                <span className="text-xs font-semibold uppercase tracking-wide2 text-ink-muted">{s.label}</span>
                <p className="mt-2 font-display text-2xl font-bold text-red">{s.time}</p>
                {s.note && <p className="mt-1 text-xs text-ink-muted">{s.note}</p>}
              </motion.div>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-paper-dim py-16">
        <div className="container-content max-w-2xl">
          <Reveal>
            <p className="text-center text-xs font-semibold uppercase tracking-wide2 text-red">Your experience</p>
            <h2 className="mt-2 text-center font-display text-2xl font-bold text-ink">What can I expect?</h2>
          </Reveal>
          <div className="mt-8">
            <Accordion items={expectFaqs} />
          </div>
        </div>
      </section>

      <section className="container-content grid grid-cols-1 gap-10 py-16 md:grid-cols-2">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide2 text-red">Location</p>
          <p className="mt-2 text-sm text-ink-muted">{address}</p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-ink/10">
            <iframe
              title="Living Faith Church Jalingo location"
              src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
              className="h-64 w-full"
              loading="lazy"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide2 text-red">First time?</p>
          <PlanVisitForm />
        </Reveal>
      </section>

      <section className="bg-red-gradient py-14">
        <div className="container-content flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-paper">Connect with us</h2>
            <p className="mt-1 max-w-md text-sm text-paper/85">
              No need to RSVP for your first visit, but if you&rsquo;d like to get in touch beforehand, reach out anytime.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/contact"
              className="inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:bg-black"
            >
              Contact us
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
