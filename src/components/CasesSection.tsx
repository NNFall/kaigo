import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowRight } from 'lucide-react';

const cases = [
  {
    title: 'Автоматизация CRM для производственной компании',
    category: 'Автоматизация',
    description: 'Внедрили CRM-систему, которая увеличила конверсию на 45% и сократила время обработки заявок в 3 раза',
    results: [
      'Увеличение конверсии на 45%',
      'Сокращение времени обработки заявок в 3 раза',
      'Автоматизация 80% рутинных процессов',
    ],
    tags: ['CRM', 'Автоматизация', 'Интеграции'],
    image: '/api/placeholder/600/400',
  },
  {
    title: 'Интернет-магазин с интеграцией 1С',
    category: 'E-commerce',
    description: 'Разработали высокопроизводительный интернет-магазин с полной интеграцией с системой учета 1С',
    results: [
      'Рост онлайн-продаж на 200%',
      'Автоматическая синхронизация остатков',
      'Сокращение времени на обработку заказов на 60%',
    ],
    tags: ['E-commerce', '1С', 'Веб-разработка'],
    image: '/api/placeholder/600/400',
  },
  {
    title: 'Мобильное приложение для доставки',
    category: 'Мобильная разработка',
    description: 'Создали мобильное приложение для службы доставки с GPS-трекингом и системой уведомлений',
    results: [
      'Увеличение количества заказов на 150%',
      'Сокращение времени доставки на 30%',
      'Повышение лояльности клиентов',
    ],
    tags: ['Mobile', 'iOS', 'Android', 'GPS'],
    image: '/api/placeholder/600/400',
  },
  {
    title: 'Корпоративный портал для финансовой компании',
    category: 'Корпоративные решения',
    description: 'Разработали защищенный корпоративный портал с системой документооборота и аналитикой',
    results: [
      'Ускорение документооборота в 4 раза',
      'Повышение информационной безопасности',
      'Внедрение системы аналитики',
    ],
    tags: ['Портал', 'Безопасность', 'Аналитика'],
    image: '/api/placeholder/600/400',
  },
];

export const CasesSection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">НАШИ</span>{' '}
            <span className="text-gradient">КЕЙСЫ</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Примеры успешных проектов, которые помогли нашим клиентам достичь новых высот
          </p>
        </div>

        {/* Cases Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {cases.map((caseItem, index) => (
            <div
              key={index}
              className="service-card rounded-2xl overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-64 bg-gradient-primary overflow-hidden">
                <div className="absolute inset-0 bg-gradient-primary opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-6xl font-bold opacity-20">
                    {index + 1}
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                    {caseItem.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {caseItem.title}
                </h3>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {caseItem.description}
                </p>

                {/* Results */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-foreground mb-3">Результаты:</h4>
                  <ul className="space-y-2">
                    {caseItem.results.map((result, resultIndex) => (
                      <li key={resultIndex} className="flex items-start text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {caseItem.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action */}
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  Подробнее о проекте
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Cases */}
        <div className="text-center">
          <Button className="btn-hero px-8 py-4 text-lg rounded-lg group">
            Посмотреть все кейсы
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};