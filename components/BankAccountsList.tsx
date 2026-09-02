"use client";

import { useState } from "react";

export type BankAccount = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  label?: string;
};

// Display-only, by design: no "confirm payment" step or admin-notification
// flow. Just the accounts, a copy button, and a note encouraging a
// narration so the church can reconcile transfers manually.
export default function BankAccountsList({ accounts, narrationHint }: { accounts: BankAccount[]; narrationHint?: string }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copy = async (value: string, index: number) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      // Clipboard API can fail silently in unsupported contexts — no-op.
    }
  };

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide2 text-ink-muted">
        Bank transfer
      </p>
      <div className="flex flex-col gap-2">
        {accounts.map((a, i) => (
          <div
            key={`${a.accountNumber}-${i}`}
            className="flex items-center justify-between rounded-xl border border-ink/10 bg-paper-dim px-4 py-3"
          >
            <div>
              <p className="text-xs font-semibold text-ink">
                {a.label ? `${a.label} · ` : ""}
                {a.bankName}
              </p>
              <p className="mt-0.5 text-sm text-ink-muted">{a.accountNumber}</p>
              <p className="text-xs text-ink-muted">{a.accountName}</p>
            </div>
            <button
              onClick={() => copy(a.accountNumber, i)}
              className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-red hover:text-red"
            >
              {copiedIndex === i ? "Copied" : "Copy"}
            </button>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-ink-muted">
        {narrationHint ?? "Kindly indicate the resource title as your transfer narration where possible."}
      </p>
    </div>
  );
}
