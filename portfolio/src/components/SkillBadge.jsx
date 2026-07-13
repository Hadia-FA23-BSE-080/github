/**
 * SkillBadge — Small pill badge for tech stack tags on project cards.
 * Props: label (string) — the technology name to display.
 */

export default function SkillBadge({ label }) {
  return (
    <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
      {label}
    </span>
  );
}
