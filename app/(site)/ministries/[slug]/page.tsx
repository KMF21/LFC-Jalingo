import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Image from "next/image";
import { MINISTRY_BY_SLUG_QUERY, sanityClient } from "@/lib/sanity";

// 1. Update Props to accept params as a Promise (Next.js 15+)
type Props = { 
  params: Promise<{ slug: string }>;
};

type MinistryDetail = {
  name: string;
  description?: string;
  imageUrl?: string;
  galleryUrls?: string[];
  whatsappGroupLink?: string;
};

const fallbackMinistry: MinistryDetail = {
  name: "Youth Alive Fellowship",
  description:
    "Youth Alive exists to empower young people in faith, purpose, and community — through weekly fellowship, outreach, and mentorship.",
  imageUrl: "/images/ministries/youth-alive.jpg",
  galleryUrls: [],
  whatsappGroupLink: undefined,
};

async function getMinistry(slug: string): Promise<MinistryDetail> {
  // Guard against missing slug values
  if (!slug) return fallbackMinistry;

  try {
    const data = await sanityClient.fetch<MinistryDetail | null>(
      MINISTRY_BY_SLUG_QUERY, 
      { slug }
    );
    return data ?? fallbackMinistry;
  } catch (err) {
    console.error("Sanity fetch failed, using fallback content:", err);
    return fallbackMinistry;
  }
}

export default async function MinistryDetailPage({ params }: Props) {
  // 2. Await the params Promise before extracting slug
  const resolvedParams = await params;
  const ministry = await getMinistry(resolvedParams.slug);
  
  const gallery = ministry.galleryUrls && ministry.galleryUrls.length > 0 
    ? ministry.galleryUrls 
    : [null, null, null];

  return (
    <main>
      <PageHero
        eyebrow="Ministry"
        title={ministry.name}
        description={ministry.description}
        variant="photo"
        imageUrl={ministry.imageUrl}
      />

      <section className="container-content max-w-2xl py-12">
        <Reveal>
          <div className="grid grid-cols-3 gap-3">
            {gallery.slice(0, 3).map((url, i) => (
              <div key={i} className="relative h-24 overflow-hidden rounded-xl bg-paper-dim">
                {url && <Image src={url} alt="" fill className="object-cover" />}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {ministry.whatsappGroupLink ? (
            <a
              href={ministry.whatsappGroupLink}
              className="mt-8 inline-block rounded-full bg-red px-6 py-3 text-sm font-semibold text-paper transition hover:bg-red-deep"
            >
              Join our WhatsApp group
            </a>
          ) : (
            <p className="mt-8 text-xs text-ink-muted">WhatsApp group link coming soon.</p>
          )}
        </Reveal>
      </section>
    </main>
  );
}