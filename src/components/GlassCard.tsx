import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
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
  ...props
}, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn(
        'glass-card p-6',
        hoverable && 'cursor-pointer transition-all duration-300 hover:shadow-glass-lg hover:-translate-y-1',
        className
      )}
      style={glowColor ? { boxShadow: `0 8px 32px ${glowColor}20` } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

GlassCard.displayName = 'GlassCard';
