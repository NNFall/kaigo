import { Button } from '@/components/ui/button';
import { ArrowRight, User } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Link } from 'react-router-dom';

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <AnimatedSection className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold">
                <span className="text-foreground">ОБО</span>{' '}
                <span className="text-gradient">МНЕ</span>
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Специалист по интеграции AI-решений с фокусом на голосовые ассистенты 
                и интеллектуальные чат-боты для автоматизации бизнес-процессов.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Помогаю компаниям внедрять искусственный интеллект для повышения 
                эффективности, сокращения затрат и улучшения клиентского опыта.
              </p>
            </div>

            <Button asChild size="lg" className="btn-hero group">
              <Link to="/about">
                Узнать больше
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </AnimatedSection>

          {/* Right Content - Photo */}
          <AnimatedSection delay={200} className="relative">
            <div className="relative w-full max-w-md mx-auto">
              {/* Photo Container */}
              <div className="glass rounded-2xl p-6">
                <div className="aspect-square rounded-xl overflow-hidden">
                  <img 
                    src="/assets/profile-1.jpg" 
                    alt="Профиль специалиста по AI-решениям"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 glass rounded-full flex items-center justify-center animate-float">
                <div className="w-8 h-8 bg-accent rounded-full animate-pulse"></div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-16 h-16 glass rounded-lg flex items-center justify-center rotate-12">
                <div className="w-6 h-6 bg-gradient-secondary rounded-sm icon-spin"></div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};