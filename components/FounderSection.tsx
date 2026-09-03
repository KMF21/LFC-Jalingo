import Reveal from "./Reveal";

/**
 * Deliberately text-only, no photo — Bishop Oyedepo is a real public
 * figure and any photo of him would need proper licensing/rights the
 * church actually holds, not something to source generically. If the
 * church has an official, licensed press photo they're authorized to use,
 * add it via a simple `imageUrl` prop later.
 *
 * Content here is factual/biographical (founding year, mandate, reach),
 * not a quote attributed to him — kept that way on purpose.
 */
export default function FounderSection() {
  return (
    <section className="bg-paper-dim py-16">
      <div className="container-content max-w-2xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide2 text-red">Part of a global work</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink">Living Faith Church Worldwide</h2>
          <p className="mt-4 text-sm text-ink-muted">
            Living Faith Church, Jalingo is a branch of Living Faith Church Worldwide
            (also known as Winners&rsquo; Chapel International), founded in 1981 by
            Bishop David Oyedepo. The ministry&rsquo;s mandate — received in a vision to
            liberate mankind through the preaching of the word of faith — has grown
            into a global work reaching millions of members across many nations,
            with its international headquarters at Canaanland, Ota, Ogun State,
            Nigeria.
          </p>
          <a
            href="https://faithtabernacle.org.ng/about"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-red underline decoration-red/40 underline-offset-4 hover:text-red-deep"
          >
            More about the founder &amp; global ministry &rarr;
          </a>
        </Reveal>
      </div>
    </section>
  );
}
