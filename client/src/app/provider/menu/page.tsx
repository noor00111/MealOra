"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { uploadImage } from "@/lib/cloudinary";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { fetchCategories } from "@/lib/meal-api";
import { createMyMeal, deleteMyMeal, fetchMyMeals, updateMyMeal } from "@/lib/provider-api";
import { mealFormSchema, MealForm, MealFormOutput, ProviderMeal } from "@/types/provider-meal";

export default function ProviderMenuPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<ProviderMeal | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== "PROVIDER") {
      router.replace("/dashboard");
    } else if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  const { data: meals, isLoading } = useQuery({
    queryKey: ["my-meals"],
    queryFn: fetchMyMeals,
    enabled: user?.role === "PROVIDER",
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const {register, handleSubmit, reset, setValue, formState: { errors }} = useForm<MealForm, unknown, MealFormOutput>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: { name: "", description: "", price: 0, categoryId: "", imageUrl: "", isAvailable: true },
  });

  const saveMutation = useMutation({
    mutationFn: (values: MealFormOutput) =>
      editing ? updateMyMeal(editing.id, values) : createMyMeal(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-meals"] });
      setDialogOpen(false);
      setEditing(null);
      reset();
      setImagePreview(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMyMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-meals"] });
    },
  });

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    setUploadError(null);

    try {
      const url = await uploadImage(file);
      setValue("imageUrl", url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    reset({ name: "", description: "", price: 0, categoryId: "", imageUrl: "", isAvailable: true });
    setImagePreview(null);
    setUploadError(null);
    setDialogOpen(true);
  }

  function openEdit(meal: ProviderMeal) {
    setEditing(meal);
    reset({
      name: meal.name,
      description: meal.description ?? "",
      price: Number(meal.price),
      categoryId: meal.categoryId ?? "",
      imageUrl: meal.imageUrl ?? "",
      isAvailable: meal.isAvailable,
    });
    setImagePreview(meal.imageUrl);
    setUploadError(null);
    setDialogOpen(true);
  }

  if (!user || user.role !== "PROVIDER") {
    return null;
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">My menu</h1>
        <Button onClick={openCreate}>Add meal</Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading menu...</p>}
      {!isLoading && meals?.length === 0 && (
        <p className="text-sm text-muted-foreground">You haven&apos;t added any meals yet.</p>
      )}

      <motion.div initial="hidden" animate="show" variants={staggerContainer} className="flex flex-col gap-3">
        {meals?.map((meal) => (
          <motion.div key={meal.id} variants={fadeUp}>
            <Card className="flex-row items-center gap-4 p-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                {meal.imageUrl && (
                  <Image src={meal.imageUrl} alt={meal.name} fill className="object-cover" />
                )}
              </div>
              <CardContent className="flex flex-1 items-center justify-between gap-4 px-0">
                <div>
                  <p className="font-medium text-foreground">{meal.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {meal.category?.name ?? "Uncategorized"} · ${meal.price}
                  </p>
                  {!meal.isAvailable && (
                    <span className="text-xs text-destructive">Unavailable</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(meal)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate(meal.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit meal" : "Add meal"}</DialogTitle>
          </DialogHeader>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit((values) => saveMutation.mutate(values))}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Input id="description" {...register("description")} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="price" className="text-sm font-medium">
                Price
              </label>
              <Input id="price" type="number" step="0.01" min={0} {...register("price")} />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="categoryId" className="text-sm font-medium">
                Category
              </label>
              <select
                id="categoryId"
                {...register("categoryId")}
                className="h-8 rounded-lg border border-input bg-card px-2.5 text-sm outline-none focus-visible:border-ring">
                <option value="">Uncategorized</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="image" className="text-sm font-medium">
                Image
              </label>
              {imagePreview && (
                <div className="relative h-32 w-full overflow-hidden rounded-xl bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <input type="hidden" {...register("imageUrl")} />
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-accent-foreground"
              />
              {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
              {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("isAvailable")} />
              Available
            </label>

            {saveMutation.isError && (
              <p className="text-sm text-destructive">{getErrorMessage(saveMutation.error)}</p>
            )}

            <DialogFooter>
              <Button type="submit" disabled={saveMutation.isPending || uploading} className="w-full">
                {saveMutation.isPending ? "Saving..." : uploading ? "Uploading image..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
