import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types/cart";

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (mealId: string) => void;
  setQuantity: (mealId: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.mealId === item.mealId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.mealId === item.mealId ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),
      removeItem: (mealId) =>
        set((state) => ({ items: state.items.filter((i) => i.mealId !== mealId) })),
      setQuantity: (mealId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.mealId !== mealId)
              : state.items.map((i) => (i.mealId === mealId ? { ...i, quantity } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "mealora-cart" }
  )
);
