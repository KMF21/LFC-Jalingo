import Link from "next/link";

export type MinistryListItem = {
  slug: string;
  name: string;
  description: string;
  whatsappGroupLink?: string;
};

export default function MinistryCard({ ministry }: { ministry: MinistryListItem }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper-dim p-5">
      <h3 className="font-display text-lg font-semibold text-ink">{ministry.name}</h3>
      <p className="mt-2 text-sm text-ink-muted">{ministry.description}</p>
      <div className="mt-4 flex gap-3">
        <Link
          href={`/ministries/${ministry.slug}`}
          className="text-xs font-semibold text-red hover:underline"
        >
          Learn more &rarr;
        </Link>
        {ministry.whatsappGroupLink && (
          <a
            href={ministry.whatsappGroupLink}
            className="rounded-full bg-red px-3 py-1.5 text-xs font-semibold text-paper transition hover:bg-red-deep"
          >
            Join WhatsApp group
          </a>
        )}
      </div>
    </div>
  );
}
