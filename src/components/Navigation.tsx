import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Menu, X } from 'lucide-react';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { title: 'Обо мне', hasDropdown: false, href: '#about' },
    { title: 'Навыки', hasDropdown: false, href: '#skills' },
    { title: 'Проекты', hasDropdown: false, href: '#projects' },
    { title: 'Контакты', hasDropdown: false, href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 nav-sticky ${isScrolled ? 'scrolled' : ''}`}>
      <div className={`container mx-auto px-4 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
              <span className="text-white font-bold text-sm">kAI</span>
            </div>
            <div className="text-foreground font-bold text-lg">
              <span className="gradient-text">kAIgo</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-foreground hover:text-primary transition-all duration-300 relative group px-3 py-2"
              >
                {item.title}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button className="btn-hero px-6 py-2 rounded-lg hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300">
              Связаться со мной
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 glass rounded-lg p-4 animate-scale-in">
            {menuItems.map((item, index) => (
              <div key={index} className="py-2">
                <a 
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </a>
              </div>
            ))}
            <div className="mt-4">
              <Button className="btn-hero w-full px-6 py-2 rounded-lg">
                Связаться со мной
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};