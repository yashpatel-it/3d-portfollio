import { useState, useRef, useEffect } from "react";
import yk from "/public/yk.png";
import type { PortfolioData } from "../types/portfolio";
import data from "../data/portfolio.json";

export default function DeviceMockup3D() {
  const profile = (data as PortfolioData).profile;
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 18, y: -20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Mouse coords from -0.5 to 0.5 relative to component center
      const mouseX = (e.clientX - rect.left) / width - 0.5;
      const mouseY = (e.clientY - rect.top) / height - 0.5;

      // Map coordinates to rotate angles
      setRotate({
        x: 18 + mouseY * -30, // tilt keyboard/bezel pitch
        y: -20 + mouseX * 35, // swing base yaw
      });
    };

    const handleMouseLeave = () => {
      // Revert smoothly to natural isometric angle
      setRotate({ x: 18, y: -20 });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center pointer-events-auto cursor-pointer"
      style={{
        width: "360px",
        height: "360px",
        perspective: "1000px",
      }}
    >
      {/* 3D Laptop Assembly */}
      <div
        className="w-full h-full relative transition-transform duration-200 ease-out flex items-center justify-center"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        {/* Glow Ring Shadow under the device */}
        <div
          className="absolute rounded-full blur-3xl opacity-30 accent-gradient pointer-events-none"
          style={{
            width: "300px",
            height: "120px",
            transform: "rotateX(90deg) translateZ(-95px) translateY(10px)",
          }}
        />

        {/* 1. KEYBOARD BASE (Horizontal Bottom Plate) */}
        <div
          className="absolute border border-white/10 bg-[#16161a]/95 rounded-xl shadow-[0_30px_50px_rgba(0,0,0,0.8)] flex flex-col justify-end p-3"
          style={{
            width: "290px",
            height: "180px",
            transform: "rotateX(90deg) translateZ(-90px)",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Keypad Grid pattern */}
          <div className="w-full h-[65px] border border-white/5 rounded-md bg-black/40 flex flex-col gap-1.5 p-1">
            <div className="flex gap-1 w-full h-[10px]">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex-1 rounded-sm bg-white/[0.04] border border-white/10" />
              ))}
            </div>
            <div className="flex gap-1 w-full h-[12px]">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex-1 rounded-sm bg-white/[0.04] border border-white/10" />
              ))}
            </div>
            <div className="flex gap-1 w-full h-[12px]">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="flex-1 rounded-sm bg-white/[0.04] border border-white/10" />
              ))}
            </div>
            <div className="flex gap-1 w-full h-[14px] justify-center">
              <div className="w-[100px] rounded-sm bg-white/[0.05] border border-white/10" />
            </div>
          </div>

          {/* Trackpad */}
          <div className="w-[60px] h-[32px] mx-auto mt-2 border border-white/5 rounded bg-black/35 self-center" />

          {/* Front Bezel Lip Edge depth thickness */}
          <div
            className="absolute left-0 bottom-0 right-0 bg-[#0d0d0f] rounded-b-xl border-t border-white/20"
            style={{
              height: "8px",
              transform: "rotateX(-90deg)",
              transformOrigin: "bottom",
            }}
          />
        </div>

        {/* 2. LAPTOP LID / SCREEN (Vertical Panel) */}
        <div
          className="absolute border-2 border-white/15 bg-[#0e0e11] rounded-2xl flex flex-col overflow-hidden shadow-[0_-15px_40px_rgba(236,72,153,0.15)]"
          style={{
            width: "284px",
            height: "186px",
            transform: "translateZ(0px) translateY(-5px)",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Inner Screen Display Area */}
          <div className="w-full h-full relative bg-gradient-to-br from-[#121214] via-[#08080a] to-[#121214] p-3 flex flex-col items-center justify-between border-4 border-[#070708]">
            
            {/* Top Webcam indicator */}
            <div className="absolute top-1.5 w-1.5 h-1.5 rounded-full bg-blue-500/80 animate-pulse" />

            {/* Glowing Screen Content */}
            <div className="w-full flex-1 flex flex-col items-center justify-center gap-1.5 select-none relative">
              {/* Star Particles Orbit background inside screen */}
              <div className="absolute inset-0 overflow-hidden opacity-30 rounded-lg pointer-events-none">
                <div className="absolute top-2 left-6 w-1 h-1 rounded-full bg-white animate-ping" />
                <div className="absolute bottom-8 right-10 w-1 h-1 rounded-full bg-pink-400 animate-ping delay-500" />
              </div>

              {/* Developer Avatar inside the laptop screen */}
              <div className="relative w-[85px] h-[85px] rounded-full overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-white/0 flex items-center justify-center mt-2 group-hover:scale-105 transition-transform duration-300">
                {/* Visual Accent Screen Glow */}
                <div className="absolute inset-0 bg-[#ec4899]/15 blur-sm opacity-50" />
                
                <img
                  src={yk}
                  alt={profile.name}
                  className="w-full h-full object-cover relative z-10"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-2xl font-black hero-heading z-10">${profile.shortName}</span>`;
                    }
                  }}
                />
              </div>

              {/* Holographic simulated code console overlay */}
              <div className="mt-2 text-center relative z-10">
                <p className="text-[10px] text-white/90 font-mono tracking-wide">{profile.name}</p>
                <div className="flex gap-1 justify-center mt-1">
                  <span className="text-[7px] font-mono px-1 rounded border border-purple-500/30 text-purple-400 bg-purple-500/5">Python</span>
                  <span className="text-[7px] font-mono px-1 rounded border border-pink-500/30 text-pink-400 bg-pink-500/5">Java</span>
                  <span className="text-[7px] font-mono px-1 rounded border border-orange-500/30 text-orange-400 bg-orange-500/5">React</span>
                </div>
              </div>
            </div>

            {/* Bottom Brand Bar logo text */}
            <div className="w-full border-t border-white/5 pt-1.5 flex justify-center items-center">
              <span className="text-[8px] font-bold tracking-[0.25em] text-white/30 uppercase font-mono">
                {profile.shortName} OS v1.0
              </span>
            </div>
          </div>

          {/* Lid Back Thickness bezel */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-[#0d0d0f] border-r border-white/10"
            style={{
              width: "4px",
              transform: "rotateY(-90deg)",
              transformOrigin: "left",
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 bg-[#0d0d0f] border-l border-white/10"
            style={{
              width: "4px",
              transform: "rotateY(90deg)",
              transformOrigin: "right",
            }}
          />
        </div>
      </div>
    </div>
  );
}
