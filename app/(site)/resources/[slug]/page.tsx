import PageHero from "@/components/PageHero";
import PaystackButton from "@/components/PaystackButton";
import BankAccountsList, { BankAccount } from "@/components/BankAccountsList";
import Reveal from "@/components/Reveal";
import { safeFetch, RESOURCE_BY_SLUG_QUERY, BANK_ACCOUNTS_QUERY, sanityClient } from "@/lib/sanity";

type Props = { params: { slug: string } };

type ResourceDetail = {
  title: string;
  category: string;
  description?: string;
  isFree: boolean;
  price?: number;
  fileUrl?: string;
};

const fallbackResource: ResourceDetail = {
  title: "The Miracle Seed",
  category: "Book",
  description: "A foundational teaching on faith and giving.",
  isFree: false,
  price: 1500,
  fileUrl: "#",
};

const fallbackBankAccounts: BankAccount[] = [
  { bankName: "GTBank", accountName: "Living Faith Church Jalingo", accountNumber: "0123456789", label: "General account" },
  { bankName: "Zenith Bank", accountName: "Living Faith Church Jalingo", accountNumber: "9876543210", label: "Building fund" },
];

async function getResource(slug: string): Promise<ResourceDetail> {
  try {
    const data = await sanityClient.fetch<ResourceDetail | null>(RESOURCE_BY_SLUG_QUERY, { slug });
    return data ?? fallbackResource;
  } catch (err) {
    console.error("Sanity fetch failed, using fallback content:", err);
    return fallbackResource;
  }
}

export default async function ResourceDetailPage({ params }: Props) {
  const [resource, bankAccounts] = await Promise.all([
    getResource(params.slug),
    safeFetch<BankAccount[]>(BANK_ACCOUNTS_QUERY, fallbackBankAccounts),
  ]);

  return (
    <main>
      <PageHero eyebrow={resource.category} title={resource.title} description={resource.description} />

      <section className="container-content max-w-lg pb-16">
        {resource.isFree ? (
          <Reveal>
            <a
              href={resource.fileUrl}
              className="inline-block rounded-full bg-red px-6 py-3 text-sm font-semibold text-paper transition hover:bg-red-deep"
            >
              Download free
            </a>
          </Reveal>
        ) : (
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-ink/10">
              <div className="bg-red-gradient px-6 py-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide2 text-coral">Price</p>
                <p className="mt-1 font-display text-3xl font-bold text-paper">
                  &#8358;{(resource.price ?? 0).toLocaleString()}
                </p>
              </div>
              <div className="space-y-6 bg-paper-dim p-6">
                <PaystackButton
                  amountNaira={resource.price ?? 0}
                  email="member@example.com"
                  reference={`${params.slug}-${Date.now()}`}
                />
                <div className="flex items-center gap-3 text-xs text-ink-muted">
                  <span className="h-px flex-1 bg-ink/10" />
                  or
                  <span className="h-px flex-1 bg-ink/10" />
                </div>
                <BankAccountsList
                  accounts={bankAccounts}
                  narrationHint={`Kindly indicate "${resource.title}" as your transfer narration where possible.`}
                />
              </div>
            </div>
          </Reveal>
        )}
      </section>
    </main>
  );
}
