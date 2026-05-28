import { motion } from "framer-motion";
import { usePortfolio } from "../hooks/usePortfolio";
import SocialLinks from "./SocialLinks";
import yk from "/public/yk.png";
import HeroCanvas3D from "./3DHeroCanvas";
import DeviceMockup3D from "./3DDeviceMockup";

export default function HeroSection() {
  const { profile } = usePortfolio();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        display: "grid",
        gridTemplateRows: "72px 1fr auto auto 80px",
      }}
    >
      {/* Background grain */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Row 1: spacer for navbar */}
      <div />

      {/* Row 2: headline */}
      <div className="flex items-end justify-center pb-4 px-6 z-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-heading font-black text-center leading-none whitespace-nowrap overflow-hidden"
          style={{ fontSize: "clamp(3rem, 13vw, 14rem)" }}
        >
          Hi, I'm {profile.shortName}
        </motion.h1>
      </div>

      {/* Row 3: avatar / 3D devices (spans rows 2-3 with z-index overlap) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
        className="relative flex justify-center z-20 -mt-8 md:-mt-16"
      >
        <div className="relative flex items-center justify-center w-[360px] h-[360px]">
          {/* Glowing 3D Geodesic wireframe orbit in background */}
          <div className="absolute inset-0 scale-[1.25] pointer-events-none opacity-45 z-0 flex items-center justify-center">
            <HeroCanvas3D />
          </div>

          {/* Interactive 3D CSS Laptop Mockup in foreground */}
          <div className="relative z-10 flex items-center justify-center">
            <DeviceMockup3D />
          </div>
        </div>
      </motion.div>

      {/* Row 4: tagline + social */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="flex flex-col items-center gap-4 px-6 pt-6 z-10"
      >
        <p className="text-white/50 text-sm md:text-base tracking-[0.3em] uppercase">
          {profile.role} · {profile.specialization}
        </p>
        <SocialLinks social={profile.social} />
        <a
          href="#projects"
          className="mt-2 px-8 py-3 rounded-full text-sm tracking-widest font-semibold text-white accent-gradient hover:opacity-90 transition-opacity"
        >
          VIEW WORK
        </a>
      </motion.div>

      {/* Row 5: scroll hint */}
      <div className="flex justify-center items-end pb-6 z-10">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-1 text-white/20"
        >
          <span className="text-[10px] tracking-widest">SCROLL</span>
          <div className="w-px h-6 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
