import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProductById, products } from "@/lib/catalog/data";

export type CartItem = {
  productId: string;
  quantity: 1;
};

type CartState = {
  items: CartItem[];
  add: (productId: string) => boolean;
  remove: (productId: string) => void;
  clear: () => void;
  prune: () => void;
};

export function resolvableItems(items: CartItem[]): CartItem[] {
  return items.filter((item) => {
    const product = getProductById(item.productId);
    return Boolean(product && product.status === "active");
  });
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (productId) => {
        const product = getProductById(productId);
        if (!product || product.status !== "active") return false;
        if (get().items.some((item) => item.productId === productId)) return true;
        set({ items: [...get().items, { productId, quantity: 1 }] });
        return true;
      },
      remove: (productId) =>
        set({ items: get().items.filter((item) => item.productId !== productId) }),
      clear: () => set({ items: [] }),
      prune: () => {
        const next = resolvableItems(get().items);
        if (next.length !== get().items.length) set({ items: next });
      },
    }),
    { name: "valalia-cart" },
  ),
);

export function cartCount(items: CartItem[]): number {
  return resolvableItems(items).length;
}

export function cartLines(items: CartItem[]) {
  return items
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return product && product.status === "active" ? { item, product } : null;
    })
    .filter((line): line is { item: CartItem; product: (typeof products)[number] } => line !== null);
}
