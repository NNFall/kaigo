import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Shield, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ContactModal } from '@/components/ContactModal';
import { useAuth } from '@/hooks/useAuth';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const location = useLocation();
  const { user, userRole, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { title: 'Главная', href: '/' },
    { title: 'О нас', href: '/about' },
    { title: 'Проекты', href: '/projects' },
    { title: 'Контакты', href: '/#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 nav-sticky ${isScrolled ? 'scrolled' : ''}`}>
      <div className={`container mx-auto px-4 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <span className="text-2xl font-bold hover:opacity-80 transition-opacity">
                <span className="text-foreground">k</span>
                <span className="text-gradient">AI</span>
                <span className="text-foreground">go</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => {
              const isActive = item.href.startsWith('#') 
                ? location.pathname === '/' && location.hash === item.href
                : location.pathname === item.href;
              
              if (item.href.startsWith('#')) {
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    className={`transition-colors relative group px-3 py-2 ${
                      isActive ? 'text-primary' : 'text-foreground hover:text-primary'
                    }`}
                  >
                    {item.title}
                    <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-primary transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                  </a>
                );
              }
              
              return (
                <Link
                  key={item.title}
                  to={item.href}
                  className={`transition-colors relative group px-3 py-2 ${
                    isActive ? 'text-primary' : 'text-foreground hover:text-primary'
                  }`}
                >
                  {item.title}
                  <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-primary transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></span>
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                {userRole === 'admin' && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Shield className="w-4 h-4" />
                      Админ-панель
                    </Button>
                  </Link>
                )}
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    Вход
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={signOut}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Вход
                </Button>
              </Link>
            )}
            <Button 
              className="btn-hero px-6 py-2 rounded-lg hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300"
              onClick={() => setIsContactModalOpen(true)}
            >
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
            {menuItems.map((item) => (
              <div key={item.title} className="py-2">
                {item.href.startsWith('#') ? (
                  <a 
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title}
                  </a>
                ) : (
                  <Link 
                    to={item.href}
                    className="text-foreground hover:text-primary transition-colors block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
            <div className="mt-4 space-y-2">
              {user ? (
                <>
                  {userRole === 'admin' && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Shield className="w-4 h-4" />
                        Админ-панель
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Выйти
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Вход
                  </Button>
                </Link>
              )}
              <Button 
                className="btn-hero w-full px-6 py-2 rounded-lg"
                onClick={() => {
                  setIsContactModalOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                Связаться со мной
              </Button>
            </div>
          </div>
        )}
      </div>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </nav>
  );
};