/**
 * SectionHeading — Reusable section title + subtitle block.
 * Used at the top of About, Skills, Projects, and Contact sections.
 */

"use client";

import { motion } from "framer-motion";

export default function SectionHeading({ heading, subheading, id }) {
  return (
    <motion.header
      id={id}
      className="mb-12 text-center md:mb-16"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {heading}
      </h2>
      {subheading && (
        <p className="mx-auto mt-3 max-w-2xl text-base text-muted sm:text-lg">
          {subheading}
        </p>
      )}
      {/* Decorative accent line */}
      <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-accent" />
    </motion.header>
  );
}
