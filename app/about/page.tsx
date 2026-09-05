import PageHero from "@/components/PageHero";
import PillarsGrid from "@/components/PillarsGrid";
import FounderSection from "@/components/FounderSection";
import LeaderBio from "@/components/LeaderBio";
import LeaderCard, { LeaderData } from "@/components/LeaderCard";
import Accordion, { AccordionItem } from "@/components/Accordion";
import Reveal from "@/components/Reveal";
import Image from "next/image";
import Link from "next/link";
import { safeSanityFetch, safeSanityFetchOne } from "@/sanity/lib/safe-fetch";
import { LEADERS_QUERY, MINISTRY_BY_SLUG_QUERY } from "@/sanity/lib/queries";


const anchorNav = [
  { href: "#mission", label: "Our Mission" },
  { href: "#leadership", label: "Leadership Team" },
  { href: "#beliefs", label: "What We Believe" },
];

type LeaderFromSanity = LeaderData & { role: string; bio?: string };

// Fallback — used until real `leader` documents (with real photos) exist
// in Sanity. First entry is treated as the featured/senior leader.
const fallbackLeaders: LeaderFromSanity[] = [
  { name: "Pst Jesse Dazema", role: "State Pastor, Taraba", bio: "Pst Jesse Dazema leads Living Faith Church across Taraba State, shepherding the church family in Jalingo with a heart for discipleship and community impact." },
  { name: "Pst Sunday Ushie", role: "State Youth Pastor" },
  { name: "Pst Godswill Akpabio", role: "Assistant State Youth Pastor" },
  { name: "Zafira Ibrahim", role: "State Music Director" },
  { name: "Dcns. Lucy Dazema", role: "Guest Minister" },
];

// TODO: church leadership should review and finalize this wording — kept
// generic/pattern-matched to the reference site's beliefs structure for now.
const beliefs: AccordionItem[] = [
  { question: "God", answer: "We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit." },
  { question: "The Word", answer: "We believe the Bible is the inspired, infallible, and authoritative word of God." },
  { question: "Salvation", answer: "We believe salvation is by grace through faith in Jesus Christ alone." },
  { question: "The Holy Spirit", answer: "We believe in the present ministry of the Holy Spirit, empowering believers for godly living." },
  { question: "The Church", answer: "We believe the Church is the body of Christ, called to worship, discipleship, and outreach." },
];

async function getOutreachGallery(): Promise<(string | null)[]> {
  const data = await safeSanityFetchOne<{ galleryUrls?: string[] }>(MINISTRY_BY_SLUG_QUERY, { slug: "outreach" });
  if (data?.galleryUrls && data.galleryUrls.length > 0) return data.galleryUrls.slice(0, 3);
  return [null, null, null];
}

export default async function AboutPage() {
  const [leaders, outreachGallery] = await Promise.all([
    safeSanityFetch<LeaderFromSanity[]>(LEADERS_QUERY, fallbackLeaders),
    getOutreachGallery(),
  ]);

  const [mainLeader, ...staff] = leaders;

  return (
    <main>
      <PageHero
        eyebrow="About us"
        title="Who we"
        accentWord="are"
        description="Living Faith Church, Jalingo is a vibrant community committed to helping you and your family grow closer to your God-given purpose."
      />

      <section className="container-content -mt-8 pb-4">
        <Reveal>
          <div className="grid grid-cols-3 gap-3">
            {anchorNav.map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="rounded-xl border border-ink/10 bg-paper-dim px-3 py-4 text-center text-xs font-semibold text-ink transition hover:border-red hover:text-red"
              >
                {a.label}
              </a>
            ))}
          </div>
        </Reveal>
      </section>

      <section id="mission" className="container-content max-w-2xl scroll-mt-20 py-10">
        <Reveal>
          <p className="text-ink-muted">
            Living Faith Church, Jalingo sits at New Ground, Mile Six Bypass Road, Dinyavoh —
            part of the Living Faith Church Worldwide family (Winners&rsquo; Chapel International),
            reaching Taraba State through the preaching of the word of faith.
          </p>
        </Reveal>
      </section>

      <section className="container-content max-w-2xl pb-16">
        <PillarsGrid />
      </section>

      <FounderSection />

      <section id="leadership" className="scroll-mt-20 bg-paper-dim py-16">
        <div className="container-content max-w-2xl">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-wide2 text-red">Our leadership</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink">Leadership team</h2>
          </Reveal>

          {mainLeader && (
            <div className="mt-8">
              <LeaderBio
                eyebrow={mainLeader.role}
                name={mainLeader.name}
                bio={mainLeader.bio || ""}
                photoUrl={mainLeader.photoUrl}
              />
            </div>
          )}

          {staff.length > 0 && (
            <div className="mt-12">
              <Reveal>
                <p className="mb-4 text-xs font-semibold uppercase tracking-wide2 text-red">Staff</p>
              </Reveal>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {staff.map((l) => (
                  <LeaderCard key={l.name} leader={l} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="beliefs" className="container-content max-w-2xl scroll-mt-20 py-16">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide2 text-red">Our beliefs</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">What we believe</h2>
        </Reveal>
        <div className="mt-8">
          <Accordion items={beliefs} />
        </div>
      </section>

      <section className="container-content max-w-2xl pb-16">
        <Reveal>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide2 text-red">
            Outreach &amp; community impact
          </p>
          <div className="grid grid-cols-3 gap-3">
            {outreachGallery.map((url, i) => (
              <div key={i} className="relative h-20 overflow-hidden rounded-xl bg-paper-dim">
                {url && <Image src={url} alt="" fill className="object-cover" />}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-ink-muted">
            Grain distribution, medical outreach, and community walks across Jalingo.
          </p>
        </Reveal>
      </section>

      <section className="bg-red-gradient py-14">
        <div className="container-content flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-paper">Want to learn more?</h2>
            <p className="mt-1 text-sm text-paper/85">We&rsquo;d love to hear from you.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/contact"
              className="inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:bg-black"
            >
              Contact form
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
