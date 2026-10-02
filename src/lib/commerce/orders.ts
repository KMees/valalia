import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CheckoutLine } from "./payment";

export type DeliveryState = "ready" | "pending";

export type PrototypeOrder = {
  id: string;
  email: string;
  lines: CheckoutLine[];
  total: number;
  currency: string;
  paymentRef: string;
  paymentState: "prototype";
  deliveryState: DeliveryState;
  createdAt: string;
};

type OrderState = {
  orders: PrototypeOrder[];
  add: (order: PrototypeOrder) => void;
};

export const useOrders = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      add: (order) => set({ orders: [order, ...get().orders] }),
    }),
    { name: "valalia-orders" },
  ),
);

export function findOrder(orders: PrototypeOrder[], id: string): PrototypeOrder | undefined {
  return orders.find((order) => order.id === id);
}

export function orderId(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let body = "";
  for (let i = 0; i < 6; i += 1) {
    body += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `VL-${body}`;
}
