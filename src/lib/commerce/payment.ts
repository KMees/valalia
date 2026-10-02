import { paymentProviderId, type PaymentProviderId } from "../env.ts";

export type CheckoutFile = {
  key: string;
  filename: string;
  contentType: string;
};

export type CheckoutLine = {
  productId: string;
  title: string;
  brandName: string;
  price: number;
  currency: string;
  files: CheckoutFile[];
};

export type CheckoutDraft = {
  email: string;
  lines: CheckoutLine[];
  currency: string;
  total: number;
};

export type CheckoutResult =
  | { ok: true; mode: "mock"; reference: string }
  | { ok: false; code: "paused" | "declined" | "invalid"; message: string };

/**
 * Payment seam. Pages call these functions. They do not import a processor SDK.
 * `mock` records a prototype reference and collects no card data.
 * `closed` pauses checkout and leaves the cart in place.
 * A live provider replaces this module behind the same functions.
 */
export type PaymentProvider = {
  id: PaymentProviderId;
  createCheckout(draft: CheckoutDraft): CheckoutResult;
};

function reference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let body = "";
  for (let i = 0; i < 8; i += 1) {
    body += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `prototype_${body}`;
}

const mockProvider: PaymentProvider = {
  id: "mock",
  createCheckout(draft) {
    if (!draft.email || draft.lines.length === 0 || draft.total < 0) {
      return { ok: false, code: "invalid", message: "The order is incomplete." };
    }
    return { ok: true, mode: "mock", reference: reference() };
  },
};

const closedProvider: PaymentProvider = {
  id: "closed",
  createCheckout() {
    return {
      ok: false,
      code: "paused",
      message: "Checkout is paused until a payment provider is connected. The cart is kept.",
    };
  },
};

export function getPaymentProvider(): PaymentProvider {
  return paymentProviderId() === "closed" ? closedProvider : mockProvider;
}

/** Explicit decline used by the prototype failure state. Not a live processor. */
export function declineCheckout(): CheckoutResult {
  return {
    ok: false,
    code: "declined",
    message: "Payment was not completed. Nothing was charged. The cart is unchanged.",
  };
}
