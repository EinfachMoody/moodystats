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
  Monitor,
  Palette,
  Sliders,
  Shield,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  ChevronLeft,
  Sparkles,
  Clock,
  Tag,
  CheckSquare,
  Database,
  Smartphone
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { LanguageSelector } from './LanguageSelector';
import { Language, LANGUAGES } from '@/i18n/translations';
import { cn } from '@/lib/utils';

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

type SettingsView = 'main' | 'language' | 'appearance' | 'tasks' | 'reminders' | 'calendar' | 'privacy' | 'advanced' | 'software';

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
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  const [glassIntensity, setGlassIntensity] = useState<'light' | 'medium' | 'strong'>('medium');
  const [animationsEnabled, setAnimationsEnabled] = useState<'full' | 'reduced' | 'off'>('full');
  
  const currentLanguageInfo = LANGUAGES.find(l => l.code === language);
  const isRTL = false; // RTL disabled for now

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Back button component
  const BackButton = ({ title }: { title: string }) => (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => setCurrentView('main')}
      className="flex items-center gap-2 mb-4 text-primary touch-feedback"
    >
      <ChevronLeft className="w-5 h-5" />
      <span className="font-medium">{t('settings')}</span>
    </motion.button>
  );

  // Settings Row Component
  const SettingsRow = ({ 
    icon: Icon, 
    label, 
    value, 
    onClick, 
    showChevron = true,
    children 
  }: { 
    icon?: any; 
    label: string; 
    value?: string; 
    onClick?: () => void;
    showChevron?: boolean;
    children?: React.ReactNode;
  }) => (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full settings-row",
        onClick && "settings-row-clickable"
      )}
      disabled={!onClick && !children}
    >
      <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
        {Icon && <Icon className="w-5 h-5 text-primary" />}
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
        {value && <span className="text-sm text-muted-foreground">{value}</span>}
        {children}
        {showChevron && onClick && (
          <ChevronRight className={cn("w-4 h-4 text-muted-foreground", isRTL && "rotate-180")} />
        )}
      </div>
    </motion.button>
  );

  // Toggle Component
  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onChange}
      className={cn("ios-toggle", enabled && "active")}
    />
  );

  // Language Selector View
  if (currentView === 'language') {
    return (
      <LanguageSelector
        currentLanguage={language}
        onLanguageChange={onLanguageChange}
        onBack={() => setCurrentView('main')}
      />
    );
  }

  // Software Info View
  if (currentView === 'software') {
    return (
      <motion.div
        key="software"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-5"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <BackButton title={t('software')} />
        
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-foreground">{t('software')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('versionInfo')}</p>
        </div>

        <GlassCard className="!p-0 overflow-hidden">
          <div className="info-row border-b border-border/20">
            <span className="info-row-label">{t('appNameLabel')}</span>
            <span className="info-row-value font-medium text-foreground">Daily Flow</span>
          </div>
          <div className="info-row border-b border-border/20">
            <span className="info-row-label">{t('versionLabel')}</span>
            <span className="info-row-value">1.3.0 (Build 42)</span>
          </div>
          <div className="info-row border-b border-border/20">
            <span className="info-row-label">{t('developmentTeam')}</span>
            <span className="info-row-value">Daily Flow Team</span>
          </div>
          <div className="info-row">
            <span className="info-row-label">{t('developer')}</span>
            <span className="info-row-value">Moody El-Lahib</span>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  // Appearance View
  if (currentView === 'appearance') {
    return (
      <motion.div
        key="appearance"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-5"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <BackButton title={t('appearance')} />
        <h1 className="text-xl font-bold text-foreground">{t('appearance')}</h1>

        {/* Theme Mode */}
        <GlassCard className="!p-0 overflow-hidden">
          <div className="settings-group-header">
            <span className="settings-group-title">{t('themeMode')}</span>
          </div>
          <div className="p-4">
            <div className="flex gap-2">
              {(['light', 'dark', 'system'] as const).map((mode) => (
                <motion.button
                  key={mode}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onThemeModeChange(mode)}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                    themeMode === mode
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  )}
                >
                  {mode === 'light' && <Sun className="w-4 h-4" />}
                  {mode === 'dark' && <Moon className="w-4 h-4" />}
                  {mode === 'system' && <Monitor className="w-4 h-4" />}
                  {t(`${mode}Mode`)}
                </motion.button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Glass Intensity */}
        <GlassCard className="!p-0 overflow-hidden">
          <div className="settings-group-header">
            <span className="settings-group-title">{t('glassIntensity')}</span>
          </div>
          <div className="p-4">
            <div className="flex gap-2">
              {(['light', 'medium', 'strong'] as const).map((intensity) => (
                <motion.button
                  key={intensity}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGlassIntensity(intensity)}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-sm font-medium transition-all",
                    glassIntensity === intensity
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  )}
                >
                  {t(intensity)}
                </motion.button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Font Size */}
        <GlassCard className="!p-0 overflow-hidden">
          <div className="settings-group-header">
            <span className="settings-group-title">{t('fontSize')}</span>
          </div>
          <div className="p-4">
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <motion.button
                  key={size}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onFontSizeChange(size)}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-sm font-medium transition-all",
                    fontSize === size
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  )}
                >
                  {size === 'small' ? 'A' : size === 'medium' ? 'A' : 'A'}
                  <span className={cn(
                    "ml-1",
                    size === 'small' && 'text-xs',
                    size === 'medium' && 'text-sm',
                    size === 'large' && 'text-base'
                  )}>
                    {t(size === 'medium' ? 'mediumSize' : size)}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Animations */}
        <GlassCard className="!p-0 overflow-hidden">
          <div className="settings-group-header">
            <span className="settings-group-title">{t('animations')}</span>
          </div>
          <div className="p-4">
            <div className="flex gap-2">
              {(['full', 'reduced', 'off'] as const).map((anim) => (
                <motion.button
                  key={anim}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAnimationsEnabled(anim)}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-sm font-medium transition-all",
                    animationsEnabled === anim
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  )}
                >
                  {t(anim)}
                </motion.button>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  // Privacy & Data View
  if (currentView === 'privacy') {
    return (
      <motion.div
        key="privacy"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-5"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <BackButton title={t('privacyData')} />
        <h1 className="text-xl font-bold text-foreground">{t('privacyData')}</h1>

        <GlassCard className="!p-4">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">{t('localStorageInfo')}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('localStorageDesc')}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-0 overflow-hidden">
          <SettingsRow icon={Download} label={t('exportData')} onClick={() => {}} />
          <SettingsRow icon={Upload} label={t('importData')} onClick={() => {}} />
        </GlassCard>

        <GlassCard className="!p-0 overflow-hidden">
          <SettingsRow icon={Trash2} label={t('deleteCompletedTasks')} onClick={() => {}} showChevron={false} />
          <SettingsRow icon={Trash2} label={t('deleteMoodHistory')} onClick={() => {}} showChevron={false} />
        </GlassCard>

        <GlassCard className="!p-0 overflow-hidden">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full settings-row settings-row-clickable"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-destructive" />
              <span className="text-sm text-destructive font-medium">{t('resetApp')}</span>
            </div>
          </motion.button>
        </GlassCard>

        <p className="text-xs text-muted-foreground text-center px-4">
          {t('resetWarning')}
        </p>
      </motion.div>
    );
  }

  // Main Settings View
  return (
    <motion.div
      key="settings-main"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: 20 }}
      variants={containerVariants}
      className="space-y-5"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <motion.h1 variants={itemVariants} className="text-2xl font-bold text-foreground">
        {t('settings')}
      </motion.h1>

      {/* General Section */}
      <motion.div variants={itemVariants}>
        <p className="section-header">{t('general')}</p>
        <GlassCard className="!p-0 overflow-hidden">
          <SettingsRow 
            icon={Palette} 
            label={t('appearance')} 
            value={t(`${themeMode}Mode`)}
            onClick={() => setCurrentView('appearance')} 
          />
          <SettingsRow 
            icon={Globe} 
            label={t('language')} 
            value={currentLanguageInfo?.nativeName}
            onClick={() => setCurrentView('language')} 
          />
        </GlassCard>
      </motion.div>

      {/* Notifications Section */}
      <motion.div variants={itemVariants}>
        <p className="section-header">{t('notifications')}</p>
        <GlassCard className="!p-0 overflow-hidden">
          <div className="settings-row">
            <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
              <Bell className="w-5 h-5 text-primary" />
              <div className={cn(isRTL ? "text-right" : "text-left")}>
                <span className="text-sm text-foreground block">{t('pushNotifications')}</span>
                <span className="text-xs text-muted-foreground">{t('dailyReminders')}</span>
              </div>
            </div>
            <Toggle enabled={notifications} onChange={() => onNotificationsChange(!notifications)} />
          </div>
        </GlassCard>
      </motion.div>

      {/* Calendar & Reminders */}
      <motion.div variants={itemVariants}>
        <p className="section-header">{t('calendarReminders')}</p>
        <GlassCard className="!p-0 overflow-hidden">
          <div className="p-4">
            <div className={cn("flex items-center gap-3 mb-3", isRTL && "flex-row-reverse")}>
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm text-foreground">{t('defaultReminder')}</span>
            </div>
            <div className="flex gap-2">
              {[5, 15, 30, 60].map((mins) => (
                <motion.button
                  key={mins}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDefaultReminderChange(mins)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-xs font-medium transition-all",
                    defaultReminder === mins
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  )}
                >
                  {mins} {t('min')}
                </motion.button>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Privacy & Data */}
      <motion.div variants={itemVariants}>
        <p className="section-header">{t('privacyData')}</p>
        <GlassCard className="!p-0 overflow-hidden">
          <SettingsRow 
            icon={Shield} 
            label={t('dataPrivacy')} 
            onClick={() => setCurrentView('privacy')} 
          />
        </GlassCard>
      </motion.div>

      {/* Stats Section */}
      <motion.div variants={itemVariants}>
        <p className="section-header">{t('yourStats')}</p>
        <GlassCard className="!p-0 overflow-hidden">
          <div className="grid grid-cols-3 gap-2 p-4">
            <div className="p-3 rounded-xl bg-primary/8 text-center">
              <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{stats.totalPoints}</p>
              <p className="text-[10px] text-muted-foreground">{t('points')}</p>
            </div>
            <div className="p-3 rounded-xl bg-secondary/8 text-center">
              <Flame className="w-5 h-5 text-secondary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{stats.streak}</p>
              <p className="text-[10px] text-muted-foreground">{t('dayStreak')}</p>
            </div>
            <div className="p-3 rounded-xl bg-accent/8 text-center">
              <Target className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{stats.tasksCompleted}</p>
              <p className="text-[10px] text-muted-foreground">{t('completed')}</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* App Info */}
      <motion.div variants={itemVariants}>
        <p className="section-header">{t('about')}</p>
        <GlassCard className="!p-0 overflow-hidden">
          <SettingsRow 
            icon={Smartphone} 
            label={t('software')} 
            value="1.3.0"
            onClick={() => setCurrentView('software')} 
          />
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};
