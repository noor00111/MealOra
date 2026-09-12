"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { fetchProviderOrders, updateProviderOrderStatus } from "@/lib/provider-api";
import { nextStatus, statusColor } from "@/lib/order-status";
import { timeAgo } from "@/lib/format";
import { StatusFilterTabs } from "@/components/shared/status-filter-tabs";
import { OrderStatus, ProviderOrder } from "@/types/order";

const STATUS_BADGE: Record<OrderStatus, { color: string; bg: string; label: string }> = {
  PLACED:    { color: "#9a3412", bg: "#fff7ed", label: "New" },
  PREPARING: { color: "#1e40af", bg: "#eff6ff", label: "Preparing" },
  READY:     { color: "#065f46", bg: "#ecfdf5", label: "Ready" },
  DELIVERED: { color: "#374151", bg: "#f3f4f6", label: "Delivered" },
  CANCELLED: { color: "#991b1b", bg: "#fef2f2", label: "Cancelled" },
};

const ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  PLACED:    "Start Preparing",
  PREPARING: "Mark Ready",
  READY:     "Mark Delivered",
};

const ACTION_COLOR: Partial<Record<OrderStatus, string>> = {
  PLACED:    "#3b82f6",
  PREPARING: "#10b981",
  READY:     "#1a4d2e",
};

type StatusFilter = OrderStatus | "ALL";

const FILTER_TABS: { value: StatusFilter; label: string }[] = [
  { value: "ALL",       label: "All" },
  { value: "PLACED",    label: "New" },
  { value: "PREPARING", label: "Preparing" },
  { value: "READY",     label: "Ready" },
  { value: "DELIVERED", label: "Done" },
];

export default function ProviderOrdersPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  useEffect(() => {
    if (user && user.role !== "PROVIDER") router.replace("/dashboard");
    else if (!user) router.replace("/login");
  }, [user, router]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["provider-orders"],
    queryFn: fetchProviderOrders,
    enabled: user?.role === "PROVIDER",
    refetchInterval: 30000,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateProviderOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["provider-orders"] }),
  });

  function advance(order: ProviderOrder) {
    const upcoming = nextStatus[order.status];
    if (upcoming) statusMutation.mutate({ id: order.id, status: upcoming });
  }

  const newCount = orders?.filter(o => o.status === "PLACED").length ?? 0;
  const filtered = statusFilter === "ALL" ? (orders ?? []) : (orders ?? []).filter(o => o.status === statusFilter);

  const tabCount = (v: StatusFilter) =>
    v === "ALL" ? (orders?.length ?? 0) : (orders?.filter(o => o.status === v).length ?? 0);

  if (!user || user.role !== "PROVIDER") return null;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">

      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="flex items-center justify-between gap-3 mb-6">

        <div>
          <h1 className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
            Incoming Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading ? "Loading…" : `${orders?.length ?? 0} total`}
          </p>
        </div>

        {newCount > 0 && (
          <span className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full shrink-0"
            style={{ color: "#9a3412", backgroundColor: "#fff7ed" }}>
            <span className="relative flex size-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "#f97316" }} />
              <span className="relative inline-flex size-2 rounded-full" style={{ backgroundColor: "#f97316" }} />
            </span>
            {newCount} new
          </span>
        )}
      </motion.div>

      <StatusFilterTabs tabs={FILTER_TABS} active={statusFilter} onChange={setStatusFilter} count={tabCount} />

      {isLoading && (
        <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4">
              <div className="size-10 rounded-lg bg-muted animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                <div className="h-2.5 w-48 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-3 w-14 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="rounded-2xl border border-border overflow-hidden">
          <motion.div initial="hidden" animate="show" variants={staggerContainer} className="divide-y divide-border">
            {filtered.map((order) => {
              const badge = STATUS_BADGE[order.status];
              const upcoming = nextStatus[order.status];
              const firstImg = order.items[0]?.meal.imageUrl;
              const itemsSummary = order.items.map(i => `${i.meal.name} ×${i.quantity}`).join(", ");

              return (
                <motion.div key={order.id} variants={fadeUp}>
                  <div className="group relative hover:bg-muted/40 transition-colors duration-150">
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[3px]"
                      style={{ backgroundColor: statusColor[order.status] }}/>

                    <div className="flex items-center gap-3 px-4 py-3.5">
                      {firstImg && (
                        <div className="relative size-10 rounded-lg overflow-hidden bg-muted shrink-0">
                          <Image src={firstImg} alt="" fill className="object-cover transition-transform duration-300 group-hover:scale-110" sizes="40px" />
                        </div>
                      )}

                      <div className="min-w-0 w-32 shrink-0">
                        <p className="text-[10px] font-black tracking-[0.12em] text-muted-foreground uppercase tabular-nums">
                          #{order.id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-sm font-semibold text-foreground truncate">{order.customer.name}</p>
                      </div>

                      <p className="flex-1 text-xs text-muted-foreground truncate hidden sm:block min-w-0">
                        {itemsSummary}
                      </p>

                      <p className="text-xs text-muted-foreground shrink-0 hidden md:block tabular-nums">
                        {timeAgo(order.createdAt)}
                      </p>

                      <span className="font-bold text-foreground text-sm shrink-0 tabular-nums">
                        ${order.totalAmount}
                      </span>

                      <span
                        className="hidden sm:inline-flex shrink-0 text-[9px] font-black tracking-[0.1em] px-2 py-0.5 rounded-full"
                        style={{ color: badge.color, backgroundColor: badge.bg }}>
                        {badge.label}
                      </span>

                      {upcoming && order.status !== "DELIVERED" && order.status !== "CANCELLED" ? (
                        <button
                          onClick={() => advance(order)}
                          disabled={statusMutation.isPending}
                          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                          style={{ backgroundColor: ACTION_COLOR[order.status] ?? "#888" }}
                        >
                          {ACTION_LABEL[order.status]} <ArrowRight size={10} />
                        </button>
                      ) : order.status === "DELIVERED" ? (
                        <span className="shrink-0 text-xs text-muted-foreground">Done ✓</span>
                      ) : (
                        <span className="shrink-0 text-xs text-muted-foreground">Cancelled</span>
                      )}
                    </div>

                    <p className="sm:hidden text-xs text-muted-foreground px-4 pb-3 -mt-2 truncate">
                      {itemsSummary}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}


      {!isLoading && filtered.length === 0 && (
        <div className="py-20 text-center rounded-2xl border-2 border-dashed border-border">
          <p className="text-3xl mb-3">🍳</p>
          <p className="font-medium text-foreground">
            {statusFilter === "ALL" ? "No orders yet" : `No ${statusFilter.toLowerCase()} orders`}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {statusFilter !== "ALL" && (
              <button onClick={() => setStatusFilter("ALL")} className="text-primary underline">Show all</button>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
