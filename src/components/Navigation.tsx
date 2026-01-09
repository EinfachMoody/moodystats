import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Home, CheckSquare, Calendar, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavPosition } from '@/types';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  t?: (key: string) => string;
  isRTL?: boolean;
  position?: NavPosition;
}

const defaultLabels: Record<string, string> = {
  dashboard: 'Home',
  tasks: 'Tasks',
  calendar: 'Calendar',
  stats: 'Stats',
  settings: 'Settings',
};

const navItems = [
  { id: 'dashboard', icon: Home },
  { id: 'tasks', icon: CheckSquare },
  { id: 'calendar', icon: Calendar },
  { id: 'stats', icon: BarChart3 },
  { id: 'settings', icon: Settings },
];

export const Navigation = forwardRef<HTMLElement, NavigationProps>(
  ({ activeTab, onTabChange, t, isRTL = false, position = 'bottom' }, ref) => {
    const getLabel = (id: string) => {
      if (t) return t(id);
      return defaultLabels[id] || id;
    };

    const isVertical = position === 'left' || position === 'right';

    const getPositionClasses = () => {
      switch (position) {
        case 'top':
          return 'top-0 left-0 right-0 pt-[env(safe-area-inset-top)]';
        case 'left':
          return 'left-0 top-0 bottom-0 pl-[env(safe-area-inset-left)] flex-col w-[72px]';
        case 'right':
          return 'right-0 top-0 bottom-0 pr-[env(safe-area-inset-right)] flex-col w-[72px]';
        default: // bottom
          return 'bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)]';
      }
    };

    // Keep a subtle mount animation, but avoid any layout-affecting movement.
    const getInitialAnimation = () => ({ opacity: 0 });
    const getFinalAnimation = () => ({ opacity: 1 });

    return (
      <motion.nav
        ref={ref}
        initial={getInitialAnimation()}
        animate={getFinalAnimation()}
        transition={{ delay: 0.05, duration: 0.22, ease: 'easeOut' }}
        className={cn('fixed z-50', getPositionClasses())}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div
          className={cn('mx-auto', isVertical ? 'h-full py-4 px-2' : 'p-3 max-w-lg')}
        >
          <div
            className={cn('glass-card px-2 py-2', isVertical ? 'h-full flex flex-col justify-center' : '')}
          >
            <div
              className={cn(
                'flex items-center',
                isVertical ? 'flex-col gap-2' : 'justify-around'
              )}
            >
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  whileTap={{ scale: 0.94 }}
                  className={cn(
                    'relative flex items-center justify-center gap-1 rounded-2xl transition-colors duration-150',
                    isVertical 
                      ? 'flex-col w-full px-2 py-2.5 min-h-[56px]' 
                      : 'flex-col px-3 py-2.5 min-w-[56px] min-h-[52px]',
                    activeTab === item.id
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-primary/10 rounded-2xl"
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                    />
                  )}
                  <div className="relative z-10">
                    <item.icon
                      className={cn(
                        'w-5 h-5 transition-transform duration-150',
                        activeTab === item.id && 'scale-105'
                      )}
                      strokeWidth={activeTab === item.id ? 2.2 : 1.6}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-[9px] font-medium relative z-10 leading-tight text-center truncate max-w-full',
                      activeTab === item.id && 'font-semibold'
                    )}
                  >
                    {getLabel(item.id)}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>
    );
  }
);

Navigation.displayName = 'Navigation';
