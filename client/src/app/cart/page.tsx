"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/lib/cart-store";
import { fadeUp, staggerContainer } from "@/lib/motion";

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button nativeButton={false} render={<Link href="/meals" />}>
          Browse meals
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4 md:p-8">
      <h1 className="text-2xl font-semibold text-foreground">Your cart</h1>

      <motion.div initial="hidden" animate="show" variants={staggerContainer} className="flex flex-col gap-3">
        {items.map((item) => (
          <motion.div key={item.mealId} variants={fadeUp}>
            <Card className="flex-row items-center gap-4 p-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                {item.imageUrl && (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                )}
              </div>
              <CardContent className="flex flex-1 items-center justify-between gap-4 px-0">
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.providerName}</p>
                  <p className="text-sm text-primary">${item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => setQuantity(item.mealId, item.quantity - 1)}>
                    -
                  </Button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => setQuantity(item.mealId, item.quantity + 1)}>
                    +
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => removeItem(item.mealId)}>
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-lg font-medium text-foreground">Total</span>
        <span className="text-lg font-semibold text-primary">${total.toFixed(2)}</span>
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button className="w-full" onClick={() => router.push("/checkout")}>
          Proceed to checkout
        </Button>
      </motion.div>
    </motion.div>
  );
}
