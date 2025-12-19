import { motion } from 'framer-motion';
import { Home, CheckSquare, Smile, Settings, Calendar } from 'lucide-react';
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
  mood: 'Mood',
  settings: 'Settings',
};

const navItems = [
  { id: 'dashboard', icon: Home },
  { id: 'tasks', icon: CheckSquare },
  { id: 'calendar', icon: Calendar },
  { id: 'mood', icon: Smile },
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
      transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-40 safe-area-bottom"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="mx-4 mb-4">
        <div 
          className="px-3 py-3 rounded-3xl"
          style={{
            background: 'hsl(var(--glass-bg))',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid hsl(var(--glass-border))',
            boxShadow: '0 8px 32px hsl(var(--foreground) / 0.1), 0 2px 8px hsl(var(--foreground) / 0.05), inset 0 1px 1px hsl(0 0% 100% / 0.3)',
          }}
        >
          <div className="flex items-center justify-around">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                whileTap={{ scale: 0.85 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className={cn(
                  'relative flex flex-col items-center gap-1 px-4 py-2.5 rounded-2xl transition-all duration-300 min-w-[60px]',
                  activeTab === item.id
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {activeTab === item.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(262 83% 58% / 0.1))',
                      border: '1px solid hsl(var(--primary) / 0.2)',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <motion.div
                  animate={activeTab === item.id ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon 
                    className="w-5 h-5 relative z-10" 
                    strokeWidth={activeTab === item.id ? 2.5 : 1.8} 
                  />
                </motion.div>
                <span className={cn(
                  "text-[10px] font-medium relative z-10 transition-all",
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
