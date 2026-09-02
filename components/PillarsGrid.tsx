"use client";
import Reveal, { RevealGroup, revealItemVariants } from "./Reveal";
import { motion } from "motion/react";

const pillars = [
  { label: "Faith", blurb: "Living by the word, not by sight." },
  { label: "The Word", blurb: "Scripture as the foundation for every teaching." },
  { label: "Prayer", blurb: "A praying church is a winning church." },
  { label: "Prosperity", blurb: "God's provision for every child of His." },
];

export default function PillarsGrid() {
  return (
    <div>
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-wide2 text-red">Our foundation</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-ink">Mission &amp; pillars</h2>
      </Reveal>
      <RevealGroup className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {pillars.map((p) => (
          <motion.div
            key={p.label}
            variants={revealItemVariants}
            className="rounded-2xl border border-ink/10 bg-paper-dim p-5 text-center"
          >
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red/10 text-red">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.5 5.5 21l2-7.5L2 9h7z" />
              </svg>
            </div>
            <p className="mt-3 font-display text-sm font-semibold text-ink">{p.label}</p>
            <p className="mt-1 text-xs text-ink-muted">{p.blurb}</p>
          </motion.div>
        ))}
      </RevealGroup>
    </div>
  );
}
