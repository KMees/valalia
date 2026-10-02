import assert from "node:assert/strict";
import test from "node:test";
import { getDeliveryProvider } from "./delivery.ts";
import { declineCheckout, getPaymentProvider } from "./payment.ts";

test("mock checkout records a reference and collects no card", () => {
  const result = getPaymentProvider().createCheckout({
    email: "buyer@example.com",
    lines: [
      {
        productId: "elv-001",
        title: "Daily Spendable",
        brandName: "Elvoria",
        price: 1200,
        currency: "USD",
        files: [{ key: "private/elvoria/elv-001/file.xlsx", filename: "file.xlsx", contentType: "application/octet-stream" }],
      },
    ],
    currency: "USD",
    total: 1200,
  });
  assert.equal(result.ok, true);
  if (result.ok) assert.match(result.reference, /^prototype_/);
});

test("a declined payment does not invent a reference", () => {
  const result = declineCheckout();
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, "declined");
});

test("a signed locator does not contain the storage key", () => {
  const key = "private/elvoria/elv-001/daily-spendable.xlsx";
  const signed = getDeliveryProvider().sign(key, "daily.xlsx", "VL-TEST");
  assert.equal(signed.locator.includes(key), false);
  assert.equal(signed.locator.includes("elv-001"), false);
  assert.match(signed.locator, /^delivery:\/\/signed\/[a-z0-9]+$/);
  assert.equal(signed.filename, "daily.xlsx");
});
