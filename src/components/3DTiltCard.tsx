import React, { useState, useRef } from "react";
import type { MouseEvent } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum rotation in degrees
  perspective?: number; // Perspective value in pixels
  scale?: number; // Hover scale multiplier
}

export default function TiltCard3D({
  children,
  className = "",
  maxTilt = 15,
  perspective = 1000,
  scale = 1.02,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({
    opacity: 0,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center (-0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // Calculate rotation angles
    // Moving mouse to the right rotates card around Y-axis positively (right side tilts in)
    // Moving mouse down rotates card around X-axis negatively (bottom side tilts in)
    const rotateX = -mouseY * maxTilt;
    const rotateY = mouseX * maxTilt;

    // Glare calculations
    const glareX = (e.clientX - rect.left) / width * 100;
    const glareY = (e.clientY - rect.top) / height * 100;

    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: "transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)",
    });

    setGlareStyle({
      opacity: 0.15,
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 60%)`,
      transition: "opacity 0.2s ease, background 0.05s ease",
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
    });

    setGlareStyle({
      opacity: 0,
      transition: "opacity 0.5s ease",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      className={`relative rounded-2xl overflow-hidden will-change-transform ${className}`}
    >
      {/* Main content */}
      <div className="w-full h-full relative z-10">{children}</div>

      {/* Glare overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay"
        style={glareStyle}
      />
    </div>
  );
}
