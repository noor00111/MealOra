"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChefHat, Leaf, ShieldCheck, Users, ArrowRight } from "lucide-react";

const features = [
  {
    icon: ChefHat,
    title: "Support Local Chefs",
    desc: "Help small kitchens and independent chefs grow their craft.",
  },
  {
    icon: Leaf,
    title: "Fresh & Quality Meals",
    desc: "Made with care, using fresh ingredients every single day.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Easy Ordering",
    desc: "Secure payments and hassle-free delivery to your door.",
  },
  {
    icon: Users,
    title: "A Foodie Community",
    desc: "Share, explore and support local food culture together.",
  },
];

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

          <div>
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
              className="mb-4">
              <span
                className="text-[10px] font-black tracking-[0.18em] px-3 py-1.5 rounded-full"
                style={{ backgroundColor: "rgba(74,140,63,0.1)", color: "var(--primary)" }}>
                ABOUT MEALORA
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
              className="text-4xl md:text-5xl font-bold leading-tight text-foreground"
              style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
              Good Food Brings<br />People{" "}
              <em
                className="not-italic">
                Together!
              </em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.18 }}
              className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-md">
              MealOra is more than just a food platform — it&apos;s a space where great food,
              talented local chefs, and food lovers come together. We make it easy to
              discover, order, and enjoy delicious meals, all from the comfort of your home.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.28 }}
              className="mt-8 flex items-center gap-4">
              <Link
                href="/meals"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-px"
                style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 16px 0 rgba(74,140,63,0.3)" }}>
                Browse meals <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                Get in touch →
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center">

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-4 size-20 rounded-full opacity-30"
              style={{ backgroundColor: "var(--primary)" }}
            />
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-6 size-14 rounded-full opacity-20"
              style={{ backgroundColor: "var(--primary)" }}
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-1/2 -left-8 size-8 rounded-full opacity-25"
              style={{ backgroundColor: "var(--primary)" }}
            />

            <div
              className="relative size-72 md:size-96 rounded-full overflow-hidden"
              style={{boxShadow: "0 12px 48px 0 rgba(74,140,63,0.18), 0 0 0 6px rgba(74,140,63,0.08)"}}>
              <Image
                src="/images/aboutImg.png"
                alt="food"
                fill
                className="object-cover"
                priority
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              className="absolute -bottom-4 right-0 md:-right-6 px-4 py-2.5 rounded-2xl bg-card border border-border"
              style={{ boxShadow: "0 4px 20px 0 rgba(74,140,63,0.1)" }}>
              <p
                className="text-sm font-semibold italic"
                style={{ fontFamily: "var(--font-playfair),Georgia,serif", color: "var(--primary)" }}>
              From their kitchen to your table.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div
        className="py-14"
        style={{ backgroundColor: "rgba(74,140,63,0.04)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 * i }}
                className="flex flex-col items-center text-center gap-3">
                <div
                  className="size-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(74,140,63,0.1)" }}>
                  <f.icon size={20} style={{ color: "var(--primary)" }} />
                </div>
                <p className="text-sm font-bold text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative h-80 md:h-[420px]">
            <div
              className="absolute left-0 top-0 w-[65%] h-[75%] rounded-3xl overflow-hidden"
              style={{ boxShadow: "0 8px 32px 0 rgba(74,140,63,0.12)" }}>
              <Image
                src="/images/aboutImg1.png"
                alt="MealOra kitchen"
                fill
                className="object-cover"
              />
            </div>
            <div
              className="absolute right-0 bottom-0 w-[50%] h-[55%] rounded-3xl overflow-hidden"
              style={{ boxShadow: "0 8px 24px 0 rgba(74,140,63,0.1)" }}>
              <Image
                src="/images/aboutImg2.png"
                alt="Delicious meal"
                fill
                className="object-cover"
              />
            </div>
            <div
              className="absolute right-[48%] top-[68%] size-12 rounded-full"
              style={{ backgroundColor: "var(--primary)", opacity: 0.15 }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="flex flex-col gap-5">
            <span
              className="text-[10px] font-black tracking-[0.18em] w-fit px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "rgba(74,140,63,0.1)", color: "var(--primary)" }}>
              OUR STORY
            </span>

            <h2
              className="text-3xl md:text-4xl font-bold text-foreground leading-tight"
              style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
              From a Simple Idea to a Growing Community
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed">
              MealOra started with a simple idea — to make great food more accessible and to give
              local chefs a bigger platform. Today, it&apos;s a growing community of food lovers
              and talented cooks, working together to bring better meals, stronger local kitchens,
              and happier tables.
            </p>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Every order you place supports a real person — someone who woke up early to prep
              fresh ingredients, who cares about what goes on your plate. That&apos;s what makes
              MealOra different.
            </p>

            <p
              className="text-xl font-bold italic mt-2"
              style={{ fontFamily: "var(--font-playfair),Georgia,serif", color: "var(--primary)" }}>
              Better food, bigger dreams.
            </p>
          </motion.div>
        </div>
      </div>

      <div
        className="py-16 px-4 text-center"
        style={{ backgroundColor: "rgba(74,140,63,0.06)" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto">
          <p
            className="text-3xl md:text-4xl font-bold italic leading-snug text-foreground"
            style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
            &ldquo;Food is the ingredient that binds us together.&rdquo;
          </p>
          <p className="text-sm text-muted-foreground mt-4">— The MealOra team</p>
        </motion.div>
      </div>
    </div>
  );
}
