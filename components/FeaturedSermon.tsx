import AudioPlayer from "./AudioPlayer";
import Reveal from "./Reveal";

export type FeaturedSermonData = {
  title: string;
  preacher: string;
  date: string;
  audioUrl?: string;
  durationSeconds?: number;
  pdfUrl?: string;
};

export default function FeaturedSermon({ sermon }: { sermon: FeaturedSermonData }) {
  return (
    <section className="bg-ink py-16">
      <div className="container-content grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wide2 text-coral">Latest message</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-paper md:text-4xl">
            Watch the latest message
          </h2>
          <p className="mt-3 max-w-md text-sm text-paper/70">
            Stay encouraged with the most recent teaching from Living Faith Church, Jalingo —
            stream it here or download it for later.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-paper/15 bg-paper/5 p-6">
            <h3 className="font-display text-xl font-semibold text-paper">{sermon.title}</h3>
            <p className="mt-1 text-sm text-paper/60">
              {sermon.preacher} &middot; {sermon.date}
            </p>

            <div className="mt-5">
              {sermon.audioUrl ? (
                <AudioPlayer src={sermon.audioUrl} initialDuration={sermon.durationSeconds} />
              ) : (
                <p className="rounded-2xl border border-paper/15 px-4 py-3 text-sm text-paper/60">
                  Audio coming soon.
                </p>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <a
                href="/sermons"
                className="rounded-full bg-red px-4 py-2 text-xs font-semibold text-paper transition hover:bg-red-deep"
              >
                Browse all sermons
              </a>
              {sermon.pdfUrl && (
                <a
                  href={sermon.pdfUrl}
                  className="rounded-full border border-paper/25 px-4 py-2 text-xs font-semibold text-paper transition hover:border-paper"
                >
                  Download PDF notes
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
