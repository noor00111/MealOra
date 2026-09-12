"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { MealCard } from "@/components/shared/meal-card";
import { CardGridSkeleton } from "@/components/shared/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { MealFilters } from "@/components/meals/meal-filters";
import { fetchCategories, fetchMeals } from "@/lib/meal-api";
import { staggerContainer } from "@/lib/motion";
import { MealFilters as MealFiltersType } from "@/types/meal";

const PAGE_SIZE = 9;

export default function MealsPage() {
  const searchParams = useSearchParams();
  const isDealMode = searchParams.get("deal") === "true";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [showPrice, setShowPrice] = useState(false);

  const filters: MealFiltersType = useMemo(() => ({
      search: search || undefined,
      category: category || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      deal: isDealMode || undefined,
    }),
    [search, category, minPrice, maxPrice, isDealMode]
  );

  useEffect(() => { setPage(1); }, [search, category, minPrice, maxPrice]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: meals, isLoading, isError } = useQuery({
    queryKey: ["meals", filters],
    queryFn: () => fetchMeals(filters),
  });

  const totalCount = meals?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const paginatedMeals = meals?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) ?? [];

  const hasActiveFilters = search || category || minPrice || maxPrice;

  function clearFilters() {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="mb-8">

        {isDealMode ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-[10px] font-black tracking-[0.14em] px-3 py-1 rounded-full"
                style={{ color: "#9a3412", backgroundColor: "#fff7ed" }}>
                HOT DEALS
              </span>
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold text-foreground leading-tight"
              style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
              Today&apos;s Deals
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Meals with special discounts from our chefs.
            </p>
          </>
        ) : (
          <>
            <h1
              className="text-4xl md:text-5xl font-bold text-foreground leading-tight"
              style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
              Find your next<br className="hidden sm:block" /> favourite meal.
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {isLoading ? "Loading meals…" : `${totalCount} meals from our kitchens`}
            </p>
          </>
        )}
      </motion.div>

      <MealFilters
        search={search}
        onSearchChange={setSearch}
        categories={categories}
        category={category}
        onCategoryChange={setCategory}
        showPrice={showPrice}
        onTogglePrice={() => setShowPrice((v) => !v)}
        minPrice={minPrice}
        onMinPriceChange={setMinPrice}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
      />

      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center justify-between mb-4">
          <p className="text-xs text-muted-foreground">
            {isLoading ? "Searching…" : `${totalCount} result${totalCount !== 1 ? "s" : ""} found`}
          </p>
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
            <X size={11} /> Clear all filters
          </button>
        </motion.div>
      )}

      {isLoading && <CardGridSkeleton />}

      {isError && (
        <div className="py-20 text-center rounded-2xl border-2 border-dashed border-border">
          <p className="text-2xl mb-3">⚠️</p>
          <p className="font-semibold text-foreground">Could not load meals</p>
          <p className="text-sm text-muted-foreground mt-1">Check your connection and try again.</p>
        </div>
      )}

      {!isLoading && !isError && totalCount === 0 && (
        <div className="py-20 text-center rounded-2xl border-2 border-dashed border-border">
          <p className="text-3xl mb-3">🍽️</p>
          <p className="font-semibold text-foreground">No meals match your search</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Try changing your filters or search term.</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm font-semibold text-primary hover:underline">
              Clear all filters
            </button>
          )}
        </div>
      )}

      {!isLoading && !isError && paginatedMeals.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${JSON.stringify(filters)}-${page}`}
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedMeals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {!isLoading && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={setPage}
          itemLabel="meals"
        />
      )}
    </div>
  );
}
