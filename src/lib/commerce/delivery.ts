import { deliveryProviderId } from "../env.ts";

export type SignedDelivery = {
  filename: string;
  locator: string;
  expiresAt: string;
};

/**
 * Delivery seam. Called only after a paid (or prototype-paid) order.
 * `sign` returns a short-lived locator. It does not expose a public bucket.
 * A live provider signs a private object URL behind the same function.
 */
export type DeliveryProvider = {
  id: "mock";
  sign(fileKey: string, filename: string, orderId: string): SignedDelivery;
};

const FIFTEEN_MINUTES = 15 * 60 * 1000;

function locatorToken(): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let body = "";
  for (let i = 0; i < 32; i += 1) {
    body += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return body;
}

const mockDelivery: DeliveryProvider = {
  id: "mock",
  sign(_fileKey, filename, _orderId) {
    const expires = Date.now() + FIFTEEN_MINUTES;
    return {
      filename,
      locator: `delivery://signed/${locatorToken()}`,
      expiresAt: new Date(expires).toISOString(),
    };
  },
};

export function getDeliveryProvider(): DeliveryProvider {
  void deliveryProviderId();
  return mockDelivery;
}
