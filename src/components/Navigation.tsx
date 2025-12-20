import { motion } from 'framer-motion';
import { Home, CheckSquare, Calendar, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  t?: (key: string) => string;
  isRTL?: boolean;
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

export const Navigation = ({ activeTab, onTabChange, t, isRTL = false }: NavigationProps) => {
  const getLabel = (id: string) => {
    if (t) return t(id);
    return defaultLabels[id] || id;
  };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 350, damping: 32 }}
      className="bottom-nav"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="bottom-nav-container">
        <div className="bottom-nav-bar">
          <div className="flex items-center justify-around">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                whileTap={{ scale: 0.88 }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.03 }}
                className={cn(
                  'nav-item',
                  activeTab === item.id ? 'nav-item-active' : 'nav-item-inactive'
                )}
              >
                {activeTab === item.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="nav-indicator"
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
