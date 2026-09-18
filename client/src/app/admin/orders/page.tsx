"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Search, X, ChevronRight, User, Mail, Package,
  LayoutGrid, Clock, ChefHat, CheckCircle2, Truck, XCircle,
} from "lucide-react";
import { fetchAdminOrders } from "@/lib/admin-api";
import { useRequireRole } from "@/lib/use-require-role";
import { statusColor } from "@/lib/order-status";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { OrderStatus } from "@/types/order";

const allStatus: OrderStatus[] = ["PLACED", "PREPARING", "READY", "DELIVERED", "CANCELLED"];

const statusIcon: Record<OrderStatus, React.ElementType> = {
  PLACED:    Clock,
  PREPARING: ChefHat,
  READY:     CheckCircle2,
  DELIVERED: Truck,
  CANCELLED: XCircle,
};

const statusLabel: Record<OrderStatus, string> = {
  PLACED:    "Placed",
  PREPARING: "Preparing",
  READY:     "Ready",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default function AdminOrdersPage() {
  const admin = useRequireRole("ADMIN");
  const [search, setSearch]           = useState("");
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
    const matchSearch =
      !q ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const countFor = (s: OrderStatus) => orders.filter((o) => o.status === s).length;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-8">
        <p className="text-sm font-black tracking-[0.18em] text-primary uppercase mb-1">Admin · Orders</p>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground" style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
          All Orders
        </h1>
        <p className="text-base text-muted-foreground mt-2">{orders.length} total orders on the platform</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 flex-wrap mb-5">
       <button
          onClick={() => setStatusFilter("ALL")}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-sm font-semibold transition-all duration-150"
          style={statusFilter === "ALL"
            ? { backgroundColor: "var(--primary)", color: "#fff" }
            : { backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
          <LayoutGrid size={14} />
          All ({orders.length})
        </button>

        {allStatus.map((s) => {
          const Icon  = statusIcon[s];
          const color = statusColor[s];
          const active = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-sm font-semibold transition-all duration-150"
              style={active
                ? { backgroundColor: color, color: "#fff" }
                : { backgroundColor: `${color}18`, color, border: `1px solid ${color}40` }}>
              <Icon size={14} />
              {statusLabel[s]} ({countFor(s)})
            </button>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
        className="relative mb-5">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name, email or order ID..."
          className="w-full h-11 pl-10 pr-9 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X size={13} />
          </button>
        )}
      </motion.div>

      {!isLoading && filtered.length === 0 && (
        <div className="py-20 text-center rounded-2xl border-2 border-dashed border-border">
          <ShoppingBag size={32} className="mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-base font-semibold text-foreground">No orders found</p>
          <p className="text-sm text-muted-foreground mt-1">Try changing your filter or search term.</p>
        </div>
      )}

      <motion.div
        initial="hidden" animate="show" variants={staggerContainer}
        className="flex flex-col gap-3">
        <AnimatePresence>
          {filtered.map((order) => {
            const color     = statusColor[order.status as OrderStatus] ?? "#9ca3af";
            const Icon      = statusIcon[order.status as OrderStatus] ?? Clock;
            const shortId   = "#" + order.id.slice(-8).toUpperCase();
            const itemCount = order.items?.reduce((sum, i) => sum + (i.quantity ?? 1), 0) ?? 0;

            return (
              <motion.div
                key={order.id}
                variants={fadeUp}
                layout
                className="group flex items-center gap-4 px-5 py-4 rounded-2xl bg-card border border-border hover:shadow-md transition-all cursor-pointer"
                style={{ boxShadow: "0 1px 6px 0 rgba(0,0,0,0.06)" }}>
                <div
                  className="size-11 rounded-xl flex items-center justify-center shrink-0 text-brand-green">
                  <ShoppingBag size={20} />
                </div>

                <div className="shrink-0 min-w-[90px]">
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase leading-tight">Order</p>
                  <p className="text-sm font-black font-mono text-foreground tracking-wide leading-tight mt-0.5">{shortId}</p>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <User size={12} className="text-muted-foreground shrink-0" />
                    <p className="text-sm font-semibold text-foreground truncate">{order.customer.name}</p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Mail size={12} className="text-muted-foreground shrink-0" />
                    <p className="text-xs text-muted-foreground truncate">{order.customer.email}</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 shrink-0 text-muted-foreground">
                  <Package size={14} />
                  <span className="text-sm font-medium">{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
                </div>

                <p className="text-base font-bold tabular-nums shrink-0" style={{ color: "var(--primary)" }}>
                  ${order.totalAmount}
                </p>

                <span
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: `${color}18`, color }}>
                  <Icon size={12} />
                  {order.status}
                </span>

                <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
