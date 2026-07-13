/**
 * Skills — Tech stack displayed as categorized glass cards.
 * Maps over skills.categories from data.js.
 */

"use client";

import { motion } from "framer-motion";
import { skills } from "@/data/data";
import SectionHeading from "./SectionHeading";
import SkillBadge from "./SkillBadge";

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
      aria-labelledby="skills-heading"
    >
      {/* Subtle section background tint */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.02] to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          id="skills-heading"
          heading={skills.heading}
          subheading={skills.subheading}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skills.categories.map((category, catIndex) => (
            <motion.article
              key={category.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: catIndex * 0.1, duration: 0.5 }}
              className="glass-card rounded-2xl p-6 transition-all hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5"
            >
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <SkillBadge key={item} label={item} />
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
