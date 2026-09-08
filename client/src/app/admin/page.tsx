"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { fetchAdminOrders, fetchAdminUsers } from "@/lib/admin-api";
import { useRequireRole } from "@/lib/use-require-role";

export default function AdminDashboardPage() {
  const admin = useRequireRole("ADMIN");

  const { data: users } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchAdminUsers,
    enabled: !!admin,
  });

  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: fetchAdminOrders,
    enabled: !!admin,
  });

  if (!admin) {
    return null;
  }

  const customers = users?.filter((u) => u.role === "CUSTOMER").length ?? 0;
  const providers = users?.filter((u) => u.role === "PROVIDER").length ?? 0;
  const suspended = users?.filter((u) => u.status === "SUSPENDED").length ?? 0;
  const revenue = orders?.reduce((sum, o) => sum + Number(o.totalAmount), 0) ?? 0;

  const stats = [
    { label: "Customers", value: customers },
    { label: "Providers", value: providers },
    { label: "Suspended accounts", value: suspended },
    { label: "Total orders", value: orders?.length ?? 0 },
    { label: "Total revenue", value: `$${revenue.toFixed(2)}` },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Admin dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform overview</p>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold text-foreground">{stat.value}</CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex gap-3">
        <Link href="/admin/users" className="text-sm text-primary underline-offset-4 hover:underline">
          Manage users
        </Link>
        <Link href="/admin/orders" className="text-sm text-primary underline-offset-4 hover:underline">
          View orders
        </Link>
        <Link href="/admin/categories" className="text-sm text-primary underline-offset-4 hover:underline">
          Manage categories
        </Link>
      </div>
    </motion.div>
  );
}
