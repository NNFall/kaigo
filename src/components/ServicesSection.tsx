import { Button } from '@/components/ui/button';
import { BarChart3, Cog, Globe, Smartphone, Database, Shield } from 'lucide-react';

const services = [
  {
    icon: BarChart3,
    title: 'Анализ и аудит бизнес-процессов',
    description: 'Показываем, где вы теряете деньги, и даём решения, как это изменить',
    features: ['Анализ текущих процессов', 'Выявление узких мест', 'Рекомендации по оптимизации'],
  },
  {
    icon: Cog,
    title: 'Автоматизация и интеграции',
    description: 'Автоматизируем продажи, заявки и управление клиентами. Настраиваем CRM-системы и связываем всё в единую рабочую среду',
    features: ['CRM-системы', 'Интеграция сервисов', 'Автоматизация процессов'],
  },
  {
    icon: Globe,
    title: 'Разработка сайтов',
    description: 'Создаём современные веб-сайты и порталы, которые работают на результат',
    features: ['Современный дизайн', 'Адаптивная верстка', 'SEO-оптимизация'],
  },
  {
    icon: Smartphone,
    title: 'Мобильные приложения',
    description: 'Разрабатываем нативные и кроссплатформенные мобильные приложения',
    features: ['iOS и Android', 'Кроссплатформенность', 'Современный UX/UI'],
  },
  {
    icon: Database,
    title: 'Системы управления данными',
    description: 'Проектируем и внедряем системы для эффективного управления корпоративными данными',
    features: ['Базы данных', 'Аналитика', 'Отчетность'],
  },
  {
    icon: Shield,
    title: 'Информационная безопасность',
    description: 'Обеспечиваем защиту корпоративной информации и соответствие требованиям безопасности',
    features: ['Аудит безопасности', 'Защита данных', 'Соответствие стандартам'],
  },
];

export const ServicesSection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">НАШИ</span>{' '}
            <span className="text-gradient">УСЛУГИ</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Комплексные цифровые решения для автоматизации и развития вашего бизнеса
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
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
                    {service.title}
                  </h3>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  Подробнее
                </Button>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center glass p-12 rounded-2xl">
          <h3 className="text-3xl font-bold mb-4 text-foreground">
            Готовы начать цифровую трансформацию?
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Получите бесплатную консультацию и узнайте, как мы можем помочь вашему бизнесу
          </p>
          <Button className="btn-hero px-8 py-4 text-lg rounded-lg">
            Заказать консультацию
          </Button>
        </div>
      </div>
    </section>
  );
};