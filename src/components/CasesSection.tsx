import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';
import { ProjectModal } from '@/components/ProjectModal';

const projects = [
  {
    title: 'AI Telegram-бот для автоматизации',
    category: 'AI & Автоматизация',
    description: 'Разработал умного Telegram-бота с интеграцией GPT API для автоматизации обработки запросов и предоставления персональных рекомендаций.',
    fullDescription: 'Полнофункциональный Telegram-бот с интеграцией OpenAI GPT API для автоматизации обработки клиентских запросов. Система включает в себя обработку естественного языка, контекстную память диалогов и персонализированные рекомендации на основе истории взаимодействий.',
    results: [
      'Обработка 500+ запросов в день',
      'Сокращение времени ответа до 5 секунд',
      'Автоматизация 90% типовых запросов',
    ],
    tags: ['Python', 'Telegram API', 'GPT', 'AI'],
    technologies: ['Python', 'aiogram', 'OpenAI API', 'PostgreSQL', 'Redis', 'Docker'],
    image: '/api/placeholder/600/400',
    githubUrl: 'https://github.com/example/ai-telegram-bot',
    liveUrl: 'https://t.me/example_bot',
  },
  {
    title: 'Веб-приложение для анализа данных',
    category: 'Веб-разработка',
    description: 'Создал полнофункциональное веб-приложение для анализа и визуализации больших объемов данных с интерактивными дашбордами.',
    fullDescription: 'Масштабируемое веб-приложение для анализа больших данных с возможностью загрузки файлов различных форматов, интерактивной визуализации и генерации детальных отчетов. Включает систему фильтрации, сравнительный анализ и экспорт результатов.',
    results: [
      'Обработка файлов до 100MB',
      'Интерактивные графики и чарты',
      'Экспорт отчетов в различных форматах',
    ],
    tags: ['React', 'Python', 'FastAPI', 'Data Visualization'],
    technologies: ['React', 'TypeScript', 'Python', 'FastAPI', 'Pandas', 'Plotly', 'PostgreSQL'],
    image: '/api/placeholder/600/400',
    githubUrl: 'https://github.com/example/data-analysis-app',
    liveUrl: 'https://data-app.example.com',
  },
  {
    title: 'Система управления контентом',
    category: 'Full-stack',
    description: 'Разработал CMS с админ-панелью для управления контентом сайта, включая систему пользователей и права доступа.',
    fullDescription: 'Комплексная система управления контентом с мощной админ-панелью, гибкой системой ролей и прав доступа. Включает редактор контента WYSIWYG, медиа-библиотеку, SEO-инструменты и систему комментариев.',
    results: [
      'Удобная админ-панель',
      'Система ролей и прав',
      'SEO-оптимизация контента',
    ],
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Tailwind CSS', 'NextAuth.js'],
    image: '/api/placeholder/600/400',
    githubUrl: 'https://github.com/example/cms-system',
    liveUrl: 'https://cms.example.com',
  },
];

export const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: typeof projects[0]) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">МОИ</span>{' '}
            <span className="text-gradient">ПРОЕКТЫ</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Практические проекты, демонстрирующие мои навыки в области AI и веб-разработки
          </p>
        </AnimatedSection>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {projects.map((project, index) => (
            <AnimatedSection
              key={index}
              delay={index * 200}
            >
              <div 
                className="interactive-card service-card rounded-2xl overflow-hidden group cursor-pointer"
                onClick={() => handleProjectClick(project)}
              >
              {/* Image */}
              <div className="relative h-64 bg-gradient-primary overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-primary opacity-80 group-hover:opacity-60 transition-opacity"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-6xl font-bold opacity-20 group-hover:opacity-40 transition-opacity">
                    {index + 1}
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                    {project.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-center">
                    <ExternalLink className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Нажмите для просмотра</p>
                  </div>
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
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0 group-hover:animate-pulse-glow transition-all"></div>
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
                      className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs group-hover:bg-primary/20 group-hover:text-primary transition-colors"
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
            </AnimatedSection>
          ))}
        </div>

        {/* View All Projects */}
        <AnimatedSection delay={600} className="text-center">
          <Button className="btn-hero px-8 py-4 text-lg rounded-lg group hover:shadow-glow hover:-translate-y-1 transition-all duration-300">
            GitHub репозиторий
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </AnimatedSection>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </section>
  );
};

// Export with the new name for consistency
export { ProjectsSection as CasesSection };