import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

// Bold geometric sans for headlines — matches the national site's actual
// typographic voice (see resources.faithtabernacle.org.ng), not a generic
// editorial serif.
const display = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Living Faith Church, Jalingo",
  description:
    "Living Faith Church, Jalingo, Taraba State — service times, sermons, resources, and ministries.",
};

// This is the true, mandatory Next.js root layout — it wraps EVERY route,
// including /studio and /admin, not just the public site. Deliberately a
// bare shell: fonts, metadata, <html>/<body>, nothing else. Nav, Footer,
// site-settings data fetching, and <SanityLive/> all live in
// app/(site)/layout.tsx instead, because:
//   1. They should only render on public site pages, not /studio or /admin.
//   2. Sanity's own docs warn against mounting <SanityLive/> on an
//      embedded Studio route — it can cause unexpected reloads there.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
