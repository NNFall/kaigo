import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { AnimatedSection } from '@/components/AnimatedSection';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContactModal } from '@/components/ContactModal';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, ArrowRight, Filter } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: "AI Голосовой ассистент для колл-центра",
    description: "Полностью автоматизированная система обработки входящих звонков с использованием NLP и синтеза речи.",
    category: "Голосовые ассистенты",
    tags: ["OpenAI", "Speech Recognition", "NLP", "Python"],
    image: "/api/placeholder/600/400",
    status: "Завершен",
    year: "2024"
  },
  {
    id: 2,
    title: "Интеллектуальный чат-бот для e-commerce",
    description: "AI-помощник для интернет-магазина с возможностью обработки заказов и консультаций по товарам.",
    category: "AI чат-боты",
    tags: ["GPT-4", "React", "Node.js", "MongoDB"],
    image: "/api/placeholder/600/400",
    status: "Завершен",
    year: "2024"
  },
  {
    id: 3,
    title: "Система тренажеров для медицинского персонала",
    description: "VR-тренажер с AI-оценкой действий для обучения нейрохирургов сложным операциям.",
    category: "Интеграция AI",
    tags: ["Machine Learning", "VR", "Computer Vision", "TensorFlow"],
    image: "/api/placeholder/600/400",
    status: "Завершен",
    year: "2023"
  },
  {
    id: 4,
    title: "AI-ассистент для продажи инструментов",
    description: "Интерактивный помощник для консультантов ВсеИнструменты.ру с базой знаний о товарах.",
    category: "AI чат-боты",
    tags: ["RAG", "Vector DB", "FastAPI", "PostgreSQL"],
    image: "/api/placeholder/600/400",
    status: "Завершен",
    year: "2023"
  },
  {
    id: 5,
    title: "Автоматизация HR-процессов с AI",
    description: "Система автоматического скрининга резюме и проведения первичных интервью.",
    category: "Интеграция AI",
    tags: ["NLP", "Computer Vision", "API Integration", "React"],
    image: "/api/placeholder/600/400",
    status: "В разработке",
    year: "2024"
  },
  {
    id: 6,
    title: "Голосовой помощник для умного дома",
    description: "Персональный AI-ассистент для управления IoT-устройствами с естественной речью.",
    category: "Голосовые ассистенты",
    tags: ["IoT", "Speech Synthesis", "Edge AI", "Raspberry Pi"],
    image: "/api/placeholder/600/400",
    status: "В разработке",
    year: "2024"
  }
];

const categories = ["Все проекты", "Голосовые ассистенты", "AI чат-боты", "Интеграция AI"];

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("Все проекты");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const filteredProjects = selectedCategory === "Все проекты" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navigation />
      
      <main className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">Мои проекты</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Портфолио реализованных AI-решений для различных отраслей бизнеса
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "btn-hero" : ""}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {category}
                  </Button>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <AnimatedSection key={project.id} delay={index * 100}>
                  <div className="glass rounded-2xl overflow-hidden group hover:shadow-glow transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge 
                          variant="secondary" 
                          className={`${
                            project.status === "Завершен" 
                              ? "bg-green-500/20 text-green-400 border-green-500/30" 
                              : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                          }`}
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="outline">
                          {project.year}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-3">
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          {project.category}
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          asChild 
                          className="flex-1 btn-hero"
                        >
                          <Link to={`/project/${project.id}`}>
                            Подробнее
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                        
                        <Button variant="outline" size="icon">
                          <Github className="w-4 h-4" />
                        </Button>
                        
                        <Button variant="outline" size="icon">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="glass p-12 rounded-2xl text-center">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="gradient-text">Готовы реализовать свой проект?</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Обсудим ваши задачи и создадим AI-решение, которое выведет ваш бизнес на новый уровень
                </p>
                <Button 
                  size="lg" 
                  className="btn-hero"
                  onClick={() => setIsContactModalOpen(true)}
                >
                  Обсудить проект
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
      <Footer />
    </div>
  );
};

export default Projects;