/**
 * Footer — Copyright line and social icon links.
 * Reads footer copy and socialLinks from data.js.
 */

import { Mail, Linkedin, Github, Twitter } from "lucide-react";
import { footer, socialLinks } from "@/data/data";

const iconMap = {
  mail: Mail,
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
};

export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="text-sm text-muted">{footer.copyright}</p>
          <p className="mt-1 text-xs text-muted/60">{footer.tagline}</p>
        </div>

        <ul className="flex items-center gap-3">
          {socialLinks.map((link) => {
            const Icon = iconMap[link.icon];
            if (!Icon) return null;
            return (
              <li key={link.name}>
                <a
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted transition-all hover:border-accent/30 hover:bg-accent/10 hover:text-accent"
                >
                  <Icon size={16} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
