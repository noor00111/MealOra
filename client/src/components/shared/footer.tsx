"use client";

import Link from "next/link";
import Image from "next/image";
import { UtensilsCrossed, ChefHat, Tag, Info, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";

const LINKS = {
  discover: [
    { href: "/meals", label: "Find Food" },
    { href: "/meals?deal=true", label: "Deals & Offers" },
    { href: "/meals?sort=popular", label: "Most Popular" },
    { href: "/meals?sort=new", label: "New Arrivals" },
  ],
  company: [
    { href: "/about", label: "About MealOra" },
    { href: "/contact", label: "Contact Us" },
    { href: "/blog", label: "Food Stories" },
    { href: "/careers", label: "Careers" },
    { href: "/partners", label: "Become a Chef" },
  ],
  support: [
    { href: "/help", label: "Help Center" },
    { href: "/faq", label: "FAQ" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/refund", label: "Refund Policy" },
  ],
};

const SOCIALS = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(""); }
  };

  return (
    <footer className="mt-16 relative overflow-hidden" style={{ background: "#0f2318" }}>

      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden>
        <span
          className="text-[13vw] font-bold leading-none tracking-tighter whitespace-nowrap"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontStyle: "italic",
            color: "transparent",
            WebkitTextStroke: "1px rgba(255,255,255,0.06)",
          }}>
          MealOra
        </span>
      </div>

      <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg, var(--primary), #fbbf24, var(--primary))" }} />
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-16 pb-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-14">

          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative size-10 rounded-full overflow-hidden ring-2 ring-white/25 group-hover:ring-primary/70 transition-all duration-300">
                <Image src="/images/logo.avif" alt="MealOra" fill className="object-cover" sizes="40px" />
              </div>
              <span
                className="text-[1.5rem] font-bold text-white tracking-wide"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontStyle: "italic" }}>
                MealOra
              </span>
            </Link>

            <p className="text-white/75 text-sm leading-relaxed max-w-[280px]">
              Good food has a story. Find yours, one plate at a time.
            </p>

            <div className="flex flex-col gap-2.5 text-sm text-white/70">
              <span className="flex items-center gap-2.5"><Mail size={13} className="text-primary shrink-0" /> hello@mealora.com</span>
              <span className="flex items-center gap-2.5"><Phone size={13} className="text-primary shrink-0" /> +880 1700-000000</span>
              <span className="flex items-center gap-2.5"><MapPin size={13} className="text-primary shrink-0" /> Chittagong, Bangladesh</span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              {SOCIALS.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex items-center justify-center size-9 rounded-full bg-white/10 text-white/80 hover:bg-primary hover:text-white border border-white/15 hover:border-primary transition-all duration-200">
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-5 flex items-center gap-1.5">
              <UtensilsCrossed size={11} /> Discover
            </p>
            <ul className="flex flex-col gap-3">
              {LINKS.discover.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-5 flex items-center gap-1.5">
              <Info size={11} /> Company
            </p>
            <ul className="flex flex-col gap-3">
              {LINKS.company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-5 flex items-center gap-1.5">
              <ChefHat size={11} /> Support
            </p>
            <ul className="flex flex-col gap-3">
              {LINKS.support.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border border-white/15 rounded-2xl p-6 md:p-8 bg-white/[0.06] mb-10 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div>
            <p className="text-white font-semibold text-base mb-1"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              Fresh deals, straight to your inbox
            </p>
          </div>
          {subscribed ? (
            <p className="text-primary font-semibold text-sm shrink-0">You&apos;re in! 🎉</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 md:w-[220px] px-4 py-2.5 rounded-full text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-primary/70 transition-colors duration-200"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold bg-primary text-white hover:opacity-90 transition-all duration-200 shrink-0">
                Subscribe <ArrowRight size={13} />
              </button>
            </form>
          )}
        </div>

        <div className="border-t border-white/15 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <span>© {new Date().getFullYear()} MealOra. All rights reserved.</span>
          <div className="flex items-center gap-1.5">
            <Tag size={10} className="text-primary" />
            <span>Made with care for local food communities</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-white transition-colors duration-200">Privacy</Link>
            <Link href="/" className="hover:text-white transition-colors duration-200">Terms</Link>
            <Link href="/" className="hover:text-white transition-colors duration-200">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
