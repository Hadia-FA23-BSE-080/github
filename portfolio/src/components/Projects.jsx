/**
 * Projects — Grid of ProjectCard components.
 * Maps over projects.items from data.js.
 */

"use client";

import { projects } from "@/data/data";
import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="projects-heading"
          heading={projects.heading}
          subheading={projects.subheading}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {(projects.items ?? []).map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
