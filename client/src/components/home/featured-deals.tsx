"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchProviders } from "@/lib/meal-api";
import { TopTicker } from "@/components/shared/top-ticker";

export function FeaturedDeals() {
  const { data: providers = [] } = useQuery({
    queryKey: ["providers"],
    queryFn: fetchProviders,
    staleTime: 5 * 60 * 1000,
  });

  const shown = providers.slice(0, 3);

  return (
    <div>
      <TopTicker />
      <div className="relative overflow-hidden min-h-[520px] md:min-h-[580px] flex items-center">
        <Image
          src="/images/home3.png"
          alt="Trending food deal"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="max-w-lg">
            <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">
              Crave it. Taste it. Love it!
            </p>
            <h2
              className="text-white leading-[1.1] mb-10"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(1.9rem, 4.5vw, 3rem)",
                fontWeight: 700,
              }}>
              Bite Into Something Special - 25% Off
            </h2>

            <div className="flex flex-col gap-3">
              {shown.length > 0
                ? shown.map((provider, i) => (
                    <Link
                      key={provider.id}
                      href={`/providers/${provider.id}`}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border backdrop-blur-sm transition-all duration-200 ${
                        i === 1
                          ? "bg-primary border-primary shadow-lg"
                          : "bg-white/10 border-white/20 hover:bg-white/15"
                      }`}>

                      <div className="relative shrink-0 size-11 rounded-lg overflow-hidden bg-white/20">
                        {provider.logoUrl ? (
                          <Image
                            src={provider.logoUrl}
                            alt={provider.businessName}
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">🍽</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-white truncate">{provider.businessName}</p>
                        <p className="text-xs mt-0.5 text-white/60 truncate">
                          {provider.cuisine ?? "Signature dishes"} · Order now & save
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                          i === 1 ? "bg-white/25 text-white" : "bg-primary/80 text-white"
                        }`}>
                        25% off
                      </span>
                    </Link>
                  ))
                : [0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`h-[62px] rounded-xl border animate-pulse ${
                        i === 1 ? "bg-primary/40 border-primary/50" : "bg-white/10 border-white/20"
                      }`}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
