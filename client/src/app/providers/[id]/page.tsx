"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchProviderById } from "@/lib/meal-api";
import { fadeUp, staggerContainer } from "@/lib/motion";

export default function ProviderDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {data: provider, isLoading,isError} = useQuery({
    queryKey: ["provider", id],
    queryFn: () => fetchProviderById(id),
  });

  if (isLoading) {
    return <p className="p-8 text-sm text-muted-foreground">Loading provider...</p>;
  }
  if (isError || !provider) {
    return <p className="p-8 text-sm text-destructive">Provider not found.</p>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-accent">
          {provider.logoUrl && (
            <Image src={provider.logoUrl} alt={provider.businessName} fill className="object-cover" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{provider.businessName}</h1>
          {provider.cuisine && <p className="text-sm text-muted-foreground">{provider.cuisine} cuisine</p>}
          {provider.address && <p className="text-sm text-muted-foreground">{provider.address}</p>}
        </div>
      </div>
      
      {provider.description && <p className="text-sm text-muted-foreground">{provider.description}</p>}

      <h2 className="text-lg font-medium text-foreground">Menu</h2>
      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {provider.meals.map((meal) => (
          <motion.div key={meal.id} variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Link href={`/meals/${meal.id}`}>
              <Card className="h-full rounded-2xl transition-shadow hover:shadow-lg hover:shadow-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2">
                    <span>{meal.name}</span>
                    <span className="text-sm font-semibold text-primary">${meal.price}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <p className="line-clamp-2">{meal.description}</p>
                  {meal.category && (
                    <span className="w-fit rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                      {meal.category.name}
                    </span>
                  )}
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
