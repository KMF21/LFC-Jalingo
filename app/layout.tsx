import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SanityLive } from "@/sanity/lib/live";
import { safeSanityFetch } from "@/sanity/lib/safe-fetch";
import { SITE_SETTINGS_QUERY, SiteSettings, FALLBACK_SITE_SETTINGS } from "@/sanity/lib/queries";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetched once here (not per-page) since the Footer renders on every
  // route via this layout. safeSanityFetch falls back to
  // FALLBACK_SITE_SETTINGS until a real siteSettings document exists.
  const siteSettings = await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, FALLBACK_SITE_SETTINGS);

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Nav />
        {children}
        <Footer
          address={siteSettings.address}
          serviceTimes={siteSettings.serviceTimes}
          facebookUrl={siteSettings.facebookUrl}
          whatsappUrl={siteSettings.whatsappUrl}
        />
        {/* Powers the Live Content API's real-time subscription — must be
            mounted once, here, so any page using sanityFetch gets pushed
            updates when content changes in Studio. */}
        <SanityLive />
      </body>
    </html>
  );
}
