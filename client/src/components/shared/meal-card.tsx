import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeUp } from "@/lib/motion";
import { Meal } from "@/types/meal";

export function MealCard({ meal }: { meal: Meal }) {
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link href={`/meals/${meal.id}`}>
        <Card className="h-full overflow-hidden rounded-2xl transition-shadow hover:shadow-lg hover:shadow-primary/10">
          <div className="relative aspect-video w-full bg-muted overflow-hidden">
            {meal.imageUrl ? (
              <Image src={meal.imageUrl} alt={meal.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No image
              </div>
            )}
          </div>
          {meal.discountPercent > 0 && (
            <div className="absolute top-2 left-2">
              <span className="text-[10px] font-black tracking-wide px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: "#ef4444" }}>
                -{meal.discountPercent}% OFF
              </span>
            </div>
          )}
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <span>{meal.name}</span>
              <div className="flex flex-col items-end shrink-0">
                {meal.discountPercent > 0 && (
                  <span className="text-[11px] text-muted-foreground line-through tabular-nums">
                    $ {meal.price}
                  </span>
                )}
                <span className="text-sm font-semibold text-primary tabular-nums">
                  $ {meal.discountPercent > 0
                    ? (Number(meal.price) * (1 - meal.discountPercent / 100)).toFixed(2)
                    : meal.price}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
            <p className="line-clamp-2">{meal.description}</p>
            <div className="flex items-center gap-2 pt-1 text-xs">
              {meal.category && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-accent-foreground">
                  {meal.category.name}
                </span>
              )}
              <span className="ml-auto">{meal.provider.businessName}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
