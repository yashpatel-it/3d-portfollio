import { usePortfolio } from "../hooks/usePortfolio";

export default function TestimonialsSection() {
  const { testimonials } = usePortfolio();

  if (testimonials.length === 0) return null;

  const doubled = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-24 overflow-hidden">
      <div className="px-6 max-w-7xl mx-auto mb-12">
        <p className="text-xs tracking-[0.3em] text-white/30 mb-4 uppercase">Testimonials</p>
        <h2
          className="hero-heading font-black leading-none"
          style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
        >
          WHAT THEY<br />SAY
        </h2>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex gap-6 marquee-track" style={{ width: "max-content" }}>
          {doubled.map((t, i) => (
            <div
              key={`${t.id}-${i}`}
              className="marquee-card w-80 flex-shrink-0 border border-white/5 bg-white/[0.02] rounded-2xl p-6"
            >
              <p className="text-white/60 text-sm leading-relaxed italic mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: t.avatarColor }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold uppercase tracking-wide">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
