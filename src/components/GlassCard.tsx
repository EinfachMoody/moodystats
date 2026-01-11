import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DURATION, EASING } from '@/lib/motion';

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
        hoverable && 'cursor-pointer transition-all duration-200 hover:shadow-glass-lg hover:-translate-y-0.5',
        className
      )}
      style={glowColor ? { boxShadow: `0 8px 32px ${glowColor}20` } : undefined}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION.fast, ease: EASING.smooth }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

GlassCard.displayName = 'GlassCard';
