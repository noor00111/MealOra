"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api";
import { uploadImage } from "@/lib/cloudinary";
import { createCategory, fetchCategories } from "@/lib/meal-api";
import { createMyMeal, updateMyMeal } from "@/lib/provider-api";
import { mealFormSchema, MealForm, MealFormOutput, ProviderMeal } from "@/types/provider-meal";

const emptyValues: MealForm = {
  name: "",
  description: "",
  price: 0,
  categoryId: "",
  imageUrl: "",
  isAvailable: true,
  discountPercent: 0,
};

export function MealFormDialog({open, onOpenChange, editing}: {open: boolean; onOpenChange: (open: boolean) => void; editing: ProviderMeal | null;}) {
  
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<MealForm, unknown, MealFormOutput>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: emptyValues,
  });

  const categoryField = register("categoryId");

  useEffect(() => {
    if (!open) return;

    if (editing) {
      reset({
        name: editing.name,
        description: editing.description ?? "",
        price: Number(editing.price),
        categoryId: editing.categoryId ?? "",
        imageUrl: editing.imageUrl ?? "",
        isAvailable: editing.isAvailable,
        discountPercent: editing.discountPercent ?? 0,
      });
      setImagePreview(editing.imageUrl);
    } else {
      reset(emptyValues);
      setImagePreview(null);
    }
    setUploadError(null);
    setAddingCategory(false);
    setNewCategoryName("");
  }, [open, editing, reset]);

  const saveMutation = useMutation({
    mutationFn: (values: MealFormOutput) =>
      editing ? updateMyMeal(editing.id, values) : createMyMeal(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-meals"] });
      onOpenChange(false);
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (category) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setValue("categoryId", category.id);
      setAddingCategory(false);
      setNewCategoryName("");
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit meal" : "Add a new meal"}</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit((v) => saveMutation.mutate(v))}>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Photo</label>
            <label htmlFor="img-upload" className={`relative overflow-hidden rounded-xl bg-muted cursor-pointer flex items-center justify-center border-2 border-dashed border-border hover:border-primary/60 transition-colors ${imagePreview ? "h-36" : "h-24"}`}>
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                  <Plus size={18} />Click to upload
                </span>
              )}
            </label>
            <input type="hidden" {...register("imageUrl")} />
            <input id="img-upload" type="file" accept="image/*" onChange={handleImageChange}
              className="text-xs text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-xs file:font-medium" />
            {uploading && <p className="text-xs text-muted-foreground">Uploading…</p>}
            {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="meal-name" className="text-sm font-medium">Name</label>
            <Input id="meal-name" {...register("name")} placeholder="e.g. Butter Chicken" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="meal-price" className="text-sm font-medium">Price ($)</label>
              <Input id="meal-price" type="number" step="0.01" min={0} {...register("price")} placeholder="0.00" />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="meal-cat" className="text-sm font-medium">Category</label>
              <select id="meal-cat" {...categoryField}
                onChange={(e) => {
                  if (e.target.value === "__new__") { setAddingCategory(true); }
                  else { setAddingCategory(false); categoryField.onChange(e); }
                }}
                className="h-9 rounded-lg border border-input bg-card px-2.5 text-sm outline-none focus-visible:border-ring">
                <option value="">Uncategorized</option>
                {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                <option value="__new__">+ New category</option>
              </select>
            </div>
          </div>

          {addingCategory && (
            <div className="flex gap-2">
              <Input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Category name" className="flex-1" />
              <Button type="button" size="sm" disabled={createCategoryMutation.isPending || !newCategoryName.trim()} onClick={() => createCategoryMutation.mutate(newCategoryName.trim())}>Add</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => { setAddingCategory(false); setNewCategoryName(""); }}>Cancel</Button>
            </div>
          )}
          {createCategoryMutation.isError && <p className="text-xs text-destructive">{getErrorMessage(createCategoryMutation.error)}</p>}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="meal-desc" className="text-sm font-medium">
              Description <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Input id="meal-desc" {...register("description")} placeholder="Short description" />
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
              <input type="checkbox" {...register("isAvailable")} className="size-4 rounded accent-green-700 cursor-pointer" />
              Available to order
            </label>
            <div className="flex items-center gap-2 shrink-0">
              <label htmlFor="meal-discount" className="text-sm font-medium whitespace-nowrap">Discount %</label>
              <Input id="meal-discount" type="number" min={0} max={90} step={5} {...register("discountPercent")} className="w-20 text-center" placeholder="0" />
            </div>
          </div>

          {saveMutation.isError && <p className="text-sm text-destructive">{getErrorMessage(saveMutation.error)}</p>}

          <DialogFooter>
            <Button type="submit" disabled={saveMutation.isPending || uploading} className="w-full rounded-full">
              {saveMutation.isPending ? "Saving…" : uploading ? "Uploading…" : editing ? "Save changes" : "Add to menu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
