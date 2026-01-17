import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  Target,
  Sparkles,
  TrendingUp,
  Calendar,
  Filter,
  Search,
  LayoutGrid,
  FolderPlus
} from 'lucide-react';
import { format, Locale } from 'date-fns';
import { de, enUS, fr, es, it, nl } from 'date-fns/locale';
import { Navigation } from '@/components/Navigation';
import { GlassCard } from '@/components/GlassCard';
import { TaskCard, DraggableTaskList } from '@/components/TaskCard';
import { MoodSelector } from '@/components/MoodSelector';
import { MoodCard } from '@/components/MoodCard';
import { StatsCard } from '@/components/StatsCard';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { PointsAnimation } from '@/components/PointsAnimation';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { SettingsPage } from '@/components/SettingsPage';
import { CalendarView } from '@/components/CalendarView';
import { StatsPage } from '@/components/StatsPage';
import { UndoToast } from '@/components/UndoToast';
import { FocusTasks } from '@/components/FocusTasks';
import { PageManager } from '@/components/PageManager';
import { TaskDetailSheet } from '@/components/TaskDetailSheet';
import { TaskSearch } from '@/components/TaskSearch';
import { MoodDetailSheet } from '@/components/MoodDetailSheet';
import { Task, MoodEntry, MoodType, JournalEntry, MOOD_EMOJIS, TaskPage, AppSettings, DEFAULT_SETTINGS, CalendarEvent } from '@/types';
import { Language } from '@/i18n/translations';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

