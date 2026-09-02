import Link from "next/link";
import Reveal from "./Reveal";

export default function MinistriesTeaser() {
  return (
    <section className="bg-paper-dim py-16">
      <div className="container-content">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide2 text-red">Ministries &amp; departments</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">A place for you</h2>
        </Reveal>

        <div className="mt-8 flex flex-col gap-4">
          <Reveal delay={0.05}>
            <Link
              href="/ministries/youth-alive"
              className="group flex min-h-[180px] flex-col justify-end rounded-2xl bg-ink p-7 transition hover:brightness-110"
            >
              <h3 className="font-display text-2xl font-bold text-paper">Youth Alive Fellowship</h3>
              <p className="mt-2 max-w-md text-sm text-paper/70">
                Empowering young people in faith, purpose, and community.
              </p>
              <span className="mt-4 text-xs font-semibold text-coral opacity-0 transition group-hover:opacity-100">
                Learn more &amp; join our WhatsApp group &rarr;
              </span>
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Reveal delay={0.1}>
              <Link
                href="/ministries/music"
                className="group flex h-full min-h-[140px] flex-col justify-end rounded-2xl bg-red p-6 transition hover:brightness-110"
              >
                <h3 className="font-display text-lg font-semibold text-paper">Music Ministry</h3>
                <span className="mt-3 text-xs font-semibold text-paper/80 opacity-0 transition group-hover:opacity-100">
                  Learn more &rarr;
                </span>
              </Link>
            </Reveal>
            <Reveal delay={0.15}>
              <Link
                href="/ministries/prayer-band"
                className="group flex h-full min-h-[140px] flex-col justify-end rounded-2xl bg-red-deep p-6 transition hover:brightness-110"
              >
                <h3 className="font-display text-lg font-semibold text-paper">Prayer Band</h3>
                <span className="mt-3 text-xs font-semibold text-paper/80 opacity-0 transition group-hover:opacity-100">
                  Learn more &rarr;
                </span>
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <Link
              href="/ministries/outreach"
              className="group flex min-h-[120px] flex-col justify-center rounded-2xl border-2 border-red p-7 transition hover:bg-red/5"
            >
              <h3 className="font-display text-xl font-semibold text-ink">Outreach &amp; Community Impact</h3>
              <p className="mt-1 text-sm text-ink-muted">
                Grain distribution, medical outreach, and community walks across Jalingo.
              </p>
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.25}>
          <Link
            href="/ministries"
            className="mt-6 inline-block text-sm font-semibold text-red underline decoration-red/40 underline-offset-4 hover:text-red-deep"
          >
            View all ministries
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
