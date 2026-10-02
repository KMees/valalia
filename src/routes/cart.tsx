import { createFileRoute, Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/catalog-ui";
import { cartLines, useCart } from "@/lib/commerce/cart";
import { formatMoney } from "@/lib/commerce/money";
import { getBrandById } from "@/lib/catalog/data";
import { useCartReady } from "@/lib/use-mounted";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({
    meta: [
      { title: "Cart — Valalia" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function CartPage() {
  const ready = useCartReady();
  const items = useCart((state) => state.items);
  const remove = useCart((state) => state.remove);
  const lines = ready ? cartLines(items) : [];
  const total = lines.reduce((sum, line) => sum + line.product.price, 0);
  const currency = lines[0]?.product.currency ?? "USD";

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-4xl font-medium">Cart</h1>
      {!ready ? <p className="mt-6 text-mute">Loading the cart.</p> : null}
      {ready && lines.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="The cart is empty.">
            <Link to="/products">Browse products</Link>
          </EmptyState>
        </div>
      ) : null}
      {lines.length > 0 ? (
        <>
          <ul className="mt-8 divide-y divide-line border border-line">
            {lines.map(({ product }) => {
              const brand = getBrandById(product.brandId);
              return (
                <li key={product.id} className="flex flex-wrap items-start justify-between gap-4 px-4 py-4">
                  <div>
                    <p className="text-sm text-mute">{brand?.name}</p>
                    <p className="text-lg">
                      <Link to="/products/$slug" params={{ slug: product.slug }}>
                        {product.title}
                      </Link>
                    </p>
                    <p className="text-sm text-mute">Quantity 1. A digital license is not duplicated.</p>
                  </div>
                  <div className="text-right">
                    <p>{formatMoney(product.price, product.currency)}</p>
                    <button type="button" className="mt-2 min-h-11 text-measure" onClick={() => remove(product.id)}>
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 flex justify-between text-lg">
            <span>Subtotal</span>
            <span>{formatMoney(total, currency)}</span>
          </p>
          <Link to="/checkout" className="btn mt-6">
            Continue to checkout
          </Link>
        </>
      ) : null}
    </main>
  );
}
