import Link from "next/link";
import { motion } from "framer-motion";
import { Users, ShoppingBag, ChefHat, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { CountUp } from "@/components/dashboard/admin/count-up";
import { Sparkline } from "@/components/dashboard/admin/sparkline";

const SPARKS = {
  customers: [4, 5, 4, 6, 7, 6, 8],
  kitchens:  [3, 3, 4, 4, 5, 5, 6],
  suspended: [1, 2, 1, 0, 1, 0, 0],
  avg:       [14, 18, 15, 22, 19, 24, 21],
};

export function RevenueAndOrdersRow({revenue, totalOrders, chartData}: {revenue: number; totalOrders: number; chartData: number[];}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
      className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-3 mb-3">
      <div
        className="rounded-2xl bg-card p-6 flex justify-between items-end gap-4"
        style={{ boxShadow: "0 2px 16px 0 rgba(0,0,0,0.06)" }}>
        <div>
          <p className="text-[11px] font-black tracking-[0.16em] text-muted-foreground uppercase mb-2">Total Revenue</p>
          <p
            className="text-5xl font-bold text-foreground tabular-nums leading-none"
            style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
            $<CountUp to={revenue} decimals={2} />
          </p>
          <p className="text-sm text-muted-foreground mt-2">Across {totalOrders} completed orders</p>
        </div>
        <div className="shrink-0 opacity-80">
          <Sparkline data={chartData} color="#f97316" id="rev-spk" />
        </div>
      </div>

      <Link href="/admin/orders">
        <div
          className="group rounded-2xl p-6 flex flex-col justify-between h-full cursor-pointer hover:border-primary/40 transition-all border border-border bg-card"
          style={{ boxShadow: "0 2px 12px 0 rgba(74,140,63,0.06)" }}>
          <div className="flex items-center justify-between">
            <div className="size-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(74,140,63,0.1)" }}>
              <ShoppingBag size={16} style={{ color: "var(--primary)" }} />
            </div>
            <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="mt-4">
            <p
              className="text-4xl font-bold tabular-nums"
              style={{ fontFamily: "var(--font-playfair),Georgia,serif", color: "var(--primary)" }}>
              <CountUp to={totalOrders} />
            </p>
            <p className="text-sm text-muted-foreground mt-0.5 font-medium">Total Orders</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function StatGrid({customers, kitchens, suspended, avgOrder}: {customers: number; kitchens: number; suspended: number; avgOrder: number;}) {
  
  const stats = [
    { label: "Customers",  value: customers,  icon: Users,          color: "#3b82f6", bg: "rgba(59,130,246,0.09)",  spark: SPARKS.customers,  id: "spk-c",  prefix: "" },
    { label: "Kitchens",   value: kitchens,   icon: ChefHat,        color: "#f97316", bg: "rgba(249,115,22,0.09)",  spark: SPARKS.kitchens,   id: "spk-k",  prefix: "" },
    { label: "Suspended",  value: suspended,  icon: AlertTriangle,  color: "#ef4444", bg: "rgba(239,68,68,0.09)",   spark: SPARKS.suspended,  id: "spk-s",  prefix: "" },
    { label: "Avg. Order", value: avgOrder,   icon: TrendingUp,     color: "#8b5cf6", bg: "rgba(139,92,246,0.09)",  spark: SPARKS.avg,        id: "spk-a",  prefix: "$", decimals: 2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        
      {stats.map((s) => (
        <div key={s.label}
          className="rounded-2xl bg-card p-4 relative overflow-hidden"
          style={{ boxShadow: "0 1px 10px 0 rgba(0,0,0,0.05)" }}>

          <div className="absolute top-0 inset-x-0 h-[3px]" style={{ backgroundColor: s.color }} />
          <div className="flex items-center justify-between mb-3">
            <div className="size-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg }}>
              <s.icon size={14} style={{ color: s.color }} />
            </div>
            <Sparkline data={s.spark} color={s.color} id={s.id} />
          </div>
          <p className="text-[10px] font-black tracking-[0.14em] text-muted-foreground uppercase">{s.label}</p>
          
          <p
            className="text-2xl font-bold tabular-nums text-foreground mt-0.5 leading-none"
            style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
            {s.prefix}<CountUp to={s.value} decimals={(s as { decimals?: number }).decimals ?? 0} />
          </p>

          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <span style={{ color: s.color }}>↑ {Math.floor(Math.random() * 8) + 2}.{Math.floor(Math.random() * 9)}%</span>
            {" "}this month
          </p>
        </div>
      ))}
    </motion.div>
  );
}
