"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { fetchMyOrders } from "@/lib/order-api";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { statusColor, statusSteps } from "@/lib/order-status";
import { timeAgo } from "@/lib/format";
import { StatusFilterTabs } from "@/components/shared/status-filter-tabs";
import { OrderStatus } from "@/types/order";

type StatusFilter = OrderStatus | "ALL";

const FILTER_TABS: { value: StatusFilter; label: string }[] = [
  { value: "ALL",       label: "All" },
  { value: "PLACED",    label: "Placed" },
  { value: "PREPARING", label: "Preparing" },
  { value: "READY",     label: "Ready" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function OrdersPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [filter, setFilter] = useState<StatusFilter>("ALL");

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: fetchMyOrders,
    enabled: !!user,
  });

  const filtered = filter === "ALL" ? (orders ?? []) : (orders ?? []).filter(o => o.status === filter);
  const activeCount = (orders ?? []).filter(o => ["PLACED", "PREPARING", "READY"].includes(o.status)).length;

  const tabCount = (v: StatusFilter) =>
    v === "ALL" ? (orders?.length ?? 0) : (orders?.filter(o => o.status === v).length ?? 0);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6">

      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
            My Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading ? "Loading…" : `${orders?.length ?? 0} orders${activeCount > 0 ? ` · ${activeCount} active` : ""}`}
          </p>
        </div>
        {activeCount > 0 && (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary shrink-0">
            {activeCount} in progress
          </span>
        )}
      </motion.div>

      <StatusFilterTabs tabs={FILTER_TABS} active={filter} onChange={setFilter} count={tabCount} />

      {isLoading && (
        <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4">
              <div className="flex gap-[-8px]">
                <div className="size-11 rounded-xl bg-muted animate-pulse" />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-36 bg-muted animate-pulse rounded" />
                <div className="h-2.5 w-48 bg-muted animate-pulse rounded" />
                <div className="h-2 w-40 bg-muted animate-pulse rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="rounded-2xl border border-border overflow-hidden">
          <motion.div initial="hidden" animate="show" variants={staggerContainer} className="divide-y divide-border">
            {filtered.map((order) => {
              const isCancelled = order.status === "CANCELLED";
              const stepIdx = statusSteps.indexOf(order.status as typeof statusSteps[number]);

              return (
                <motion.div key={order.id} variants={fadeUp}>
                  <Link href={`/orders/${order.id}`}>
                    <div className="group relative flex items-center gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors duration-150 cursor-pointer">
                      <div
                        className="absolute left-0 top-0 bottom-0 w-[3px]"
                        style={{ backgroundColor: statusColor[order.status] }}
                      />

                      <div className="flex items-center shrink-0 self-start pt-0.5">
                        {order.items.slice(0, 3).map((item, i) => (
                          <div
                            key={item.id}
                            style={{ marginLeft: i > 0 ? "-10px" : 0, zIndex: 3 - i }}
                            className="relative size-11 rounded-xl overflow-hidden border-2 border-card bg-muted">
                            {item.meal.imageUrl ? (
                              <Image
                                src={item.meal.imageUrl} alt={item.meal.name} fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                sizes="44px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-base">🍽</div>
                            )}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div
                            style={{ marginLeft: "-10px", zIndex: 0 }}
                            className="relative size-11 rounded-xl border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[10px] font-black tracking-[0.12em] text-muted-foreground uppercase tabular-nums">
                              #{order.id.slice(-8).toUpperCase()}
                            </p>
                            <p className="font-semibold text-sm text-foreground mt-0.5 truncate">
                              {order.items[0]?.meal.name}
                              {order.items.length > 1 && (
                                <span className="font-normal text-muted-foreground"> +{order.items.length - 1} more</span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(order.createdAt)}</p>
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            <span className="font-bold text-primary text-sm tabular-nums">${order.totalAmount}</span>
                            <ArrowRight size={13} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-150" />
                          </div>
                        </div>

                        {!isCancelled ? (
                          <div className="flex items-center gap-1 mt-2.5">
                            {statusSteps.map((step, i) => (
                              <Fragment key={step}>
                                <div
                                  className="size-1.5 rounded-full shrink-0 transition-colors duration-300"
                                  style={{ backgroundColor: i <= stepIdx ? "var(--primary)" : "var(--muted)" }}
                                />
                                {i < statusSteps.length - 1 && (
                                  <div
                                    className="h-px flex-1 transition-colors duration-300"
                                    style={{ backgroundColor: i < stepIdx ? "var(--primary)" : "var(--muted)" }}
                                  />
                                )}
                              </Fragment>
                            ))}
                            <span className="text-[10px] font-semibold text-muted-foreground ml-2 shrink-0">
                              {order.status}
                            </span>
                          </div>
                        ) : (
                          <div className="mt-2.5">
                            <span className="text-[10px] font-black tracking-wide px-2 py-0.5 rounded-full"
                              style={{ color: "#991b1b", backgroundColor: "#fef2f2" }}>
                              CANCELLED
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="py-20 text-center rounded-2xl border-2 border-dashed border-border">
          <p className="text-3xl mb-3">🛍️</p>
          <p className="font-medium text-foreground">
            {filter === "ALL" ? "No orders yet" : `No ${filter.toLowerCase()} orders`}
          </p>
          {filter === "ALL" ? (
            <Link href="/meals" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              Browse meals <ArrowRight size={13} />
            </Link>
          ) : (
            <button onClick={() => setFilter("ALL")} className="mt-2 text-sm text-primary hover:underline">
              Show all orders
            </button>
          )}
        </div>
      )}
    </div>
  );
}
