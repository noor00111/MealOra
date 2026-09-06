"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";
import { fadeUp } from "@/lib/motion";

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
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="flex flex-1 flex-col items-center justify-center gap-4 bg-background p-4"
    >
      <p className="text-foreground">
        Signed in as {user.name} ({user.role})
      </p>
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          variant="outline"
          onClick={() => {
            logout();
            router.push("/login");
          }}>
          Log out
        </Button>
      </motion.div>
    </motion.div>
  );
}
