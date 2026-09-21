"use client";

import Reveal, { RevealGroup, revealItemVariants } from "./Reveal";
import { motion } from "motion/react";

// The 12 Pillars of Living Faith Church Worldwide — the same foundational
// commitments taught across every branch, not something Jalingo-specific
// to customize. Kept as a static component rather than Sanity content for
// that reason: this doesn't vary by church, so there's no admin need to
// edit it per branch.
const pillars = [
  { label: "The Word", scripture: "John 1:1–12; Heb. 1:3",
    blurb: "God's infallible word as the final authority and food for spiritual growth." },
  { label: "Faith", scripture: "1 John 5:4; Eph. 6:16",
    blurb: "Living by active, unwavering faith to overcome life's battles." },
  { label: "The Supernatural", scripture: "John 3:8; Ps. 82:5–7",
    blurb: "Operating in the realm of signs, wonders, and the impossible through God's power." },
  { label: "The Holy Spirit", scripture: "Acts 1:1–8; Isa. 10:27",
    blurb: "Depending on the person, power, and anointing of the Holy Spirit for daily victory." },
  { label: "Prosperity", scripture: "3 John 2; Ps. 35:27",
    blurb: "Walking in financial abundance and total well-being through Kingdom principles." },
  { label: "Prayer", scripture: null,
    blurb: "Engaging the effective, fervent prayer of faith to enforce God's will on earth." },
  { label: "Healing", scripture: null,
    blurb: "Receiving and ministering divine health through Christ's redemption." },
  { label: "Wisdom", scripture: "Isa. 48:17",
    blurb: "Applying divine direction and practical wisdom to navigate life successfully." },
  { label: "Success", scripture: null,
    blurb: "Achieving distinction and true fulfillment through God-styled principles." },
  { label: "Vision", scripture: null,
    blurb: "Following God's specific plan, purpose, and blueprint for destiny." },
  { label: "Consecration", scripture: null,
    blurb: "Living a holy, dedicated, and separated life that pleases God." },
  { label: "Praise", scripture: "2 Chron. 20:20–22; Ps. 149",
    blurb: "Engaging high praises as a spiritual weapon for warfare and divine intervention." },
];

export default function PillarsGrid() {
  return (
    <div>
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-wide2 text-red">Our foundation</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-ink">The 12 Pillars</h2>
      </Reveal>
      <RevealGroup className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {pillars.map((p) => (
          <motion.div
            key={p.label}
            variants={revealItemVariants}
            className="rounded-2xl border border-ink/10 bg-paper-dim p-5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red/10 text-red">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.5 5.5 21l2-7.5L2 9h7z" />
              </svg>
            </div>
            <p className="mt-3 font-display text-sm font-semibold text-ink">{p.label}</p>
            <p className="mt-1 text-xs text-ink-muted">{p.blurb}</p>
            {p.scripture && (
              <p className="mt-2 text-[11px] font-medium text-red/70">{p.scripture}</p>
            )}
          </motion.div>
        ))}
      </RevealGroup>
    </div>
  );
}