"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ChefHat } from "lucide-react";
import { ReviewsSection } from "@/components/shared/reviews-section";
import { DetailPageSkeleton } from "@/components/shared/skeleton";
import { MealImagePanel } from "@/components/meals/meal-image-panel";
import { AddToCartBar } from "@/components/meals/add-to-cart-bar";
import { fetchMealById } from "@/lib/meal-api";

export default function MealDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: meal, isLoading, isError } = useQuery({
    queryKey: ["meal", id],
    queryFn: () => fetchMealById(id),
  });

  if (isLoading) return <DetailPageSkeleton />;

  if (isError || !meal) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <p className="text-3xl mb-3">🍽️</p>
        <p className="font-semibold text-foreground">Meal not found</p>
        <Link href="/meals" className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ArrowLeft size={13} /> Back to meals
        </Link>
      </div>
    );
  }

  const hasDiscount = meal.discountPercent > 0;
  const discountedPrice = hasDiscount ? (Number(meal.price) * (1 - meal.discountPercent / 100)).toFixed(2) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">

      <motion.div
        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
        className="mb-6">
        <Link
          href="/meals"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={15} /> All meals
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-6 md:gap-10 items-start">
        <MealImagePanel meal={meal} />

        <div className="flex flex-col gap-5 py-0 md:py-2">
          <motion.div
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-2">
            {meal.category && (
              <span
                className="text-[10px] font-black tracking-[0.18em] px-3 py-1 rounded-full"
                style={{ backgroundColor: "rgba(74,140,63,0.1)", color: "var(--primary)" }}>
                {meal.category.name.toUpperCase()}
              </span>
            )}
            {meal.isAvailable && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Available
              </span>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.17 }}
            className="text-3xl md:text-4xl font-bold text-foreground leading-tight"
            style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
            {meal.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.22 }}
            className="flex items-center gap-2 md:hidden">
            <ChefHat size={13} className="text-primary shrink-0" />
            <Link
              href={`/providers/${meal.provider.id}`}
              className="text-sm font-semibold text-primary hover:underline">
              {meal.provider.businessName}
            </Link>
          </motion.div>

          {meal.description && (
            <motion.p
              initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.27 }}
              className="text-sm text-muted-foreground leading-relaxed">
              {meal.description}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.33, type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-end gap-3">
            <div>
              {hasDiscount && (
                <p className="text-sm text-muted-foreground line-through tabular-nums leading-none mb-1">
                  ${meal.price}
                </p>
              )}
              <p
                className="text-5xl font-bold tabular-nums leading-none tracking-tight"
                style={{ fontFamily: "var(--font-playfair),Georgia,serif", color: "var(--primary)" }}>
                ${discountedPrice ?? meal.price}
              </p>
            </div>
            {hasDiscount && (
              <span
                className="mb-1 text-xs font-black tracking-wide px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: "#ef4444" }}>
                DEAL
              </span>
            )}
          </motion.div>

          <AddToCartBar meal={meal} />

          <motion.div
            initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
            className="h-px bg-border my-1"
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.4 }}>
            <ReviewsSection mealId={meal.id} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
