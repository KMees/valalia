export type PaymentProviderId = "mock" | "closed";
export type DeliveryProviderId = "mock";

function read(name: "VITE_SITE_URL" | "VITE_PAYMENT_PROVIDER" | "VITE_DELIVERY_PROVIDER" | "VITE_ANALYTICS_SINK"): string {
  const bag = import.meta.env;
  if (!bag) return "";
  const value = bag[name];
  return typeof value === "string" ? value.trim() : "";
}

export function siteUrl(): string {
  return read("VITE_SITE_URL").replace(/\/$/, "");
}

export function paymentProviderId(): PaymentProviderId {
  const value = read("VITE_PAYMENT_PROVIDER");
  return value === "closed" ? "closed" : "mock";
}

export function deliveryProviderId(): DeliveryProviderId {
  return "mock";
}

export function analyticsSink(): "console" | "silent" {
  return read("VITE_ANALYTICS_SINK") === "console" ? "console" : "silent";
}
