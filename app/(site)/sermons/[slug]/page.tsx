import PageHero from "@/components/PageHero";
import AudioPlayer from "@/components/AudioPlayer";
import Reveal from "@/components/Reveal";
import { SERMON_BY_SLUG_QUERY, sanityClient } from "@/lib/sanity";
import { blocksToParagraphs } from "@/lib/portableText";

type Props = { params: { slug: string } };

type SermonDetail = {
  title: string;
  preacher: string;
  date: string;
  scripture?: string;
  body?: string[];
  audioUrl?: string;
  durationSeconds?: number;
  pdfUrl?: string;
};

const fallbackSermon: SermonDetail = {
  title: "Gateways to Financial Dominion",
  preacher: "Pst Jesse Dazema",
  date: "20 Jul 2026",
  scripture: "2 Corinthians 9:8",
  body: [
    "God is able to make all grace abound toward you, that you, always having all sufficiency in all things, may abound to every good work.",
    "Financial dominion is our heritage in Christ — every child of God is a candidate for wealth, and by redemption has an inheritance of financial fortune in Christ.",
  ],
  audioUrl: "",
  durationSeconds: undefined,
  pdfUrl: "#",
};

async function getSermon(slug: string): Promise<SermonDetail> {
  try {
    const data = await sanityClient.fetch<any>(SERMON_BY_SLUG_QUERY, { slug });
    if (!data) return fallbackSermon;
    return { ...data, body: blocksToParagraphs(data.body) };
  } catch (err) {
    console.error("Sanity fetch failed, using fallback content:", err);
    return fallbackSermon;
  }
}

export default async function SermonDetailPage({ params }: Props) {
  const sermon = await getSermon(params.slug);

  return (
    <main>
      <PageHero
        eyebrow={sermon.scripture || "Sermon"}
        title={sermon.title}
        description={`${sermon.preacher} · ${sermon.date}`}
      />

      <section className="container-content max-w-2xl pb-16">
        <Reveal>
          {sermon.audioUrl ? (
            <AudioPlayer src={sermon.audioUrl} initialDuration={sermon.durationSeconds} />
          ) : (
            <p className="rounded-2xl border border-ink/10 bg-paper-dim px-4 py-3 text-sm text-ink-muted">
              Audio coming soon.
            </p>
          )}
        </Reveal>

        {sermon.body && (
          <Reveal delay={0.1}>
            <div className="mt-8 space-y-4 text-ink-muted">
              {sermon.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal delay={0.15}>
          <div className="mt-8 flex gap-3">
            {sermon.audioUrl && (
              <a
                href={sermon.audioUrl}
                download
                className="rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold text-ink transition hover:border-red hover:text-red"
              >
                Download audio
              </a>
            )}
            {sermon.pdfUrl && (
              <a
                href={sermon.pdfUrl}
                className="rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold text-ink transition hover:border-red hover:text-red"
              >
                Download PDF
              </a>
            )}
          </div>
        </Reveal>
      </section>
    </main>
  );
}
