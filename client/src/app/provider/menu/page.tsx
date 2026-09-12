"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { fetchCategories } from "@/lib/meal-api";
import { deleteMyMeal, fetchMyMeals } from "@/lib/provider-api";
import { ProviderMeal } from "@/types/provider-meal";
import { MealFormDialog } from "@/components/provider/meal-form-dialog";

export default function ProviderMenuPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<ProviderMeal | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== "PROVIDER") router.replace("/dashboard");
    else if (!user) router.replace("/login");
  }, [user, router]);

  const { data: meals, isLoading } = useQuery({
    queryKey: ["my-meals"],
    queryFn: fetchMyMeals,
    enabled: user?.role === "PROVIDER",
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMyMeal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-meals"] }),
  });

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(meal: ProviderMeal) {
    setEditing(meal);
    setDialogOpen(true);
  }

  const filteredMeals = useMemo(
    () => !activeCategory ? (meals ?? []) : (meals ?? []).filter(m => m.categoryId === activeCategory),
    [meals, activeCategory]
  );

  const availableCount = (meals ?? []).filter(m => m.isAvailable).length;

  if (!user || user.role !== "PROVIDER") return null;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">

      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
            My Kitchen Menu
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading ? "Loading…" : `${meals?.length ?? 0} meals · ${availableCount} available`}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-primary text-white hover:opacity-90 hover:-translate-y-px transition-all duration-200 shadow-sm shrink-0">
          <Plus size={14} /> Add Meal
        </button>
      </motion.div>

      {categories && categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-2 flex-wrap mb-5">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              activeCategory === null
                ? "bg-brand-green text-white border-brand-green"
                : "bg-card text-muted-foreground border-border hover:border-brand-green/60 hover:text-brand-green"
            }`}>
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                activeCategory === cat.id
                  ? "bg-brand-green text-white border-brand-green"
                  : "bg-card text-muted-foreground border-border hover:border-brand-green/60 hover:text-brand-green"
              }`}>
              {cat.name}
            </button>
          ))}
        </motion.div>
      )}

      {isLoading && (
        <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5">
              <div className="size-16 rounded-xl bg-muted animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-40 bg-muted animate-pulse rounded" />
                <div className="h-2.5 w-24 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-3 w-12 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="rounded-2xl border border-border overflow-hidden">
          {filteredMeals.length === 0 && meals && meals.length > 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No meals in this category.{" "}
              <button onClick={() => setActiveCategory(null)} className="text-primary underline">Show all</button>
            </div>
          )}

          <motion.div initial="hidden" animate="show" variants={staggerContainer} className="divide-y divide-border">
            {filteredMeals.map((meal) => (
              <motion.div key={meal.id} variants={fadeUp}>
                <div className="group relative flex items-center gap-4 px-4 py-3.5 hover:bg-muted/40 transition-colors duration-150">
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ backgroundColor: meal.isAvailable ? "#10b981" : "#9ca3af" }}
                  />
                  <div className="relative size-16 rounded-xl overflow-hidden bg-muted shrink-0">
                    {meal.imageUrl ? (
                      <Image
                        src={meal.imageUrl} alt={meal.name} fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="56px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl opacity-25 select-none">🍽</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base text-foreground leading-snug">{meal.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {meal.description ? ` ${meal.description}` : ""}
                    </p>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    {meal.discountPercent > 0 && (
                      <span className="text-[9px] font-black tracking-wide px-1.5 py-0.5 rounded-full mb-0.5"
                        style={{ color: "#991b1b", backgroundColor: "#fef2f2" }}>
                        -{meal.discountPercent}%
                      </span>
                    )}
                    <span className="font-bold text-primary text-base tabular-nums">
                      $ {meal.discountPercent > 0
                        ? (Number(meal.price) * (1 - meal.discountPercent / 100)).toFixed(2)
                        : meal.price}
                    </span>
                    {meal.discountPercent > 0 && (
                      <span className="text-[10px] text-muted-foreground line-through tabular-nums">$ {meal.price}</span>
                    )}
                  </div>

                  <span
                    className="hidden sm:inline-flex shrink-0 text-[9px] font-black tracking-[0.12em] px-2 py-0.5 rounded-full"
                    style={meal.isAvailable
                      ? { color: "#065f46", backgroundColor: "#d1fae5" }
                      : { color: "#374151", backgroundColor: "#f3f4f6" }
                    }>
                    {meal.isAvailable ? "OPEN" : "PAUSED"}
                  </span>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(meal)}
                      className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      aria-label="Edit">
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(meal.id)}
                      disabled={deleteMutation.isPending}
                      className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                      aria-label="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <button
            onClick={openCreate}
            className="group w-full flex items-center gap-4 px-4 py-3.5 border-t border-dashed border-border hover:bg-muted/30 transition-colors duration-150">
            <div className="size-16 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/50 transition-colors duration-200">
              <Plus size={16} />
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-150">
              Add another meal
            </span>
          </button>
        </div>
      )}

      {!isLoading && !meals?.length && (
        <div className="mt-4 py-20 text-center rounded-2xl border-2 border-dashed border-border">
          <p className="text-3xl mb-3">🍳</p>
          <p className="font-semibold text-foreground mb-1">Your menu is empty</p>
          <p className="text-sm text-muted-foreground mb-5">Add your first meal to get started.</p>
          <button onClick={openCreate} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-primary text-white hover:opacity-90 transition-all duration-200 shadow-sm">
            <Plus size={14} /> Add your first meal
          </button>
        </div>
      )}

      <MealFormDialog open={dialogOpen} onOpenChange={setDialogOpen} editing={editing} />
    </div>
  );
}
