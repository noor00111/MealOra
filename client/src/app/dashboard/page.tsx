"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { CustomerDashboard } from "@/components/dashboard/customer-dashboard";
import { ProviderDashboard } from "@/components/dashboard/provider-dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else if (user.role === "ADMIN") {
      router.replace("/admin");
    }
  }, [user, router]);

  if (!user || user.role === "ADMIN") return null;

  if (user.role === "PROVIDER") return <ProviderDashboard name={user.name} />;
  return <CustomerDashboard name={user.name} />;
}
