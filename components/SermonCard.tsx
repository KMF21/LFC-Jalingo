import Link from "next/link";

export type SermonListItem = {
  slug: string;
  title: string;
  preacher: string;
  date: string;
  hasVideo?: boolean;
};

export default function SermonCard({ sermon }: { sermon: SermonListItem }) {
  return (
    <Link
      href={`/sermons/${sermon.slug}`}
      className="group flex items-center gap-4 rounded-2xl border border-ink/10 bg-paper-dim p-4 transition hover:border-red"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red/10 text-red">
        {sermon.hasVideo ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <p className="font-display text-sm font-semibold text-ink">{sermon.title}</p>
        <p className="mt-1 text-xs text-ink-muted">
          {sermon.preacher} &middot; {sermon.date} &middot; {sermon.hasVideo ? "audio + video" : "audio"}
        </p>
      </div>
      <span className="text-xs font-semibold text-red opacity-0 transition group-hover:opacity-100">
        View &rarr;
      </span>
    </Link>
  );
}
