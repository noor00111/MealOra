"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { useCartStore } from "@/lib/cart-store";
import { createOrder } from "@/lib/order-api";
import { fadeUp } from "@/lib/motion";

const checkoutSchema = z.object({
  deliveryAddress: z.string().min(5, "Enter a delivery address"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);

  const {register, handleSubmit,formState: { errors }} = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { deliveryAddress: user?.address ?? "" },
  });

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      clear();
      router.push(`/orders/${order.id}`);
    },
  });

  if (!user) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button nativeButton={false} render={<Link href="/meals" />}>
          Find Food
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-4 md:p-8">

      <Card className="[--card-spacing:--spacing(8)]">
        <CardHeader>
          <CardTitle className="text-2xl">Checkout</CardTitle>
          <p className="text-sm text-muted-foreground">Cash on delivery</p>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-2 rounded-xl bg-muted p-4 text-sm">
            {items.map((item) => (
              <div key={item.mealId} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="mt-2 flex justify-between border-t border-border pt-2 font-medium">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit((values) =>
              mutation.mutate({
                deliveryAddress: values.deliveryAddress,
                items: items.map((i) => ({ mealId: i.mealId, quantity: i.quantity })),
              })
            )}>
            <div className="flex flex-col gap-2">
              <label htmlFor="deliveryAddress" className="text-sm font-medium">
                Delivery address
              </label>
              <Input id="deliveryAddress" className="h-11 px-4" {...register("deliveryAddress")} />
              {errors.deliveryAddress && (
                <p className="text-sm text-destructive">{errors.deliveryAddress.message}</p>
              )}
            </div>

            {mutation.isError && (
              <p className="text-sm text-destructive">{getErrorMessage(mutation.error)}</p>
            )}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" disabled={mutation.isPending} className="h-11 w-full text-base">
                {mutation.isPending ? "Placing order..." : "Place order"}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
