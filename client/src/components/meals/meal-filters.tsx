import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Category } from "@/types/meal";

export function MealFilters({
  search,
  onSearchChange,
  categories,
  category,
  onCategoryChange,
  showPrice,
  onTogglePrice,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  categories: Category[] | undefined;
  category: string;
  onCategoryChange: (value: string) => void;
  showPrice: boolean;
  onTogglePrice: () => void;
  minPrice: string;
  onMinPriceChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.07 }}
        className="relative mb-5">

        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"/>
        <input
          type="text"
          placeholder="Search by name, description…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-12 pl-10 pr-12 rounded-2xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors duration-200"
          style={{ boxShadow: "0 2px 8px 0 rgba(74,140,63,0.06)" }}
        />

        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search">
            <X size={14} />
          </button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}
        className="flex items-center gap-2 flex-wrap mb-4">
        <button
          onClick={() => onCategoryChange("")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
            !category
              ? "text-white border-transparent"
              : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
          }`}
          style={!category ? { backgroundColor: "var(--primary)", borderColor: "var(--primary)" } : {}}>
          All
        </button>

        {categories?.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.slug)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              category === cat.slug
                ? "text-white border-transparent"
                : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
            }`}
            style={category === cat.slug ? { backgroundColor: "var(--primary)", borderColor: "var(--primary)" } : {}}>
            {cat.name}
          </button>
        ))}

        <button
          onClick={onTogglePrice}
          className={`ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
            showPrice || minPrice || maxPrice
              ? "text-white border-transparent"
              : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
          }`}
          style={showPrice || minPrice || maxPrice ? { backgroundColor: "var(--primary)", borderColor: "var(--primary)" } : {}}>
          <SlidersHorizontal size={13} />
          Price
        </button>
      </motion.div>

      <AnimatePresence>
        {showPrice && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden mb-5">
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card"
              style={{ boxShadow: "0 2px 8px 0 rgba(74,140,63,0.05)" }}>
              <span className="text-xs font-semibold text-muted-foreground shrink-0">Price range</span>
              
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-[120px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => onMinPriceChange(e.target.value)}
                    className="w-full h-9 pl-6 pr-3 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/60 transition-colors"
                  />
                </div>

                <span className="text-muted-foreground text-xs">to</span>
                <div className="relative flex-1 max-w-[120px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => onMaxPriceChange(e.target.value)}
                    className="w-full h-9 pl-6 pr-3 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/60 transition-colors"
                  />
                </div>

                {(minPrice || maxPrice) && (
                  <button
                    onClick={() => { onMinPriceChange(""); onMaxPriceChange(""); }}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                    Clear
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
