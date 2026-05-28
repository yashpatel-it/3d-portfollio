import { motion } from "framer-motion";
import ProjectCarousel3D from "./3DProjectCarousel";

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className="text-xs tracking-[0.3em] text-white/30 mb-4 uppercase">Projects</p>
        <h2
          className="hero-heading font-black leading-none mb-4"
          style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
        >
          WHAT I'VE<br />BUILT
        </h2>

        {/* 3D Cylindrical Project Card Carousel */}
        <ProjectCarousel3D />
      </motion.div>
    </section>
  );
}
