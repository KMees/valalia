import { useEffect, useState } from "react";
import { useCart } from "@/lib/commerce/cart";
import { useOrders } from "@/lib/commerce/orders";

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function usePersistReady(store: {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (fn: () => void) => () => void;
  };
}): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (store.persist.hasHydrated()) {
      setReady(true);
      return;
    }
    return store.persist.onFinishHydration(() => setReady(true));
  }, [store]);
  return ready;
}

export function useCartReady(): boolean {
  return usePersistReady(useCart);
}

export function useOrdersReady(): boolean {
  return usePersistReady(useOrders);
}
