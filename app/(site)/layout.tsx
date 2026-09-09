import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SanityLive } from "@/sanity/lib/live";
import { safeSanityFetch } from "@/sanity/lib/safe-fetch";
import { SITE_SETTINGS_QUERY, SiteSettings, FALLBACK_SITE_SETTINGS } from "@/sanity/lib/queries";

// Scoped to the (site) route group specifically — this is what keeps Nav,
// Footer, and <SanityLive/> off /studio and /admin, since those routes
// sit outside this group and only inherit the bare root layout.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Fetched once here (not per-page) since the Footer renders on every
  // public route via this layout. safeSanityFetch falls back to
  // FALLBACK_SITE_SETTINGS until a real siteSettings document exists.
  const siteSettings = await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, FALLBACK_SITE_SETTINGS);

  return (
    <>
      <Nav />
      {children}
      <Footer
        address={siteSettings.address}
        serviceTimes={siteSettings.serviceTimes}
        facebookUrl={siteSettings.facebookUrl}
        whatsappUrl={siteSettings.whatsappUrl}
      />
      {/* Powers the Live Content API's real-time subscription — scoped to
          public site pages only, per the note in app/layout.tsx. */}
      <SanityLive />
    </>
  );
}
