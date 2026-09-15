"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, X } from "lucide-react";
import { fetchAdminOrders } from "@/lib/admin-api";
import { useRequireRole } from "@/lib/use-require-role";
import { statusColor } from "@/lib/order-status";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { OrderStatus } from "@/types/order";

const allStatus: OrderStatus[] = ["PLACED", "PREPARING", "READY", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const admin = useRequireRole("ADMIN");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: fetchAdminOrders,
    enabled: !!admin,
  });

  if (!admin) return null;

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || o.customer.name.toLowerCase().includes(q)
      || o.customer.email.toLowerCase().includes(q)
      || o.id.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const countFor = (s: OrderStatus) => orders.filter((o) => o.status === s).length;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-8">
        <p className="text-sm font-black tracking-[0.18em] text-primary uppercase mb-1">Admin · Orders</p>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground" style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
          All Orders
        </h1>
        <p className="text-base text-muted-foreground mt-2">{orders.length} total orders on the platform</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="flex gap-2 flex-wrap mb-5">
        <button
          onClick={() => setStatusFilter("ALL")}
          className="h-10 px-5 rounded-xl text-sm font-bold transition-all duration-150"
          style={statusFilter === "ALL"
            ? { backgroundColor: "var(--primary)", color: "#fff" }
            : { backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
          All ({orders.length})
        </button>

        {allStatus.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="h-10 px-4 rounded-xl text-xs font-black tracking-wide transition-all duration-150"
            style={statusFilter === s
              ? { backgroundColor: statusColor[s], color: "#fff" }
              : { backgroundColor: `${statusColor[s]}12`, color: statusColor[s], border: `1px solid ${statusColor[s]}30` }}>
            {s} ({countFor(s)})
          </button>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative mb-6">
        <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name, email or order ID…"
          className="w-full h-12 pl-9 pr-8 rounded-xl border border-border bg-card text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X size={12} />
          </button>
        )}
      </motion.div>

      {!isLoading && filtered.length === 0 && (
        <div className="py-20 text-center rounded-2xl border-2 border-dashed border-border">
          <ShoppingBag size={32} className="mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-lg font-semibold text-foreground">No orders found</p>
          <p className="text-sm text-muted-foreground mt-1">Try changing your filter or search term.</p>
        </div>
      )}

      <motion.div initial="hidden" animate="show" variants={staggerContainer} className="flex flex-col gap-2">
        <AnimatePresence>
          {filtered.map((order) => {
            const color = statusColor[order.status as OrderStatus] ?? "#9ca3af";
            return (
              <motion.div
                key={order.id}
                variants={fadeUp}
                layout
                className="group flex items-center gap-4 px-6 py-5 rounded-2xl bg-card border border-border hover:border-border/70 transition-all"
                style={{ boxShadow: "0 1px 8px 0 rgba(0,0,0,0.04)" }}>

                <div className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: color }} />
                <div className="shrink-0 hidden sm:block">
                  <p className="text-xs font-black tracking-[0.12em] text-muted-foreground uppercase">Order</p>
                  <p className="text-sm font-black font-mono text-foreground tracking-wider">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-foreground truncate">{order.customer.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{order.customer.email}</p>
                </div>

                <div className="text-center shrink-0 hidden sm:block">
                  <p className="text-sm font-black text-foreground">{order.items?.length ?? "–"}</p>
                  <p className="text-xs text-muted-foreground">items</p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-base font-bold tabular-nums text-foreground">${order.totalAmount}</p>
                </div>

                <span
                  className="text-xs font-black tracking-wide px-3 py-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: `${color}15`, color }}>
                  {order.status}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
