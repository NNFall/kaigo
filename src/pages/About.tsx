import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { AnimatedSection } from '@/components/AnimatedSection';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';
import { ContactModal } from '@/components/ContactModal';
import { Mail, Phone, Calendar, Award, Target, Users } from 'lucide-react';

const About = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
                <span className="gradient-text">Обо мне</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Специалист по интеграции AI-решений с фокусом на голосовые ассистенты и интеллектуальные чат-боты
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Personal Info Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Column - Text Content */}
              <div className="space-y-8">
                <AnimatedSection delay={200}>
                  <div className="glass p-8 rounded-2xl">
                    <h2 className="text-3xl font-bold mb-6 text-gradient">
                      Кто я и чем занимаюсь
                    </h2>
                    <div className="space-y-4 text-lg leading-relaxed">
                      <p>
                        Привет! Меня зовут Владимир, и я специализируюсь на создании и внедрении 
                        AI-решений для бизнеса. Моя страсть — превращать сложные технологии 
                        искусственного интеллекта в понятные и эффективные инструменты.
                      </p>
                      <p>
                        За последние годы я помог десяткам компаний автоматизировать процессы 
                        с помощью голосовых ассистентов, чат-ботов и других AI-технологий. 
                        Моя цель — сделать искусственный интеллект доступным для любого бизнеса.
                      </p>
                      <p>
                        Я верю, что будущее — за симбиозом человека и машины, где AI берет на себя 
                        рутинные задачи, освобождая людей для творчества и стратегического мышления.
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              </div>

              {/* Right Column - Photo */}
              <div className="space-y-8">
                <AnimatedSection delay={300}>
                  <div className="relative w-full max-w-md mx-auto lg:max-w-full">
                    <div className="glass p-6 rounded-2xl">
                      <div className="aspect-[3/4] rounded-xl overflow-hidden">
                        <img 
                          src="/assets/profile-2.jpg" 
                          alt="Владимир - специалист по AI-решениям"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 glass rounded-full flex items-center justify-center animate-float">
                      <div className="w-8 h-8 bg-accent rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 glass rounded-lg flex items-center justify-center rotate-12">
                      <div className="w-6 h-6 bg-gradient-secondary rounded-sm"></div>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>

        {/* Experience and Skills Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              
              {/* Left Column - Approach */}
              <div className="space-y-8">
                <AnimatedSection delay={200}>
                  <div className="glass p-8 rounded-2xl">
                    <h2 className="text-3xl font-bold mb-6 text-gradient">
                      Мой подход к работе
                    </h2>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <Target className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Фокус на результате</h3>
                          <p className="text-muted-foreground">
                            Каждое решение направлено на достижение конкретных бизнес-целей клиента
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <Users className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Понимание пользователей</h3>
                          <p className="text-muted-foreground">
                            AI должен быть интуитивным и полезным для конечных пользователей
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <Award className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Качество превыше всего</h3>
                          <p className="text-muted-foreground">
                            Предпочитаю создать одно отличное решение, чем несколько посредственных
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              </div>

              {/* Right Column - Stats & Contact */}
              <div className="space-y-8">
                <AnimatedSection delay={300}>
                  <div className="glass p-8 rounded-2xl">
                    <h2 className="text-3xl font-bold mb-6 text-gradient">
                      Мой опыт в цифрах
                    </h2>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">50+</div>
                        <div className="text-sm text-muted-foreground">Проектов реализовано</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">3+</div>
                        <div className="text-sm text-muted-foreground">Года в AI</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">100%</div>
                        <div className="text-sm text-muted-foreground">Удовлетворенных клиентов</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                        <div className="text-sm text-muted-foreground">Поддержка решений</div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={500}>
                  <div className="glass p-8 rounded-2xl">
                    <h2 className="text-3xl font-bold mb-6 text-gradient">
                      Ключевые компетенции
                    </h2>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Интеграция AI-решений</span>
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div className="w-full bg-gradient-primary h-2 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Голосовые ассистенты</span>
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div className="w-5/6 bg-gradient-primary h-2 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>AI чат-боты</span>
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div className="w-5/6 bg-gradient-primary h-2 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Автоматизация процессов</span>
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div className="w-4/5 bg-gradient-primary h-2 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={600}>
                  <div className="glass p-8 rounded-2xl">
                    <h2 className="text-3xl font-bold mb-6 text-gradient">
                      Готовы к сотрудничеству?
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Обсудим ваш проект и найдем лучшее AI-решение для вашего бизнеса
                    </p>
                    <div className="space-y-4">
                      <Button 
                        className="w-full btn-hero" 
                        size="lg"
                        onClick={() => setIsContactModalOpen(true)}
                      >
                        <Mail className="w-5 h-5 mr-2" />
                        Написать мне
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        size="lg"
                        onClick={() => setIsContactModalOpen(true)}
                      >
                        <Calendar className="w-5 h-5 mr-2" />
                        Запланировать встречу
                      </Button>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>

        {/* Why Work With Me */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                <span className="gradient-text">Почему стоит работать именно с kAIgo</span>
              </h2>
            </AnimatedSection>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatedSection delay={200}>
                <div className="glass p-8 rounded-2xl text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Индивидуальный подход</h3>
                  <p className="text-muted-foreground">
                    Каждое решение создается под конкретные задачи и особенности вашего бизнеса
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={400}>
                <div className="glass p-8 rounded-2xl text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Проверенная экспертиза</h3>
                  <p className="text-muted-foreground">
                    Опыт работы с ведущими компаниями и успешно реализованные проекты
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={600}>
                <div className="glass p-8 rounded-2xl text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Полная поддержка</h3>
                  <p className="text-muted-foreground">
                    От концепции до запуска и дальнейшего развития решения
                  </p>
                </div>
              </AnimatedSection>
            </div>
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

export default About;