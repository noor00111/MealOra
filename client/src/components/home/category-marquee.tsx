"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchMeals } from "@/lib/meal-api";

const CATEGORY_EMOJIS: Record<string, string> = {
  burger: "🍔", pizza: "🍕", salad: "🥗", rice: "🍚", noodles: "🍜",
  soup: "🍲", chicken: "🍗", fish: "🐟", dessert: "🍰", drinks: "🥤",
  breakfast: "🍳", pasta: "🍝", biryani: "🍛", sandwich: "🥪", default: "🍽",
};

function categoryEmoji(name: string) {
  const key = name.toLowerCase();
  return Object.entries(CATEGORY_EMOJIS).find(([k]) => key.includes(k))?.[1] ?? CATEGORY_EMOJIS.default;
}

export function CategoryMarquee() {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
  });

  const { data: meals = [] } = useQuery({
    queryKey: ["meals"],
    queryFn: () => fetchMeals(),
    staleTime: 5 * 60 * 1000,
    enabled: categories.length > 0,
  });

  if (categories.length === 0) return null;

  const mealByCategory = Object.fromEntries(
    categories.map((cat) => [cat.id, meals.find((m) => m.category?.id === cat.id) ?? null])
  );

  const tiles = [...categories, ...categories];

  return (
    <div className="mb-36 bg-background overflow-hidden">
      <div className="mb-20 px-6 text-center">
        <p className="text-xs font-bold tracking-widest text-primary uppercase mb-2">Explore by category</p>
        <h2
          className="text-foreground leading-tight"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
            fontWeight: 500,
          }}>
          What are you craving?
        </h2>
      </div>

      <div
        className="flex gap-4 w-max px-4"
        style={{ animation: "marquee 40s linear infinite" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "paused")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "running")}>
       
        {tiles.map((cat, i) => {
          const meal = mealByCategory[cat.id];
          return (
            <Link
              key={`${cat.id}-${i}`}
              href={`/meals?category=${cat.slug}`}
              className="shrink-0 w-[180px] rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md group/card">
             
              <div className="relative h-[130px] bg-muted overflow-hidden">
                {meal?.imageUrl ? (
                  <Image
                    src={meal.imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                    sizes="180px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {categoryEmoji(cat.name)}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="px-3.5 py-3 flex items-center justify-between">
                <p className="font-semibold text-foreground text-sm">{cat.name}</p>
                <span className="text-lg leading-none">{categoryEmoji(cat.name)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
