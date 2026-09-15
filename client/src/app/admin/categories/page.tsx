"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Plus, Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import { fetchCategories, createCategory } from "@/lib/meal-api";
import { updateAdminCategory, deleteAdminCategory } from "@/lib/admin-api";
import { useRequireRole } from "@/lib/use-require-role";

export default function AdminCategoriesPage() {
  const admin = useRequireRole("ADMIN");
  const qc = useQueryClient();
  const [newName, setNewName]   = useState("");
  const [editId, setEditId]    = useState<string | null>(null);
  const [editName, setEditName]  = useState("");
  const [deleteId, setDeleteId]  = useState<string | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    enabled: !!admin,
  });

  const refetch = () => qc.invalidateQueries({ queryKey: ["categories"] });
  const { mutate: create, isPending: creating } = useMutation({
    mutationFn: () => createCategory(newName.trim()),
    onSuccess: () => { setNewName(""); refetch(); },
  });

  const { mutate: update, isPending: updating } = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateAdminCategory(id, name),
    onSuccess: () => { setEditId(null); setEditName(""); refetch(); },
  });

  const { mutate: remove, isPending: removing } = useMutation({
    mutationFn: (id: string) => deleteAdminCategory(id),
    onSuccess: () => { setDeleteId(null); refetch(); },
  });

  if (!admin) return null;

  function startEdit(id: string, name: string) {
    setEditId(id);
    setEditName(name);
  }

  function cancelEdit() {
    setEditId(null);
    setEditName("");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-8">
        <p className="text-sm font-black tracking-[0.18em] text-primary uppercase mb-1">Admin · Categories</p>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground" style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
          Meal Categories
        </h1>
        <p className="text-base text-muted-foreground mt-2">{categories.length} categories available across MealOra</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="rounded-2xl bg-card border border-border p-5 mb-6"
        style={{ boxShadow: "0 2px 12px 0 rgba(74,140,63,0.06)" }}>
        <p className="text-sm font-black tracking-[0.14em] text-muted-foreground uppercase mb-4">Add New Category</p>
        <form
          onSubmit={(e) => { e.preventDefault(); if (newName.trim()) create(); }}
          className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Biryani, Desserts, Salads…"
            className="flex-1 h-12 px-4 rounded-xl border border-border bg-background text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors"
          />
          <motion.button
            type="submit"
            disabled={!newName.trim() || creating}
            whileTap={{ scale: 0.95 }}
            className="h-12 px-6 rounded-xl text-sm font-bold text-white flex items-center gap-2 disabled:opacity-60 transition-opacity"
            style={{ backgroundColor: "var(--primary)" }}>
            {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            <span>Add</span>
          </motion.button>
        </form>
      </motion.div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 rounded-2xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && categories.length === 0 && (
        <div className="py-16 text-center rounded-2xl border-2 border-dashed border-border">
          <Tag size={28} className="mx-auto text-muted-foreground/40 mb-3" />
          <p className="font-semibold text-foreground">No categories yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add one above to get started.</p>
        </div>
      )}

      <motion.div className="flex flex-col gap-2">
        <AnimatePresence>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              layout
              className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
              style={{ boxShadow: "0 1px 6px 0 rgba(0,0,0,0.04)" }}>
              <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(74,140,63,0.08)" }}>
                <Tag size={16} style={{ color: "var(--primary)" }} />
              </div>

              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  {editId === cat.id ? (
                    <motion.input
                      key="input"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && editName.trim()) update({ id: cat.id, name: editName.trim() });
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className="w-full bg-transparent border-b border-primary/60 text-base font-semibold text-foreground outline-none py-1"
                    />
                  ) : (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-base font-semibold text-foreground"
                    >
                      {cat.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                {editId === cat.id ? (
                  <motion.div key="edit-actions" initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 6 }} className="flex gap-1.5">
                    <button
                      onClick={() => { if (editName.trim()) update({ id: cat.id, name: editName.trim() }); }}
                      disabled={!editName.trim() || updating}
                      className="size-8 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
                      style={{ backgroundColor: "rgba(34,197,94,0.10)", color: "#16a34a" }}>
                      {updating ? <Loader2 size={12} className="animate-spin" /> : <Check size={13} />}
                    </button>

                    <button
                      onClick={cancelEdit}
                      className="size-8 rounded-xl flex items-center justify-center transition-colors"
                      style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#ef4444" }}>
                      <X size={13} />
                    </button>
                  </motion.div>
                ) : deleteId === cat.id ? (
                  <motion.div key="delete-confirm" initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 6 }} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Delete?</span>
                    <button
                      onClick={() => remove(cat.id)}
                      disabled={removing}
                      className="text-[11px] font-bold px-3 py-1 rounded-lg transition-colors"
                      style={{ backgroundColor: "rgba(239,68,68,0.10)", color: "#ef4444" }}>
                      {removing ? "…" : "Yes"}
                    </button>

                    <button
                      onClick={() => setDeleteId(null)}
                      className="text-[11px] font-bold px-3 py-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                      style={{ backgroundColor: "var(--muted)" }}>
                      No
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="default-actions" initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 6 }} className="flex gap-1.5">
                    <button
                      onClick={() => startEdit(cat.id, cat.name)}
                      className="size-8 rounded-xl flex items-center justify-center transition-colors"
                      style={{ backgroundColor: "rgba(59,130,246,0.08)", color: "#3b82f6" }}>
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => setDeleteId(cat.id)}
                      className="size-8 rounded-xl flex items-center justify-center transition-colors"
                      style={{ backgroundColor: "rgba(239,68,68,0.07)", color: "#ef4444" }}>
                      <Trash2 size={12} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
