"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChefHat, MapPin, ArrowRight } from "lucide-react";
import { fetchProviders } from "@/lib/meal-api";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { Provider } from "@/types/provider";
import { KitchenStripSkeleton } from "@/components/shared/skeleton";

function KitchenStrip({ provider }: { provider: Provider }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div variants={fadeUp}>
      <Link href={`/providers/${provider.id}`}>
        <div
          className="relative flex overflow-hidden rounded-2xl cursor-pointer"
          style={{
            backgroundColor: hovered ? "rgba(150,167,141,0.045)" : "var(--card)",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}>


          <div className="relative w-[180px] md:w-[240px] h-[140px] md:h-[156px] shrink-0 overflow-hidden bg-muted">
            {provider.logoUrl ? (
              <Image
                src={provider.logoUrl}
                alt={provider.businessName}
                fill
                className="object-cover"
                style={{
                  transform: hovered ? "scale(1.07)" : "scale(1)",
                  transition: "transform 0.65s ease",
                }}
                sizes="240px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ChefHat size={36} className="text-muted-foreground/20" />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center px-5 md:px-7 py-5 flex-1 min-w-0">
            {provider.cuisine && (
              <p className="text-[10px] font-black tracking-[0.18em] text-primary uppercase mb-1.5">
                {provider.cuisine}
              </p>
            )}

            <motion.h2
              className="text-lg md:text-2xl font-bold text-foreground leading-tight"
              style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}
              animate={{ x: hovered ? 6 : 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}>
              {provider.businessName}
            </motion.h2>

            {(provider.address || provider.description) && (
              <div className="flex items-start gap-1.5 mt-2">
                {provider.address ? (
                  <>
                    <MapPin size={11} className="text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground line-clamp-1">{provider.address}</p>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {provider.description}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center pr-5 md:pr-7 shrink-0">
            <motion.div
              animate={{ x: hovered ? 5 : 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              style={{ color: hovered ? "var(--primary)" : "var(--muted-foreground)", transition: "color 0.2s ease" }}>
              <ArrowRight size={20} strokeWidth={2} />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProvidersPage() {
  const { data: providers, isLoading } = useQuery({
    queryKey: ["providers"],
    queryFn: fetchProviders,
  });

  const count = providers?.length ?? 0;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38 }}
        className="flex items-end gap-5 mb-10">
        {!isLoading && (
          <span
            className="text-6xl md:text-8xl font-black tabular-nums leading-none"
            style={{ color: "var(--primary)", fontFamily: "var(--font-geist-sans)" }}>
            {count}
          </span>
        )}
        <div className="pb-1">
          <p className="text-sm font-black tracking-[0.18em] text-primary uppercase mb-0.5">
            MealOra · Kitchens
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold text-foreground leading-tight"
            style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
            Kitchens behind<br className="hidden sm:block" /> every plate.
          </h1>
        </div>
      </motion.div>

      {isLoading && (
        <div className="flex flex-col gap-5">
          {Array.from({ length: 4 }).map((_, i) => <KitchenStripSkeleton key={i} />)}
        </div>
      )}

      {!isLoading && providers && providers.length > 0 && (
        <motion.div
          initial="hidden" animate="show" variants={staggerContainer}
          className="flex flex-col gap-5">
          {providers.map((provider) => (
            <KitchenStrip key={provider.id} provider={provider} />
          ))}
        </motion.div>
      )}

      {!isLoading && (!providers || providers.length === 0) && (
        <div className="py-28 text-center rounded-2xl bg-card">
          <p className="text-3xl mb-3">👨‍🍳</p>
          <p className="font-semibold text-foreground">No kitchens yet</p>
          <p className="text-sm text-muted-foreground mt-1">Check back soon — chefs are signing up.</p>
        </div>
      )}
    </div>
  );
}
