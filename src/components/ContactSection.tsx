import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Send, Github, MessageCircle, Linkedin } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      console.log('Form submitted:', formData);
      
      // Reset form after success message
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }, 3000);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">ДАВАЙТЕ РАБОТАТЬ</span>{' '}
            <span className="text-gradient">ВМЕСТЕ</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Готов обсудить ваш проект или ответить на вопросы. Свяжитесь со мной удобным способом
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <AnimatedSection delay={200} className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Мои контакты
              </h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-foreground font-semibold">Email</div>
                    <a href="mailto:hello@kaigo.ai" className="text-muted-foreground group-hover:text-primary transition-colors">
                      hello@kaigo.ai
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-foreground font-semibold">Telegram</div>
                    <a href="https://t.me/kaigo_ai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground group-hover:text-primary transition-colors">
                      @kaigo_ai
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-foreground font-semibold">Локация</div>
                    <div className="text-muted-foreground group-hover:text-primary transition-colors">Россия</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <AnimatedSection delay={400} className="glass p-6 rounded-2xl">
              <h4 className="text-lg font-semibold text-foreground mb-4">
                Социальные сети
              </h4>
              <div className="space-y-3">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-all duration-300 group">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                    <Github className="w-4 h-4 text-primary" />
                  </div>
                  <span>GitHub</span>
                </a>
                <a href="https://t.me/kaigo_ai" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-all duration-300 group">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                    <MessageCircle className="w-4 h-4 text-primary" />
                  </div>
                  <span>Telegram</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-all duration-300 group">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                    <Linkedin className="w-4 h-4 text-primary" />
                  </div>
                  <span>LinkedIn</span>
                </a>
              </div>
            </AnimatedSection>

            {/* Availability Status */}
            <AnimatedSection delay={600} className="glass p-6 rounded-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="text-foreground font-semibold">Доступен для проектов</div>
                  <div className="text-sm text-muted-foreground">Готов к новым вызовам!</div>
                </div>
              </div>
            </AnimatedSection>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection delay={300} className="glass p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Расскажите о вашем проекте
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="floating-label">
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder=" "
                  />
                  <label htmlFor="name">Имя *</label>
                </div>
                <div className="floating-label">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder=" "
                  />
                  <label htmlFor="phone">Телефон *</label>
                </div>
              </div>

              <div className="floating-label">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="email">Email *</label>
              </div>

              <div className="floating-label">
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder=" "
                  className="resize-none"
                />
                <label htmlFor="message">Сообщение</label>
              </div>

              <Button 
                type="submit" 
                className="btn-hero w-full py-3 text-lg rounded-lg group hover:shadow-glow transition-all duration-300"
                disabled={isSubmitting || isSubmitted}
              >
                {isSubmitting ? (
                  <>
                    Отправка...
                    <div className="w-5 h-5 ml-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : isSubmitted ? (
                  <>
                    Отправлено!
                    <div className="w-5 h-5 ml-2 text-green-400">✓</div>
                  </>
                ) : (
                  <>
                    Обсудить проект
                    <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Нажимая "Отправить сообщение", вы соглашаетесь с{' '}
              <a href="#" className="text-primary hover:underline transition-colors">
                политикой конфиденциальности
              </a>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};