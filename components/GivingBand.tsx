import Link from "next/link";
import Reveal from "./Reveal";

export default function GivingBand() {
  return (
    <section className="bg-red-gradient py-16">
      <div className="container-content text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide2 text-coral">Your generosity</p>
          <h2 className="mx-auto mt-2 max-w-lg font-display text-3xl font-bold text-paper md:text-4xl">
            Give to make an impact
          </h2>
          <p className="mx-auto mt-3 max-w-md text-paper/85">
            Your giving helps change lives and share the hope of Christ across Jalingo and beyond.
          </p>
          <Link
            href="/give"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm font-semibold text-red-deep transition hover:bg-paper/90"
          >
            Give now
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
