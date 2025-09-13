import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowRight } from 'lucide-react';

const projects = [
  {
    title: 'AI Telegram-бот для автоматизации',
    category: 'AI & Автоматизация',
    description: 'Разработал умного Telegram-бота с интеграцией GPT API для автоматизации обработки запросов и предоставления персональных рекомендаций.',
    results: [
      'Обработка 500+ запросов в день',
      'Сокращение времени ответа до 5 секунд',
      'Автоматизация 90% типовых запросов',
    ],
    tags: ['Python', 'Telegram API', 'GPT', 'AI'],
    image: '/api/placeholder/600/400',
  },
  {
    title: 'Веб-приложение для анализа данных',
    category: 'Веб-разработка',
    description: 'Создал полнофункциональное веб-приложение для анализа и визуализации больших объемов данных с интерактивными дашбордами.',
    results: [
      'Обработка файлов до 100MB',
      'Интерактивные графики и чарты',
      'Экспорт отчетов в различных форматах',
    ],
    tags: ['React', 'Python', 'FastAPI', 'Data Visualization'],
    image: '/api/placeholder/600/400',
  },
  {
    title: 'Система управления контентом',
    category: 'Full-stack',
    description: 'Разработал CMS с админ-панелью для управления контентом сайта, включая систему пользователей и права доступа.',
    results: [
      'Удобная админ-панель',
      'Система ролей и прав',
      'SEO-оптимизация контента',
    ],
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
    image: '/api/placeholder/600/400',
  },
];

export const ProjectsSection = () => {
  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">МОИ</span>{' '}
            <span className="text-gradient">ПРОЕКТЫ</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Практические проекты, демонстрирующие мои навыки в области AI и веб-разработки
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {projects.map((project, index) => (
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
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Results */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-foreground mb-3">Особенности:</h4>
                  <ul className="space-y-2">
                    {project.results.map((result, resultIndex) => (
                      <li key={resultIndex} className="flex items-start text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, tagIndex) => (
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
                  Подробнее
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Projects */}
        <div className="text-center">
          <Button className="btn-hero px-8 py-4 text-lg rounded-lg group">
            GitHub репозиторий
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};