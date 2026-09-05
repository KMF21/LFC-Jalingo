import PageHero from "@/components/PageHero";
import PaystackButton from "@/components/PaystackButton";
import BankAccountsList, { BankAccount } from "@/components/BankAccountsList";
import Reveal from "@/components/Reveal";
import { safeSanityFetch } from "@/sanity/lib/safe-fetch";
import { BANK_ACCOUNTS_QUERY } from "@/sanity/lib/queries";


const fallbackBankAccounts: BankAccount[] = [
  { bankName: "GTBank", accountName: "Living Faith Church Jalingo", accountNumber: "0123456789", label: "General account" },
  { bankName: "Zenith Bank", accountName: "Living Faith Church Jalingo", accountNumber: "9876543210", label: "Building fund" },
];

export default async function GivePage() {
  const bankAccounts = await safeSanityFetch<BankAccount[]>(BANK_ACCOUNTS_QUERY, fallbackBankAccounts);

  return (
    <main>
      <PageHero
        eyebrow="Give"
        title="Sow into the"
        accentWord="work"
        description="Give via Paystack for an instant receipt, or by direct bank transfer."
      />

      <section className="container-content max-w-lg pb-16">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-ink/10">
            <div className="bg-red-gradient px-6 py-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide2 text-coral">Living Faith Church, Jalingo</p>
              <p className="mt-2 font-display text-2xl font-bold text-paper">Every seed counts</p>
            </div>
            <div className="space-y-6 bg-paper-dim p-6">
              <PaystackButton
                amountNaira={5000}
                email="member@example.com"
                reference={`giving-${Date.now()}`}
              />
              <div className="flex items-center gap-3 text-xs text-ink-muted">
                <span className="h-px flex-1 bg-ink/10" />
                or
                <span className="h-px flex-1 bg-ink/10" />
              </div>
              <BankAccountsList
                accounts={bankAccounts}
                narrationHint="Kindly indicate your name and purpose (e.g. tithe, offering, building fund) as your transfer narration where possible."
              />
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
