import { Link2, AtSign, Code, Share2 } from "lucide-react";
import type { Social } from "../types/portfolio";

interface Props {
  social: Social;
  className?: string;
}

export default function SocialLinks({ social, className = "" }: Props) {
  const links = [
    { href: social.github, icon: <Code size={16} />, label: "GitHub" },
    { href: social.linkedin, icon: <Link2 size={16} />, label: "LinkedIn" },
    { href: social.instagram, icon: <Share2 size={16} />, label: "Instagram" },
    { href: `mailto:${social.email}`, icon: <AtSign size={16} />, label: "Email" },
  ].filter((l) => l.href && l.href.trim() !== "" && l.href !== "mailto:");

  if (!links.length) return null;

  return (
    <div className={`flex items-center gap-3 flex-wrap ${className}`}>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target={l.href.startsWith("mailto") ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={l.label}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/30 transition-all duration-200 text-xs tracking-wider"
        >
          {l.icon}
          <span className="hidden sm:inline">{l.label}</span>
        </a>
      ))}
    </div>
  );
}
