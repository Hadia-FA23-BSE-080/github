/**
 * Contact — Contact form (UI only) and direct social/contact links.
 * Form does not submit anywhere — wire up your own backend or service later.
 */

"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Github, Twitter, Send } from "lucide-react";
import { contact, socialLinks } from "@/data/data";
import SectionHeading from "./SectionHeading";

// Map icon name strings from data.js to Lucide components
const iconMap = {
  mail: Mail,
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
};

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // UI-only — replace with your form handler (Formspree, Resend, API route, etc.)
    alert("Form submitted! Connect this to your backend in Contact.jsx.");
  };

  return (
    <section
      id="contact"
      className="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
      aria-labelledby="contact-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-accent/[0.03] to-transparent" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          id="contact-heading"
          heading={contact.heading}
          subheading={contact.subheading}
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left column — description + social links */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-base leading-relaxed text-muted sm:text-lg">
              {contact.description}
            </p>

            <ul className="mt-8 space-y-4">
              {socialLinks.map((link) => {
                const Icon = iconMap[link.icon];
                if (!Icon) return null;
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 text-muted transition-colors hover:text-accent"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all group-hover:border-accent/30 group-hover:bg-accent/10">
                        <Icon size={18} className="text-accent" />
                      </span>
                      <span className="font-medium">{link.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Right column — contact form */}
          <motion.form
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="glass-card space-y-5 rounded-2xl p-6 sm:p-8"
            noValidate
          >
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder={contact.form.namePlaceholder}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder={contact.form.emailPlaceholder}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
              />
            </div>

            <div>
              <label htmlFor="message" className="sr-only">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder={contact.form.messagePlaceholder}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
              />
            </div>

            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-background shadow-lg shadow-accent/25 transition-all hover:shadow-accent/40"
            >
              {contact.form.submitLabel}
              <Send
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
