import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { findOrder, useOrders } from "@/lib/commerce/orders";
import { getDeliveryProvider, type SignedDelivery } from "@/lib/commerce/delivery";
import { formatMoney } from "@/lib/commerce/money";
import { track } from "@/lib/commerce/analytics";
import { useOrdersReady } from "@/lib/use-mounted";
import type { CheckoutFile, CheckoutLine } from "@/lib/commerce/payment";
import { getProductById } from "@/lib/catalog/data";

export const Route = createFileRoute("/checkout/confirmation/$order")({
  component: ConfirmationPage,
  head: () => ({
    meta: [
      { title: "Order — Valalia" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function filesFor(line: CheckoutLine): CheckoutFile[] {
  if (line.files?.length) return line.files;
  const legacy = (line as CheckoutLine & { fileKeys?: string[] }).fileKeys ?? [];
  const product = getProductById(line.productId);
  return (product?.files ?? [])
    .filter((file) => legacy.length === 0 || legacy.includes(file.key))
    .map((file) => ({
      key: file.key,
      filename: file.filename,
      contentType: file.contentType,
    }));
}

function ConfirmationPage() {
  const { order: orderParam } = Route.useParams();
  const ready = useOrdersReady();
  const orders = useOrders((state) => state.orders);
  const order = ready ? findOrder(orders, orderParam) : undefined;
  const [signed, setSigned] = useState<Record<string, SignedDelivery>>({});

  function sign(fileKey: string, filename: string, productId: string) {
    if (!order) return;
    try {
      const result = getDeliveryProvider().sign(fileKey, filename, order.id);
      setSigned((current) => ({ ...current, [fileKey]: result }));
      track("download", { product_id: productId, status: "prototype" });
    } catch {
      track("download_failed", { product_id: productId, status: "prototype" });
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-4xl font-medium">Order</h1>
      {!ready ? <p className="mt-6 text-mute">Loading the order.</p> : null}
      {ready && !order ? (
        <div className="mt-8">
          <p>This order is not in this browser.</p>
          <p className="mt-4">
            <Link to="/account/orders">Prototype orders</Link>
          </p>
        </div>
      ) : null}
      {order ? (
        <div className="mt-8 space-y-6">
          <dl className="grid gap-2">
            <div className="flex justify-between gap-4">
              <dt className="text-mute">Order</dt>
              <dd>{order.id}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mute">Email</dt>
              <dd>{order.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mute">Payment</dt>
              <dd>Prototype · {order.paymentRef}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mute">Delivery</dt>
              <dd>{order.deliveryState === "pending" ? "Files pending" : "Ready to sign"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mute">Total</dt>
              <dd>{formatMoney(order.total, order.currency)}</dd>
            </div>
          </dl>
          <ul className="divide-y divide-line border border-line">
            {order.lines.map((line) => (
              <li key={line.productId} className="px-4 py-3">
                <p>
                  {line.brandName} — {line.title}
                </p>
                <p className="text-sm text-mute">{formatMoney(line.price, line.currency)}</p>
              </li>
            ))}
          </ul>
          <section>
            <h2 className="text-sm tracking-widest text-mute">Files</h2>
            {order.deliveryState === "pending" ? (
              <p className="mt-3">
                The order exists. Files are pending. <Link to="/support">Support</Link>
              </p>
            ) : (
              <ul className="mt-3 space-y-4">
                {order.lines.flatMap((line) =>
                  filesFor(line).map((file) => {
                    const link = signed[file.key];
                    return (
                      <li key={file.key} className="border border-line px-4 py-3">
                        <p>{file.filename}</p>
                        <p className="text-sm text-mute">{file.contentType}</p>
                        {link ? (
                          <p className="mt-2 break-all text-sm">
                            {link.locator}
                            <span className="mt-1 block text-mute">
                              Expires {new Date(link.expiresAt).toLocaleString()}. This is not a file download.
                            </span>
                          </p>
                        ) : null}
                        <button
                          type="button"
                          className="btn btn-secondary mt-3"
                          onClick={() => sign(file.key, file.filename, line.productId)}
                        >
                          {link ? "Request a new signed link" : "Create a signed link"}
                        </button>
                      </li>
                    );
                  }),
                )}
              </ul>
            )}
          </section>
          <p className="text-sm text-mute">This record stays in this browser. It is not an account and not a sale.</p>
        </div>
      ) : null}
    </main>
  );
}
