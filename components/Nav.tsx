"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import FlameMark from "./FlameMark";

const primaryLinks = [
  { href: "/about", label: "About" },
  { href: "/sermons", label: "Sermons" },
  { href: "/resources", label: "Resources" },
  { href: "/ministries", label: "Ministries" },
  { href: "/give", label: "Give" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu automatically if the viewport grows past the
  // breakpoint where the links are shown inline instead.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-paper/95 backdrop-blur transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_0_0_rgba(0,0,0,0.08)]" : ""
      }`}
    >
      <div className="container-content flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <FlameMark size={28} />
          <span className="font-display text-sm font-semibold tracking-wide2 uppercase text-ink">
            LFC Jalingo
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-ink-muted md:flex">
          {primaryLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-red">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/prayer-request"
            className="hidden text-xs font-semibold text-ink-muted transition hover:text-red sm:inline-block"
          >
            Prayer request
          </Link>
          <Link
            href="/visit"
            className="hidden rounded-full bg-red px-4 py-2 text-xs font-bold uppercase tracking-wide text-paper transition hover:bg-red-deep sm:inline-block"
          >
            Plan a visit
          </Link>

          {/* Hamburger — mobile only. The one thing missing before: no
              way to reach the nav links below the md breakpoint. */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink md:hidden"
          >
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <motion.line
                x1="4" y1="7" x2="20" y2="7"
                animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                style={{ transformOrigin: "12px 7px" }}
              />
              <motion.line
                x1="4" y1="12" x2="20" y2="12"
                animate={{ opacity: menuOpen ? 0 : 1 }}
              />
              <motion.line
                x1="4" y1="17" x2="20" y2="17"
                animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                style={{ transformOrigin: "12px 17px" }}
              />
            </motion.svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-ink/10 bg-paper md:hidden"
          >
            <nav className="container-content flex flex-col gap-1 py-4">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-2 py-3 text-sm font-medium text-ink-muted transition hover:bg-paper-dim hover:text-red"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-ink/10 pt-4">
                <Link
                  href="/prayer-request"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full border border-ink/15 px-4 py-2.5 text-center text-xs font-semibold text-ink transition hover:border-red hover:text-red"
                >
                  Prayer request
                </Link>
                <Link
                  href="/visit"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full bg-red px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-paper transition hover:bg-red-deep"
                >
                  Plan a visit
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
