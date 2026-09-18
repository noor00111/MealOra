"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Meal } from "@/types/meal";

export function MealCard({ meal }: { meal: Meal }) {
  const [hovered, setHovered] = useState(false);

  const discountedPrice =
    meal.discountPercent > 0
      ? (Number(meal.price) * (1 - meal.discountPercent / 100)).toFixed(2)
      : null;

  return (
    <motion.div variants={fadeUp} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Link href={`/meals/${meal.id}`}>
        <div
          className="group rounded-2xl overflow-hidden bg-card flex flex-col h-full"
          style={{
            boxShadow: hovered
              ? "0 20px 52px 0 rgba(150,167,141,0.25)"
              : "0 2px 12px 0 rgba(150,167,141,0.06)",
            transition: "box-shadow 0.35s ease",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}>

          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted shrink-0">
            {meal.imageUrl ? (
              <Image
                src={meal.imageUrl}
                alt={meal.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-3xl opacity-20">🍽</div>
            )}

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
              <motion.span
                animate={{ scale: hovered ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 18 }}
                className="text-sm font-black tabular-nums px-2.5 py-1 rounded-lg"
                style={{ backgroundColor: "var(--primary)", color: "white" }}>
                ${discountedPrice ?? meal.price}
              </motion.span>
            </div>
          </div>

          <div className="relative flex flex-col flex-1 px-4 pt-3.5 pb-4 gap-1.5 overflow-hidden">

            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundColor: "var(--primary)", originY: 1 }}
              initial={{ y: "100%" }}
              animate={{ y: hovered ? "0%" : "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            />

            <div className="relative z-10 flex flex-col flex-1 gap-1.5">
              {meal.provider?.businessName && (
                <motion.p
                  className="text-[10px] font-black tracking-[0.14em] uppercase leading-none"
                  animate={{ color: hovered ? "rgba(255,255,255,0.65)" : "var(--primary)" }}
                  transition={{ duration: 0.18 }}>
                  {meal.provider.businessName}
                </motion.p>
              )}

              <motion.h3
                className="font-bold text-base leading-snug line-clamp-2"
                style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}
                animate={{ color: hovered ? "#ffffff" : "var(--foreground)" }}
                transition={{ duration: 0.18 }}>
                {meal.name}
              </motion.h3>

              {meal.description && (
                <motion.p
                  className="text-xs line-clamp-2 leading-relaxed"
                  animate={{ color: hovered ? "rgba(255,255,255,0.72)" : "var(--muted-foreground)" }}
                  transition={{ duration: 0.18 }}>
                  {meal.description}
                </motion.p>
              )}

              {meal.category && (
                <div className="pt-1 mt-auto">
                  <motion.span
                    className="inline-flex text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full"
                    animate={
                      hovered
                        ? { backgroundColor: "rgba(255,255,255,0.18)", color: "#ffffff" }
                        : { backgroundColor: "rgba(150,167,141,0.10)", color: "var(--primary)" }
                    }
                    transition={{ duration: 0.18 }}>
                    {meal.category.name}
                  </motion.span>
                </div>
              )}
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}
