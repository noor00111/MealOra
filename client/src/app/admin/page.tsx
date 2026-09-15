"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchAdminOrders, fetchAdminUsers } from "@/lib/admin-api";
import { fetchCategories } from "@/lib/meal-api";
import { useRequireRole } from "@/lib/use-require-role";
import { RevenueAndOrdersRow, StatGrid } from "@/components/dashboard/admin/stat-cards";
import { SalesAndCategories } from "@/components/dashboard/admin/sales-and-categories";
import { RecentOrdersTable } from "@/components/dashboard/admin/recent-orders-table";
import type { AdminOrder } from "@/types/admin";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

function get7DayRevenue(orders: AdminOrder[]): number[] {
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const s = d.toISOString().split("T")[0];
    return orders
      .filter((o) => o.createdAt.startsWith(s))
      .reduce((sum, o) => sum + Number(o.totalAmount), 0);
  });
}

export default function AdminDashboardPage() {
  const admin = useRequireRole("ADMIN");
  const { data: users } = useQuery({ queryKey: ["admin-users"],  queryFn: fetchAdminUsers,  enabled: !!admin });
  const { data: orders } = useQuery({ queryKey: ["admin-orders"], queryFn: fetchAdminOrders, enabled: !!admin });
  const { data: cats } = useQuery({ queryKey: ["categories"],   queryFn: fetchCategories,  enabled: !!admin });

  const customers   = users?.filter((u) => u.role === "CUSTOMER").length ?? 0;
  const kitchens    = users?.filter((u) => u.role === "PROVIDER").length ?? 0;
  const suspended   = users?.filter((u) => u.status === "SUSPENDED").length ?? 0;
  const totalOrders = orders?.length ?? 0;
  const revenue     = orders?.reduce((sum, o) => sum + Number(o.totalAmount), 0) ?? 0;
  const avgOrder    = totalOrders > 0 ? revenue / totalOrders : 0;
  const recentOrders = (orders ?? []).slice(0, 5);

  const weeklyRevenue = useMemo(() => get7DayRevenue(orders ?? []), [orders]);
  const hasRealData   = weeklyRevenue.some((v) => v > 0);
  const chartData     = hasRealData ? weeklyRevenue : [18, 22, 19, 25, 24, 32, 28];
  const topCats = (cats ?? []).slice(0, 5);

  if (!admin) return null;

  return (
    <div className="px-5 md:px-7 py-14 max-w-5xl mx-auto">

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-6">
        <h1
          className="text-3xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
          {greeting()}, {admin.name.split(" ")[0]}!
        </h1>
        <p className="text-base text-muted-foreground mt-2">
          Here&apos;s what&apos;s happening with MealOra today.
        </p>
      </motion.div>

      <RevenueAndOrdersRow revenue={revenue} totalOrders={totalOrders} chartData={chartData} />
      <StatGrid customers={customers} kitchens={kitchens} suspended={suspended} avgOrder={avgOrder} />
      <SalesAndCategories chartData={chartData} topCats={topCats} />
      <RecentOrdersTable orders={recentOrders} />
    </div>
  );
}
