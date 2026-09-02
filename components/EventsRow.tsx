"use client";
import Reveal, { RevealGroup, revealItemVariants } from "./Reveal";
import { motion } from "motion/react";
import Image from "next/image";

export type EventItem = {
  slug: string;
  title: string;
  date: string;
  category?: string;
  imageUrl?: string;
};

export default function EventsRow({ events }: { events: EventItem[] }) {
  return (
    <section className="border-b border-ink/10 bg-paper py-16">
      <div className="container-content">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide2 text-red">Upcoming</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">Happening at LFC Jalingo</h2>
        </Reveal>

        <RevealGroup className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {events.map((e) => (
            <motion.div
              key={e.slug}
              variants={revealItemVariants}
              className="overflow-hidden rounded-2xl border border-ink/10 bg-paper-dim"
            >
              <div className="relative h-32 w-full bg-ink/10">
                {e.imageUrl && <Image src={e.imageUrl} alt={e.title} fill className="object-cover" />}
              </div>
              <div className="p-5">
                {e.category && (
                  <span className="rounded-full bg-red/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-red">
                    {e.category}
                  </span>
                )}
                <h3 className="mt-3 font-display text-base font-semibold text-ink">{e.title}</h3>
                <p className="mt-1 text-xs text-ink-muted">{e.date}</p>
              </div>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
