"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChefHat, MapPin, ArrowRight } from "lucide-react";
import { fetchProviders } from "@/lib/meal-api";
import { fadeUp, staggerContainer } from "@/lib/motion";

export default function ProvidersPage() {
  const { data: providers, isLoading } = useQuery({
    queryKey: ["providers"],
    queryFn: fetchProviders,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">

      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="mb-8">
        <h1 className="text-3xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
          Meet Your Cooks!
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          {isLoading ? "Loading…" : `${providers?.length ?? 0} kitchens on MealOra`}
        </p>
      </motion.div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border overflow-hidden bg-card">
              <div className="h-36 bg-muted animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-36 bg-muted animate-pulse rounded" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                <div className="h-3 w-48 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && providers && providers.length > 0 && (
        <motion.div
          initial="hidden" animate="show" variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {providers.map((provider) => (
            <motion.div key={provider.id} variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Link href={`/providers/${provider.id}`}>
                <div className="group rounded-2xl border border-border overflow-hidden bg-card hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-200">
                  <div className="relative h-36 bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center overflow-hidden">
                    {provider.logoUrl ? (
                      <Image
                        src={provider.logoUrl} alt={provider.businessName} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <ChefHat size={40} className="text-muted-foreground/30" />
                    )}
                    {provider.cuisine && (
                      <span className="absolute bottom-2 left-3 text-[10px] font-black tracking-[0.12em] px-2.5 py-0.5 rounded-full"
                        style={{ color: "#065f46", backgroundColor: "rgba(209,250,229,0.9)" }}>
                        {provider.cuisine.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="font-semibold text-base text-foreground leading-snug truncate">
                          {provider.businessName}
                        </h2>
                        {provider.address && (
                          <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <MapPin size={11} /> {provider.address}
                          </p>
                        )}
                      </div>
                      <div className="size-7 rounded-full bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                        <ArrowRight size={13} />
                      </div>
                    </div>
                    {provider.description && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                        {provider.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!isLoading && (!providers || providers.length === 0) && (
        <div className="py-24 text-center rounded-2xl border-2 border-dashed border-border">
          <p className="text-3xl mb-3">👨‍🍳</p>
          <p className="font-medium text-foreground">No chefs yet</p>
          <p className="text-sm text-muted-foreground mt-1">Check back soon.</p>
        </div>
      )}
    </div>
  );
}
