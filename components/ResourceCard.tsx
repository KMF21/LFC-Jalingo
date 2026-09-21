import Link from "next/link";
import Image from "next/image";

export type ResourceListItem = {
  slug: string;
  title: string;
  category: string;
  isFree: boolean;
  price?: number;
  coverImageUrl?: string;
};

export default function ResourceCard({ resource }: { resource: ResourceListItem }) {
  return (
    <Link
      href={`/resources/${resource.slug}`}
      className="group rounded-2xl border border-ink/10 bg-paper-dim p-4 transition hover:border-red"
    >
      <div className="relative mb-3 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-ink/5 text-ink-muted">
        {resource.coverImageUrl ? (
          <Image
            src={resource.coverImageUrl}
            alt={resource.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path d="M6 4h9l3 3v13H6z" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <p className="text-sm font-medium text-ink-muted">{resource.category}</p>
      <p className="mt-1 font-display text-sm font-semibold text-ink">{resource.title}</p>
      <div className="mt-3 flex items-center justify-between">
        {resource.isFree ? (
          <span className="text-sm font-semibold text-green-700">Free</span>
        ) : (
          <span className="text-sm font-semibold text-ink">
            &#8358;{resource.price?.toLocaleString()}
          </span>
        )}
        <span className="text-sm font-semibold text-red opacity-0 transition group-hover:opacity-100">
          {resource.isFree ? "Download" : "View"} &rarr;
        </span>
      </div>
    </Link>
  );
}