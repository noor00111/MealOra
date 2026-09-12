"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Meal } from "@/types/meal";

export function MealCard({ meal }: { meal: Meal }) {
  const discountedPrice =  meal.discountPercent > 0
      ? (Number(meal.price) * (1 - meal.discountPercent / 100)).toFixed(2)
      : null;

  return (
    <motion.div variants={fadeUp} whileHover={{ y: -5 }} transition={{ duration: 0.22 }}>
      <Link href={`/meals/${meal.id}`}>
        <div
          className="group rounded-2xl overflow-hidden bg-card flex flex-col h-full transition-all duration-300"
          style={{ boxShadow: "0 2px 12px 0 rgba(74,140,63,0.06)" }}
          
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 10px 36px 0 rgba(74,140,63,0.14)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 2px 12px 0 rgba(74,140,63,0.06)";
          }}>

          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted shrink-0">
            {meal.imageUrl ? (
              <Image
                src={meal.imageUrl}
                alt={meal.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (<div className="flex h-full items-center justify-center text-3xl opacity-20">🍽 </div>)}

            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
            {meal.discountPercent > 0 && (
              <div className="absolute top-2.5 left-2.5">
                <span
                  className="text-[10px] font-black tracking-wide px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: "#ef4444" }}>
                  -{meal.discountPercent}% OFF
                </span>
              </div>
            )}

            <div className="absolute bottom-2.5 right-2.5 flex flex-col items-end">
              {discountedPrice && (
                <span className="text-[10px] text-white/70 line-through tabular-nums leading-none mb-0.5">
                  ${meal.price}
                </span>
              )}
              <span
                className="text-sm font-black tabular-nums px-2.5 py-1 rounded-lg"
                style={{ backgroundColor: "var(--primary)", color: "white" }}>
                ${discountedPrice ?? meal.price}
              </span>
            </div>
          </div>

          <div className="flex flex-col flex-1 px-4 pt-3.5 pb-4 gap-1.5">
            {meal.provider?.businessName && (
              <p className="text-[10px] font-black tracking-[0.14em] text-primary uppercase leading-none">
                {meal.provider.businessName}
              </p>
            )}

            <h3
              className="font-bold text-base text-foreground leading-snug line-clamp-2"
              style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
              {meal.name}
            </h3>

            {meal.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {meal.description}
              </p>
            )}

            {meal.category && (
              <div className="pt-1 mt-auto">
                <span
                  className="inline-flex text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "rgba(74,140,63,0.1)",
                    color: "var(--primary)",
                  }}>
                  {meal.category.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
