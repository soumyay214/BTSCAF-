import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OrderStatus = "confirmed" | "preparing" | "out-for-delivery" | "delivered";

interface ActiveOrder {
  id: string;
  timestamp: number;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}

interface OrderState {
  activeOrder: ActiveOrder | null;
  setOrder: (order: ActiveOrder) => void;
  clearOrder: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      activeOrder: null,
      setOrder: (order) => set({ activeOrder: order }),
      clearOrder: () => set({ activeOrder: null }),
    }),
    { name: "bts-cafe-active-order" }
  )
);
