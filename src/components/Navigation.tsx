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

export const Navigation = ({ activeTab, onTabChange, t, isRTL = false, position = 'bottom' }: NavigationProps) => {
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
        return 'left-0 top-0 bottom-0 pl-[env(safe-area-inset-left)] flex-col w-20';
      case 'right':
        return 'right-0 top-0 bottom-0 pr-[env(safe-area-inset-right)] flex-col w-20';
      default: // bottom
        return 'bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)]';
    }
  };

  const getInitialAnimation = () => {
    switch (position) {
      case 'top': return { y: -100, opacity: 0 };
      case 'left': return { x: -100, opacity: 0 };
      case 'right': return { x: 100, opacity: 0 };
      default: return { y: 100, opacity: 0 };
    }
  };

  const getFinalAnimation = () => {
    return { x: 0, y: 0, opacity: 1 };
  };

  return (
    <motion.nav
      initial={getInitialAnimation()}
      animate={getFinalAnimation()}
      transition={{ delay: 0.15, type: 'spring', stiffness: 350, damping: 32 }}
      className={cn(
        'fixed z-50',
        getPositionClasses()
      )}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className={cn(
        'mx-auto',
        isVertical ? 'h-full py-4 px-2' : 'p-3 max-w-lg'
      )}>
        <div className={cn(
          'glass-card px-2 py-2',
          isVertical ? 'h-full flex flex-col justify-center' : ''
        )}>
          <div className={cn(
            'flex items-center',
            isVertical ? 'flex-col gap-2' : 'justify-around'
          )}>
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                whileTap={{ scale: 0.92 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 + index * 0.02 }}
                className={cn(
                  'relative flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl transition-colors duration-200 min-w-[60px] min-h-[52px]',
                  isVertical ? 'flex-col w-full' : 'flex-col',
                  activeTab === item.id 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {activeTab === item.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-2xl"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <motion.div
                  animate={activeTab === item.id ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10"
                >
                  <item.icon 
                    className="w-[22px] h-[22px]" 
                    strokeWidth={activeTab === item.id ? 2.2 : 1.6} 
                  />
                </motion.div>
                <span className={cn(
                  "text-[10px] font-medium relative z-10 transition-all leading-tight",
                  activeTab === item.id && "font-semibold"
                )}>
                  {getLabel(item.id)}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
