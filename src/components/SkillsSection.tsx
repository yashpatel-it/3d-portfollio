import { motion } from "framer-motion";
import { usePortfolio } from "../hooks/usePortfolio";
import TiltCard3D from "./3DTiltCard";
import SkillsGlobe3D from "./3DSkillsGlobe";

export default function SkillsSection() {
  const { skills } = usePortfolio();

  return (
    <section id="skills" className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className="text-xs tracking-[0.3em] text-white/30 mb-4 uppercase">Skills</p>
        <h2
          className="hero-heading font-black leading-none mb-16"
          style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
        >
          WHAT I<br />KNOW
        </h2>

        <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
          {/* Left Column: Skill Category Cards wrapped in 3D Tilt */}
          <div className="grid sm:grid-cols-2 gap-6 order-2 lg:order-1 w-full">
            {skills.categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="h-full"
              >
                <TiltCard3D className="h-full">
                  <div className="border border-white/5 bg-white/[0.02] rounded-2xl p-6 hover:border-white/10 transition-colors h-full flex flex-col">
                    <p className="text-xs tracking-widest text-white/30 uppercase mb-4">{cat.name}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {cat.items.map((item) => (
                        <span
                          key={item}
                          className="text-sm px-3 py-1 rounded-full border border-white/10 text-white/60 bg-white/5"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </TiltCard3D>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Interactive 3D Skills Tag Globe */}
          <div className="flex justify-center items-center order-1 lg:order-2 w-full lg:w-[450px]">
            <SkillsGlobe3D />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
