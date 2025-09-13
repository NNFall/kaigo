import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { TypingEffect } from '@/components/TypingEffect';
import { AnimatedSection } from '@/components/AnimatedSection';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <AnimatedSection className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-foreground">ПРИВЕТ, Я</span><br />
                <span className="text-gradient">НИКИТА</span><br />
                <span className="text-foreground">СОЗДАЮ ИНТЕЛЛЕКТУАЛЬНЫЕ</span><br />
                <div className="text-gradient inline-block">
                  <TypingEffect text="ВЕБ-РЕШЕНИЯ" className="inline-block" delay={2000} />
                </div>
              </h1>
              
              <AnimatedSection delay={800}>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Разработчик, увлеченный нейросетями и созданием эффективных веб-проектов. Превращаю идеи в код.
                </p>
              </AnimatedSection>
            </div>

            <AnimatedSection delay={1200}>
              <Button className="btn-hero px-8 py-4 text-lg rounded-lg group hover:shadow-glow hover:-translate-y-1 transform transition-all duration-300">
                Связаться со мной
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </AnimatedSection>

            {/* Stats */}
            <div className="flex space-x-8 pt-8">
              <AnimatedSection delay={1400} className="text-center">
                <div className="text-3xl font-bold text-gradient">2+</div>
                <div className="text-sm text-muted-foreground">Года опыта</div>
              </AnimatedSection>
              <AnimatedSection delay={1600} className="text-center">
                <div className="text-3xl font-bold text-gradient">10+</div>
                <div className="text-sm text-muted-foreground">Проектов</div>
              </AnimatedSection>
              <AnimatedSection delay={1800} className="text-center">
                <div className="text-3xl font-bold text-gradient">16</div>
                <div className="text-sm text-muted-foreground">Лет</div>
              </AnimatedSection>
            </div>
          </AnimatedSection>

          {/* Right Content - Decorative Elements */}
          <AnimatedSection delay={1000} className="relative hidden lg:block">
            <div className="relative w-full h-96">
              {/* Floating Elements with enhanced effects */}
              <div className="absolute top-10 right-10 w-20 h-20 glass rounded-full flex items-center justify-center animate-float hover:scale-110 transition-transform cursor-pointer">
                <div className="w-8 h-8 bg-gradient-primary rounded-full animate-pulse-glow"></div>
              </div>
              
              <div className="absolute bottom-20 left-10 w-16 h-16 glass rounded-lg flex items-center justify-center rotate-12 hover:rotate-45 transition-transform cursor-pointer" style={{ animationDelay: '1s' }}>
                <div className="w-6 h-6 bg-gradient-secondary rounded-sm icon-spin"></div>
              </div>
              
              <div className="absolute top-1/2 right-1/4 w-12 h-12 glass rounded-full flex items-center justify-center -rotate-12 hover:animate-pulse-glow transition-all cursor-pointer" style={{ animationDelay: '2s' }}>
                <div className="w-4 h-4 bg-accent rounded-full"></div>
              </div>

              {/* Central Element */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-48 h-48 glass rounded-2xl flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                  <div className="w-32 h-32 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <div className="text-3xl font-bold text-white gradient-text">kAI</div>
                  </div>
                </div>
              </div>

              {/* Additional interactive elements */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 border border-primary/20 rounded-full animate-spin-slow"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-accent/30 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};