"use client";

import { motion } from "motion/react";

type FlameMarkProps = {
  size?: number;
  className?: string;
};

/**
 * The church's globe-and-flame emblem, rendered as a live SVG rather than a
 * flat image so the flame can carry a slow, restrained flicker — the one
 * signature motion moment reused across the site (nav mark, section
 * dividers, loading state) rather than scattered animation everywhere.
 */
export default function FlameMark({ size = 40, className = "" }: FlameMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Living Faith Church Jalingo emblem"
    >
      <motion.path
        d="M50 8 C58 22 70 26 70 40 C70 52 61 58 50 58 C39 58 30 52 30 40 C30 26 42 22 50 8 Z"
        fill="#C41E1E"
        initial={{ scaleY: 1, opacity: 1 }}
        animate={{ scaleY: [1, 1.04, 0.98, 1], opacity: [1, 0.92, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50px 58px" }}
      />
      <path
        d="M18 46 a32 20 0 0 0 64 0 Z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={5}
      />
      <path
        d="M22 46 a28 17 0 0 0 56 0"
        fill="#111111"
      />
      <path
        d="M30 40 Q50 52 70 40 M26 50 Q50 62 74 50"
        stroke="#FFFFFF"
        strokeWidth={1}
        fill="none"
        opacity={0.5}
      />
    </svg>
  );
}
