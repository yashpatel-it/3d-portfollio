import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import SkillsSection from "./components/SkillsSection";
import ExperienceSection from "./components/ExperienceSection";
import ServicesSection from "./components/ServicesSection";
import ProjectsSection from "./components/ProjectsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import Footer from "./components/Footer";
import Starfield3D from "./components/3DStarfield";

export default function App() {
  return (
    <div className="bg-[#0C0C0C] min-h-screen font-kanit relative selection:bg-[#ec4899] selection:text-white">
      {/* 3D Interactive Cosmic Starfield Background */}
      <Starfield3D />

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ServicesSection />
        <ProjectsSection />
        <TestimonialsSection />
        <Footer />
      </div>
    </div>
  );
}
