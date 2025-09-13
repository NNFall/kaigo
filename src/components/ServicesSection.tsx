import { Button } from '@/components/ui/button';
import { BarChart3, Cog, Globe, Smartphone, Database, Shield } from 'lucide-react';

const skills = [
  {
    icon: BarChart3,
    title: 'AI и Машинное обучение',
    description: 'Разработка и интеграция решений на базе нейронных сетей для автоматизации и анализа данных.',
    features: ['Работа с GPT API', 'Компьютерное зрение', 'Обработка естественного языка', 'Интеграция AI в веб-приложения'],
  },
  {
    icon: Cog,
    title: 'Веб-разработка',
    description: 'Создание сайтов и веб-систем под ключ. Frontend и Backend разработка с использованием современных технологий.',
    features: ['React, Next.js, TypeScript', 'Node.js, Python, FastAPI', 'Базы данных и API', 'Responsive дизайн'],
  },
  {
    icon: Globe,
    title: 'Бизнес-анализ',
    description: 'Анализ процессов для поиска точек роста и возможностей для автоматизации бизнеса.',
    features: ['Анализ бизнес-процессов', 'Поиск точек автоматизации', 'Техническое консультирование', 'Планирование проектов'],
  },
];

export const SkillsSection = () => {
  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">МОИ</span>{' '}
            <span className="text-gradient">НАВЫКИ</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ключевые компетенции в области разработки и внедрения современных технологий
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <div
                key={index}
                className="service-card p-8 rounded-2xl group cursor-pointer"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
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
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Export with the new name for consistency
export { SkillsSection as ServicesSection };