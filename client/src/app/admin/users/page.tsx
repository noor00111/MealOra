"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, ShieldOff, ShieldCheck, ChefHat, UserRound, X } from "lucide-react";
import { fetchAdminUsers, updateAdminUserStatus } from "@/lib/admin-api";
import { useRequireRole } from "@/lib/use-require-role";
import { useAuthStore } from "@/lib/auth-store";
import type { UserStatus } from "@/types/admin";
import { staggerContainer, fadeUp } from "@/lib/motion";

const ROLE_COLORS: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  CUSTOMER: { color: "#3b82f6", bg: "rgba(59,130,246,0.08)", icon: UserRound },
  PROVIDER: { color: "#f97316", bg: "rgba(249,115,22,0.08)", icon: ChefHat },
  ADMIN:    { color: "#8b5cf6", bg: "rgba(139,92,246,0.08)", icon: ShieldCheck },
};

export default function AdminUsersPage() {
  const admin = useRequireRole("ADMIN");
  const self = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchAdminUsers,
    enabled: !!admin,
  });

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) => updateAdminUserStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  if (!admin) return null;
  const roles = ["ALL", "CUSTOMER", "PROVIDER", "ADMIN"];

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-8">
        <p className="text-sm font-black tracking-[0.18em] text-primary uppercase mb-1">Admin · Users</p>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground" style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
          User Management
        </h1>
        <p className="text-base text-muted-foreground mt-2">{users.length} accounts registered on MealOra</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full h-12 pl-9 pr-8 rounded-xl border border-border bg-card text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X size={12} />
            </button>
          )}
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className="h-12 px-5 rounded-xl text-sm font-bold transition-all duration-150"
              style={roleFilter === r
                ? { backgroundColor: "var(--primary)", color: "#fff" }
                : { backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
              {r === "ALL" ? "All" : r.charAt(0) + r.slice(1).toLowerCase() + "s"}
            </button>
          ))}
        </div>
      </motion.div>

      {!isLoading && filtered.length === 0 && (
        <div className="py-20 text-center rounded-2xl border-2 border-dashed border-border">
          <Users size={28} className="mx-auto text-muted-foreground/40 mb-3" />
          <p className="font-semibold text-foreground">No users found</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filter.</p>
        </div>
      )}

      <motion.div initial="hidden" animate="show" variants={staggerContainer} className="flex flex-col gap-2">
        <AnimatePresence>
          {filtered.map((u) => {
            const role = ROLE_COLORS[u.role] ?? ROLE_COLORS.CUSTOMER;
            const RoleIcon = role.icon;
            const isSelf   = u.id === self?.id;
            const isAdmin  = u.role === "ADMIN";
            const canAct   = !isSelf && !isAdmin;

            return (
              <motion.div
                key={u.id}
                variants={fadeUp}
                layout
                className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-card border border-border hover:border-border/80 transition-all"
                style={{ boxShadow: "0 1px 8px 0 rgba(0,0,0,0.04)" }}>
                <div
                  className="size-12 rounded-xl flex items-center justify-center text-base font-bold shrink-0"
                  style={{ backgroundColor: role.bg, color: role.color }}>
                  {u.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-base font-bold text-foreground truncate">{u.name}</p>
                    {isSelf && (
                      <span className="text-xs font-black tracking-wide px-2 py-0.5 rounded-full bg-primary/10 text-primary">You</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{u.email}</p>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                  <div className="size-6 rounded-md flex items-center justify-center" style={{ backgroundColor: role.bg }}>
                    <RoleIcon size={13} style={{ color: role.color }} />
                  </div>
                  <span className="text-xs font-black tracking-wide" style={{ color: role.color }}>
                    {u.role}
                  </span>
                </div>

                <span
                  className="text-xs font-black tracking-wide px-3 py-1.5 rounded-full shrink-0"
                  style={u.status === "ACTIVE"
                    ? { backgroundColor: "rgba(34,197,94,0.12)", color: "#16a34a" }
                    : { backgroundColor: "rgba(239,68,68,0.10)", color: "#ef4444" }}>
                  {u.status}
                </span>

                {canAct ? (
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    disabled={isPending}
                    onClick={() => updateStatus({ id: u.id, status: (u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE") as UserStatus })}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-150 shrink-0"
                    style={u.status === "ACTIVE"
                      ? { backgroundColor: "rgba(239,68,68,0.08)", color: "#ef4444" }
                      : { backgroundColor: "rgba(34,197,94,0.08)", color: "#16a34a" }}>
                    {u.status === "ACTIVE" ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                    <span className="hidden sm:inline">{u.status === "ACTIVE" ? "Suspend" : "Activate"}</span>
                  </motion.button>
                ) : (
                  <div className="w-[88px] shrink-0" />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
