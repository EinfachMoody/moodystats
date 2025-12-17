import { motion } from 'framer-motion';
import { Moon, Sun, Bell, Type, Trophy, Zap, Flame, Target } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface SettingsPageProps {
  darkMode: boolean;
  onDarkModeChange: (value: boolean) => void;
  notifications: boolean;
  onNotificationsChange: (value: boolean) => void;
  fontSize: 'small' | 'medium' | 'large';
  onFontSizeChange: (value: 'small' | 'medium' | 'large') => void;
  stats: {
    totalPoints: number;
    streak: number;
    tasksCompleted: number;
  };
}

export const SettingsPage = ({
  darkMode,
  onDarkModeChange,
  notifications,
  onNotificationsChange,
  fontSize,
  onFontSizeChange,
  stats,
}: SettingsPageProps) => {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      {/* Appearance */}
      <GlassCard className="!p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Appearance
        </h3>
        
        {/* Dark Mode */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-secondary" />}
            <div>
              <h4 className="font-medium text-foreground text-sm">Dark Mode</h4>
              <p className="text-xs text-muted-foreground">Switch theme</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onDarkModeChange(!darkMode)}
            className={`w-12 h-7 rounded-full relative transition-colors ${
              darkMode ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <motion.div
              layout
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              animate={{ left: darkMode ? 'calc(100% - 24px)' : '4px' }}
            />
          </motion.button>
        </div>

        {/* Font Size */}
        <div className="py-3 border-t border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <Type className="w-5 h-5 text-primary" />
            <div>
              <h4 className="font-medium text-foreground text-sm">Font Size</h4>
              <p className="text-xs text-muted-foreground">Adjust text size</p>
            </div>
          </div>
          <div className="flex gap-2">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <motion.button
                key={size}
                whileTap={{ scale: 0.95 }}
                onClick={() => onFontSizeChange(size)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                  fontSize === size
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground'
                }`}
              >
                {size}
              </motion.button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Notifications */}
      <GlassCard className="!p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Notifications
        </h3>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary" />
            <div>
              <h4 className="font-medium text-foreground text-sm">Push Notifications</h4>
              <p className="text-xs text-muted-foreground">Daily reminders & alerts</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onNotificationsChange(!notifications)}
            className={`w-12 h-7 rounded-full relative transition-colors ${
              notifications ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <motion.div
              layout
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              animate={{ left: notifications ? 'calc(100% - 24px)' : '4px' }}
            />
          </motion.button>
        </div>
      </GlassCard>

      {/* Stats */}
      <GlassCard className="!p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" />
          Your Stats
        </h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-primary/10">
            <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{stats.totalPoints}</p>
            <p className="text-xs text-muted-foreground">Points</p>
          </div>
          <div className="p-3 rounded-2xl bg-secondary/10">
            <Flame className="w-5 h-5 text-secondary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{stats.streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="p-3 rounded-2xl bg-accent/10">
            <Target className="w-5 h-5 text-accent mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{stats.tasksCompleted}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </div>
      </GlassCard>

      {/* App Info */}
      <GlassCard className="!p-4">
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">Daily Flow</p>
          <p className="text-xs text-muted-foreground">Version 1.0.0</p>
        </div>
      </GlassCard>
    </motion.div>
  );
};