"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { Meal } from "@/types/meal";

export function AddToCartBar({ meal }: { meal: Meal }) {
  
  const addItem = useCartStore((s) => s.addItem);
  const cartItemCount = useCartStore((s) => s.items.length);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addItem({
      mealId: meal.id,
      name: meal.name,
      price: meal.price,
      imageUrl: meal.imageUrl,
      providerId: meal.provider.id,
      providerName: meal.provider.businessName,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.38 }}
      className="flex flex-wrap items-center gap-3">
      <motion.button
        whileHover={meal.isAvailable && !added ? { scale: 1.02, y: -1 } : {}}
        whileTap={meal.isAvailable && !added ? { scale: 0.97 } : {}}
        disabled={!meal.isAvailable}
        onClick={handleAddToCart}
        className="relative flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        style={{
          backgroundColor: added ? "#16a34a" : "var(--primary)",
          boxShadow: meal.isAvailable
            ? added
              ? "0 4px 20px 0 rgba(22,163,74,0.4)"
              : "0 4px 20px 0 rgba(74,140,63,0.35)"
            : "none",
        }}>

        <AnimatePresence mode="wait">
          {added ? (
            <motion.span
              key="added"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="flex items-center gap-2">
              <Check size={15} strokeWidth={2.5} />
              Added to cart!
            </motion.span>
          ) : (
            <motion.span
              key="add"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2">
              <ShoppingCart size={15} />
              {meal.isAvailable ? "Add to cart" : "Unavailable"}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {cartItemCount > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}>
          <Link
            href="/cart"
            className="flex items-center gap-2 px-5 py-3.5 rounded-full text-sm font-semibold border transition-all duration-200 hover:border-primary/50 hover:text-primary"
            style={{
              borderColor: "var(--border)",
              color: "var(--muted-foreground)",
              backgroundColor: "var(--card)",
            }}>
            <ShoppingCart size={14} />
            Cart
            <span
              className="size-5 rounded-full text-[10px] font-black flex items-center justify-center text-white"
              style={{ backgroundColor: "var(--primary)" }}>
              {cartItemCount}
            </span>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
