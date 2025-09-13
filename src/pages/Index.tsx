import { ParticleBackground } from '@/components/ParticleBackground';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { SkillsSection } from '@/components/ServicesSection';
import { ProjectsSection } from '@/components/CasesSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { OurAdvantages } from '@/components/OurAdvantages';
import { ClientTestimonials } from '@/components/ClientTestimonials';

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navigation />
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <OurAdvantages />
        <ClientTestimonials />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
