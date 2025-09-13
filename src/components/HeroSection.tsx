import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-foreground">ЦИФРОВЫЕ</span><br />
                <span className="text-foreground">РЕШЕНИЯ</span><br />
                <span className="text-gradient">ДЛЯ БИЗНЕСА</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg">
                Автоматизируем процессы, внедряем новые технологии, увеличиваем прибыль!
              </p>
            </div>

            <Button className="btn-hero px-8 py-4 text-lg rounded-lg group">
              Узнать, как это работает
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Stats */}
            <div className="flex space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">200+</div>
                <div className="text-sm text-muted-foreground">Проектов</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">150+</div>
                <div className="text-sm text-muted-foreground">Клиентов</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">5</div>
                <div className="text-sm text-muted-foreground">Лет опыта</div>
              </div>
            </div>
          </div>

          {/* Right Content - Decorative Elements */}
          <div className="relative hidden lg:block">
            <div className="relative w-full h-96">
              {/* Floating Elements */}
              <div className="absolute top-10 right-10 w-20 h-20 glass rounded-full flex items-center justify-center animate-pulse">
                <div className="w-8 h-8 bg-gradient-primary rounded-full"></div>
              </div>
              
              <div className="absolute bottom-20 left-10 w-16 h-16 glass rounded-lg flex items-center justify-center rotate-12">
                <div className="w-6 h-6 bg-gradient-secondary rounded-sm"></div>
              </div>
              
              <div className="absolute top-1/2 right-1/4 w-12 h-12 glass rounded-full flex items-center justify-center -rotate-12">
                <div className="w-4 h-4 bg-accent rounded-full"></div>
              </div>

              {/* Central Element */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-48 h-48 glass rounded-2xl flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <div className="text-4xl font-bold text-white">ЦО</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};