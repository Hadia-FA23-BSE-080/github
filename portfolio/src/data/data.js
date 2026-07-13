/**
 * ============================================================
 * PORTFOLIO DATA — Edit this file to update your entire site
 * ============================================================
 * All text, links, projects, skills, and stats live here.
 * UI components read from this file only — no hardcoded content.
 */

// ── Site metadata (used in layout & SEO) ──────────────────
export const siteMeta = {
  name: "Hadia Ahmad",
  title: "Hadia Ahmad | MERN Stack Developer",
  description:
    "MERN Stack Developer with 1 year of experience building scalable full-stack web applications using MongoDB, Express, React, and Node.js.",
  url: "https://yourportfolio.com",
};

// ── Navigation links (Navbar + smooth scroll targets) ───
export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

// ── Hero section ──────────────────────────────────────────
export const hero = {
  greeting: "Hi, I'm",
  name: "Hadia Ahmad",
  title: "MERN Stack Developer",
  bio: [
    "I design and build scalable full-stack web applications with MongoDB, Express, React, and Node.js.",
    "Focused on clean architecture, reliable APIs, and interfaces that users actually enjoy.",
  ],
  cta: {
    primary: { label: "View Projects", href: "#projects" },
    secondary: { label: "Contact Me", href: "#contact" },
  },
};

// ── About section ─────────────────────────────────────────
export const about = {
  heading: "About Me",
  subheading: "Turning ideas into production-ready web applications",
  summary:
    "I'm a MERN Stack Developer with one year of professional experience building end-to-end web applications that are fast, scalable, and built to last. From designing intuitive React frontends to developing secure RESTful APIs with Node.js and Express, and structuring efficient data models in MongoDB — I work confidently across the full stack. I thrive on solving complex problems with clean, maintainable code and take ownership of every feature from concept to deployment. Whether it's a new product or an existing codebase, I bring a detail-oriented mindset and a commitment to delivering work that meets real business needs.",
  stats: [
    { label: "Years of Experience", value: "1+" },
    { label: "Projects Completed", value: "10+" },
    { label: "Technologies Mastered", value: "10+" },
    { label: "Core Stack", value: "MERN" },
  ],
};

// ── Skills / Tech stack ───────────────────────────────────
export const skills = {
  heading: "Skills & Tech Stack",
  subheading: "The MERN stack and tools I use to build scalable web apps",
  categories: [
    {
      name: "Frontend",
      items: ["React", "JavaScript", "HTML5", "CSS3", "Tailwind CSS"],
    },
    {
      name: "Backend",
      items: ["Node.js", "Express.js", "REST APIs", "JWT Auth", "Middleware"],
    },
    {
      name: "Database",
      items: ["MongoDB", "Mongoose", "Schema Design", "Aggregation", "Indexing"],
    },
    {
      name: "Tools",
      items: ["Git", "GitHub", "Postman", "VS Code", "npm"],
    },
  ],
};

// ── Projects ──────────────────────────────────────────────
export const projects = {
  heading: "Featured Projects",
  subheading: "Full-stack MERN applications I've designed and built",
  items: [
    {
      id: "adflow-pro",
      title: "AdFlow Pro",
      description:
        "A full-stack MERN dashboard for managing, tracking, and optimizing digital ad campaigns with real-time analytics.",
      image:
        "https://github.com/user-attachments/assets/d836f86a-29bf-4f20-8887-70f1999143a7",
      imageAlt: "AdFlow Pro dashboard preview",
      tech: ["React", "Node.js", "MongoDB", "Redux", "Stripe"],
      links: {
        live: "https://github-ji8l.vercel.app/",
        github:
          "https://github.com/Hadia-FA23-BSE-080/github/tree/main/midterm",
      },
    },
    {
      id: "exam-management-api",
      title: "Exam Management API",
      description:
        "A backend application built with Node.js, Express.js, and SQLite for managing students, exams, and results through RESTful endpoints.",
      image:
        "https://github.com/user-attachments/assets/1d5af64d-da21-427a-830b-be5d04346d13",
      imageAlt: "Exam Management API preview",
      tech: ["Node.js", "Express", "SQLite", "REST APIs"],
      links: {
        live: null,
        github:
          "https://github.com/Hadia-FA23-BSE-080/github/tree/main/exam-management-api",
      },
    },
    {
      id: "school-management-system",
      title: "School Management System",
      description:
        "A comprehensive MERN stack platform for academic operations — student management, attendance tracking, and role-based dashboards for admins, teachers, and students.",
      image:
        "https://github.com/user-attachments/assets/98c29712-6055-49f8-a287-5a7b1753dc04",
      imageAlt: "School Management System preview",
      tech: ["React", "Express", "MongoDB", "Node.js"],
      links: {
        live: null,
        github:
          "https://github.com/Hadia-FA23-BSE-080/github/tree/main/School%20Management%20System",
      },
    },
    {
      id: "dr-hub",
      title: "Dr Hub",
      description:
        "A secure MERN stack healthcare platform streamlining doctor-patient appointments, medical record management, and clinic administration.",
      image:
        "https://github.com/user-attachments/assets/b46ec997-b4c3-4548-a8bf-b95407739b85",
      imageAlt: "Dr Hub healthcare platform preview",
      tech: ["React", "Express", "MongoDB", "Node.js"],
      links: {
        live: "https://dorctor-hub.vercel.app",
        github:
          "https://github.com/Hadia-FA23-BSE-080/github/tree/main/Dr%20Hub%20Final",
      },
    },
  ],
};
// ── Contact section ───────────────────────────────────────
export const contact = {
  heading: "Get In Touch",
  subheading: "Have a project in mind? Let's talk.",
  description:
    "I'm open to freelance projects, full-time roles, and collaborations. Whether you have a product idea or need a developer on your team — let's connect.",
  form: {
    namePlaceholder: "Your Name",
    emailPlaceholder: "Your Email",
    messagePlaceholder: "Your Message",
    submitLabel: "Send Message",
  },
};

// ── Social & direct contact links ─────────────────────────
export const socialLinks = [
  {
    name: "Email",
    href: "mailto:ahmadhadia242@gmail.com",
    icon: "mail",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/hadia-ahmad-a83a8536b?",
    icon: "linkedin",
  },
  {
    name: "GitHub",
    href: "https://github.com/Hadia-FA23-BSE-080/github",
    icon: "github",
  },


];

// ── Footer ────────────────────────────────────────────────
export const footer = {
  copyright: `© ${new Date().getFullYear()} Hadia Ahmad. All rights reserved.`,
  tagline: "Built with Next.js, Tailwind CSS & Framer Motion",
};
