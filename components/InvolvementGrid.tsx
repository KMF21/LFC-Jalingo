import Link from "next/link";
import Reveal from "./Reveal";

const steps = [
  {
    href: "/ministries",
    title: "Join a ministry",
    description: "Find your place serving alongside the church family.",
  },
  {
    href: "/give",
    title: "Give online",
    description: "Sow into the work through Paystack or bank transfer.",
  },
  {
    href: "/visit",
    title: "Plan your visit",
    description: "First time? We'd love to welcome you in person.",
  },
  {
    href: "/prayer-request",
    title: "Ask for prayer",
    description: "Share what's on your heart — we're standing with you.",
  },
];

export default function InvolvementGrid() {
  return (
    <section className="bg-paper-dim py-16">
      <div className="container-content">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide2 text-red">Take a step</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">How to get involved</h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {steps.map((s, i) => (
            <Reveal key={s.href} delay={i * 0.05}>
              <Link
                href={s.href}
                className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-paper p-6 transition hover:-translate-y-0.5 hover:border-red hover:shadow-sm"
              >
                <h3 className="font-display text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{s.description}</p>
                <span className="mt-4 text-xs font-semibold text-red opacity-0 transition group-hover:opacity-100">
                  Learn more &rarr;
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
