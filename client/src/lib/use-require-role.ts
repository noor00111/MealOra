import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./auth-store";
import { Role } from "@/types/auth";

export function useRequireRole(role: Role) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else if (user.role !== role) {
      router.replace("/dashboard");
    }
  }, [user, role, router]);

  return user?.role === role ? user : null;
}
