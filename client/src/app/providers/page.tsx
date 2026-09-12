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
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">

      <motion.div
        initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="mb-10">
        <h1
          className="text-4xl md:text-5xl font-bold text-foreground leading-tight"
          style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
          Meet Our Kitchens<br className="hidden sm:block" /> behind every bite.
        </h1>
        <p className="text-sm text-muted-foreground mt-3">
          {isLoading ? "Loading…" : `${providers?.length ?? 0} kitchens cooking on MealOra`}
        </p>
      </motion.div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-card shadow-sm" style={{ boxShadow: "0 2px 16px 0 rgba(74,140,63,0.06)" }}>
              <div className="h-1.5 bg-muted animate-pulse" />
              <div className="p-5 space-y-2">
                <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                <div className="h-6 w-44 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-44 bg-muted animate-pulse" />
              <div className="p-4 flex justify-between">
                <div className="h-3 w-28 bg-muted animate-pulse rounded" />
                <div className="h-3 w-10 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && providers && providers.length > 0 && (
        <motion.div
          initial="hidden" animate="show" variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {providers.map((provider) => (
            <motion.div key={provider.id} variants={fadeUp}>
              <Link href={`/providers/${provider.id}`}>
                <div
                  className="group rounded-2xl overflow-hidden bg-card transition-all duration-300 cursor-pointer"
                  style={{ boxShadow: "0 2px 16px 0 rgba(74,140,63,0.06)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px 0 rgba(74,140,63,0.13)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px 0 rgba(74,140,63,0.06)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
                  <div className="h-[3px]" style={{ backgroundColor: "var(--primary)" }} />

                  <div className="px-5 pt-4 pb-3">
                    <h2
                      className="text-2xl font-bold text-foreground leading-tight"
                      style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
                      {provider.businessName}
                    </h2>
                  </div>

                  <div className="relative h-44 overflow-hidden bg-muted mx-0">
                    {provider.logoUrl ? (
                      <Image
                        src={provider.logoUrl}
                        alt={provider.businessName}
                        fill
                        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 50vw"/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ChefHat size={44} className="text-muted-foreground/20" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between px-5 py-3.5 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
                      {provider.address ? (
                        <>
                          <MapPin size={11} className="shrink-0" />
                          <span className="truncate">{provider.address}</span>
                        </>
                      ) : (
                        <span>{provider.description ? provider.description.slice(0, 40) + "…" : "Local kitchen"}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-primary shrink-0 ml-3 group-hover:gap-2 transition-all duration-200">
                       <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!isLoading && (!providers || providers.length === 0) && (
        <div className="py-28 text-center rounded-2xl border-2 border-dashed border-border">
          <p className="text-3xl mb-3">👨‍🍳</p>
          <p className="font-semibold text-foreground">No kitchens yet</p>
          <p className="text-sm text-muted-foreground mt-1">Check back soon — chefs are signing up.</p>
        </div>
      )}
    </div>
  );
}
