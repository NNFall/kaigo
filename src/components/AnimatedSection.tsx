import { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: 'reveal-up' | 'scale-in' | 'fade-in';
}

export const AnimatedSection = ({ 
  children, 
  className, 
  delay = 0,
  animation = 'reveal-up'
}: AnimatedSectionProps) => {
  const { ref, isInView } = useScrollAnimation();

  return (
    <div
      ref={ref as any}
      className={cn(
        'animate-reveal',
        isInView && 'in-view',
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationName: isInView ? animation : 'none'
      }}
    >
      {children}
    </div>
  );
};