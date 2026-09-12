"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MapPin, ArrowLeft, ArrowRight, ChefHat } from "lucide-react";
import { fetchProviderById } from "@/lib/meal-api";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { ProfilePageSkeleton } from "@/components/shared/skeleton";

export default function ProviderDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: provider, isLoading, isError } = useQuery({
    queryKey: ["provider", id],
    queryFn: () => fetchProviderById(id),
  });

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (isError || !provider) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-3xl mb-3">🍳</p>
        <p className="font-semibold text-foreground">Kitchen not found</p>
        <Link href="/providers" className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ArrowLeft size={13} /> Back to kitchens
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <Link href="/providers" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft size={16} /> Go Back
        </Link>
      </motion.div>

      <div
        className="rounded-2xl overflow-hidden bg-card mb-8 grid grid-cols-1 md:grid-cols-2 min-h-[280px]"
        style={{ boxShadow: "0 4px 32px 0 rgba(74,140,63,0.12)" }}>
        <div className="relative flex flex-col justify-center px-7 py-8 md:py-10">

          {provider.cuisine && (
            <motion.p
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
              className="text-[10px] font-black tracking-[0.2em] text-primary uppercase mb-3">
              {provider.cuisine} · {provider.meals.length} meals
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.12 }}
            className="text-3xl md:text-4xl font-bold text-foreground leading-tight"
            style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
            {provider.businessName}
          </motion.h1>

          {provider.address && (
            <motion.p
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground mt-3">
              <MapPin size={13} className="shrink-0 text-primary" /> {provider.address}
            </motion.p>
          )}

          {provider.description && (
            <motion.p
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.27 }}
              className="text-sm text-muted-foreground mt-3 leading-relaxed">
              {provider.description}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.34 }}
            className="mt-6 flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "rgba(74,140,63,0.1)", color: "var(--primary)" }}>
              <span className="size-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--primary)" }} />
              Open for orders
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55, delay: 0.1 }}
          className="relative min-h-[220px] md:min-h-0 overflow-hidden bg-muted">
          {provider.logoUrl ? (
            <Image
              src={provider.logoUrl}
              alt={provider.businessName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 448px"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ChefHat size={64} className="text-muted-foreground/15" />
            </div>
          )}
          <div className="absolute inset-y-0 left-0 w-8 hidden md:block bg-gradient-to-r from-card to-transparent" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
        className="mb-5 flex items-center justify-between">
        <h2
          className="text-xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
          Menu
        </h2>
        <span className="text-xs text-muted-foreground">{provider.meals.length} items</span>
      </motion.div>

      {provider.meals.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border-2 border-dashed border-border">
          <p className="text-2xl mb-2">🍽️</p>
          <p className="text-sm text-muted-foreground">No meals available yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden bg-card" style={{ boxShadow: "0 2px 16px 0 rgba(74,140,63,0.06)" }}>
          <div className="h-[3px]" style={{ backgroundColor: "var(--primary)" }} />

          <motion.div initial="hidden" animate="show" variants={staggerContainer} className="divide-y divide-border">
            {provider.meals.map((meal) => (
              <motion.div key={meal.id} variants={fadeUp}>
                <Link href={`/meals/${meal.id}`}>
                  <div className="group flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors duration-150 cursor-pointer">

                    <div className="relative size-14 rounded-xl overflow-hidden bg-muted shrink-0">
                      {meal.imageUrl ? (
                        <Image
                          src={meal.imageUrl}
                          alt={meal.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="56px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg opacity-20">🍽</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold text-base text-foreground leading-snug truncate"
                        style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
                        {meal.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {meal.category?.name ?? ""}
                        {meal.description ? (meal.category?.name ? ` · ${meal.description}` : meal.description) : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-base text-primary tabular-nums">${meal.price}</span>
                      <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-150" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}
