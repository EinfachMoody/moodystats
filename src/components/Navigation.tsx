import { motion } from 'framer-motion';
import { Home, CheckSquare, Smile, BookOpen, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', icon: Home, label: 'Home' },
  { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
  { id: 'mood', icon: Smile, label: 'Mood' },
  { id: 'journal', icon: BookOpen, label: 'Journal' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 z-40 safe-area-bottom"
    >
      <div 
        className="mx-3 mb-3 px-2 py-2 rounded-2xl"
        style={{
          background: 'hsla(var(--glass-bg))',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          border: '1px solid hsla(var(--glass-border))',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              whileTap={{ scale: 0.9 }}
              className={cn(
                'relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-300 min-w-[56px]',
                activeTab === item.id
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {activeTab === item.id && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <item.icon className="w-5 h-5 relative z-10" strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-[10px] font-medium relative z-10">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};