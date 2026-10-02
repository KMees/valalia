import { createFileRoute, Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/catalog-ui";
import { useOrders } from "@/lib/commerce/orders";
import { formatMoney } from "@/lib/commerce/money";
import { useOrdersReady } from "@/lib/use-mounted";

export const Route = createFileRoute("/account/orders/")({
  component: OrdersPage,
  head: () => ({
    meta: [
      { title: "Orders — Valalia" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function OrdersPage() {
  const ready = useOrdersReady();
  const orders = useOrders((state) => state.orders);

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-sm">
        <Link to="/account">Account</Link>
      </p>
      <h1 className="mt-3 text-4xl font-medium">Orders</h1>
      <p className="mt-3 text-mute">Browser prototype. Not an account.</p>
      {!ready ? <p className="mt-6 text-mute">Loading orders.</p> : null}
      {ready && orders.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No orders yet.">
            <Link to="/products">Browse products</Link>
          </EmptyState>
        </div>
      ) : null}
      {orders.length > 0 ? (
        <ul className="mt-8 divide-y divide-line border border-line">
          {orders.map((order) => (
            <li key={order.id}>
              <Link to="/account/orders/$order" params={{ order: order.id }} className="flex min-h-11 items-center justify-between gap-4 px-4 py-3">
                <span>{order.id}</span>
                <span>{formatMoney(order.total, order.currency)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
