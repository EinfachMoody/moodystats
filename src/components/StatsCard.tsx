import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '@/lib/utils';
import { DURATION, EASING } from '@/lib/motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  gradient?: string;
  delay?: number;
}

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  gradient = 'from-primary to-blue-600',
  delay = 0,
}: StatsCardProps) => {
  return (
    <GlassCard className="relative overflow-hidden">
      <div>
        {/* Background Gradient Blob */}
        <div 
          className={cn(
            'absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl',
            `bg-gradient-to-br ${gradient}`
          )}
        />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              'p-3 rounded-xl bg-gradient-to-br',
              gradient
            )}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            
            {trend && trendValue && (
              <span className={cn(
                'text-xs font-medium px-2 py-1 rounded-full',
                trend === 'up' && 'bg-accent/20 text-accent',
                trend === 'down' && 'bg-destructive/20 text-destructive',
                trend === 'neutral' && 'bg-muted text-muted-foreground'
              )}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {trendValue}
              </span>
            )}
          </div>

          <div>
            <p className="text-3xl font-bold text-foreground">
              {value}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{title}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground/70 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
