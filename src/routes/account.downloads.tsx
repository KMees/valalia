import { createFileRoute, Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/catalog-ui";
import { useOrders } from "@/lib/commerce/orders";
import { useOrdersReady } from "@/lib/use-mounted";

export const Route = createFileRoute("/account/downloads")({
  component: DownloadsPage,
  head: () => ({
    meta: [
      { title: "Downloads — Valalia" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function DownloadsPage() {
  const hydrated = useOrdersReady();
  const orders = useOrders((state) => state.orders);
  const deliverable = orders.filter((order) => order.deliveryState === "ready");

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-sm">
        <Link to="/account">Account</Link>
      </p>
      <h1 className="mt-3 text-4xl font-medium">Downloads</h1>
      <p className="mt-3 text-mute">
        Signed links are created after payment. This prototype signs a locator. It does not release a file.
      </p>
      {!hydrated ? <p className="mt-6 text-mute">Loading downloads.</p> : null}
      {hydrated && deliverable.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No orders yet." />
        </div>
      ) : null}
      {deliverable.length > 0 ? (
        <ul className="mt-8 divide-y divide-line border border-line">
          {deliverable.map((order) => (
            <li key={order.id} className="px-4 py-3">
              <Link to="/checkout/confirmation/$order" params={{ order: order.id }}>
                {order.id}
              </Link>
              <p className="text-sm text-mute">{order.lines.map((line) => line.title).join(", ")}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
