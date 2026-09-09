"use client";

import { motion } from "motion/react";
import { RevealGroup, revealItemVariants } from "./Reveal";
import type { ServiceTime } from "@/sanity/lib/queries";

/**
 * Exists specifically because constructing <motion.div> elements directly
 * inside a Server Component (even as children passed into a Client
 * Component like RevealGroup) doesn't work — the server has no access to
 * motion's client runtime, so motion.div resolves to undefined there and
 * the page fails to prerender ("Element type is invalid... got undefined").
 * This component's own "use client" boundary is what makes the
 * motion.div construction happen on the client instead. See
 * app/(site)/visit/page.tsx, which renders this instead of building the
 * animated cards itself.
 */
export default function ServiceTimesGrid({ services }: { services: ServiceTime[] }) {
  return (
    <RevealGroup className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {services.map((s) => (
        <motion.div
          key={s.label}
          variants={revealItemVariants}
          className="rounded-2xl bg-paper p-6 text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-wide2 text-ink-muted">{s.label}</span>
          <p className="mt-2 font-display text-2xl font-bold text-red">{s.time}</p>
          {s.note && <p className="mt-1 text-sm text-ink-muted">{s.note}</p>}
        </motion.div>
      ))}
    </RevealGroup>
  );
}
