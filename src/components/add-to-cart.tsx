import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/commerce/cart";
import { track } from "@/lib/commerce/analytics";
import { useCartReady } from "@/lib/use-mounted";
import type { Product } from "@/lib/catalog/types";

export function AddToCart({ product }: { product: Product }) {
  const ready = useCartReady();
  const items = useCart((state) => state.items);
  const add = useCart((state) => state.add);
  const inCart = ready && items.some((item) => item.productId === product.id);

  if (!ready && product.status === "active") {
    return (
      <button type="button" className="btn" disabled>
        Add to cart
      </button>
    );
  }

  if (product.status !== "active") {
    return (
      <button type="button" className="btn" disabled>
        Not for sale yet
      </button>
    );
  }

  if (inCart) {
    return (
      <Link to="/cart" className="btn">
        In the cart
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="btn"
      onClick={() => {
        const added = add(product.id);
        if (added) {
          track("add_to_cart", {
            brand_id: product.brandId,
            product_id: product.id,
            price: product.price,
            status: product.status,
          });
        }
      }}
    >
      Add to cart
    </button>
  );
}
