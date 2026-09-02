"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  accentWord?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  variant?: "light" | "photo";
  imageUrl?: string;
};

export default function PageHero({
  eyebrow,
  title,
  accentWord,
  description,
  ctaLabel,
  ctaHref,
  variant = "light",
  imageUrl,
}: PageHeroProps) {
  const isPhoto = variant === "photo" && imageUrl;

  return (
    <section className={`relative overflow-hidden ${isPhoto ? "py-28" : "bg-paper py-16"}`}>
      {isPhoto && (
        <>
          <Image src={imageUrl} alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-ink/70" />
        </>
      )}

      <div className="container-content relative mx-auto max-w-2xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`text-xs font-semibold uppercase tracking-wide2 ${isPhoto ? "text-coral" : "text-red"}`}
        >
          {eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`mt-3 font-display text-4xl font-bold leading-tight md:text-5xl ${isPhoto ? "text-paper" : "text-ink"}`}
        >
          {title}{" "}
          {accentWord && <span className="text-red">{accentWord}</span>}
        </motion.h1>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`mx-auto mt-5 max-w-xl ${isPhoto ? "text-paper/85" : "text-ink-muted"}`}
          >
            {description}
          </motion.p>
        )}

        {ctaLabel && ctaHref && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href={ctaHref}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-red px-6 py-3 text-sm font-semibold text-paper transition hover:bg-red-deep"
            >
              {ctaLabel}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
