// app/(site)/resources/page.tsx
import PageHero from "@/components/PageHero";
import ResourcesFilterableGrid from "@/components/ResourcesFilterableGrid";
import { ResourceListItem } from "@/components/ResourceCard";
import { safeSanityFetch } from "@/sanity/lib/safe-fetch";
import { RESOURCES_LIST_QUERY } from "@/sanity/lib/queries";

const fallbackResources: ResourceListItem[] = [
  { slug: "the-miracle-seed", title: "The Miracle Seed", category: "Book", isFree: false, price: 1500 },
  { slug: "word-of-the-week", title: "Word of the Week — Consecration", category: "Devotional", isFree: true },
  { slug: "prayer-guidelines", title: "Prayer Guidelines", category: "Teaching Guide", isFree: true },
];

export default async function ResourcesPage() {
  const resources = await safeSanityFetch<ResourceListItem[]>(RESOURCES_LIST_QUERY, fallbackResources);

  return (
    <main>
      <PageHero
        eyebrow="Resources"
        title="Books &"
        accentWord="publications"
        description="Download sermons, devotionals, and books — free, or for a stipulated amount."
      />
      <div className="container-content py-12">
        <ResourcesFilterableGrid resources={resources} />
      </div>
    </main>
  );
}