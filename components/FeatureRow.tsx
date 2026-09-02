import Link from "next/link";
import Image from "next/image";
import Reveal from "./Reveal";

export type FeatureRowData = {
  title: string;
  accentWord?: string;
  description: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
  reverse?: boolean;
};

export default function FeatureRow({ title, accentWord, description, imageUrl, ctaLabel, ctaHref, reverse }: FeatureRowData) {
  return (
    <Reveal>
      <div
        className={`flex flex-col overflow-hidden rounded-2xl border-b-4 border-red bg-paper-dim md:flex-row ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        <div className="relative h-56 w-full shrink-0 bg-ink/10 md:h-auto md:w-2/5">
          {imageUrl && <Image src={imageUrl} alt={title} fill className="object-cover" />}
        </div>
        <div className="flex flex-1 flex-col justify-center p-7">
          <h3 className="font-display text-2xl font-bold text-ink">
            {title} {accentWord && <span className="text-red">{accentWord}</span>}
          </h3>
          <p className="mt-3 text-sm text-ink-muted">{description}</p>
          {ctaLabel && ctaHref && (
            <Link
              href={ctaHref}
              className="mt-4 inline-flex w-max items-center gap-2 rounded-full bg-red px-4 py-2 text-xs font-semibold text-paper transition hover:bg-red-deep"
            >
              {ctaLabel}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </div>
    </Reveal>
  );
}
