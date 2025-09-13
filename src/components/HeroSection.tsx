import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';
import { KaigoTypingEffect } from '@/components/KaigoTypingEffect';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10" id="hero">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <KaigoTypingEffect />
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="btn-hero group">
              <a href="#contact" className="flex items-center">
                Связаться со мной
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </AnimatedSection>

        {/* Stats */}
        <div className="flex justify-center space-x-8 mt-20">
          <AnimatedSection delay={2000} className="text-center">
            <div className="text-3xl font-bold text-gradient">50+</div>
            <div className="text-sm text-muted-foreground">AI-проектов</div>
          </AnimatedSection>
          <AnimatedSection delay={2200} className="text-center">
            <div className="text-3xl font-bold text-gradient">3+</div>
            <div className="text-sm text-muted-foreground">Года в AI</div>
          </AnimatedSection>
          <AnimatedSection delay={2400} className="text-center">
            <div className="text-3xl font-bold text-gradient">100%</div>
            <div className="text-sm text-muted-foreground">Успешных внедрений</div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};