/**
 * About — Professional summary and stats grid.
 * All copy and stat values come from data.js → about.
 */

"use client";

import { motion } from "framer-motion";
import { about } from "@/data/data";
import SectionHeading from "./SectionHeading";

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function About() {
  return (
    <section
      id="about"
      className="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="about-heading"
          heading={about.heading}
          subheading={about.subheading}
        />

        {/* Summary paragraph in a glass card */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-3xl text-center text-base leading-relaxed text-muted sm:text-lg"
        >
          {about.summary}
        </motion.p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {about.stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={statVariants}
              className="glass-card group flex flex-col items-center rounded-2xl p-6 text-center transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 sm:p-8"
            >
              <span className="text-3xl font-bold text-accent transition-transform group-hover:scale-110 sm:text-4xl">
                {stat.value}
              </span>
              <span className="mt-2 text-sm text-muted sm:text-base">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
