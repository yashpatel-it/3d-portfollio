import { motion } from "framer-motion";
import { usePortfolio } from "../hooks/usePortfolio";

export default function ExperienceSection() {
  const { experience } = usePortfolio();

  // TODO: Populate experience array in src/data/portfolio.json with your work history

  return (
    <section id="experience" className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className="text-xs tracking-[0.3em] text-white/30 mb-4 uppercase">Experience</p>
        <h2
          className="hero-heading font-black leading-none mb-16"
          style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
        >
          WHERE<br />I'VE BEEN
        </h2>

        {experience.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center">
            <p className="text-white/30 text-sm tracking-widest">Completed a 2-month internship at Oneway Akshar Technology, Himmatnagar, where I gained hands-on experience in web development and software development practices. During the internship, I worked on real-world projects, improved my programming skills, and learned how to collaborate effectively in a professional development environment. This experience strengthened my knowledge of modern technologies and software development workflows.</p>
          </div>
        ) : (
          <div className="space-y-0">
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border-b border-white/5 py-10 grid md:grid-cols-[80px_1fr] gap-6 group hover:bg-white/[0.01] transition-colors px-4 -mx-4 rounded-xl"
              >
                <div>
                  <span className="section-number text-3xl font-black opacity-40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-white font-semibold text-xl">{exp.company}</h3>
                      <p className="text-white/50 text-sm mt-1">{exp.role}</p>
                    </div>
                    <span className="font-mono text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/40">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">{exp.summary}</p>
                  <ul className="space-y-2">
                    {exp.highlights.slice(0, 3).map((h, j) => (
                      <li key={j} className="flex gap-3 text-sm text-white/40">
                        <span className="accent-gradient-text font-bold mt-0.5">→</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