const dateLocales: Record<string, Locale> = { de, en: enUS, fr, es, it, nl };

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Persistent state with localStorage
  const [tasks, setTasks] = useLocalStorage<Task[]>('dailyflow-tasks', []);
  const [moods, setMoods] = useLocalStorage<MoodEntry[]>('dailyflow-moods', []);
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>('dailyflow-journal', []);
  const [totalPoints, setTotalPoints] = useLocalStorage<number>('dailyflow-points', 0);
  const [streak, setStreak] = useLocalStorage<number>('dailyflow-streak', 0);
  const [taskPages, setTaskPages] = useLocalStorage<TaskPage[]>('dailyflow-pages', []);
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>('dailyflow-events', []);
  const [appSettings, setAppSettings] = useLocalStorage<AppSettings>('dailyflow-settings', DEFAULT_SETTINGS);
  
  // Settings with localStorage
  const [language, setLanguage] = useLocalStorage<Language>('dailyflow-language', 'en');
  const [themeMode, setThemeMode] = useLocalStorage<'light' | 'dark' | 'system'>('dailyflow-themeMode', 'system');
  const [notifications, setNotifications] = useLocalStorage<boolean>('dailyflow-notifications', true);
  const [fontSize, setFontSize] = useLocalStorage<'small' | 'medium' | 'large'>('dailyflow-fontSize', 'medium');
  const [defaultReminder, setDefaultReminder] = useLocalStorage<number>('dailyflow-reminder', 15);
  
  // Non-persistent UI state
  const [todayMood, setTodayMood] = useState<MoodType | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [journalText, setJournalText] = useState('');
  const [searchTags, setSearchTags] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'card'>('card');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [deletedTask, setDeletedTask] = useState<Task | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showPageManager, setShowPageManager] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [searchFilteredTasks, setSearchFilteredTasks] = useState<Task[] | null>(null);
  const [showMoodDetail, setShowMoodDetail] = useState(false);

  const { t, isRTL } = useTranslation(language);
  const dateLocale = dateLocales[language] || enUS;

  // Determine dark mode from theme mode
  const darkMode = themeMode === 'dark' || 
    (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Apply RTL
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  // Apply font size
  useEffect(() => {
    const sizes = { small: '14px', medium: '16px', large: '18px' };
    document.documentElement.style.fontSize = sizes[fontSize];
  }, [fontSize]);

  // Apply glass intensity
  useEffect(() => {
    const intensities = { light: '0.6', normal: '1', strong: '1.4' };
    document.documentElement.style.setProperty('--glass-intensity', intensities[appSettings.glassIntensity]);
  }, [appSettings.glassIntensity]);

  // Apply accent color
  useEffect(() => {
    if (appSettings.accentColor) {
      // Convert hex to HSL for CSS variable
      const hex = appSettings.accentColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }
      document.documentElement.style.setProperty('--primary', `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`);
    }
  }, [appSettings.accentColor]);

  // Check for today's mood
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayEntry = moods.find(m => format(new Date(m.date), 'yyyy-MM-dd') === today);
    if (todayEntry) {
      setTodayMood(todayEntry.mood);
    }
  }, [moods]);

  const completedTasksCount = useMemo(() => tasks.filter(t => t.completed).length, [tasks]);
  const pendingTasksCount = useMemo(() => tasks.filter(t => !t.completed).length, [tasks]);

  // NOTE: keep existing behavior ("completedToday" currently represents total completed tasks)
  const completedToday = completedTasksCount;

  const todayTasks = useMemo(() => (
    tasks.filter(t => format(new Date(t.dueDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
  ), [tasks]);

  const focusTasks = useMemo(() => (
    tasks.filter(t => t.isFocus && !t.completed)
  ), [tasks]);

  const filteredTasks = useMemo(() => {
    if (selectedPageId) return tasks.filter(t => t.pageId === selectedPageId);
    if (filterCategory === 'all') return tasks;
    return tasks.filter(t => t.category === filterCategory);
  }, [tasks, selectedPageId, filterCategory]);

  const handleCompleteTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id && !task.completed) {
        setEarnedPoints(task.points);
        setShowPoints(true);
        setTotalPoints(p => p + task.points);
        return { ...task, completed: true, completedAt: new Date() };
      }
      if (task.id === id && task.completed) {
        setTotalPoints(p => p - task.points);
        return { ...task, completed: false, completedAt: undefined };
      }
      return task;
    }));
  }, [setTasks, setTotalPoints]);

  const handleDeleteTask = useCallback((id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete) {
      setDeletedTask(taskToDelete);
      setShowUndoToast(true);
      setTasks(prev => prev.filter(t => t.id !== id));
      
      setTimeout(() => {
        setShowUndoToast(false);
        setDeletedTask(null);
      }, 5000);
    }
  }, [tasks, setTasks]);

  const handleUndoDelete = useCallback(() => {
    if (deletedTask) {
      setTasks(prev => [deletedTask, ...prev]);
      setDeletedTask(null);
      setShowUndoToast(false);
    }
  }, [deletedTask, setTasks]);

  const handleAddTask = useCallback((task: Omit<Task, 'id' | 'completed' | 'completedAt'>) => {
    if (isAddingTask) return;
    setIsAddingTask(true);
    
    const newTask: Task = {
      ...task,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      completed: false,
      order: tasks.length,
      pageId: selectedPageId || undefined,
    };
    setTasks(prev => [newTask, ...prev]);
    
    setTimeout(() => setIsAddingTask(false), 500);
  }, [setTasks, isAddingTask, tasks.length, selectedPageId]);

  const handleUpdateTask = useCallback((updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setShowTaskDetail(false);
    setSelectedTask(null);
  }, [setTasks]);

  const handleDuplicateTask = useCallback((task: Task) => {
    const duplicatedTask: Task = {
      ...task,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      completed: false,
      completedAt: undefined,
      title: `${task.title} (copy)`,
      order: tasks.length,
    };
    setTasks(prev => [duplicatedTask, ...prev]);
  }, [tasks.length, setTasks]);

  const handleReorderTasks = useCallback((reorderedTasks: Task[]) => {
    setTasks(prev => {
      const taskIds = new Set(reorderedTasks.map(t => t.id));
      const otherTasks = prev.filter(t => !taskIds.has(t.id));
      return [...reorderedTasks.map((t, i) => ({ ...t, order: i })), ...otherTasks];
    });
  }, [setTasks]);

  const handleToggleFocus = useCallback((taskId: string) => {
    const currentFocusCount = tasks.filter(t => t.isFocus && !t.completed).length;
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        if (t.isFocus) {
          return { ...t, isFocus: false };
        } else if (currentFocusCount < 3) {
          return { ...t, isFocus: true };
        }
      }
      return t;
    }));
  }, [tasks, setTasks]);

  const handleMoodSelect = useCallback((mood: MoodType) => {
    setTodayMood(mood);
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood,
    };
    setMoods(prev => [newEntry, ...prev.filter(m => 
      format(new Date(m.date), 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')
    )]);
  }, [setMoods]);

  const handleSaveJournal = useCallback(() => {
    if (!journalText.trim()) return;
    
    const tags = journalText.match(/#\w+/g)?.map(t => t.slice(1)) || [];
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      text: journalText.trim(),
      tags,
    };
    setJournalEntries(prev => [newEntry, ...prev]);
    setJournalText('');
  }, [journalText, setJournalEntries]);

  const handleAddPage = useCallback((page: Omit<TaskPage, 'id' | 'order' | 'createdAt'>) => {
    const newPage: TaskPage = {
      ...page,
      id: `page-${Date.now()}`,
      order: taskPages.length,
      createdAt: new Date(),
    };
    setTaskPages(prev => [...prev, newPage]);
  }, [taskPages, setTaskPages]);

  const handleReorderPages = useCallback((reorderedPages: TaskPage[]) => {
    setTaskPages(reorderedPages);
  }, [setTaskPages]);

  const handleUpdatePage = useCallback((updatedPage: TaskPage) => {
    setTaskPages(prev => prev.map(p => p.id === updatedPage.id ? updatedPage : p));
  }, [setTaskPages]);

  const handleDeletePage = useCallback((pageId: string) => {
    setTaskPages(prev => prev.filter(p => p.id !== pageId));
    setTasks(prev => prev.map(t => t.pageId === pageId ? { ...t, pageId: undefined } : t));
    if (selectedPageId === pageId) setSelectedPageId(null);
  }, [setTaskPages, setTasks, selectedPageId]);

  const handleSettingsChange = useCallback((newSettings: Partial<AppSettings>) => {
    setAppSettings(prev => ({ ...prev, ...newSettings }));
  }, [setAppSettings]);

  const handleResetSettings = useCallback((type: 'colors' | 'layout' | 'all') => {
    if (type === 'all') {
      setAppSettings(DEFAULT_SETTINGS);
    } else if (type === 'colors') {
      setAppSettings(prev => ({
        ...prev,
        accentColor: DEFAULT_SETTINGS.accentColor,
        glassIntensity: DEFAULT_SETTINGS.glassIntensity,
      }));
    } else if (type === 'layout') {
      setAppSettings(prev => ({
        ...prev,
        taskViewMode: DEFAULT_SETTINGS.taskViewMode,
        textSize: DEFAULT_SETTINGS.textSize,
        uiDensity: DEFAULT_SETTINGS.uiDensity,
      }));
    }
  }, [setAppSettings]);

  // Event handlers
  const handleAddEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setEvents(prev => [newEvent, ...prev]);
  }, [setEvents]);

  const handleUpdateEvent = useCallback((updatedEvent: CalendarEvent) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  }, [setEvents]);

  const handleDeleteEvent = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  }, [setEvents]);

  const filteredJournalEntries = searchTags
    ? journalEntries.filter(e => 
        e.tags.some(tag => tag.toLowerCase().includes(searchTags.toLowerCase())) ||
        e.text.toLowerCase().includes(searchTags.toLowerCase())
      )
    : journalEntries;

  const greetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 17) return t('goodAfternoon');
    return t('goodEvening');
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      all: t('all'),
      work: t('work'),
      personal: t('personal'),
      health: t('health'),
      other: t('other'),
    };
    return labels[cat] || cat;
  };

  // Layout padding based on nav position - improved spacing for all positions
  const getLayoutClasses = () => {
    switch (appSettings.navPosition) {
      case 'top':
        return 'pt-24 pb-8';
      case 'left':
        return 'pl-24 pr-4 pt-6 pb-6';
      case 'right':
        return 'pr-24 pl-4 pt-6 pb-6';
      default: // bottom
        return 'pb-28 pt-6';
    }
  };

  const getMainClasses = () => {
    const isVerticalNav = appSettings.navPosition === 'left' || appSettings.navPosition === 'right';
    if (isVerticalNav) {
      return 'max-w-2xl mx-auto px-3';
    }
    return 'max-w-lg mx-auto px-4';
  };

  const getFabPosition = () => {
    switch (appSettings.navPosition) {
      case 'top':
        return { bottom: 24, right: isRTL ? undefined : 24, left: isRTL ? 24 : undefined };
      case 'left':
        return { bottom: 24, right: isRTL ? undefined : 24, left: isRTL ? 24 : undefined };
      case 'right':
        return { bottom: 24, left: isRTL ? undefined : 24, right: isRTL ? 24 : undefined };
      default: // bottom
        return { bottom: 100, right: isRTL ? undefined : 24, left: isRTL ? 24 : undefined };
    }
  };

  return (
    <div className={cn("min-h-screen relative safe-area-top", getLayoutClasses(), isRTL && "rtl")} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mesh Background */}
      <div className="mesh-background" />

      {/* Undo Toast */}
      <UndoToast
        show={showUndoToast}
        message={t('taskDeleted')}
        undoLabel={t('undo')}
        onUndo={handleUndoDelete}
        onDismiss={() => { setShowUndoToast(false); setDeletedTask(null); }}
      />

      {/* Points Animation */}
      <PointsAnimation 
        points={earnedPoints} 
        show={showPoints} 
        onComplete={() => setShowPoints(false)} 
      />

      {/* Add Task Dialog */}
      <AddTaskDialog 
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAdd={handleAddTask}
        t={t}
        language={language}
      />

      {/* Task Detail Sheet */}
      <TaskDetailSheet
        task={selectedTask}
        isOpen={showTaskDetail}
        onClose={() => { setShowTaskDetail(false); setSelectedTask(null); }}
        onSave={handleUpdateTask}
        onDelete={(id) => { handleDeleteTask(id); setShowTaskDetail(false); setSelectedTask(null); }}
        onDuplicate={handleDuplicateTask}
        t={t}
      />

      {/* Mood Detail Sheet */}
      <MoodDetailSheet
        moods={moods}
        tasks={tasks}
        isOpen={showMoodDetail}
        onClose={() => setShowMoodDetail(false)}
        t={t}
        locale={dateLocale}
      />

      {/* Page Manager Sheet */}
      <PageManager
        pages={taskPages}
        isOpen={showPageManager}
        onClose={() => setShowPageManager(false)}
        onAddPage={handleAddPage}
        onUpdatePage={handleUpdatePage}
        onDeletePage={handleDeletePage}
        onReorderPages={handleReorderPages}
        t={t}
      />

      {/* Floating Action Button */}
      {activeTab !== 'settings' && (
        <FloatingActionButton 
          onClick={() => setIsAddTaskOpen(true)} 
          isRTL={isRTL} 
          customPosition={getFabPosition()}
        />
      )}

      {/* Main Content */}
      <main className={getMainClasses()}>
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="space-y-5"
            >
              {/* Header */}
              <div>
                <p className="text-muted-foreground text-sm">
                  {format(new Date(), 'EEEE, MMMM d', { locale: dateLocale })}
                </p>
                <h1 className="text-2xl font-bold text-foreground mt-1">
                  {greetingMessage()} ✨
                </h1>
              </div>

              {/* Stats Grid - Enhanced */}
              <div className="grid grid-cols-2 gap-3">
                <StatsCard
                  title={t('points')}
                  value={totalPoints}
                  icon={Zap}
                  gradient="from-primary to-blue-600"
                  delay={0}
                />
                <StatsCard
                  title={t('dayStreak')}
                  value={`${streak} 🔥`}
                  icon={Flame}
                  subtitle={t('days')}
                  gradient="from-secondary to-rose-500"
                  delay={0.1}
                />
              </div>

              {/* Quick Overview Row */}
              <div className="grid grid-cols-3 gap-2">
                <GlassCard className="!p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{pendingTasksCount}</p>
                  <p className="text-[9px] text-muted-foreground">{t('pending')}</p>
                </GlassCard>
                <GlassCard className="!p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{todayTasks.length}</p>
                  <p className="text-[9px] text-muted-foreground">{t('today')}</p>
                </GlassCard>
                <GlassCard className="!p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{completedTasksCount}</p>
                  <p className="text-[9px] text-muted-foreground">{t('completed')}</p>
                </GlassCard>
              </div>

              {/* Focus Tasks */}
              {focusTasks.length > 0 && (
                <FocusTasks
                  tasks={focusTasks}
                  onComplete={handleCompleteTask}
                  onRemoveFocus={handleToggleFocus}
                  t={t}
                />
              )}

              {/* Today's Mood */}
              <GlassCard className="!p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-primary" />
                    {t('howAreYouFeeling')}
                  </h3>
                  {todayMood && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-2xl"
                    >
                      {MOOD_EMOJIS[todayMood]}
                    </motion.span>
                  )}
                </div>
                <MoodSelector selectedMood={todayMood} onSelect={handleMoodSelect} t={t} />
              </GlassCard>

              {/* Today's Tasks */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-primary" />
                    {t('todaysTasks')}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {completedToday}/{todayTasks.length}
                  </span>
                </div>
                
                {todayTasks.length > 0 && (
                  <div className="h-1.5 bg-muted rounded-full mb-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedToday / Math.max(todayTasks.length, 1)) * 100}%` }}
                      transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  {todayTasks.slice(0, 5).map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={index}
                      onComplete={handleCompleteTask}
                      onDelete={handleDeleteTask}
                      onClick={() => { setSelectedTask(task); setShowTaskDetail(true); }}
                      viewMode={appSettings.taskViewMode}
                    />
                  ))}
                  
                  {todayTasks.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">{t('noTasksToday')}</p>
                      <p className="text-xs mt-1">{t('tapToAddFirst')}</p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Recent Moods */}
              {moods.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3 text-sm">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    {t('recentMoods')}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {moods.slice(0, 4).map((entry, index) => (
                      <MoodCard key={entry.id} entry={entry} index={index} locale={dateLocale} t={t} />
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Tasks Preview */}
              {tasks.filter(t => !t.completed && new Date(t.dueDate) > new Date()).length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    {t('upcoming')}
                  </h3>
                  <GlassCard className="!p-3">
                    <div className="space-y-2">
                      {tasks
                        .filter(t => !t.completed && new Date(t.dueDate) > new Date())
                        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                        .slice(0, 3)
                        .map((task) => (
                          <div key={task.id} className="flex items-center gap-3 py-1.5">
                            <div 
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: task.pageId ? taskPages.find(p => p.id === task.pageId)?.accentColor : 'hsl(var(--primary))' }}
                            />
                            <span className="text-sm flex-1 truncate">{task.title}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {format(new Date(task.dueDate), 'MMM d', { locale: dateLocale })}
                            </span>
                          </div>
                        ))}
                    </div>
                  </GlassCard>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">{t('tasks')}</h1>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPageManager(true)}
                    className="p-2 rounded-xl bg-muted/50"
                  >
                    <FolderPlus className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode(viewMode === 'list' ? 'card' : 'list')}
                    className="p-2 rounded-xl bg-muted/50"
                  >
                    <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                </div>
              </div>

              {/* Task Search */}
              <TaskSearch
                tasks={tasks}
                onSearch={(filtered) => setSearchFilteredTasks(filtered)}
                onClear={() => setSearchFilteredTasks(null)}
                t={t}
                isRTL={isRTL}
              />

              {/* Pages Pills */}
              {taskPages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedPageId(null)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                      selectedPageId === null
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground'
                    )}
                  >
                    {t('all')}
                  </motion.button>
                  {taskPages.map((page) => (
                    <motion.button
                      key={page.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPageId(page.id)}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2',
                        selectedPageId === page.id
                          ? 'text-white'
                          : 'bg-muted/50 text-muted-foreground'
                      )}
                      style={{
                        backgroundColor: selectedPageId === page.id ? page.accentColor : undefined,
                      }}
                    >
                      <span 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: page.accentColor }}
                      />
                      {page.name}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Filter Pills */}
              {!selectedPageId && (
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                  {['all', 'work', 'personal', 'health', 'other'].map((cat) => (
                    <motion.button
                      key={cat}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilterCategory(cat)}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                        filterCategory === cat
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/50 text-muted-foreground'
                      )}
                    >
                      {getCategoryLabel(cat)}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Pending Tasks */}
              {filteredTasks.filter(t => !t.completed).length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                    {t('pending')} ({filteredTasks.filter(t => !t.completed).length})
                  </h3>
                  <DraggableTaskList
                    tasks={filteredTasks.filter(t => !t.completed)}
                    onReorder={(reordered) => handleReorderTasks(reordered)}
                    onComplete={handleCompleteTask}
                    onDelete={handleDeleteTask}
                    onClick={(task) => { setSelectedTask(task); setShowTaskDetail(true); }}
                    onDuplicate={handleDuplicateTask}
                    onToggleFocus={handleToggleFocus}
                    viewMode={appSettings.taskViewMode}
                  />
                </div>
              )}

              {/* Completed Tasks */}
              {filteredTasks.filter(t => t.completed).length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                    {t('completed')} ({filteredTasks.filter(t => t.completed).length})
                  </h3>
                  <div className="space-y-2">
                    {filteredTasks.filter(t => t.completed).map((task, index) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        index={index}
                        onComplete={handleCompleteTask}
                        onDelete={handleDeleteTask}
                        onClick={() => { setSelectedTask(task); setShowTaskDetail(true); }}
                        viewMode={appSettings.taskViewMode}
                      />
                    ))}
                  </div>
                </div>
              )}

              {tasks.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-muted-foreground"
                >
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>{t('noTasksYet')}</p>
                  <p className="text-sm mt-1">{t('tapToAddFirst')}</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <CalendarView
                tasks={tasks}
                events={events}
                language={language}
                t={t}
                onAddTask={() => setIsAddTaskOpen(true)}
                onAddEvent={handleAddEvent}
                onSelectTask={(task) => { setSelectedTask(task); setShowTaskDetail(true); }}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <StatsPage
                tasks={tasks}
                moods={moods}
                totalPoints={totalPoints}
                streak={streak}
                t={t}
                locale={dateLocale}
                isRTL={isRTL}
              />
            </motion.div>
          )}

          {activeTab === 'mood' && (
            <motion.div
              key="mood"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="space-y-5"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">{t('moodTracker')}</h1>
                {moods.length >= 3 && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMoodDetail(true)}
                    className="text-xs text-primary font-medium"
                  >
                    {t('moodInsights')}
                  </motion.button>
                )}
              </div>

              <GlassCard className="!p-5">
                <h3 className="font-semibold text-foreground mb-4 text-sm">{t('todaysMood')}</h3>
                <MoodSelector selectedMood={todayMood} onSelect={handleMoodSelect} t={t} />
              </GlassCard>

              {/* Mood Overview/Trend */}
              {moods.length >= 3 && (
                <GlassCard className="!p-4">
                  <h3 className="font-semibold text-foreground mb-3 text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    {t('moodOverview')}
                  </h3>
                  <div className="flex items-end justify-between gap-2 h-20">
                    {moods.slice(0, 7).reverse().map((mood) => {
                      const moodHeight: Record<string, number> = {
                        amazing: 100, good: 80, okay: 60, bad: 40, terrible: 20
                      };
                      return (
                        <div
                          key={mood.id}
                          className={cn(
                            "flex-1 rounded-lg flex items-end justify-center pb-1 transition-all duration-300",
                            mood.mood === 'amazing' && "bg-gradient-to-t from-emerald-500 to-emerald-300",
                            mood.mood === 'good' && "bg-gradient-to-t from-sky-500 to-sky-300",
                            mood.mood === 'okay' && "bg-gradient-to-t from-amber-500 to-amber-300",
                            mood.mood === 'bad' && "bg-gradient-to-t from-orange-500 to-orange-300",
                            mood.mood === 'terrible' && "bg-gradient-to-t from-rose-500 to-rose-300"
                          )}
                          style={{ height: `${moodHeight[mood.mood]}%` }}
                        >
                          <span className="text-xs">{MOOD_EMOJIS[mood.mood]}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center mt-2">
                    {t('recentMoods')} ({moods.length} {t('days').toLowerCase()})
                  </p>
                </GlassCard>
              )}

              {/* Mood History */}
              <div>
                <h3 className="font-semibold text-foreground mb-3 text-sm">{t('moodHistory')}</h3>
                {moods.length > 0 ? (
                  <div className="space-y-2">
                    {moods.map((entry, index) => (
                      <MoodCard key={entry.id} entry={entry} index={index} locale={dateLocale} t={t} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sparkles className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{t('noMoodEntriesYet')}</p>
                    <p className="text-xs mt-1">{t('trackYourFirstMood')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="space-y-5"
            >
              <h1 className="text-2xl font-bold text-foreground">{t('journal')}</h1>
              
              <GlassCard className="!p-4">
                <h3 className="font-semibold text-foreground mb-3 text-sm">{t('quickNote')}</h3>
                <textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder={t('whatsOnYourMind')}
                  className="w-full h-24 px-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground text-sm"
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveJournal}
                  disabled={!journalText.trim()}
                  className="mt-3 glass-button-primary w-full py-3 disabled:opacity-50"
                >
                  {t('saveEntry')}
                </motion.button>
              </GlassCard>

              {/* Search */}
              <div className="relative">
                <Search className={cn(
                  "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                  isRTL ? "right-4" : "left-4"
                )} />
                <input
                  type="text"
                  value={searchTags}
                  onChange={(e) => setSearchTags(e.target.value)}
                  placeholder={t('searchByTags')}
                  className={cn(
                    "w-full py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm",
                    isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                  )}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Entries */}
              <div>
                <h3 className="font-semibold text-foreground mb-3 text-sm">{t('yourEntries')}</h3>
                {filteredJournalEntries.length > 0 ? (
                  <div className="space-y-2">
                    {filteredJournalEntries.map((entry) => (
                      <GlassCard key={entry.id} className="!p-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          {format(new Date(entry.date), 'PPP', { locale: dateLocale })}
                        </p>
                        <p className="text-foreground text-sm leading-relaxed">{entry.text}</p>
                        {entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {entry.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </GlassCard>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sparkles className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{t('noEntriesYet')}</p>
                    <p className="text-xs mt-1">{t('startWriting')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <SettingsPage
                darkMode={darkMode}
                onDarkModeChange={(value) => setThemeMode(value ? 'dark' : 'light')}
                themeMode={themeMode}
                onThemeModeChange={setThemeMode}
                notifications={notifications}
                onNotificationsChange={setNotifications}
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
                language={language}
                onLanguageChange={setLanguage}
                defaultReminder={defaultReminder}
                onDefaultReminderChange={setDefaultReminder}
                appSettings={appSettings}
                onSettingsChange={handleSettingsChange}
                onResetSettings={handleResetSettings}
                stats={{
                  totalPoints,
                  streak,
                  tasksCompleted: completedTasksCount,
                }}
                t={t}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        t={t}
        isRTL={isRTL}
        position={appSettings.navPosition}
        reducedMotion={appSettings.reducedMotion}
      />
    </div>
  );
};

export default Index;
