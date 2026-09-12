import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChefHat } from "lucide-react";
import { Meal } from "@/types/meal";

export function MealImagePanel({ meal }: { meal: Meal }) {
  const hasDiscount = meal.discountPercent > 0;

  return (
    <div className="md:sticky md:top-20">
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-[4/3] md:aspect-[5/6] w-full overflow-hidden rounded-3xl bg-muted"
        style={{ boxShadow: "0 8px 40px 0 rgba(74,140,63,0.14)" }}>

        {meal.imageUrl ? (
          <Image
            src={meal.imageUrl}
            alt={meal.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 420px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat size={64} className="text-muted-foreground/20" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        {hasDiscount && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 18 }}
            className="absolute top-4 left-4">
            <span
              className="text-xs font-black tracking-wide px-3 py-1.5 rounded-full text-white shadow-lg"
              style={{ backgroundColor: "#ef4444" }}>
              -{meal.discountPercent}% OFF
            </span>
          </motion.div>
        )}

        {!meal.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-3xl">
            <span
              className="text-xs font-black tracking-[0.18em] px-4 py-2 rounded-full"
              style={{ backgroundColor: "rgba(239,68,68,0.9)", color: "white" }}>
              UNAVAILABLE
            </span>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.35 }}
        className="hidden md:flex items-center gap-2.5 mt-4 px-1">
        <div
          className="size-8 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: "rgba(74,140,63,0.1)" }}>
          <ChefHat size={15} className="text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Kitchen</p>
          <Link
            href={`/providers/${meal.provider.id}`}
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block">
            {meal.provider.businessName}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
