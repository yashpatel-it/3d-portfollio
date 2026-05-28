import { motion } from "framer-motion";
import { Server, Brain, Monitor, Cloud } from "lucide-react";

// TODO: Move services to src/data/portfolio.json later
const services = [
  {
    id: "01",
    title: "Backend",
    description: "Scalable APIs, database design, and server-side logic using Python and Java.",
    icon: Server,
  },
  {
    id: "02",
    title: "AI / LLM",
    description: "Integrating large language models and building intelligent, data-driven features.",
    icon: Brain,
  },
  {
    id: "03",
    title: "Frontend",
    description: "Responsive interfaces with React, TypeScript, and modern CSS frameworks.",
    icon: Monitor,
  },
  {
    id: "04",
    title: "Cloud",
    description: "Deployment, containerization, and cloud-native application architecture.",
    icon: Cloud,
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className="text-xs tracking-[0.3em] text-white/30 mb-4 uppercase">Services</p>
        <h2
          className="hero-heading font-black leading-none mb-16"
          style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
        >
          WHAT I<br />OFFER
        </h2>

        <div className="space-y-0">
          {services.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border-b border-white/5 py-8 grid grid-cols-[60px_1fr_auto] md:grid-cols-[80px_1fr_auto] items-center gap-6 group hover:bg-white/[0.01] transition-colors px-4 -mx-4 rounded-xl"
            >
              <span className="section-number text-2xl font-black opacity-30">{svc.id}</span>
              <div>
                <h3 className="text-white font-semibold text-xl mb-1">{svc.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{svc.description}</p>
              </div>
              <div className="text-white/10 group-hover:text-white/30 transition-colors">
                <svc.icon size={28} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
