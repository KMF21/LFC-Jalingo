'use client';

import { motion } from "motion/react";
import { revealItemVariants } from "@/components/Reveal";

interface ServiceItem {
  label?: string;
  time?: string;
  note?: string;
}

export default function ServiceCard({ service }: { service?: ServiceItem }) {
  if (!service) return null;

  return (
    <motion.div
      variants={revealItemVariants}
      className="rounded-2xl bg-paper p-6 text-center"
    >
      <span className="text-xs font-semibold uppercase tracking-wide2 text-ink-muted">
        {service.label || "Service"}
      </span>
      <p className="mt-2 font-display text-2xl font-bold text-red">
        {service.time || "TBA"}
      </p>
      {service.note && (
        <p className="mt-1 text-xs text-ink-muted">{service.note}</p>
      )}
    </motion.div>
  );
}