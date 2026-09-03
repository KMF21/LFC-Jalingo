"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export type HeroSlide = {
  _key: string;
  title: string;
  accentWord?: string;
  subtitle?: string;
  imageUrl: string;
  ctaLabel?: string;
  ctaHref?: string;
};

const AUTO_ADVANCE_MS = 6500;

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  const goTo = useCallback(
    (next: number) => {
      setIndex((next + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => goTo(index + 1), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [index, goTo, slides.length]);

  const slide = slides[index];
  if (!slide) return null;

  return (
    <section className="relative h-[64vh] min-h-[420px] w-full overflow-hidden bg-red-gradient">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={slide._key}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -80) goTo(index + 1);
            else if (info.offset.x > 80) goTo(index - 1);
          }}
        >
          {/* Full-bleed image at every breakpoint — previously this was
              wrapped in `hidden md:block`, a desktop-only right-hand
              panel, so mobile visitors saw the plain gradient with no
              photo at all. Now the image is the base layer everywhere,
              with a gradient overlay on top for text legibility and
              brand color, and a stronger overlay at small sizes since
              there's no side panel absorbing the darkness there. */}
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-red-deep/90 via-red-deep/55 to-red-deep/25 md:bg-gradient-to-r md:from-red-deep/85 md:via-red-deep/40 md:to-transparent" />

          <div className="container-content relative flex h-full flex-col justify-end pb-16 md:justify-center md:pb-0">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-4 inline-block w-max rounded-full border border-paper/40 px-3 py-1 text-xs font-semibold text-paper"
            >
              Living Faith Church, Jalingo
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="max-w-xl font-display text-4xl font-bold leading-[1.1] text-paper md:text-5xl"
            >
              {slide.title}{" "}
              {slide.accentWord && (
                <span className="text-coral">{slide.accentWord}</span>
              )}
            </motion.h1>
            {slide.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.7 }}
                className="mt-4 max-w-md text-paper/85"
              >
                {slide.subtitle}
              </motion.p>
            )}
            {slide.ctaLabel && slide.ctaHref && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.54, duration: 0.6 }}
              >
                <Link
                  href={slide.ctaHref}
                  className="mt-7 inline-block rounded-full bg-paper px-6 py-3 text-sm font-semibold text-red-deep transition hover:bg-paper/90"
                >
                  {slide.ctaLabel}
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute right-6 top-6 z-10 hidden gap-2 sm:flex">
        <Link
          href="/prayer-request"
          className="rounded-full border border-paper/50 bg-red-deep/30 px-4 py-2 text-xs font-semibold text-paper backdrop-blur transition hover:bg-paper hover:text-red-deep"
        >
          Prayer request
        </Link>
        <Link
          href="/visit"
          className="rounded-full bg-paper px-4 py-2 text-xs font-semibold text-red-deep transition hover:bg-paper/90"
        >
          Plan a visit
        </Link>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((s, i) => (
            <button
              key={s._key}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-paper" : "w-1.5 bg-paper/40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
