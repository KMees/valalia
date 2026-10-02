import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { EmptyState } from "@/components/catalog-ui";
import { cartLines, useCart } from "@/lib/commerce/cart";
import { declineCheckout, getPaymentProvider, type CheckoutLine } from "@/lib/commerce/payment";
import { orderId, useOrders, type DeliveryState } from "@/lib/commerce/orders";
import { formatMoney } from "@/lib/commerce/money";
import { getBrandById } from "@/lib/catalog/data";
import { track } from "@/lib/commerce/analytics";
import { useCartReady } from "@/lib/use-mounted";
import { paymentProviderId } from "@/lib/env";

export const Route = createFileRoute("/checkout/")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Checkout — Valalia" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function CheckoutPage() {
  const ready = useCartReady();
  const navigate = useNavigate();
  const items = useCart((state) => state.items);
  const clear = useCart((state) => state.clear);
  const addOrder = useOrders((state) => state.add);
  const lines = ready ? cartLines(items) : [];
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const lock = useRef(false);
  const provider = getPaymentProvider();
  const paused = paymentProviderId() === "closed";
  const total = lines.reduce((sum, line) => sum + line.product.price, 0);
  const currency = lines[0]?.product.currency ?? "USD";

  function draftLines(): CheckoutLine[] {
    return lines.map(({ product }) => ({
      productId: product.id,
      title: product.title,
      brandName: getBrandById(product.brandId)?.name ?? product.brandId,
      price: product.price,
      currency: product.currency,
      files: product.files.map((file) => ({
        key: file.key,
        filename: file.filename,
        contentType: file.contentType,
      })),
    }));
  }

  function place(deliveryState: DeliveryState, forceDecline = false) {
    if (lock.current) return;
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setError("Enter a valid email.");
      return;
    }
    const currencies = new Set(lines.map((line) => line.product.currency));
    if (currencies.size !== 1) {
      setError("This cart mixes currencies. Remove a line and check out again.");
      return;
    }
    const draft = { email: email.trim(), lines: draftLines(), currency, total };
    track("begin_checkout", { price: total, status: provider.id });
    const result = forceDecline ? declineCheckout() : provider.createCheckout(draft);
    if (!result.ok) {
      setError(result.message);
      if (result.code === "paused") track("payment_redirect", { status: "paused" });
      return;
    }
    lock.current = true;
    setPending(true);
    track("payment_redirect", { status: "mock" });
    const id = orderId();
    addOrder({
      id,
      email: draft.email,
      lines: draft.lines,
      total,
      currency,
      paymentRef: result.reference,
      paymentState: "prototype",
      deliveryState,
      createdAt: new Date().toISOString(),
    });
    clear();
    track("purchase", { price: total, status: "prototype" });
    void navigate({ to: "/checkout/confirmation/$order", params: { order: id } });
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-4xl font-medium">Checkout</h1>
      <p className="mt-3 text-mute">No card data is collected. Nothing is charged.</p>
      {!ready ? <p className="mt-6 text-mute">Loading checkout.</p> : null}
      {ready && lines.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="The cart is empty.">
            <Link to="/products">Browse products</Link>
          </EmptyState>
        </div>
      ) : null}
      {lines.length > 0 ? (
        <form
          className="mt-8 space-y-8"
          onSubmit={(event) => {
            event.preventDefault();
            place("ready");
          }}
        >
          <section aria-labelledby="step-email">
            <h2 id="step-email" className="text-sm tracking-widest text-mute">1. Email</h2>
            <label className="mt-3 block" htmlFor="email">
              <span className="mb-1 block">Email</span>
              <input
                id="email"
                className="field"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "checkout-error" : undefined}
                required
              />
            </label>
          </section>
          <section aria-labelledby="step-pay">
            <h2 id="step-pay" className="text-sm tracking-widest text-mute">2. Payment</h2>
            <p className="mt-3 border border-line px-4 py-4">
              Provider: {paused ? "not connected" : "prototype"}. Card numbers are not accepted on this page.
              {paused ? " Checkout is paused. The cart is kept." : " Placing the order records it in this browser. Nothing is charged."}
            </p>
          </section>
          <section aria-labelledby="step-review">
            <h2 id="step-review" className="text-sm tracking-widest text-mute">3. Review</h2>
            <ul className="mt-3 divide-y divide-line border border-line">
              {lines.map(({ product }) => (
                <li key={product.id} className="flex justify-between gap-4 px-4 py-3">
                  <span>
                    {getBrandById(product.brandId)?.name} — {product.title}
                  </span>
                  <span>{formatMoney(product.price, product.currency)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex justify-between text-lg">
              <span>Total</span>
              <span>{formatMoney(total, currency)}</span>
            </p>
          </section>
          {error ? (
            <p id="checkout-error" className="border border-line px-4 py-3" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="btn" disabled={paused || pending}>
            Place prototype order
          </button>
          <details className="border border-line px-4 py-3">
            <summary className="min-h-11 cursor-pointer">Prototype checks</summary>
            <p className="mt-2 text-sm text-mute">
              These are not a purchase. One keeps the cart after a declined payment. The other records an order whose files stay pending.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" className="btn btn-secondary" onClick={() => place("ready", true)}>
                Simulate a failed payment
              </button>
              <button type="button" className="btn btn-secondary" disabled={paused || pending} onClick={() => place("pending")}>
                Record with files pending
              </button>
            </div>
          </details>
        </form>
      ) : null}
    </main>
  );
}
