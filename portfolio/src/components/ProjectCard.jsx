/**
 * ProjectCard — Single project card with image, details, tech badges, and links.
 * Props: project — one item from projects.items in data.js.
 */

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Github, FolderOpen } from "lucide-react";
import SkillBadge from "./SkillBadge";

export default function ProjectCard({ project, index = 0 }) {
  const { title, description, image, imageAlt, tech = [], links = {} } = project;
  const liveUrl = links.live && links.live !== "#" ? links.live : null;
  const githubUrl = links.github || null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="glass-card group flex flex-col overflow-hidden rounded-2xl transition-shadow hover:shadow-xl hover:shadow-accent/5"
    >
      {/* Project image or placeholder */}
      <div
        className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-accent/10 to-white/5"
        role="img"
        aria-label={imageAlt || title}
      >
        {image ? (
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FolderOpen
              size={48}
              className="text-accent/30 transition-transform duration-300 group-hover:scale-110 group-hover:text-accent/50"
              strokeWidth={1.5}
            />
          </div>
        )}

        {/* Hover overlay with quick links */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 bg-background/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent p-3 text-background transition-transform hover:scale-110"
              aria-label={`Live demo of ${title}`}
            >
              <ExternalLink size={18} />
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 bg-white/10 p-3 text-foreground transition-transform hover:scale-110"
              aria-label={`GitHub repo for ${title}`}
            >
              <Github size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {description}
        </p>

        {/* Tech stack badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tech.map((t) => (
            <SkillBadge key={t} label={t} />
          ))}
        </div>

        {/* Footer links (always visible on mobile) */}
        <div className="mt-5 flex gap-4 border-t border-white/5 pt-4 md:hidden">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              <ExternalLink size={14} />
              Live Demo
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground"
            >
              <Github size={14} />
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
