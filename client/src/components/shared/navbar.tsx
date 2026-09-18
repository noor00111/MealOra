"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {ShoppingCart, Menu, X, ChefHat, UtensilsCrossed, Tag, Info, Mail, LayoutDashboard, ShoppingBag, ClipboardList, Users, List, Settings, LogOut, ChevronDown} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useCartStore } from "@/lib/cart-store";

const publicLinks = [
  { href: "/meals",           label: "Find Food",    icon: UtensilsCrossed },
  { href: "/providers",       label: "Our Kitchens", icon: ChefHat },
  { href: "/about",           label: "About",        icon: Info },
  { href: "/contact",         label: "Contact",      icon: Mail },
  { href: "/meals?deal=true", label: "Deals",        icon: Tag },
];

const roleLinks: Record<string, { href: string; label: string; icon: React.ElementType }[]> = {
  CUSTOMER: [
    { href: "/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
    { href: "/orders",     label: "My Orders",  icon: ShoppingBag },
  ],
  PROVIDER: [
    { href: "/dashboard",       label: "Dashboard", icon: LayoutDashboard },
    { href: "/provider/menu",   label: "My Menu",   icon: ClipboardList },
    { href: "/provider/orders", label: "Orders",    icon: ShoppingBag },
  ],
  ADMIN: [
    { href: "/admin",             label: "Dashboard",  icon: LayoutDashboard },
    { href: "/admin/users",       label: "Users",      icon: Users },
    { href: "/admin/orders",      label: "Orders",     icon: ClipboardList },
    { href: "/admin/categories",  label: "Categories", icon: List },
  ],
};

export function Navbar() {
  const router    = useRouter();
  const pathname  = usePathname();
  const user      = useAuthStore((s) => s.user);
  const logout    = useAuthStore((s) => s.logout);
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    if (dropOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [dropOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]);
  const userRoleLinks = user ? (roleLinks[user.role] ?? []) : [];
  if (pathname?.startsWith("/admin")) return null;

  function handleLogout() {
    logout();
    router.push("/login");
    setDropOpen(false);
    setMobileOpen(false);
  }

  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/60 shadow-[0_1px_24px_rgba(0,0,0,0.06)]"
          : "bg-background border-b border-border/40"
      }`}>
      <div className="max-w-7xl mx-auto flex h-[64px] items-center justify-between px-4 md:px-8 gap-4">

        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative size-8 rounded-full overflow-hidden ring-2 ring-border/60 group-hover:ring-primary/40 transition-all duration-300 shadow-sm">
            <Image src="/images/logo.avif" alt="MealOra" fill className="object-cover" sizes="32px" />
          </div>
          <span
            className="text-[1.15rem] font-semibold text-primary tracking-wide transition-colors duration-200"
            style={{ fontFamily: "var(--font-playfair),Georgia,serif", fontStyle: "italic" }}>
            MealOra
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5 px-2 py-1.5 rounded-full bg-foreground/[0.04] border border-border/50 flex-shrink-0">
          {publicLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex gap-2 items-center px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 whitespace-nowrap ${
                  active
                    ? "bg-background text-primary shadow-sm ring-1 ring-border/40"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                }`}>
                  <link.icon size={14} />
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 shrink-0">
          {(!user || user.role === "CUSTOMER") && (
            <Link
              href="/cart"
              className="relative flex items-center justify-center size-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06] transition-all duration-200"
              aria-label="Cart">
              <ShoppingCart size={17} strokeWidth={1.8} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-primary text-white text-[9px] font-bold">
                    {cartCount > 9 ? "9+" : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )}

          {!user && (
            <div className="hidden md:flex items-center gap-1">
              <div className="w-px h-5 bg-border/60 mx-1" />
              <Link
                href="/login"
                className="px-4 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-foreground/[0.06] transition-all duration-200">
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-full text-[13px] font-semibold bg-primary text-white hover:opacity-90 transition-all duration-200 hover:-translate-y-px shadow-sm">
                Sign up
              </Link>
            </div>
          )}

          {user && (
            <div className="hidden md:block relative" ref={dropRef}>
              <button
                onClick={() => setDropOpen((v) => !v)}
                className="flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-full border border-border hover:border-primary/40 hover:bg-primary/[0.04] transition-all duration-200 group">
                <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col leading-tight text-left">
                  <span className="text-[13px] font-semibold text-foreground truncate max-w-[100px]">{user.name}</span>
                  <span className="text-[10px] text-primary font-semibold tracking-wide">
                    {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                  </span>
                </div>
                <ChevronDown
                  size={13}
                  className={`text-muted-foreground transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
                    style={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.10)" }}>
                    <div className="px-2 py-2">
                     
                      {userRoleLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setDropOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ${
                            isActive(link.href)
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}>
                          <link.icon size={14} />
                          {link.label}
                        </Link>
                      ))}
                    </div>

                    <div className="h-px bg-border/60 mx-3" />

                    <div className="px-2 py-2">
                      <Link
                        href="/settings"
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150">
                        <Settings size={14} /> Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-150">
                        <LogOut size={14} /> Log out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button
            className="md:hidden flex items-center justify-center size-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06] transition-all duration-200"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu">
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span key="x"
                  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                  <X size={18} />
                </motion.span>
              ) : (
                <motion.span key="menu"
                  initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                  <Menu size={18} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-t border-border/50 bg-background overflow-hidden">
            <div className="px-4 py-4 flex flex-col gap-1">
             
              {publicLinks.map((link, i) => {
                const active = isActive(link.href);
                return (
                  <motion.div key={link.href}
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05]"
                      }`}>
                      <link.icon size={15} strokeWidth={2} />
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              {user && userRoleLinks.length > 0 && (
                <>
                  <div className="h-px bg-border/50 my-2 mx-2" />
                  {userRoleLinks.map((link, i) => {
                    const active = isActive(link.href);
                    return (
                      <motion.div key={link.href}
                        initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (publicLinks.length + i) * 0.04 }}>
                        <Link
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05]"
                          }`}>
                          <link.icon size={15} strokeWidth={2} />
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </>
              )}

              <div className="mt-3 pt-3 border-t border-border/50">
                {!user ? (
                  <div className="flex gap-2">
                    <Link href="/login" onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-muted-foreground border border-border/60 rounded-full">
                      Log in
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center px-4 py-2.5 text-sm font-semibold bg-primary text-white rounded-full">
                      Sign up
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-1">
                    <Link href="/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold text-foreground">{user.name}</span>
                        <span className="text-[10px] text-primary font-medium">
                          {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </Link>
                    <button onClick={handleLogout}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground border border-border/60 rounded-full hover:text-destructive hover:border-destructive/40 transition-colors">
                      <LogOut size={13} /> Log out
                     </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
