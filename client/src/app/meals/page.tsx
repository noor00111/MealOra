"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { MealCard } from "@/components/shared/meal-card";
import { Input } from "@/components/ui/input";
import { fetchCategories, fetchMeals } from "@/lib/meal-api";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { MealFilters } from "@/types/meal";

export default function MealsPage() {
  const searchParams = useSearchParams();
  const isDealMode = searchParams.get("deal") === "true";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filters: MealFilters = useMemo(
    () => ({
      search: search || undefined,
      category: category || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      deal: isDealMode || undefined,
    }),
    [search, category, minPrice, maxPrice, isDealMode]
  );

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const {data: meals, isLoading, isError} = useQuery({
    queryKey: ["meals", filters],
    queryFn: () => fetchMeals(filters),
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-8">
      <motion.div initial="hidden" animate="show" variants={fadeUp}>
        {isDealMode ? (
          <>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black tracking-[0.12em] px-2.5 py-1 rounded-full" style={{ color: "#9a3412", backgroundColor: "#fff7ed" }}>HOT DEALS</span>
            </div>
            <h1 className="text-2xl font-semibold text-foreground" style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>Today&apos;s Deals</h1>
            <p className="text-sm text-muted-foreground">Meals with special discounts from our chefs.</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-foreground">Browse meals</h1>
            <p className="text-sm text-muted-foreground">Find something to eat from our providers.</p>
          </>
        )}
      </motion.div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="search" className="text-sm font-medium">
            Search
          </label>
          <Input
            id="search"
            placeholder="Search meals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-8 rounded-lg border border-input bg-card px-2.5 text-sm outline-none focus-visible:border-ring">
            <option value="">All</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="minPrice" className="text-sm font-medium">
            Min price
          </label>
          <Input
            id="minPrice"
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-24"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="maxPrice" className="text-sm font-medium">
            Max price
          </label>
          <Input
            id="maxPrice"
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-24"
          />
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading meals...</p>}
      {isError && <p className="text-sm text-destructive">Could not load meals.</p>}
      {!isLoading && !isError && meals?.length === 0 && (
        <p className="text-sm text-muted-foreground">No meals match your filters.</p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={JSON.stringify(filters)}
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {meals?.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
