"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ReviewsSection } from "@/components/shared/reviews-section";
import { fetchMealById } from "@/lib/meal-api";
import { fadeUp } from "@/lib/motion";
import { useCartStore } from "@/lib/cart-store";

export default function MealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const addItem = useCartStore((s) => s.addItem);
  const cartItemCount = useCartStore((s) => s.items.length);
  const [added, setAdded] = useState(false);

  const {data: meal, isLoading, isError} = useQuery({
    queryKey: ["meal", id],
    queryFn: () => fetchMealById(id),
  });

  if (isLoading) {
    return <p className="p-8 text-sm text-muted-foreground">Loading meal...</p>;
  }

  if (isError || !meal) {
    return <p className="p-8 text-sm text-destructive">Meal not found.</p>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-muted">
        {meal.imageUrl ? (
          <Image src={meal.imageUrl} alt={meal.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{meal.name}</h1>
          <Link
            href={`/providers/${meal.provider.id}`}
            className="text-sm text-primary underline-offset-4 hover:underline">
            {meal.provider.businessName}
          </Link>
        </div>
        <span className="text-xl font-semibold text-primary">${meal.price}</span>
      </div>

      <div className="flex items-center gap-2 text-xs">
        {meal.category && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-accent-foreground">
            {meal.category.name}
          </span>
        )}
        {!meal.isAvailable && (
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-destructive">Unavailable</span>
        )}
      </div>

      <p className="text-sm text-muted-foreground">{meal.description}</p>

      <div className="flex items-center gap-3">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-fit">
          <Button
            disabled={!meal.isAvailable}
            className="w-fit"
            onClick={() => {
              addItem({
                mealId: meal.id,
                name: meal.name,
                price: meal.price,
                imageUrl: meal.imageUrl,
                providerId: meal.provider.id,
                providerName: meal.provider.businessName,
              });
              setAdded(true);
              setTimeout(() => setAdded(false), 1500);
            }}
          >
            {added ? "Added!" : "Add to cart"}
          </Button>
        </motion.div>

        {cartItemCount > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-fit"
          >
            <Button variant="outline" nativeButton={false} render={<Link href="/cart" />}>
              View cart ({cartItemCount})
            </Button>
          </motion.div>
        )}
      </div>

      <ReviewsSection mealId={meal.id} />
    </motion.div>
  );
}
