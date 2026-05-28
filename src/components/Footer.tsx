import { useState } from "react";
import { Copy, Check, MapPin } from "lucide-react";
import { usePortfolio } from "../hooks/usePortfolio";
import SocialLinks from "./SocialLinks";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const { profile } = usePortfolio();
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.social.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer id="contact" className="border-t border-white/5 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* 3-column grid */}
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <h3
              className="hero-heading font-black leading-none mb-3"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              {profile.name}
            </h3>
            <p className="text-white/40 text-sm mb-2">{profile.specialization}</p>
            <div className="flex items-center gap-1.5 text-white/30 text-sm">
              <MapPin size={13} />
              <span>{profile.location}</span>
            </div>
          </div>

          {/* Navigate */}
          <div>
            <p className="text-xs tracking-widest text-white/30 uppercase mb-6">Navigate</p>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-white/50 text-sm hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Reach Out */}
          <div>
            <p className="text-xs tracking-widest text-white/30 uppercase mb-6">Reach Out</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-white/50 text-sm">{profile.social.email}</span>
                <button
                  onClick={copyEmail}
                  aria-label="Copy email"
                  className="p-1.5 rounded-md border border-white/10 hover:border-white/30 text-white/40 hover:text-white transition-all"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>
              {profile.social.phone && (
                <a
                  href={`tel:${profile.social.phone}`}
                  className="block text-white/50 text-sm hover:text-white transition-colors"
                >
                  {profile.social.phone}
                </a>
              )}
              <SocialLinks social={profile.social} className="mt-4 flex-wrap" />
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Built with React · TypeScript · Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
}
