import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Carousel } from '@/components/Carousel';
import { Link } from 'react-router-dom';

const projects = [
  {
    id: 1,
    title: 'AI Голосовой ассистент для колл-центра',
    category: 'Голосовые ассистенты',
    description: 'Полностью автоматизированная система обработки входящих звонков с использованием NLP и синтеза речи. Заменила 40 операторов и сократила расходы на 70%.',
    results: [
      'Обработка 10,000+ звонков в день',
      'Сокращение времени ожидания до 0 секунд',
      'Экономия ₽2.5M в месяц на зарплатах',
    ],
    tags: ['OpenAI Whisper', 'ElevenLabs', 'Python', 'FastAPI'],
    image: '/api/placeholder/800/500',
    year: '2024'
  },
  {
    id: 2,
    title: 'Интеллектуальный чат-бот для e-commerce',
    category: 'AI чат-боты',
    description: 'AI-консультант для интернет-магазина, который увеличил конверсию на 35% и автоматизировал 90% обращений в поддержку.',
    results: [
      'Увеличение конверсии с 2.1% до 3.8%',
      'Рост среднего чека на 25%',
      'Автоматизация 90% обращений в поддержку',
    ],
    tags: ['GPT-4', 'React', 'Node.js', 'MongoDB'],
    image: '/api/placeholder/800/500',
    year: '2024'
  },
  {
    id: 3,
    title: 'VR-тренажер с AI для нейрохирургов',
    category: 'Интеграция AI',
    description: 'Система тренажеров для медицинского персонала с AI-оценкой действий для обучения сложным операциям.',
    results: [
      'Повышение качества подготовки на 40%',
      'Безопасная виртуальная среда обучения',
      'AI-анализ техники выполнения операций',
    ],
    tags: ['Machine Learning', 'VR', 'Computer Vision', 'TensorFlow'],
    image: '/api/placeholder/800/500',
    year: '2023'
  }
];

export const ProjectsSection = () => {
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
            Реальные AI-решения, которые трансформируют бизнес-процессы и приносят измеримые результаты
          </p>
        </AnimatedSection>

        {/* Projects Carousel */}
        <AnimatedSection delay={200}>
          <Carousel autoPlay autoPlayInterval={7000} className="mb-12">
            {projects.map((project) => (
              <div key={project.id} className="px-4">
                <div className="glass rounded-2xl overflow-hidden max-w-4xl mx-auto">
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="relative h-64 lg:h-auto bg-gradient-primary overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-primary opacity-80"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-6xl font-bold opacity-20">
                          {project.id}
                        </div>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                          {project.category}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                          {project.year}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-foreground mb-4">
                        {project.title}
                      </h3>

                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Results */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-foreground mb-3">Ключевые результаты:</h4>
                        <ul className="space-y-2">
                          {project.results.map((result, index) => (
                            <li key={index} className="flex items-start text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></div>
                              {result}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action */}
                      <Button asChild className="btn-hero w-full">
                        <Link to={`/project/${project.id}`}>
                          Подробнее
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </AnimatedSection>

        {/* View All Projects */}
        <AnimatedSection delay={400} className="text-center">
          <Button asChild size="lg" className="btn-hero group hover:shadow-glow hover:-translate-y-1 transition-all duration-300">
            <Link to="/projects">
              <ExternalLink className="mr-2 h-4 w-4" />
              Посмотреть все проекты
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};

// Export with the new name for consistency
export { ProjectsSection as CasesSection };