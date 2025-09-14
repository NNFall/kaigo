import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export const KaigoTypingEffect = () => {
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    // Show main title immediately
    setShowTitle(true);
    
    // Show subtitle after a delay
    const subtitleTimer = setTimeout(() => {
      setShowSubtitle(true);
    }, 1000);

    // Show arrow after subtitle animation
    const arrowTimer = setTimeout(() => {
      setShowArrow(true);
    }, 2500);

    return () => {
      clearTimeout(subtitleTimer);
      clearTimeout(arrowTimer);
    };
  }, []);

  return (
    <div className="text-center space-y-6">
      {/* Main Kaigo title */}
      <h1 
        className={`text-7xl md:text-8xl lg:text-9xl font-bold transition-all duration-1000 ${
          showTitle 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-10'
        }`}
      >
        <span className="text-foreground">k</span>
        <span className="gradient-text">AI</span>
        <span className="text-foreground">go</span>
      </h1>

      {/* Subtitle with typing effect */}
      <div className="relative">
        <div 
          className={`text-2xl md:text-3xl font-medium text-muted-foreground transition-all duration-800 ${
            showSubtitle 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-5'
          }`}
        >
          Путь к нейросетям
          {showSubtitle && (
            <span className="inline-block ml-2 w-0.5 h-8 bg-primary animate-pulse" />
          )}
        </div>
        
        {/* English translation */}
        <div 
          className={`text-lg text-muted-foreground/70 mt-2 transition-all duration-800 delay-500 ${
            showSubtitle 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-3'
          }`}
        >
          (K AI GO)
        </div>
      </div>

      {/* Animated arrow */}
      <div 
        className={`flex justify-center transition-all duration-800 delay-1000 ${
          showArrow 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-5'
        }`}
      >
        <div className="flex items-center space-x-3 text-primary">
          <div className="w-12 h-0.5 bg-gradient-primary" />
          <ArrowRight className={`w-8 h-8 ${showArrow ? 'animate-pulse' : ''}`} />
          <div className="w-12 h-0.5 bg-gradient-primary" />
        </div>
      </div>

      {/* Description */}
      <div 
        className={`transition-all duration-1000 delay-1500 ${
          showArrow 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-5'
        }`}
      >
        <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          Создаём интеллектуальные AI-решения для автоматизации бизнес-процессов
        </p>
      </div>
    </div>
  );
};