import { useState, useRef, useEffect } from "react";
import type { TouchEvent, MouseEvent } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { usePortfolio } from "../hooks/usePortfolio";
import type { Project } from "../types/portfolio";

export default function ProjectCarousel3D() {
  const { projects } = usePortfolio();

  // If there are fewer than 4 items, we duplicate the list so the cylinder looks balanced in 3D
  const carouselItems: Project[] = 
    projects.length === 2 
      ? [...projects, ...projects.map((p, i) => ({ ...p, id: `0${i + 3}`, title: `${p.title} (Mirror)` }))]
      : projects.length === 3
      ? [...projects, { ...projects[0], id: "04", title: "Future Project (Soon)" }]
      : projects;

  const count = carouselItems.length;
  const angleStep = 360 / count;

  const [activeIndex, setActiveIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentRotationRef = useRef(0);
  const dragRotationRef = useRef(0);

  // Dynamic Radius based on screen size to prevent card overlap
  const [radius, setRadius] = useState(300);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setRadius(190); // mobile
      } else if (window.innerWidth < 1024) {
        setRadius(260); // tablet
      } else {
        setRadius(340); // desktop
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update target rotation based on active index
  useEffect(() => {
    // Rotation is negative because moving next rotates the cylinder to the left
    const targetRot = -activeIndex * angleStep;
    setRotation(targetRot);
    currentRotationRef.current = targetRot;
  }, [activeIndex, angleStep]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % count);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
  };

  // Drag listeners
  const startDrag = (clientX: number) => {
    isDragging.current = true;
    startX.current = clientX;
    dragRotationRef.current = currentRotationRef.current;
  };

  const moveDrag = (clientX: number) => {
    if (!isDragging.current) return;
    const deltaX = clientX - startX.current;
    
    // Convert pixels to rotation angles (3px drag = 1deg rotation)
    const deltaAngle = deltaX * 0.25;
    const newRot = dragRotationRef.current + deltaAngle;
    
    setRotation(newRot);
    currentRotationRef.current = newRot;
  };

  const endDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    // Calculate nearest active index based on active rotation angle
    // angle = -index * angleStep
    // index = -angle / angleStep
    const rawIndex = -currentRotationRef.current / angleStep;
    const nearestIndex = Math.round(rawIndex);
    
    // Snap to nearest index (accounting for loop indices)
    const normalizedIndex = ((nearestIndex % count) + count) % count;
    setActiveIndex(normalizedIndex);
    
    // Smoothly snap rotation
    const snapRot = -nearestIndex * angleStep;
    setRotation(snapRot);
    currentRotationRef.current = snapRot;
  };

  // Mouse drag handlers
  const onMouseDown = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest("a")) return; // don't drag on link clicks
    startDrag(e.clientX);
  };

  const onMouseMove = (e: MouseEvent) => {
    moveDrag(e.clientX);
  };

  const onMouseUp = () => {
    endDrag();
  };

  // Touch drag handlers
  const onTouchStart = (e: TouchEvent) => {
    startDrag(e.touches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    moveDrag(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    endDrag();
  };

  return (
    <div className="relative w-full py-16 flex flex-col items-center justify-center overflow-hidden">
      {/* 3D Scene viewport container */}
      <div
        className="relative flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
        style={{
          width: "100%",
          height: "440px",
          perspective: "1000px",
          perspectiveOrigin: "50% 35%",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Dynamic 3D Cylinder Panel Ring */}
        <div
          className="relative w-[280px] sm:w-[340px] h-[340px] flex items-center justify-center transition-transform duration-700 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `translateZ(-${radius}px) rotateY(${rotation}deg)`,
          }}
        >
          {carouselItems.map((project, idx) => {
            const itemAngle = idx * angleStep;
            
            // Calculate how "facing" the card is relative to camera
            const diffAngle = Math.abs((rotation + itemAngle) % 360);
            const isFront = diffAngle < 20 || diffAngle > 340;
            const isFacedActive = idx === activeIndex;

            return (
              <div
                key={project.id + "-" + idx}
                className="absolute w-full h-full rounded-2xl border border-white/10 bg-[#121215]/95 overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.6)] transition-all duration-500 flex flex-col justify-between"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "visible",
                  opacity: isFacedActive ? 1.0 : isFront ? 0.6 : 0.18,
                  filter: isFacedActive ? "none" : "blur(2px) grayscale(40%)",
                  scale: isFacedActive ? "1.0" : "0.85",
                  pointerEvents: isFacedActive ? "auto" : "none",
                }}
              >
                {/* 1. Image / Card Header */}
                <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-white/5 to-white/0 overflow-hidden">
                  {project.image && !project.title.includes("Mirror") && !project.title.includes("Soon") ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#1b1b22] to-[#0c0c0e]">
                      <span className="hero-heading font-black opacity-10 text-center text-3xl">
                        {project.title}
                      </span>
                    </div>
                  )}
                  {project.highlight && (
                    <span className="absolute top-3 left-3 text-[8px] tracking-widest px-2 py-0.5 rounded-full accent-gradient text-white font-semibold">
                      FEATURED
                    </span>
                  )}
                  <span className="absolute top-2 right-3 section-number text-2xl font-black opacity-20">
                    {project.id}
                  </span>
                </div>

                {/* 2. Text / Info Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">{project.title}</h3>
                    <p className="text-white/40 text-xs mt-0.5">{project.subtitle}</p>
                    <p className="text-white/50 text-[11px] leading-relaxed mt-2.5 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Badges Stack */}
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[9px] px-2 py-0.5 rounded border border-white/5 text-white/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Bottom Action buttons */}
                    <div className="flex items-center justify-between mt-4">
                      {project.link && project.link.trim() !== "" ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full accent-gradient text-white text-[10px] tracking-widest font-semibold hover:opacity-90 transition-opacity"
                        >
                          LIVE PROJECT <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="text-[9px] text-white/20 tracking-wider">PROJECT {project.id}</span>
                      )}
                      <span className="text-white/30 text-[10px] tracking-wider">{project.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Circular Arrows and Navigation Dots Controls */}
      <div className="flex items-center gap-6 mt-2 relative z-20">
        <button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Carousel indicator dots */}
        <div className="flex gap-2">
          {Array.from({ length: count }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex ? "w-6 bg-pink-500" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all active:scale-95"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
