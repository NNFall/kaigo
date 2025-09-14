import { Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-hero-bg border-t border-border/50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Н</span>
              </div>
              <div className="text-foreground font-bold text-lg">
                НОВОСЕЛЬЦЕВ<br />
                <span className="text-primary">НИКИТА</span>
              </div>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              Создаю цифровые решения для бизнеса
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="https://t.me/kiperovka" className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
              </a>
              <a href="mailto:novoseltsevnikitos@yandex.ru" className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">Контакты</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">+7 (995) 840-77-52</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">novoseltsevnikitos@yandex.ru</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-muted-foreground">
                  г. Самара,<br />
                  ул. Магнитогорская
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-muted-foreground text-sm">
              © {currentYear} Новосельцев Никита. Все права защищены.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Условия использования
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Согласие на обработку данных
              </a>
              <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors text-xs opacity-70">
                Вход для администратора
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};