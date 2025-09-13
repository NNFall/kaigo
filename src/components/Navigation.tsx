import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Menu, X } from 'lucide-react';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const menuItems = [
    {
      title: 'Услуги',
      hasDropdown: true,
      items: [
        'Анализ и аудит бизнес-процессов',
        'Автоматизация и интеграции',
        'Разработка сайтов',
        'Мобильные приложения',
      ],
    },
    { title: 'О нас', hasDropdown: false },
    {
      title: 'Кейсы',
      hasDropdown: true,
      items: ['Веб-разработка', 'Мобильная разработка', 'Автоматизация'],
    },
    { title: 'Контакты', hasDropdown: false },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-glass">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Ц</span>
            </div>
            <div className="text-foreground font-bold text-lg">
              ЦИФРОВАЯ<br />
              <span className="text-primary">ОПОРА</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.title)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors">
                  <span>{item.title}</span>
                  {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Dropdown */}
                {item.hasDropdown && activeDropdown === item.title && (
                  <div className="absolute top-full left-0 mt-2 w-64 glass rounded-lg p-4 shadow-card">
                    {item.items?.map((subItem, subIndex) => (
                      <button
                        key={subIndex}
                        className="block w-full text-left px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                      >
                        {subItem}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button className="btn-hero px-6 py-2 rounded-lg">
              Заказать консультацию
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 glass rounded-lg p-4">
            {menuItems.map((item, index) => (
              <div key={index} className="py-2">
                <button className="flex items-center justify-between w-full text-foreground hover:text-primary transition-colors">
                  <span>{item.title}</span>
                  {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </button>
                {item.hasDropdown && (
                  <div className="mt-2 ml-4 space-y-1">
                    {item.items?.map((subItem, subIndex) => (
                      <button
                        key={subIndex}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {subItem}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-4">
              <Button className="btn-hero w-full px-6 py-2 rounded-lg">
                Заказать консультацию
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};