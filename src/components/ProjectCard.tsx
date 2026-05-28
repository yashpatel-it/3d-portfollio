import { ExternalLink } from "lucide-react";
import type { Project } from "../types/portfolio";
import TiltCard3D from "./3DTiltCard";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  return (
    <TiltCard3D className="sticky">
      <div className="border border-white/5 bg-white/[0.02] rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300 group">
        {/* Image / Placeholder */}
        <div className="relative aspect-video bg-gradient-to-br from-white/5 to-white/0 overflow-hidden">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span
                className="hero-heading font-black opacity-10 text-center px-4"
                style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
              >
                {project.title}
              </span>
            </div>
          )}
          {project.highlight && (
            <span className="absolute top-4 left-4 text-[10px] tracking-widest px-3 py-1 rounded-full accent-gradient text-white font-semibold">
              FEATURED
            </span>
          )}
          <span className="absolute top-4 right-4 section-number text-4xl font-black opacity-20">
            {project.id}
          </span>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="text-white font-bold text-xl">{project.title}</h3>
              <p className="text-white/40 text-sm mt-0.5">{project.subtitle}</p>
            </div>
            <span className="font-mono text-xs text-white/30 mt-1">{project.year}</span>
          </div>

          <p className="text-white/50 text-sm leading-relaxed mb-5">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2.5 py-1 rounded-md border border-white/10 text-white/40"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {project.link && project.link.trim() !== "" && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full accent-gradient text-white text-xs tracking-widest font-semibold hover:opacity-90 transition-opacity"
              >
                LIVE PROJECT <ExternalLink size={12} />
              </a>
            )}
            <span className="text-white/30 text-xs tracking-wider">{project.role}</span>
          </div>
        </div>
      </div>
    </TiltCard3D>
  );
}
