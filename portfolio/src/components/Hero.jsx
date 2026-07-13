/**
 * Hero — Full-viewport landing section with greeting, title, bio, and CTAs.
 * Background features a subtle animated gradient glow.
 */

"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { hero } from "@/data/data";

export default function Hero() {
  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-20 sm:px-6 lg:px-8"
      aria-label="Hero"
    >
      {/* Animated background glow orbs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-accent/10 blur-[140px]" />
        <motion.div
          className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/15 blur-[100px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Small badge above the name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted backdrop-blur-sm"
        >
          <Sparkles size={14} className="text-accent" />
          <span>Available for freelance work</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="block text-muted">{hero.greeting}</span>
          <span className="mt-1 block bg-gradient-to-r from-foreground via-foreground to-accent bg-clip-text text-transparent">
            {hero.name}
          </span>
        </motion.h1>

        {/* Professional title */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-lg font-medium text-accent sm:text-xl md:text-2xl"
        >
          {hero.title}
        </motion.p>

        {/* Two-line bio */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-6 max-w-xl space-y-1 text-base text-muted sm:text-lg"
        >
          {hero.bio.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            type="button"
            onClick={() => scrollTo(hero.cta.primary.href)}
            className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-background shadow-lg shadow-accent/25 transition-all hover:shadow-accent/40 sm:w-auto"
          >
            <span className="relative z-10">{hero.cta.primary.label}</span>
            <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0" />
          </button>

          <button
            type="button"
            onClick={() => scrollTo(hero.cta.secondary.href)}
            className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:border-accent/50 hover:bg-accent/10 sm:w-auto"
          >
            {hero.cta.secondary.label}
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-20"
        >
          <motion.button
            type="button"
            onClick={() => scrollTo("#about")}
            aria-label="Scroll to about section"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex flex-col items-center gap-2 text-muted transition-colors hover:text-accent"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ArrowDown size={18} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
