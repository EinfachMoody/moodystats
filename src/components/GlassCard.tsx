import { forwardRef, CSSProperties, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  glowColor?: string;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(({
  children,
  className,
  hoverable = false,
  glowColor,
  style,
  ...props
}, ref) => {
  const computedStyle: CSSProperties = {
    ...style,
    ...(glowColor ? { boxShadow: `0 8px 32px ${glowColor}20` } : {}),
  };

  return (
    <div
      ref={ref}
      className={cn(
        'glass-card p-6',
        hoverable && 'cursor-pointer transition-all duration-200 hover:shadow-glass-lg hover:-translate-y-0.5',
        className
      )}
      style={computedStyle}
      {...props}
    >
      {children}
    </div>
  );
});

GlassCard.displayName = 'GlassCard';
