import Image from "next/image";
import Reveal from "./Reveal";

export type LeaderBioData = {
  eyebrow: string;
  name: string;
  accentName?: string;
  bio: string;
  photoUrl?: string;
  reverse?: boolean;
};

export default function LeaderBio({ eyebrow, name, accentName, bio, photoUrl, reverse }: LeaderBioData) {
  return (
    <Reveal>
      <div className={`flex flex-col items-center gap-8 md:flex-row ${reverse ? "md:flex-row-reverse" : ""}`}>
        <div className="relative h-64 w-full max-w-xs shrink-0 overflow-hidden rounded-2xl bg-ink/10">
          {photoUrl && <Image src={photoUrl} alt={name} fill className="object-cover" />}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide2 text-red">{eyebrow}</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-ink">
            {name} {accentName && <span className="text-red">{accentName}</span>}
          </h3>
          <p className="mt-3 max-w-md text-sm text-ink-muted">{bio}</p>
        </div>
      </div>
    </Reveal>
  );
}
