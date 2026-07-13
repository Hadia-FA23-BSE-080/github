# Portfolio Website

A modern, fully responsive personal portfolio built with **Next.js**, **Tailwind CSS**, and **Framer Motion**.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Editing Your Content

**All dynamic content lives in one file:**

```
src/data/data.js
```

Edit this file to update your name, bio, projects, skills, stats, social links, and more. The UI components automatically read from it — no need to touch component files for content changes.

## Project Structure

```
src/
├── data/
│   └── data.js          ← Edit all content here
├── components/
│   ├── Navbar.jsx       ← Sticky navigation
│   ├── Hero.jsx         ← Landing section
│   ├── About.jsx        ← About + stats
│   ├── Skills.jsx       ← Tech stack grid
│   ├── Projects.jsx     ← Projects section
│   ├── ProjectCard.jsx  ← Individual project card
│   ├── SkillBadge.jsx   ← Tech tag pill
│   ├── Contact.jsx      ← Contact form + links
│   ├── Footer.jsx       ← Footer
│   └── SectionHeading.jsx
└── app/
    ├── layout.js        ← Root layout + fonts
    ├── page.js          ← Main page assembly
    └── globals.css      ← Theme colors & utilities
```

## Customization

- **Accent color**: Change `--accent` in `src/app/globals.css` (default: electric blue `#3b82f6`)
- **Project images**: Add images to `public/projects/` and uncomment the `<Image>` line in `ProjectCard.jsx`
- **Contact form**: Wire up `handleSubmit` in `Contact.jsx` to your backend (Formspree, Resend, etc.)

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide React](https://lucide.dev/) (icons)
- [Geist](https://vercel.com/font) (font)
