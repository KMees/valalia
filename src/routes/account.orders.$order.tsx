import { createFileRoute, Link } from "@tanstack/react-router";
import { findOrder, useOrders } from "@/lib/commerce/orders";
import { formatMoney } from "@/lib/commerce/money";
import { useOrdersReady } from "@/lib/use-mounted";

export const Route = createFileRoute("/account/orders/$order")({
  component: OrderDetail,
  head: () => ({
    meta: [
      { title: "Order — Valalia" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function OrderDetail() {
  const { order: orderId } = Route.useParams();
  const ready = useOrdersReady();
  const orders = useOrders((state) => state.orders);
  const order = ready ? findOrder(orders, orderId) : undefined;

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-sm">
        <Link to="/account/orders">Orders</Link>
      </p>
      {!ready ? <p className="mt-6">Loading the order.</p> : null}
      {ready && !order ? (
        <div className="mt-6">
          <h1 className="text-3xl font-medium">This order is not in this browser.</h1>
          <p className="mt-4">
            <Link to="/brands">Brands</Link>
          </p>
        </div>
      ) : null}
      {order ? (
        <>
          <h1 className="mt-3 text-4xl font-medium">{order.id}</h1>
          <p className="mt-3 text-mute">{order.email}</p>
          <p className="mt-2">Payment state: prototype. Reference {order.paymentRef}. No card is stored.</p>
          <p className="mt-2">Delivery: {order.deliveryState === "pending" ? "Files pending" : "Ready to sign"}.</p>
          <ul className="mt-6 divide-y divide-line border border-line">
            {order.lines.map((line) => (
              <li key={line.productId} className="flex justify-between gap-4 px-4 py-3">
                <span>
                  {line.brandName} — {line.title}
                </span>
                <span>{formatMoney(line.price, line.currency)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">Total {formatMoney(order.total, order.currency)}</p>
          <p className="mt-6">
            <Link to="/checkout/confirmation/$order" params={{ order: order.id }}>
              Delivery
            </Link>
          </p>
        </>
      ) : null}
    </main>
  );
}
