import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, 
  Sun, 
  Bell, 
  Type, 
  Globe,
  ChevronRight,
  Info,
  Monitor,
  Palette,
  Shield,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  ChevronLeft,
  Clock,
  Database,
  Smartphone,
  Zap,
  Flame,
  Target,
  Sliders,
  LayoutList,
  LayoutGrid,
  CreditCard,
  Droplets,
  Sparkles
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { LanguageSelector } from './LanguageSelector';
import { ColorPicker } from './ColorPicker';
import { Language, LANGUAGES } from '@/i18n/translations';
import { AppSettings, TaskViewMode, TextSize, UIDensity, GlassIntensity } from '@/types';
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
  appSettings: AppSettings;
  onSettingsChange: (settings: Partial<AppSettings>) => void;
  onResetSettings: (type: 'colors' | 'layout' | 'all') => void;
  stats: {
    totalPoints: number;
    streak: number;
    tasksCompleted: number;
  };
  t: (key: string) => string;
}

type SettingsView = 'main' | 'language' | 'appearance' | 'customization' | 'colors' | 'privacy' | 'software';

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
  appSettings,
  onSettingsChange,
  onResetSettings,
  stats,
  t,
}: SettingsPageProps) => {
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const currentLanguageInfo = LANGUAGES.find(l => l.code === language);
  const isRTL = false;

  // Optimized animation - single fade, no staggering
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.18 } }
  };

  // Items render immediately - no individual animation to prevent jank
  const itemVariants = {
    hidden: {},
    visible: {}
  };

  const BackButton = ({ title }: { title: string }) => (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      onClick={() => setCurrentView('main')}
      className="flex items-center gap-2 mb-4 text-primary touch-feedback min-h-[44px]"
    >
      <ChevronLeft className="w-5 h-5" />
      <span className="font-medium">{t('settings')}</span>
    </motion.button>
  );

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

  // Color Picker
  if (showColorPicker) {
    return (
      <ColorPicker
        isOpen={showColorPicker}
        currentColor={appSettings.accentColor}
        onColorChange={(color) => onSettingsChange({ accentColor: color })}
        onClose={() => setShowColorPicker(false)}
        onReset={() => onSettingsChange({ accentColor: '#3B82F6' })}
        t={t}
      />
    );
  }

  // Software Info View
  if (currentView === 'software') {
    return (
      <motion.div
        key="software"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="space-y-5"
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
            <span className="info-row-value">0.2 Alpha 4</span>
          </div>
          <div className="info-row border-b border-border/20">
            <span className="info-row-label">{t('buildLabel')}</span>
            <span className="info-row-value">54</span>
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="space-y-5"
      >
        <BackButton title={t('appearance')} />
        <h1 className="text-xl font-bold text-foreground">{t('appearance')}</h1>

        {/* Theme Mode */}
        <GlassCard className="!p-0 overflow-hidden">
          <div className="settings-group-header">
            <span className="settings-group-title">{t('themeMode')}</span>
          </div>
          <div className="p-5">
            <div className="flex gap-3">
              {(['light', 'dark', 'system'] as const).map((mode) => (
                <motion.button
                  key={mode}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onThemeModeChange(mode)}
                  className={cn(
                    "flex-1 py-4 rounded-2xl text-sm font-medium transition-all flex items-center justify-center gap-2 min-h-[56px]",
                    themeMode === mode
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  )}
                >
                  {mode === 'light' && <Sun className="w-5 h-5" />}
                  {mode === 'dark' && <Moon className="w-5 h-5" />}
                  {mode === 'system' && <Monitor className="w-5 h-5" />}
                  {t(`${mode}Mode`)}
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
          <div className="p-5">
            <div className="flex gap-3">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <motion.button
                  key={size}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onFontSizeChange(size)}
                  className={cn(
                    "flex-1 py-4 rounded-2xl font-medium transition-all min-h-[56px]",
                    fontSize === size
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted',
                    size === 'small' && 'text-xs',
                    size === 'medium' && 'text-sm',
                    size === 'large' && 'text-base'
                  )}
                >
                  {t(size === 'medium' ? 'mediumSize' : size)}
                </motion.button>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  // Customization View - with optimized animations (no delays, fast transitions)
  if (currentView === 'customization') {
    return (
      <motion.div
        key="customization"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="space-y-5"
      >
        <BackButton title={t('customization')} />
        <h1 className="text-xl font-bold text-foreground">{t('customization')}</h1>

        {/* Layout & View */}
        <GlassCard className="!p-0 overflow-hidden">
          <div className="settings-group-header">
            <span className="settings-group-title">{t('layoutView')}</span>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-xs text-muted-foreground mb-3">{t('taskViewMode')}</p>
            <div className="flex gap-3">
              {(['compact', 'standard', 'cards'] as TaskViewMode[]).map((mode) => (
                <motion.button
                  key={mode}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSettingsChange({ taskViewMode: mode })}
                  className={cn(
                    "flex-1 py-4 rounded-2xl text-sm font-medium flex flex-col items-center gap-2 min-h-[72px] transition-colors duration-100",
                    appSettings.taskViewMode === mode
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-muted/50 text-muted-foreground active:bg-muted'
                  )}
                >
                  {mode === 'compact' && <LayoutList className="w-5 h-5" />}
                  {mode === 'standard' && <LayoutList className="w-5 h-5" />}
                  {mode === 'cards' && <LayoutGrid className="w-5 h-5" />}
                  <span className="text-xs">{t(mode)}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Size & Density */}
        <GlassCard className="!p-0 overflow-hidden">
          <div className="settings-group-header">
            <span className="settings-group-title">{t('sizeDensity')}</span>
          </div>
          <div className="p-5 space-y-5">
            <div>
              <p className="text-xs text-muted-foreground mb-3">{t('textSize')}</p>
              <div className="flex gap-3">
                {(['small', 'normal', 'large'] as TextSize[]).map((size) => (
                  <motion.button
                    key={size}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSettingsChange({ textSize: size })}
                    className={cn(
                      "flex-1 py-3.5 rounded-2xl font-medium min-h-[52px] transition-colors duration-100",
                      appSettings.textSize === size
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted/50 text-muted-foreground active:bg-muted',
                      size === 'small' && 'text-xs',
                      size === 'normal' && 'text-sm',
                      size === 'large' && 'text-base'
                    )}
                  >
                    A
                  </motion.button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-3">{t('uiDensity')}</p>
              <div className="flex gap-3">
                {(['compact', 'normal'] as UIDensity[]).map((density) => (
                  <motion.button
                    key={density}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSettingsChange({ uiDensity: density })}
                    className={cn(
                      "flex-1 py-3.5 rounded-2xl text-sm font-medium min-h-[52px] transition-colors duration-100",
                      appSettings.uiDensity === density
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted/50 text-muted-foreground active:bg-muted'
                    )}
                  >
                    {t(density)}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Colors & Accents */}
        <GlassCard className="!p-0 overflow-hidden">
          <div className="settings-group-header">
            <span className="settings-group-title">{t('colorsAccents')}</span>
          </div>
          <SettingsRow 
            icon={Palette} 
            label={t('accentColor')} 
            onClick={() => setShowColorPicker(true)}
          >
            <div 
              className="w-6 h-6 rounded-full border-2 border-border"
              style={{ backgroundColor: appSettings.accentColor }}
            />
          </SettingsRow>
        </GlassCard>

        {/* Accessibility */}
        <GlassCard className="!p-0 overflow-hidden">
          <div className="settings-group-header">
            <span className="settings-group-title">{t('accessibility')}</span>
          </div>
          <div className="settings-row">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <div>
                <span className="text-sm text-foreground">{t('reducedMotion')}</span>
                <p className="text-xs text-muted-foreground">{t('reducedMotionDesc')}</p>
              </div>
            </div>
            <Toggle 
              enabled={appSettings.reducedMotion} 
              onChange={() => onSettingsChange({ reducedMotion: !appSettings.reducedMotion })} 
            />
          </div>
        </GlassCard>

        {/* Navigation Position */}
        <GlassCard className="!p-0 overflow-hidden">
          <div className="settings-group-header">
            <span className="settings-group-title">{t('navPosition')}</span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-3">
              {(['bottom', 'top', 'left', 'right'] as const).map((pos) => (
                <motion.button
                  key={pos}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSettingsChange({ navPosition: pos })}
                  className={cn(
                    "py-4 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 min-h-[56px] transition-colors duration-100",
                    appSettings.navPosition === pos
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-muted/50 text-muted-foreground active:bg-muted'
                  )}
                >
                  {t(pos)}
                </motion.button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Reset Options */}
        <GlassCard className="!p-0 overflow-hidden">
          <div className="settings-group-header">
            <span className="settings-group-title">{t('resetOptions')}</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onResetSettings('colors')}
            className="w-full settings-row settings-row-clickable"
          >
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-foreground">{t('resetColors')}</span>
            </div>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onResetSettings('layout')}
            className="w-full settings-row settings-row-clickable"
          >
            <div className="flex items-center gap-3">
              <LayoutGrid className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-foreground">{t('resetLayout')}</span>
            </div>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onResetSettings('all')}
            className="w-full settings-row settings-row-clickable"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-destructive" />
              <span className="text-sm text-destructive font-medium">{t('resetAll')}</span>
            </div>
          </motion.button>
        </GlassCard>
      </motion.div>
    );
  }

  // Privacy & Data View
  if (currentView === 'privacy') {
    return (
      <motion.div
        key="privacy"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="space-y-5"
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
      exit={{ opacity: 0 }}
      variants={containerVariants}
      className="space-y-5"
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
          <SettingsRow 
            icon={Sliders} 
            label={t('customization')} 
            onClick={() => setCurrentView('customization')} 
          />
        </GlassCard>
      </motion.div>

      {/* Notifications Section */}
      <motion.div variants={itemVariants}>
        <p className="section-header">{t('notifications')}</p>
        <GlassCard className="!p-0 overflow-hidden">
          <div className="settings-row">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <div>
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
            <div className="flex items-center gap-3 mb-3">
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
            value="1.4.0"
            onClick={() => setCurrentView('software')} 
          />
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};
