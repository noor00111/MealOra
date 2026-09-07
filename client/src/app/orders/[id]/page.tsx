"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { fetchOrderById } from "@/lib/order-api";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { statusStyles, statusSteps } from "@/lib/order-status";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {data: order, isLoading, isError} = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrderById(id),
  });

  if (isLoading) {
    return <p className="p-8 text-sm text-muted-foreground">Loading order...</p>;
  }

  if (isError || !order) {
    return <p className="p-8 text-sm text-destructive">Order not found.</p>;
  }

  const currentStep = statusSteps.indexOf(order.status);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Order #{order.id.slice(-8)}</h1>
          <p className="text-sm text-muted-foreground">
            Placed {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status]}`}>
          {order.status}
        </span>
      </div>

      {order.status !== "CANCELLED" && (
        <div className="flex items-center gap-2">
          {statusSteps.map((step, i) => (
            <div key={step} className="flex flex-1 items-center gap-2">
              <div
                className={`h-2 flex-1 rounded-full ${
                  i <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            </div>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Delivery address</p>
          <p>{order.deliveryAddress}</p>
        </CardContent>
      </Card>

      <motion.div initial="hidden" animate="show" variants={staggerContainer} className="flex flex-col gap-3">
        {order.items.map((item) => (
          <motion.div key={item.id} variants={fadeUp}>
            <Card className="flex-row items-center gap-4 p-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                {item.meal.imageUrl && (
                  <Image src={item.meal.imageUrl} alt={item.meal.name} fill className="object-cover" />
                )}
              </div>
              <CardContent className="flex flex-1 items-center justify-between px-0">
                <div>
                  <p className="font-medium text-foreground">{item.meal.name}</p>
                  <p className="text-sm text-muted-foreground">Qty {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-primary">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-lg font-medium text-foreground">Total</span>
        <span className="text-lg font-semibold text-primary">${order.totalAmount}</span>
      </div>
    </motion.div>
  );
}
