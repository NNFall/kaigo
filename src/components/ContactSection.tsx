import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">ДАВАЙТЕ РАБОТАТЬ</span>{' '}
            <span className="text-gradient">ВМЕСТЕ</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Готов обсудить ваш проект или ответить на вопросы. Свяжитесь со мной удобным способом
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Мои контакты
              </h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-foreground font-semibold">Email</div>
                    <div className="text-muted-foreground">nikita@kaigo.dev</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-foreground font-semibold">Telegram</div>
                    <div className="text-muted-foreground">@nikita_kaigo</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-foreground font-semibold">Локация</div>
                    <div className="text-muted-foreground">Россия</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="glass p-6 rounded-2xl">
              <h4 className="text-lg font-semibold text-foreground mb-4">
                Социальные сети
              </h4>
              <div className="space-y-3">
                <a href="#" className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">GH</span>
                  </div>
                  <span>GitHub</span>
                </a>
                <a href="#" className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">TG</span>
                  </div>
                  <span>Telegram</span>
                </a>
                <a href="#" className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">LI</span>
                  </div>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Availability Status */}
            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="text-foreground font-semibold">Доступен для проектов</div>
                  <div className="text-sm text-muted-foreground">Готов к новым вызовам!</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Расскажите о вашем проекте
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Имя *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-muted/50 border-border"
                    placeholder="Ваше имя"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Телефон *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="bg-muted/50 border-border"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-muted/50 border-border"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Сообщение
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="bg-muted/50 border-border resize-none"
                  placeholder="Опишите вашу задачу, бюджет и сроки..."
                />
              </div>

              <Button type="submit" className="btn-hero w-full py-3 text-lg rounded-lg group">
                Обсудить проект
                <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Нажимая "Отправить сообщение", вы соглашаетесь с{' '}
              <a href="#" className="text-primary hover:underline">
                политикой конфиденциальности
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};