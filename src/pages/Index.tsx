import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  Target,
  Sparkles,
  TrendingUp,
  Calendar,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { Navigation } from '@/components/Navigation';
import { GlassCard } from '@/components/GlassCard';
import { TaskCard } from '@/components/TaskCard';
import { MoodSelector } from '@/components/MoodSelector';
import { MoodCard } from '@/components/MoodCard';
import { StatsCard } from '@/components/StatsCard';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { PointsAnimation } from '@/components/PointsAnimation';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { SettingsPage } from '@/components/SettingsPage';
import { Task, MoodEntry, MoodType, JournalEntry, MOOD_EMOJIS } from '@/types';
import { cn } from '@/lib/utils';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [todayMood, setTodayMood] = useState<MoodType | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [journalText, setJournalText] = useState('');
  const [searchTags, setSearchTags] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'card'>('card');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Settings
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Apply font size
  useEffect(() => {
    const sizes = { small: '14px', medium: '16px', large: '18px' };
    document.documentElement.style.fontSize = sizes[fontSize];
  }, [fontSize]);

  const completedToday = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed);
  const todayTasks = tasks.filter(t => 
    format(t.dueDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const filteredTasks = filterCategory === 'all' 
    ? tasks 
    : tasks.filter(t => t.category === filterCategory);

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
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleAddTask = useCallback((task: Omit<Task, 'id' | 'completed' | 'completedAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false,
    };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const handleMoodSelect = useCallback((mood: MoodType) => {
    setTodayMood(mood);
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood,
    };
    setMoods(prev => [newEntry, ...prev.filter(m => 
      format(m.date, 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')
    )]);
  }, []);

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
  }, [journalText]);

  const filteredJournalEntries = searchTags
    ? journalEntries.filter(e => 
        e.tags.some(tag => tag.toLowerCase().includes(searchTags.toLowerCase())) ||
        e.text.toLowerCase().includes(searchTags.toLowerCase())
      )
    : journalEntries;

  const greetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen pb-28 relative">
      {/* Mesh Background */}
      <div className="mesh-background" />

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
      />

      {/* Floating Action Button */}
      {activeTab !== 'settings' && (
        <FloatingActionButton onClick={() => setIsAddTaskOpen(true)} />
      )}

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 pt-6 pb-4">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Header */}
              <div>
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-muted-foreground text-sm"
                >
                  {format(new Date(), 'EEEE, MMMM d')}
                </motion.p>
                <motion.h1 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-bold text-foreground mt-1"
                >
                  {greetingMessage()} ✨
                </motion.h1>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <StatsCard
                  title="Points"
                  value={totalPoints}
                  icon={Zap}
                  gradient="from-primary to-blue-600"
                  delay={0}
                />
                <StatsCard
                  title="Streak"
                  value={`${streak} 🔥`}
                  icon={Flame}
                  subtitle="days"
                  gradient="from-secondary to-rose-500"
                  delay={0.1}
                />
              </div>

              {/* Today's Mood */}
              <GlassCard className="!p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-primary" />
                    How are you feeling?
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
                <MoodSelector selectedMood={todayMood} onSelect={handleMoodSelect} />
              </GlassCard>

              {/* Today's Tasks */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-primary" />
                    Today's Tasks
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {completedToday}/{todayTasks.length}
                  </span>
                </div>
                
                {/* Progress Bar */}
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
                    />
                  ))}
                  
                  {todayTasks.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No tasks for today</p>
                      <p className="text-xs mt-1">Tap + to add your first task</p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Recent Moods */}
              {moods.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3 text-sm">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Recent Moods
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {moods.slice(0, 4).map((entry, index) => (
                      <MoodCard key={entry.id} entry={entry} index={index} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode(viewMode === 'list' ? 'card' : 'list')}
                    className="p-2 rounded-xl bg-muted/50"
                  >
                    <Filter className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                </div>
              </div>

              {/* Filter Pills */}
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
                    {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </motion.button>
                ))}
              </div>

              {/* Pending Tasks */}
              {filteredTasks.filter(t => !t.completed).length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                    Pending ({filteredTasks.filter(t => !t.completed).length})
                  </h3>
                  <div className="space-y-2">
                    {filteredTasks.filter(t => !t.completed).map((task, index) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        index={index}
                        onComplete={handleCompleteTask}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Tasks */}
              {filteredTasks.filter(t => t.completed).length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                    Completed ({filteredTasks.filter(t => t.completed).length})
                  </h3>
                  <div className="space-y-2">
                    {filteredTasks.filter(t => t.completed).map((task, index) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        index={index}
                        onComplete={handleCompleteTask}
                        onDelete={handleDeleteTask}
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
                  <p>No tasks yet</p>
                  <p className="text-sm mt-1">Tap + to add your first task</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'mood' && (
            <motion.div
              key="mood"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <h1 className="text-2xl font-bold text-foreground">Mood Tracker</h1>

              <GlassCard className="!p-5">
                <h3 className="font-semibold text-foreground mb-4 text-sm">Today's Mood</h3>
                <MoodSelector selectedMood={todayMood} onSelect={handleMoodSelect} />
              </GlassCard>

              <div>
                <h3 className="font-semibold text-foreground mb-3 text-sm">Mood History</h3>
                {moods.length > 0 ? (
                  <div className="space-y-2">
                    {moods.map((entry, index) => (
                      <MoodCard key={entry.id} entry={entry} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sparkles className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No mood entries yet</p>
                    <p className="text-xs mt-1">Track your first mood above</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <h1 className="text-2xl font-bold text-foreground">Journal</h1>
              
              <GlassCard className="!p-4">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Quick Note</h3>
                <textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="What's on your mind? Use #tags to organize..."
                  className="w-full h-24 px-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveJournal}
                  disabled={!journalText.trim()}
                  className="mt-3 glass-button-primary w-full py-3 disabled:opacity-50"
                >
                  Save Entry
                </motion.button>
              </GlassCard>

              {/* Search */}
              {journalEntries.length > 0 && (
                <input
                  type="text"
                  value={searchTags}
                  onChange={(e) => setSearchTags(e.target.value)}
                  placeholder="Search by tags or text..."
                  className="w-full px-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary outline-none text-foreground placeholder:text-muted-foreground text-sm"
                />
              )}

              {/* Entries */}
              <div className="space-y-3">
                {filteredJournalEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GlassCard className="!p-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        {format(entry.date, 'MMM d, h:mm a')}
                      </p>
                      <p className="text-foreground text-sm">{entry.text}</p>
                      {entry.tags.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {entry.tags.map(tag => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </GlassCard>
                  </motion.div>
                ))}
              </div>

              {journalEntries.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">Your journal entries will appear here</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              darkMode={darkMode}
              onDarkModeChange={setDarkMode}
              notifications={notifications}
              onNotificationsChange={setNotifications}
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              stats={{
                totalPoints,
                streak,
                tasksCompleted: tasks.filter(t => t.completed).length,
              }}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;