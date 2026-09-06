"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/motion";

export default function Home() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer}
      className="flex flex-1 flex-col items-center justify-center gap-6 bg-background p-4 text-center">
      <motion.h1 variants={fadeUp} className="text-4xl font-semibold text-brand-green">
        MealOra
      </motion.h1>
      <motion.p variants={fadeUp} className="max-w-md text-muted-foreground">
        Good food is waiting for you. Discover and order delicious meals from local providers.
      </motion.p>
      <motion.div variants={fadeUp} className="flex gap-3">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button nativeButton={false} render={<Link href="/meals" />}>
            Browse meals
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button nativeButton={false} variant="outline" render={<Link href="/signup" />}>
            Get started
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
