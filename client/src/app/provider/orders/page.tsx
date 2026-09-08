"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/lib/auth-store";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { fetchProviderOrders, updateProviderOrderStatus } from "@/lib/provider-api";
import { nextStatus, statusStyles } from "@/lib/order-status";
import { OrderStatus } from "@/types/order";

export default function ProviderOrdersPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user && user.role !== "PROVIDER") {
      router.replace("/dashboard");
    } else if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["provider-orders"],
    queryFn: fetchProviderOrders,
    enabled: user?.role === "PROVIDER",
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateProviderOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-orders"] });
    },
  });

  if (!user || user.role !== "PROVIDER") {
    return null;
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-8">
      <h1 className="text-2xl font-semibold text-foreground">Incoming orders</h1>

      {isLoading && <p className="text-sm text-muted-foreground">Loading orders...</p>}
      {!isLoading && orders?.length === 0 && (
        <p className="text-sm text-muted-foreground">No orders yet.</p>
      )}

      <motion.div initial="hidden" animate="show" variants={staggerContainer} className="flex flex-col gap-3">
        {orders?.map((order) => {
          const upcoming = nextStatus[order.status];
          return (
            <motion.div key={order.id} variants={fadeUp}>
              <Card>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">Order #{order.id.slice(-8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer.name}
                        {order.customer.phone ? ` · ${order.customer.phone}` : ""}
                      </p>
                      <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status]}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          {item.meal.name} × {item.quantity}
                        </span>
                        <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="font-medium text-foreground">${order.totalAmount}</span>
                    <div className="flex gap-2">
                      {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            size="sm"
                            disabled={!upcoming || statusMutation.isPending}
                            onClick={() =>
                              upcoming && statusMutation.mutate({ id: order.id, status: upcoming })
                            }>
                            Mark as {upcoming}
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
