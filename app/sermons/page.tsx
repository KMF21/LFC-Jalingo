import PageHero from "@/components/PageHero";
import SermonCard, { SermonListItem } from "@/components/SermonCard";
import { safeSanityFetch } from "@/sanity/lib/safe-fetch";
import { SERMONS_LIST_QUERY } from "@/sanity/lib/queries";


// Fallback — used until real sermons exist in Sanity.
const fallbackSermons: SermonListItem[] = [
  { slug: "gateways-to-financial-dominion", title: "Gateways to Financial Dominion", preacher: "Pst Jesse Dazema", date: "20 Jul 2026" },
  { slug: "encounter-with-power-through-vision", title: "Encounter with Power Through Vision", preacher: "Pst Sunday Ushie", date: "13 Jul 2026" },
  { slug: "the-force-of-praise", title: "The Force of Praise", preacher: "Pst Jesse Dazema", date: "06 Jul 2026", hasVideo: true },
];

const filters = ["All", "Sunday Service", "Midweek", "Youth Alive", "Guest Ministers"];

export default async function SermonsPage() {
  const sermons = await safeSanityFetch<SermonListItem[]>(SERMONS_LIST_QUERY, fallbackSermons);

  return (
    <main>
      <PageHero eyebrow="Sermons & media" title="Listen and" accentWord="grow" />
      <div className="container-content py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex h-11 flex-1 items-center gap-2 rounded-full border border-ink/15 bg-paper-dim px-4 sm:max-w-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-ink-muted" aria-hidden="true">
            <circle cx="11" cy="11" r="7" strokeWidth="2" />
            <path d="M21 21l-4.3-4.3" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search sermons"
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f, i) => (
            <span
              key={f}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                i === 0 ? "bg-red text-paper" : "border border-ink/15 text-ink-muted"
              }`}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {sermons.map((s) => (
          <SermonCard key={s.slug} sermon={s} />
        ))}
      </div>
      </div>
    </main>
  );
}
