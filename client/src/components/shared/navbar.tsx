"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, ChefHat, UtensilsCrossed, Tag, Info } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useCartStore } from "@/lib/cart-store";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const publicLinks = [
    { href: "/meals", label: "Find Food", icon: UtensilsCrossed },
    { href: "/providers", label: "Our Kitchens", icon: ChefHat },
    { href: "/meals?deal=true", label: "Deals", icon: Tag },
    { href: "/about", label: "About", icon: Info },
  ];

  const navLinks =
    user?.role === "CUSTOMER"
      ? [
          ...publicLinks,
          { href: "/dashboard", label: "Dashboard", icon: null },
          { href: "/orders", label: "My Orders", icon: null },
        ]
      : user?.role === "PROVIDER"
      ? [
          ...publicLinks,
          { href: "/dashboard", label: "Dashboard", icon: null },
          { href: "/provider/menu", label: "My Menu", icon: null },
          { href: "/provider/orders", label: "Orders", icon: null },
        ]
      : user?.role === "ADMIN"
      ? [
        ...publicLinks,
          { href: "/admin", label: "Dashboard", icon: null },
          { href: "/admin/users", label: "Users", icon: null },
          { href: "/admin/orders", label: "Orders", icon: null },
          { href: "/admin/categories", label: "Categories", icon: null },
        ]
      : publicLinks;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

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
      <div className="max-w-7xl mx-auto flex h-[68px] items-center justify-between px-4 md:px-8 gap-6">

        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative size-9 rounded-full overflow-hidden ring-2 ring-border/60 group-hover:ring-brand-green/60 transition-all duration-300 shadow-sm">
            <Image
              src="/images/logo.avif"
              alt="MealOra"
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
          <span
            className="text-[1.25rem] font-semibold text-brand-green tracking-wide transition-colors duration-200 group-hover:text-primary"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontStyle: "italic" }}>
            MealOra
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full bg-foreground/[0.05] border border-border/50">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-background text-brand-green shadow-sm ring-1 ring-border/40"
                    : "text-muted-foreground hover:text-foreground"
                }`}>
                {link.icon && (
                  <link.icon
                    size={13}
                    strokeWidth={2}
                    className={active ? "text-brand-green" : "text-muted-foreground"}
                  />
                )}
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

        <div className="flex items-center gap-1">
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
                    className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-bold">
                    {cartCount > 9 ? "9+" : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )}

          <span className="hidden md:block h-5 w-px bg-border/60 mx-1.5" />

          {!user ? (
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/login"
                className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-foreground/[0.06] transition-all duration-200">
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 rounded-full text-sm font-semibold bg-brand-green text-white hover:opacity-90 transition-all duration-200 hover:-translate-y-px shadow-sm">
                Get started
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/settings" className="group flex items-center gap-2.5 pl-3 pr-3.5 py-1.5 rounded-full border border-border hover:border-primary/40 hover:bg-primary/[0.04] transition-all duration-200">
                <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-foreground truncate max-w-[120px]">{user.name}</span>
                  <span className="text-[10px] text-primary font-semibold tracking-wide">{user.role.charAt(0) + user.role.slice(1).toLowerCase()}</span>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-primary transition-colors shrink-0"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </Link>
              <button
                onClick={() => { logout(); router.push("/login"); }}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground border border-border/60 hover:border-foreground/30 hover:bg-foreground/[0.04] transition-all duration-200">
                Log out
              </button>
            </div>
          )}

          <button
            className="md:hidden flex items-center justify-center size-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06] transition-all duration-200 ml-0.5"
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
              {navLinks.map((link, i) => {
                const active = isActive(link.href);
                return (
                  <motion.div key={link.href}
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-brand-green/8 text-brand-green border border-brand-green/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05]"
                      }`}>
                      {link.icon && <link.icon size={15} strokeWidth={2} />}
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              <div className="mt-3 pt-3 border-t border-border/50 flex flex-col gap-2">
                {!user ? (
                  <div className="flex gap-2">
                    <Link href="/login" onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-muted-foreground border border-border/60 rounded-full">
                      Log in
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center px-4 py-2.5 text-sm font-semibold bg-brand-green text-white rounded-full">
                      Get started
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col leading-none pl-1">
                      <span className="text-xs font-semibold text-foreground">{user.name}</span>
                      <span className="text-[10px] text-primary font-medium mt-0.5">
                        {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <button
                      onClick={() => { logout(); router.push("/login"); setMobileOpen(false); }}
                      className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border/60 rounded-full hover:text-foreground transition-colors">
                      Log out
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
