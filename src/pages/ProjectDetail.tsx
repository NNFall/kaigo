import { useParams, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { AnimatedSection } from '@/components/AnimatedSection';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, ExternalLink, Github, Calendar, Target, CheckCircle } from 'lucide-react';

const projectsData = {
  "1": {
    title: "AI Голосовой ассистент для колл-центра",
    category: "Голосовые ассистенты",
    description: "Революционная система автоматизации входящих звонков, которая полностью заменила операторов первой линии и сократила операционные расходы на 70%.",
    fullDescription: "Разработали и внедрили интеллектуального голосового ассистента на базе современных технологий распознавания и синтеза речи. Система способна обрабатывать сложные запросы клиентов, направлять звонки по нужным отделам и даже решать типовые задачи без участия человека.",
    client: "AI Call Holdings",
    duration: "3 месяца",
    year: "2024",
    status: "Завершен",
    image: "/api/placeholder/800/500",
    technologies: ["OpenAI Whisper", "ElevenLabs", "Python", "FastAPI", "Redis", "PostgreSQL", "WebRTC"],
    challenge: "Компания тратила огромные ресурсы на содержание колл-центра с 50+ операторами. Большинство звонков были типовыми и не требовали сложной обработки, но клиенты ждали на линии по 5-10 минут.",
    solution: "Создали AI-ассистента, который:\n• Мгновенно отвечает на входящие звонки\n• Понимает естественную речь клиентов\n• Обрабатывает 80% запросов самостоятельно\n• Передает сложные случаи живым операторам\n• Работает 24/7 без перерывов",
    results: [
      "Сокращение времени ожидания с 8 минут до 0 секунд",
      "Уменьшение штата операторов с 50 до 10 человек",
      "Экономия ₽2.5M в месяц на зарплатах",
      "Повышение удовлетворенности клиентов на 45%",
      "Обработка 10,000+ звонков в день"
    ],
    images: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    nextProject: "2",
    prevProject: "6"
  },
  "2": {
    title: "Интеллектуальный чат-бот для e-commerce",
    category: "AI чат-боты",
    description: "AI-консультант для крупного интернет-магазина, который увеличил конверсию на 35% и автоматизировал 90% обращений в поддержку.",
    fullDescription: "Создали умного помощника покупателей, который не только отвечает на вопросы, но и активно помогает в выборе товаров, оформлении заказов и решении проблем после покупки.",
    client: "TechStore",
    duration: "2 месяца",
    year: "2024",
    status: "Завершен",
    image: "/api/placeholder/800/500",
    technologies: ["GPT-4", "React", "Node.js", "MongoDB", "Stripe API", "WebSocket"],
    challenge: "Интернет-магазин терял клиентов из-за сложности выбора товаров и медленной поддержки. Пользователи уходили, не найдя нужную информацию.",
    solution: "Разработали AI-консультанта который:\n• Помогает выбрать товар по потребностям\n• Сравнивает характеристики и цены\n• Оформляет заказы в чате\n• Отслеживает доставку\n• Решает проблемы возврата/обмена",
    results: [
      "Увеличение конверсии с 2.1% до 3.8%",
      "Рост среднего чека на 25%",
      "Автоматизация 90% обращений в поддержку",
      "Сокращение времени выбора товара в 3 раза",
      "Повышение повторных покупок на 40%"
    ],
    images: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    nextProject: "3",
    prevProject: "1"
  }
  // Add more projects as needed
};

const ProjectDetail = () => {
  const { id } = useParams();
  const project = projectsData[id as keyof typeof projectsData];

  if (!project) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <ParticleBackground />
        <Navigation />
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Проект не найден</h1>
          <Link to="/projects">
            <Button>Вернуться к проектам</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navigation />
      
      <main className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="mb-8">
                <Link to="/projects" className="inline-flex items-center text-primary hover:text-primary-glow transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Все проекты
                </Link>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      {project.category}
                    </Badge>
                    <Badge variant="outline">
                      {project.year}
                    </Badge>
                    <Badge 
                      className={`${
                        project.status === "Завершен" 
                          ? "bg-green-500/20 text-green-400 border-green-500/30" 
                          : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                      }`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    <span className="gradient-text">{project.title}</span>
                  </h1>
                  
                  <p className="text-xl text-muted-foreground mb-8">
                    {project.description}
                  </p>
                  
                  <div className="flex gap-4">
                    <Button className="btn-hero">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Посмотреть проект
                    </Button>
                    <Button variant="outline">
                      <Github className="w-4 h-4 mr-2" />
                      Код на GitHub
                    </Button>
                  </div>
                </div>
                
                <div>
                  <AnimatedSection delay={200}>
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full rounded-2xl shadow-glow"
                    />
                  </AnimatedSection>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Project Info */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              <AnimatedSection>
                <div className="glass p-6 rounded-2xl">
                  <div className="flex items-center mb-4">
                    <Calendar className="w-5 h-5 text-primary mr-3" />
                    <h3 className="font-semibold">Информация о проекте</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Клиент:</span>
                      <p className="font-medium">{project.client}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Длительность:</span>
                      <p className="font-medium">{project.duration}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Год:</span>
                      <p className="font-medium">{project.year}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div className="glass p-6 rounded-2xl">
                  <div className="flex items-center mb-4">
                    <Target className="w-5 h-5 text-primary mr-3" />
                    <h3 className="font-semibold">Задача клиента</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.challenge}
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={400}>
                <div className="glass p-6 rounded-2xl">
                  <h3 className="font-semibold mb-4">Технологии</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Detailed Description */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              <AnimatedSection>
                <div className="glass p-8 rounded-2xl">
                  <h2 className="text-3xl font-bold mb-6 text-gradient">
                    Решение
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg leading-relaxed mb-6">
                      {project.fullDescription}
                    </p>
                    <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                      {project.solution}
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div className="glass p-8 rounded-2xl">
                  <h2 className="text-3xl font-bold mb-6 text-gradient">
                    Результаты
                  </h2>
                  <div className="space-y-4">
                    {project.results.map((result, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                        <p className="text-muted-foreground leading-relaxed">{result}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Project Gallery */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-center mb-12">
                <span className="gradient-text">Скриншоты проекта</span>
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {project.images.map((image, index) => (
                  <AnimatedSection key={index} delay={index * 100}>
                    <img 
                      src={image} 
                      alt={`${project.title} скриншот ${index + 1}`}
                      className="w-full rounded-xl hover:shadow-glow transition-all duration-300 cursor-pointer"
                    />
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <AnimatedSection>
                {project.prevProject && (
                  <Link to={`/project/${project.prevProject}`}>
                    <Button variant="outline" className="group">
                      <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                      Предыдущий проект
                    </Button>
                  </Link>
                )}
              </AnimatedSection>

              <AnimatedSection delay={100}>
                <Link to="/projects">
                  <Button variant="outline">
                    Все проекты
                  </Button>
                </Link>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                {project.nextProject && (
                  <Link to={`/project/${project.nextProject}`}>
                    <Button variant="outline" className="group">
                      Следующий проект
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="glass p-12 rounded-2xl text-center">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="gradient-text">Хотите похожее решение?</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Обсудим ваши задачи и адаптируем подобное решение под ваш бизнес
                </p>
                <Button size="lg" className="btn-hero">
                  Обсудить проект
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectDetail;