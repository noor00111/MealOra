"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
      <p>
        Signed in as {user.name} ({user.role})
      </p>
      <Button
        variant="outline"
        onClick={() => {
          logout();
          router.push("/login");
        }}>
        Log out
      </Button>
    </div>
  );
}
