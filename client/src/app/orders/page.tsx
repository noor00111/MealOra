"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/lib/auth-store";
import { fetchMyOrders } from "@/lib/order-api";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { statusStyles } from "@/lib/order-status";

export default function OrdersPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: fetchMyOrders,
    enabled: !!user,
  });

  if (!user) {
    return null;
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4 md:p-8">
      <h1 className="text-2xl font-semibold text-foreground">My orders</h1>

      {isLoading && <p className="text-sm text-muted-foreground">Loading orders...</p>}
      {!isLoading && orders?.length === 0 && (
        <p className="text-sm text-muted-foreground">You haven&apos;t placed any orders yet.</p>
      )}

      <motion.div initial="hidden" animate="show" variants={staggerContainer} className="flex flex-col gap-3">
        {orders?.map((order) => (
          <motion.div key={order.id} variants={fadeUp}>
            <Link href={`/orders/${order.id}`}>
              <Card className="transition-shadow hover:shadow-lg hover:shadow-primary/10">
                <CardContent className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">Order #{order.id.slice(-8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""} · $
                      {order.totalAmount}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status]}`}>
                    {order.status}
                  </span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
