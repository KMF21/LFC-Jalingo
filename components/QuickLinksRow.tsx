import Link from "next/link";
import Reveal from "./Reveal";

const items = [
  {
    href: "/visit",
    label: "Plan a visit",
    blurb: "Service times, location, and what to expect",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.5 5.5 21l2-7.5L2 9h7z" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/sermons",
    label: "Watch online",
    blurb: "Stream and download the latest messages",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M8 5v14l11-7z" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/give",
    label: "Give online",
    blurb: "Paystack or direct bank transfer",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M12 2v20M17 6H9.5a3 3 0 000 6h5a3 3 0 010 6H6" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/ministries",
    label: "Find a ministry",
    blurb: "Youth, music, outreach, and more",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <circle cx="9" cy="7" r="3" strokeWidth="1.6" />
        <path d="M2 21v-1a6 6 0 016-6h2a6 6 0 016 6v1M17 11a3 3 0 100-6M22 21v-1a5.5 5.5 0 00-4-5.3" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function QuickLinksRow() {
  return (
    <section className="border-b border-ink/10 bg-paper py-14">
      <div className="container-content">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide2 text-red">Find the right next step</p>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.href} delay={i * 0.06}>
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-2xl border border-ink/10 p-5 transition hover:-translate-y-0.5 hover:border-red hover:shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red/10 text-red">
                  {item.icon}
                </span>
                <span className="mt-4 font-display text-sm font-semibold text-ink">{item.label}</span>
                <span className="mt-1 text-xs text-ink-muted">{item.blurb}</span>
                <span className="mt-3 text-xs font-semibold text-red opacity-0 transition group-hover:opacity-100">
                  Go &rarr;
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
