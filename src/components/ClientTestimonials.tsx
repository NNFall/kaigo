import { AnimatedSection } from '@/components/AnimatedSection';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    company: "Нейрохирург",
    project: "VR-тренажер для обучения врачей",
    text: "Kaigo разработали революционную систему-тренажер для обучения нейрохирургов. Благодаря AI-оценке действий качество подготовки специалистов выросло на 40%. Теперь молодые врачи могут отрабатывать сложные операции в безопасной виртуальной среде.",
    author: "Дмитрий Петров",
    position: "Главный врач",
    rating: 5,
    logo: "/api/placeholder/80/40"
  },
  {
    company: "ВсеИнструменты.ру",
    project: "AI-ассистент для продавцов-консультантов",
    text: "Внедрение интерактивного AI-помощника кардинально изменило процесс обучения наших консультантов. Время адаптации новых сотрудников сократилось с 2 месяцев до 2 недель, а качество консультаций выросло в разы.",
    author: "Анна Смирнова",
    position: "Директор по персоналу",
    rating: 5,
    logo: "/api/placeholder/80/40"
  },
  {
    company: "AI Call Holdings",
    project: "Голосовой AI для колл-центра",
    text: "Полностью заменили операторов первой линии на AI-ассистентов. Экономия составила 2.5 миллиона рублей в месяц при повышении качества обслуживания. Клиенты больше не ждут в очереди, а сложные вопросы передаются профильным специалистам.",
    author: "Михаил Козлов",
    position: "Генеральный директор",
    rating: 5,
    logo: "/api/placeholder/80/40"
  }
];

export const ClientTestimonials = () => {
  return (
    <section className="py-20 relative" id="testimonials">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Отзывы клиентов</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Что говорят о нас компании, которые уже внедрили AI-решения в свои бизнес-процессы
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={index} delay={index * 200}>
              <div className="glass p-8 rounded-2xl h-full flex flex-col group hover:shadow-glow transition-all duration-300">
                
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote className="w-8 h-8 text-primary opacity-60" />
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                  "{testimonial.text}"
                </blockquote>

                {/* Project Info */}
                <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-sm text-primary font-medium">Проект:</div>
                  <div className="text-sm text-muted-foreground">{testimonial.project}</div>
                </div>

                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.position}</div>
                    <div className="text-sm text-primary font-medium">{testimonial.company}</div>
                  </div>
                  
                  {/* Company Logo */}
                  <div className="w-16 h-8 bg-muted/20 rounded flex items-center justify-center">
                    <img 
                      src={testimonial.logo} 
                      alt={`${testimonial.company} logo`}
                      className="max-w-full max-h-full object-contain opacity-60"
                    />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection delay={600}>
          <div className="mt-16 text-center">
            <div className="glass p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">
                <span className="gradient-text">Хотите стать следующим успешным кейсом?</span>
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Обсудим ваши задачи и покажем, как AI может трансформировать ваш бизнес
              </p>
              <a 
                href="#contact"
                className="inline-flex items-center px-8 py-3 bg-gradient-primary text-white rounded-lg hover:shadow-glow transition-all duration-300"
              >
                Получить консультацию
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};