"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {slideFromLeft, slideFromRight, scaleReveal, blurReveal, fadeUpDelayed, heroStagger} from "@/lib/motion";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-background">
      <motion.div
        initial="hidden"
        animate="show"
        variants={heroStagger}
        className="flex h-[260px] md:h-[620px] items-end gap-1 md:gap-1.5 px-1 md:px-2">
       
        <motion.div
          variants={slideFromLeft}
          className="relative flex-1 h-full overflow-hidden rounded-t-xl md:rounded-t-2xl">
          <Image
            src="/images/hero1.jpg"
            alt="A beautifully plated meal"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </motion.div>

        <motion.div
          variants={scaleReveal}
          className="hidden md:relative md:block md:flex-1 md:h-[68%] overflow-hidden self-end"
          style={{ borderTopLeftRadius: 9999, borderTopRightRadius: 9999 }}>
          <Image
            src="/images/hero22.jpg"
            alt="Fresh ingredients and vibrant flavours"
            fill
            priority
            className="object-cover object-top"
            sizes="25vw"
          />
        </motion.div>

        <motion.div
          variants={scaleReveal}
          className="hidden md:relative md:block md:flex-1 md:h-[68%] overflow-hidden self-end"
          style={{ borderTopLeftRadius: 9999, borderTopRightRadius: 9999 }}>
          <Image
            src="/images/hero3.jpg"
            alt="Chef's signature dish"
            fill
            priority
            className="object-cover object-center"
            sizes="25vw"
          />
        </motion.div>

        <motion.div
          variants={slideFromRight}
          className="relative flex-1 h-full overflow-hidden rounded-t-xl md:rounded-t-2xl">
          <Image
            src="/images/hero4.avif"
            alt="A memorable dining experience"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={heroStagger}
        className="absolute inset-0 z-10 flex flex-col items-center pointer-events-none px-4">
        <motion.h1
          variants={blurReveal}
          className="mt-5 md:mt-9 text-center text-brand-green leading-[0.9] select-none"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: "clamp(3.2rem, 9.5vw, 8rem)",
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}>
          MealOra
        </motion.h1>

        <motion.p
          variants={fadeUpDelayed}
          className="mt-2 md:mt-3 text-center text-muted-foreground font-light tracking-[0.18em] uppercase"
          style={{ fontSize: "clamp(0.6rem, 1.2vw, 0.72rem)" }}>
          Handcrafted meals&nbsp;&nbsp;·&nbsp;&nbsp;Local providers&nbsp;&nbsp;·&nbsp;&nbsp;Delivered fresh
        </motion.p>
      </motion.div>
    </div>
  );
}
