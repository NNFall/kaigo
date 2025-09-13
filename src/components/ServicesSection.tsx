import { Button } from '@/components/ui/button';
import { BarChart3, Cog, Globe, Smartphone, Database, Shield } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';

const skills = [
  {
    icon: BarChart3,
    title: 'Интеграция AI-решений',
    description: 'Внедрение нейросетей в бизнес-процессы для автоматизации и повышения эффективности работы компании.',
    features: ['Интеграция OpenAI API', 'Анализ данных с ИИ', 'Автоматизация процессов', 'Персонализация контента'],
    iconClass: 'icon-pulse',
  },
  {
    icon: Cog,
    title: 'Голосовые AI-ассистенты',
    description: 'Разработка разговорных ботов для звонков и автоматизации коммуникаций с клиентами 24/7.',
    features: ['Speech-to-Text системы', 'Синтез речи', 'Обработка диалогов', 'Колл-центр автоматизация'],
    iconClass: 'icon-spin',
  },
  {
    icon: Globe,
    title: 'AI-чат-боты',
    description: 'Создание интеллектуальных чат-ботов для сайтов и мессенджеров с возможностью обучения.',
    features: ['Telegram/WhatsApp боты', 'Веб-чат интеграция', 'Контекстная память', 'Многоязычная поддержка'],
    iconClass: 'hover:animate-pulse-glow',
  },
];

export const SkillsSection = () => {
  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">МОИ</span>{' '}
            <span className="text-gradient">НАВЫКИ</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Основные направления в области AI-технологий для автоматизации бизнеса
          </p>
        </AnimatedSection>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <AnimatedSection
                key={index}
                delay={index * 200}
                className="interactive-card service-card p-8 rounded-2xl group cursor-pointer"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Icon className={`w-6 h-6 text-white ${skill.iconClass}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {skill.title}
                  </h3>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {skill.description}
                </p>

                <ul className="space-y-2">
                  {skill.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 group-hover:animate-pulse-glow transition-all"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Export with the new name for consistency
export { SkillsSection as ServicesSection };