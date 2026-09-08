"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";

export function Navbar() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:px-8">
      <Link href="/" className="text-lg text-brand-green font-semibold">
        MealOra
      </Link>

      <nav className="flex items-center gap-4">
        {user?.role === "CUSTOMER" && (
          <>
            <Link href="/meals" className="text-sm text-muted-foreground hover:text-foreground">
              Browse
            </Link>
            <Link href="/cart" className="text-sm text-muted-foreground hover:text-foreground">
              Cart
            </Link>
            <Link href="/orders" className="text-sm text-muted-foreground hover:text-foreground">
              My orders
            </Link>
          </>
        )}

        {user?.role === "PROVIDER" && (
          <>
            <Link href="/provider/menu" className="text-sm text-muted-foreground hover:text-foreground">
              My menu
            </Link>
            <Link href="/provider/orders" className="text-sm text-muted-foreground hover:text-foreground">
              Orders
            </Link>
          </>
        )}

        {user?.role === "ADMIN" && (
          <>
            <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/admin/users" className="text-sm text-muted-foreground hover:text-foreground">
              Users
            </Link>
            <Link href="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground">
              Orders
            </Link>
            <Link href="/admin/categories" className="text-sm text-muted-foreground hover:text-foreground">
              Categories
            </Link>
          </>
        )}

        {!user && (
          <>
            <Link href="/meals" className="text-sm text-muted-foreground hover:text-foreground">
              Browse
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Log in
            </Link>
            <Button size="sm" nativeButton={false} render={<Link href="/signup" />}>
              Sign up
            </Button>
          </>
        )}

        {user && (
          <Button variant="outline" size="sm"
            onClick={() => {logout();
              router.push("/login");
            }}>
            Log out
          </Button>
        )}
      </nav>
    </header>
  );
}
