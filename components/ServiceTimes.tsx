import type { ServiceTime } from "@/lib/sanity";

const defaultServices: ServiceTime[] = [
  { label: "1st Service", time: "7:00 AM" },
  { label: "2nd Service", time: "9:00 AM", note: "Interpreted in Hausa" },
  { label: "Midweek Service", time: "Wed · 5:00 PM" },
];

export default function ServiceTimes({ services = defaultServices }: { services?: ServiceTime[] }) {
  return (
    <section className="border-b border-ink/10 bg-paper-dim">
      <div className="container-content grid grid-cols-1 divide-y divide-ink/10 py-2 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {services.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1 px-4 py-5 text-center">
            <span className="text-xs font-semibold uppercase tracking-wide2 text-ink-muted">{s.label}</span>
            <span className="font-display text-xl font-bold text-red">{s.time}</span>
            {s.note && <span className="text-xs text-ink-muted">{s.note}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
