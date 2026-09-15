"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {LayoutDashboard, ClipboardList, Users, Tag, Settings, LogOut, MoreHorizontal, X, Home} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

const navItems = [
  { href: "/admin",            label: "Overview",   icon: LayoutDashboard, exact: true },
  { href: "/admin/orders",     label: "Orders",     icon: ClipboardList },
  { href: "/admin/users",      label: "Users",      icon: Users },
  { href: "/admin/categories", label: "Categories", icon: Tag },
];


function MobileTabBar() {
  const pathname = usePathname();
  const router   = useRouter();
  const logout   = useAuthStore((s) => s.logout);
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname?.startsWith(href);

  function handleLogout() {
    setMoreOpen(false);
    logout();
    router.push("/login");
  }

  return (
    <>
      <nav className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-stretch border-b border-border/50 bg-background">
        <Link
          href="/"
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-semibold text-muted-foreground transition-colors">
          <Home size={18} />
          Home
        </Link>
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}>
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-semibold text-muted-foreground transition-colors">
          <MoreHorizontal size={18} />
          More
        </button>
      </nav>

      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-start">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMoreOpen(false)} />
          <div className="relative bg-background rounded-b-2xl border-b border-border/50 p-3 mt-12">
            <div className="flex items-center justify-between px-2 py-2 mb-1">
              <span className="text-xs font-black tracking-[0.14em] text-muted-foreground/60 uppercase">More</span>
              <button onClick={() => setMoreOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>
            
            <Link
              href="/settings"
              onClick={() => setMoreOpen(false)}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-foreground hover:bg-foreground/[0.05] transition-all">
              <Settings size={16} />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50/60 transition-all">
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function SidebarInner({ onClose }: { onClose?: () => void }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const user      = useAuthStore((s) => s.user);
  const logout    = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname?.startsWith(href);

  return (
    <div className="flex flex-col h-full select-none">
      <Link href="/" onClick={onClose} className="flex items-center gap-2.5 px-5 py-5 mb-1">
        <div
          className="size-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "var(--primary)" }}>
          <span
            className="text-white text-sm font-bold"
            style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}
          >M</span>
        </div>
        <span
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--font-playfair),Georgia,serif", fontStyle: "italic", color: "var(--primary)" }}>
          MealOra
        </span>
      </Link>

      <p className="px-5 mb-2 text-[10px] font-black tracking-[0.18em] text-muted-foreground/60 uppercase">
        Menu
      </p>

      <nav className="flex-1 px-3 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05]"
              }`}
              style={active ? { backgroundColor: "rgba(74,140,63,0.09)" } : {}}>
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                  style={{ backgroundColor: "var(--primary)" }}
                />
              )}
              <item.icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5 mt-4 pt-4 border-t border-border/50 flex flex-col gap-0.5">
        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05] transition-all">
          <Settings size={15} />
          Settings
        </Link>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold text-muted-foreground hover:text-red-500 hover:bg-red-50/60 transition-all">
          <LogOut size={15} />
          Log out
        </button>
      </div>

      {user && (
        <div className="px-5 py-4 border-t border-border/50 flex items-center gap-3">
          <div
            className="size-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ backgroundColor: "rgba(74,140,63,0.12)", color: "var(--primary)" }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-foreground truncate">{user.name}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Admin</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">

      <aside className="hidden md:flex flex-col w-[220px] shrink-0 border-r border-border/50 sticky top-0 h-screen overflow-y-auto bg-background">
        <SidebarInner />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
          {children}
        </main>
      </div>

      <MobileTabBar />
    </div>
  );
}
