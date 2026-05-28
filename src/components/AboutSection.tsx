import { motion } from "framer-motion";
import { usePortfolio } from "../hooks/usePortfolio";
import { MapPin } from "lucide-react";

export default function AboutSection() {
  const { profile } = usePortfolio();

  return (
    <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="grid md:grid-cols-2 gap-16 items-center"
      >
        <div>
          <p className="text-xs tracking-[0.3em] text-white/30 mb-4 uppercase">About</p>
          <h2
            className="hero-heading font-black leading-none mb-8"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
          >
            WHO<br />AM I
          </h2>
          <div className="flex items-center gap-2 text-white/40 text-sm mb-6">
            <MapPin size={14} />
            <span>{profile.location}</span>
          </div>
        </div>

        <div className="space-y-6">
          <p
            className="text-white/70 text-lg leading-relaxed"
            style={{ wordBreak: "normal", overflowWrap: "normal" }}
          >Hi, I'm Yash Patel, a B.Tech Information Technology student and
    aspiring Software Developer from Mehsana, India. I specialize in
    Python, Java, and AI, and I enjoy building web applications that
    solve real-world problems.
            {profile.bio}
          </p>
          <div className="flex gap-8 pt-4">
            <div>
              <p className="accent-gradient-text text-3xl font-black">{profile.yearsOfExperience}</p>
              <p className="text-white/40 text-xs tracking-widest uppercase mt-1">No Experience</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="accent-gradient-text text-3xl font-black">{profile.specialization.split("·").length}</p>
              <p className="text-white/40 text-xs tracking-widest uppercase mt-1">Core Skills</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
