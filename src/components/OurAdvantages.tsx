import { AnimatedSection } from '@/components/AnimatedSection';
import { Target, Zap, Shield, Users, Award, Rocket } from 'lucide-react';

const advantages = [
  {
    icon: Target,
    title: "Фокус на результате",
    description: "Каждое AI-решение создается для достижения конкретных бизнес-целей и измеримых результатов."
  },
  {
    icon: Zap,
    title: "Быстрое внедрение",
    description: "Разрабатываем MVP за 2-4 недели, полное решение - за 2-3 месяца с гарантией качества."
  },
  {
    icon: Shield,
    title: "Надежность и безопасность",
    description: "Используем проверенные технологии и обеспечиваем защиту данных на уровне enterprise."
  },
  {
    icon: Users,
    title: "Персональный подход",
    description: "Изучаем специфику вашего бизнеса и создаем решения, идеально подходящие под ваши процессы."
  },
  {
    icon: Award,
    title: "Экспертиза в AI",
    description: "Глубокие знания современных AI-технологий: от NLP и компьютерного зрения до голосовых ассистентов."
  },
  {
    icon: Rocket,
    title: "Масштабируемость",
    description: "Создаем решения, которые растут вместе с вашим бизнесом и легко адаптируются к новым задачам."
  }
];

export const OurAdvantages = () => {
  return (
    <section className="py-20 relative" id="advantages">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Наши преимущества</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Почему более 50 компаний доверяют нам создание AI-решений для своего бизнеса
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="glass p-8 rounded-2xl text-center group hover:shadow-glow transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {advantage.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Stats Section */}
        <AnimatedSection delay={600}>
          <div className="mt-20 glass p-12 rounded-2xl">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-muted-foreground">Реализованных проектов</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">70%</div>
                <div className="text-muted-foreground">Сокращение затрат клиентов</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-muted-foreground">Поддержка решений</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-muted-foreground">Удовлетворенных клиентов</div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};