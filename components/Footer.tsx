import Link from "next/link";
import Reveal from "./Reveal";
import type { ServiceTime } from "@/sanity/lib/queries";
import Image from "next/image";

const quickLinks = [
  { href: "/sermons", label: "Sermons" },
  { href: "/resources", label: "Resources & Books" },
  { href: "/give", label: "Give Online" },
  { href: "/visit", label: "Plan a Visit" },
  { href: "/prayer-request", label: "Prayer Request" },
  { href: "/contact", label: "Contact Us" },
];

// A representative handful, not the full 14 — kept short on purpose for a
// footer column. The Ministries page itself lists all of them.
const ministries = [
  { href: "/ministries/youth-alive", label: "Youth Alive Fellowship" },
  { href: "/ministries/music", label: "Choir / Music Department" },
  { href: "/ministries/ushering", label: "Ushering / Hospitality Unit" },
  { href: "/ministries/prayer-band", label: "Prayer Band" },
  { href: "/ministries/outreach", label: "Outreach & Community Impact" },
];

type FooterProps = {
  address?: string;
  serviceTimes?: ServiceTime[];
  facebookUrl?: string;
  whatsappUrl?: string;
};

export default function Footer({ address, serviceTimes, facebookUrl, whatsappUrl }: FooterProps) {
  return (
    <footer className="bg-ink pt-14 text-paper/70">
      <div className="container-content grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal>
          <div className="flex items-center gap-2">
           <Image src="/images/lflogo.png" alt="logo" width={26} height={26} />
            <span className="font-display text-sm font-semibold text-paper">
              Living Faith Church, Jalingo
            </span>
          </div>
          {address && <p className="mt-4 text-sm">{address}</p>}
          <p className="mt-3 text-sm">
            {facebookUrl ? (
              <a href={facebookUrl} className="hover:text-coral">Facebook</a>
            ) : (
              <span className="text-paper/40">Facebook</span>
            )}
            <span className="mx-2 text-paper/30">&middot;</span>
            {whatsappUrl ? (
              <a href={whatsappUrl} className="hover:text-coral">WhatsApp</a>
            ) : (
              <span className="text-paper/40">WhatsApp</span>
            )}
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="text-sm font-semibold uppercase tracking-wide2 text-coral">Quick Links</p>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-paper">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-sm font-semibold uppercase tracking-wide2 text-coral">Ministries</p>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {ministries.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-paper">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/ministries" className="font-semibold text-coral transition hover:text-paper">
                View all ministries &rarr;
              </Link>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="text-sm font-semibold uppercase tracking-wide2 text-coral">Service Times</p>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {(serviceTimes || []).map((s) => (
              <li key={s.label}>
                {s.label} &middot; {s.time}
                {s.note ? ` (${s.note})` : ""}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-content flex flex-col gap-2 py-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Living Faith Church, Jalingo</span>
          <span>Part of Living Faith Church Worldwide</span>
        </div>
        <div className="container-content flex justify-center pb-5 text-xs text-paper/40 sm:justify-start">
          <a
            href="https://www.kmfenterprise.ng/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-coral"
          >
            Built and managed by KMFenterprise
          </a>
        </div>
      </div>
    </footer>
  );
}