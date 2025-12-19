import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, 
  Sun, 
  Bell, 
  Type, 
  Trophy, 
  Zap, 
  Flame, 
  Target,
  Globe,
  ChevronRight,
  Calendar,
  Info,
  Monitor
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { LanguageSelector } from './LanguageSelector';
import { Language, LANGUAGES } from '@/i18n/translations';

interface SettingsPageProps {
  darkMode: boolean;
  onDarkModeChange: (value: boolean) => void;
  themeMode: 'light' | 'dark' | 'system';
  onThemeModeChange: (value: 'light' | 'dark' | 'system') => void;
  notifications: boolean;
  onNotificationsChange: (value: boolean) => void;
  fontSize: 'small' | 'medium' | 'large';
  onFontSizeChange: (value: 'small' | 'medium' | 'large') => void;
  language: Language;
  onLanguageChange: (value: Language) => void;
  defaultReminder: number;
  onDefaultReminderChange: (value: number) => void;
  stats: {
    totalPoints: number;
    streak: number;
    tasksCompleted: number;
  };
  t: (key: string) => string;
}

export const SettingsPage = ({
  darkMode,
  onDarkModeChange,
  themeMode,
  onThemeModeChange,
  notifications,
  onNotificationsChange,
  fontSize,
  onFontSizeChange,
  language,
  onLanguageChange,
  defaultReminder,
  onDefaultReminderChange,
  stats,
  t,
}: SettingsPageProps) => {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const currentLanguageInfo = LANGUAGES.find(l => l.code === language);
  const isRTL = language === 'ar';

  if (showLanguageSelector) {
    return (
      <LanguageSelector
        currentLanguage={language}
        onLanguageChange={onLanguageChange}
        onBack={() => setShowLanguageSelector(false)}
      />
    );
  }

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <h1 className="text-2xl font-bold text-foreground">{t('settings')}</h1>

      {/* Appearance Section */}
      <GlassCard className="!p-0 overflow-hidden">
        <div className="px-4 py-2 bg-muted/30">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t('appearance')}
          </h3>
        </div>
        
        {/* Theme Mode */}
        <div className="px-4 py-3 border-t border-border/30">
          <div className="flex items-center gap-3 mb-3">
            {darkMode ? (
              <Moon className="w-5 h-5 text-primary" />
            ) : (
              <Sun className="w-5 h-5 text-secondary" />
            )}
            <div>
              <h4 className="font-medium text-foreground text-sm">{t('darkMode')}</h4>
              <p className="text-xs text-muted-foreground">{t('switchTheme')}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {(['light', 'dark', 'system'] as const).map((mode) => (
              <motion.button
                key={mode}
                whileTap={{ scale: 0.95 }}
                onClick={() => onThemeModeChange(mode)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  themeMode === mode
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {mode === 'light' && <Sun className="w-4 h-4" />}
                {mode === 'dark' && <Moon className="w-4 h-4" />}
                {mode === 'system' && <Monitor className="w-4 h-4" />}
                {t(`${mode}Mode`)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div className="px-4 py-3 border-t border-border/30">
          <div className="flex items-center gap-3 mb-3">
            <Type className="w-5 h-5 text-primary" />
            <div>
              <h4 className="font-medium text-foreground text-sm">{t('fontSize')}</h4>
              <p className="text-xs text-muted-foreground">{t('adjustTextSize')}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <motion.button
                key={size}
                whileTap={{ scale: 0.95 }}
                onClick={() => onFontSizeChange(size)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  fontSize === size
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {size === 'small' ? t('small') : size === 'medium' ? t('mediumSize') : t('large')}
              </motion.button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Language Section */}
      <GlassCard className="!p-0 overflow-hidden">
        <div className="px-4 py-2 bg-muted/30">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t('language')}
          </h3>
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowLanguageSelector(true)}
          className="w-full flex items-center justify-between px-4 py-3 border-t border-border/30 hover:bg-muted/30 transition-colors"
        >
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Globe className="w-5 h-5 text-primary" />
            <div className={`text-${isRTL ? 'right' : 'left'}`}>
              <h4 className="font-medium text-foreground text-sm">{t('selectLanguage')}</h4>
              <p className="text-xs text-muted-foreground">
                {currentLanguageInfo?.nativeName} ({currentLanguageInfo?.englishName})
              </p>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
        </motion.button>
      </GlassCard>

      {/* Notifications Section */}
      <GlassCard className="!p-0 overflow-hidden">
        <div className="px-4 py-2 bg-muted/30">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t('notifications')}
          </h3>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/30">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Bell className="w-5 h-5 text-primary" />
            <div className={`text-${isRTL ? 'right' : 'left'}`}>
              <h4 className="font-medium text-foreground text-sm">{t('pushNotifications')}</h4>
              <p className="text-xs text-muted-foreground">{t('dailyReminders')}</p>
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

      {/* Calendar & Reminders Section */}
      <GlassCard className="!p-0 overflow-hidden">
        <div className="px-4 py-2 bg-muted/30">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t('calendarReminders')}
          </h3>
        </div>
        <div className="px-4 py-3 border-t border-border/30">
          <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Calendar className="w-5 h-5 text-primary" />
            <div className={`text-${isRTL ? 'right' : 'left'}`}>
              <h4 className="font-medium text-foreground text-sm">{t('defaultReminder')}</h4>
            </div>
          </div>
          <div className="flex gap-2">
            {[5, 15, 30, 60].map((mins) => (
              <motion.button
                key={mins}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDefaultReminderChange(mins)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                  defaultReminder === mins
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {mins} {t('minutes')}
              </motion.button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Stats Section */}
      <GlassCard className="!p-0 overflow-hidden">
        <div className="px-4 py-2 bg-muted/30">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            {t('yourStats')}
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2 p-4">
          <div className="p-3 rounded-2xl bg-primary/10 text-center">
            <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{stats.totalPoints}</p>
            <p className="text-xs text-muted-foreground">{t('points')}</p>
          </div>
          <div className="p-3 rounded-2xl bg-secondary/10 text-center">
            <Flame className="w-5 h-5 text-secondary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{stats.streak}</p>
            <p className="text-xs text-muted-foreground">{t('dayStreak')}</p>
          </div>
          <div className="p-3 rounded-2xl bg-accent/10 text-center">
            <Target className="w-5 h-5 text-accent mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{stats.tasksCompleted}</p>
            <p className="text-xs text-muted-foreground">{t('completed')}</p>
          </div>
        </div>
      </GlassCard>

      {/* App Info Section */}
      <GlassCard className="!p-0 overflow-hidden">
        <div className="px-4 py-2 bg-muted/30">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t('appInfo')}
          </h3>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 border-t border-border/30">
          <Info className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">{t('appName')}</p>
            <p className="text-xs text-muted-foreground">{t('version')}</p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};
