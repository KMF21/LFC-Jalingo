import Link from "next/link";
import Image from "next/image";
import Reveal from "./Reveal";

export default function AboutTeaser() {
  return (
    <section className="relative overflow-hidden py-24">
      <Image
        src="/images/congregation.jpg"
        alt="Congregation at Living Faith Church, Jalingo"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-red-deep/85" />

      <div className="container-content relative text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide2 text-coral">About Living Faith Church</p>
          <h2 className="mx-auto mt-3 max-w-lg font-display text-3xl font-bold text-paper md:text-4xl">
            A glimpse into who we are
          </h2>
          <p className="mx-auto mt-4 max-w-md text-paper/85">
            From our founding mandate to our leadership and outreach across Taraba —
            discover the heartbeat behind Living Faith Church, Jalingo, part of
            Living Faith Church Worldwide, founded by Bishop David Oyedepo.
          </p>
          <Link
            href="/about"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm font-semibold text-red-deep transition hover:bg-paper/90"
          >
            More about us
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
