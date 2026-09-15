import { motion } from "framer-motion";
import { SalesChart } from "@/components/dashboard/admin/sales-chart";
import { Category } from "@/types/meal";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CAT_COLORS = ["#f97316", "#8b5cf6", "#4a8c3f", "#eab308", "#3b82f6"];
const MOCK_PERCENTS = [38, 27, 19, 11, 5];

export function SalesAndCategories({chartData, topCats}: {chartData: number[]; topCats: Category[];}) {
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
      className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-3 mb-3">
      <div className="rounded-2xl bg-card p-5" style={{ boxShadow: "0 2px 12px 0 rgba(0,0,0,0.05)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-foreground">Sales Overview</h2>
          <span className="text-xs text-muted-foreground px-2.5 py-1 rounded-lg border border-border">
            Last 7 days
          </span>
        </div>
        <SalesChart data={chartData} days={DAY_LABELS} />
      </div>

      <div className="rounded-2xl bg-card p-5" style={{ boxShadow: "0 2px 12px 0 rgba(0,0,0,0.05)" }}>
        <h2 className="text-sm font-bold text-foreground mb-4">Top Categories</h2>
        {topCats.length === 0 ? (
          <p className="text-sm text-muted-foreground">No categories yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            
            {topCats.map((cat, i) => {
              const pct = MOCK_PERCENTS[i] ?? Math.max(5, 30 - i * 6);
              const color = CAT_COLORS[i % CAT_COLORS.length];
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-sm font-medium text-foreground">{cat.name}</span>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(0,0,0,0.06)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
