"use client";

import { useState } from "react";

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

type PaystackButtonProps = {
  amountNaira: number;
  email: string;
  reference: string;
  onSuccess?: (reference: string) => void;
};

const PAYSTACK_SCRIPT_SRC = "https://js.paystack.co/v1/inline.js";

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve();
    const script = document.createElement("script");
    script.src = PAYSTACK_SCRIPT_SRC;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Paystack"));
    document.body.appendChild(script);
  });
}

export default function PaystackButton({ amountNaira, email, reference, onSuccess }: PaystackButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      await loadPaystackScript();
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";
      const handler = window.PaystackPop?.setup({
        key: publicKey,
        email,
        amount: amountNaira * 100, // kobo
        ref: reference,
        currency: "NGN",
        callback: (response: { reference: string }) => {
          onSuccess?.(response.reference);
        },
        onClose: () => setLoading(false),
      });
      handler?.openIframe();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="w-full rounded-full bg-red px-5 py-3 text-sm font-semibold text-paper transition hover:bg-red-deep disabled:opacity-60"
    >
      {loading ? "Loading Paystack…" : `Pay ₦${amountNaira.toLocaleString()} with Paystack`}
    </button>
  );
}
