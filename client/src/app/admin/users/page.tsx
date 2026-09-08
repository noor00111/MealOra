"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { fetchAdminUsers, updateAdminUserStatus } from "@/lib/admin-api";
import { useRequireRole } from "@/lib/use-require-role";
import { getErrorMessage } from "@/lib/api";

export default function AdminUsersPage() {
  const admin = useRequireRole("ADMIN");
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchAdminUsers,
    enabled: !!admin,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "SUSPENDED" }) =>
      updateAdminUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  if (!admin) {
    return null;
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 md:p-8"
    >
      <h1 className="text-2xl font-semibold text-foreground">Users</h1>

      {isLoading && <p className="text-sm text-muted-foreground">Loading users...</p>}
      {statusMutation.isError && (
        <p className="text-sm text-destructive">{getErrorMessage(statusMutation.error)}</p>
      )}

      <motion.div initial="hidden" animate="show" variants={staggerContainer} className="flex flex-col gap-3">
        {users?.map((u) => (
          <motion.div key={u.id} variants={fadeUp}>
            <Card>
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">
                    {u.name} <span className="text-sm text-muted-foreground">({u.role})</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      u.status === "SUSPENDED"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-brand-green/15 text-brand-green"
                    }`}
                  >
                    {u.status}
                  </span>
                  {u.id !== admin.id && u.role !== "ADMIN" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={statusMutation.isPending}
                      onClick={() =>
                        statusMutation.mutate({
                          id: u.id,
                          status: u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
                        })
                      }
                    >
                      {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
