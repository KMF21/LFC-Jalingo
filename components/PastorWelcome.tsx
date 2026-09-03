import Image from "next/image";
import Reveal from "./Reveal";

export type PastorWelcomeData = {
  name: string;
  role: string;
  photoUrl?: string;
  welcomeMessage: string;
};

/**
 * Deliberately renders nothing (`null`) rather than a placeholder when no
 * real welcome message exists yet. This text is publicly attributed to a
 * named, real person — it should never show draft or invented copy, even
 * as a "coming soon" stand-in. See PASTOR_WELCOME_QUERY / the leader
 * schema for the same reasoning.
 */
export default function PastorWelcome({ pastor }: { pastor: PastorWelcomeData | null }) {
  if (!pastor) return null;

  return (
    <section className="border-b border-ink/10 bg-paper py-16">
      <div className="container-content flex flex-col items-center gap-10 md:flex-row">
        <Reveal>
          <div className="relative h-[400px] w-[400px] shrink-0 overflow-hidden rounded-full bg-ink/10">
            {pastor.photoUrl && (
              <Image src={pastor.photoUrl} alt={pastor.name} fill className="object-cover" />
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-3xl font-semibold uppercase tracking-wide2 text-red">A welcome from our pastor</p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-muted">
            &ldquo;{pastor.welcomeMessage}&rdquo;
          </p>
          <p className="mt-4 font-display text-sm font-semibold text-ink">
            {pastor.name} <span className="font-normal text-ink-muted">&middot; {pastor.role}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
