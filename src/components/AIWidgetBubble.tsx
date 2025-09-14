import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AIWidgetBubbleProps {
  onClose: () => void;
  onOpenChat: () => void;
}

const AIWidgetBubble: React.FC<AIWidgetBubbleProps> = ({ onClose, onOpenChat }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { ref, isInView } = useScrollAnimation({ 
    threshold: 0.3,
    triggerOnce: false 
  });

  // Show bubble when contact section is in view
  useEffect(() => {
    if (isInView && !isDismissed) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isInView, isDismissed]);

  const handleClose = () => {
    setIsVisible(false);
    setIsDismissed(true);
    onClose();
  };

  const handleBubbleClick = () => {
    setIsVisible(false);
    onOpenChat();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Invisible tracker element */}
      <div ref={ref as any} className="invisible absolute" />
      
      {/* Speech bubble */}
      <div className="fixed bottom-24 right-8 z-40 animate-scale-in">
        <div className="relative bg-white border border-border rounded-2xl shadow-lg p-4 max-w-xs">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute -top-2 -right-2 bg-background border border-border rounded-full w-6 h-6 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
          
          {/* Message content */}
          <div 
            className="cursor-pointer"
            onClick={handleBubbleClick}
          >
            <p className="text-foreground text-sm font-medium mb-2">
              Есть вопрос? 🤔
            </p>
            <p className="text-muted-foreground text-xs">
              Задайте его нашему AI-помощнику!
            </p>
          </div>
          
          {/* Speech bubble arrow */}
          <div className="absolute bottom-0 right-6 transform translate-y-full">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-border absolute top-0.5 left-0"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIWidgetBubble;