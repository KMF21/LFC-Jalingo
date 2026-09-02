import PageHero from "@/components/PageHero";
import FeatureRow from "@/components/FeatureRow";
import { safeFetch, MINISTRIES_LIST_QUERY } from "@/lib/sanity";

type MinistryFromSanity = {
  slug: string;
  name: string;
  description?: string;
  imageUrl?: string;
  whatsappGroupLink?: string;
};

// Fallback — the five ministries discussed, used until real `ministry`
// documents (with real photos) exist in Sanity.
const fallbackMinistries: MinistryFromSanity[] = [
  { slug: "youth-alive", name: "Youth Alive Fellowship", description: "Empowering young people in faith, purpose, and community — through weekly fellowship, outreach, and mentorship." },
  { slug: "music", name: "Music Ministry", description: "Leading the congregation in praise and worship, and raising up musicians and singers for the house of God." },
  { slug: "ushering", name: "Ushering", description: "Serving members and visitors with warmth and order, from the car park to the auditorium." },
  { slug: "prayer-band", name: "Prayer Band", description: "Standing in intercession for the church, the community, and the nation." },
  { slug: "outreach", name: "Outreach & Community Impact", description: "Grain distribution, medical outreach, and community walks across Jalingo — reaching our city with practical love." },
];

export default async function MinistriesPage() {
  const ministries = await safeFetch<MinistryFromSanity[]>(MINISTRIES_LIST_QUERY, fallbackMinistries);

  return (
    <main>
      <PageHero
        eyebrow="Ministries & departments"
        title="Get"
        accentWord="involved"
        description="Being part of Living Faith Church is more than attending Sundays — find your place serving alongside the church family."
      />

      <section className="container-content max-w-3xl py-12">
        <div className="flex flex-col gap-6">
          {ministries.map((m, i) => (
            <FeatureRow
              key={m.slug}
              title={m.name}
              description={m.description || ""}
              imageUrl={m.imageUrl}
              ctaLabel="Learn more"
              ctaHref={`/ministries/${m.slug}`}
              reverse={i % 2 === 1}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
