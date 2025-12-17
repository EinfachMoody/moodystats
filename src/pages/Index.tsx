import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Zap, 
  Flame, 
  Trophy, 
  Target,
  Sparkles,
  TrendingUp
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
import { Task, MoodEntry, MoodType, MOOD_EMOJIS } from '@/types';

// Initial demo data
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project presentation',
    description: 'Finish the Q4 review slides',
    category: 'work',
    priority: 'high',
    dueDate: new Date(),
    completed: false,
    points: 30,
  },
  {
    id: '2',
    title: 'Morning workout',
    description: '30 min cardio + stretching',
    category: 'health',
    priority: 'medium',
    dueDate: new Date(),
    completed: true,
    completedAt: new Date(),
    points: 20,
  },
  {
    id: '3',
    title: 'Call mom',
    category: 'personal',
    priority: 'low',
    dueDate: new Date(),
    completed: false,
    points: 10,
  },
  {
    id: '4',
    title: 'Review code PR',
    description: 'Check the new feature implementation',
    category: 'work',
    priority: 'medium',
    dueDate: new Date(),
    completed: false,
    points: 20,
  },
];

const initialMoods: MoodEntry[] = [
  { id: '1', date: new Date(Date.now() - 86400000 * 2), mood: 'good', note: 'Had a productive day!' },
  { id: '2', date: new Date(Date.now() - 86400000), mood: 'amazing', note: 'Great workout and finished all tasks' },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [moods, setMoods] = useState<MoodEntry[]>(initialMoods);
  const [todayMood, setTodayMood] = useState<MoodType | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(150);
  const [streak, setStreak] = useState(7);

  const completedToday = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed);
  const todayTasks = tasks.filter(t => 
    format(t.dueDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

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

  const greetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen pb-24 relative">
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

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 pt-8 pb-4">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
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

                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAddTaskOpen(true)}
                  className="glass-button-primary !px-4 !py-2.5 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Task</span>
                </motion.button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <StatsCard
                  title="Total Points"
                  value={totalPoints}
                  icon={Zap}
                  trend="up"
                  trendValue="+20"
                  gradient="from-primary to-blue-600"
                  delay={0}
                />
                <StatsCard
                  title="Day Streak"
                  value={`${streak} 🔥`}
                  icon={Flame}
                  subtitle="Keep it up!"
                  gradient="from-secondary to-rose-500"
                  delay={0.1}
                />
              </div>

              {/* Today's Mood */}
              <GlassCard className="!p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Today's Tasks
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {completedToday}/{todayTasks.length} done
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-2 bg-muted rounded-full mb-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedToday / Math.max(todayTasks.length, 1)) * 100}%` }}
                    transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  />
                </div>

                <div className="space-y-3">
                  {todayTasks.map((task, index) => (
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
                      <p>No tasks for today!</p>
                      <button
                        onClick={() => setIsAddTaskOpen(true)}
                        className="text-primary font-medium mt-2 hover:underline"
                      >
                        Add your first task
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Recent Moods */}
              {moods.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Mood History
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
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
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">All Tasks</h1>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAddTaskOpen(true)}
                  className="glass-button-primary !px-4 !py-2.5 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </motion.button>
              </div>

              {/* Pending Tasks */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Pending ({pendingTasks.length})
                </h3>
                <div className="space-y-3">
                  {pendingTasks.map((task, index) => (
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

              {/* Completed Tasks */}
              {tasks.filter(t => t.completed).length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Completed ({tasks.filter(t => t.completed).length})
                  </h3>
                  <div className="space-y-3">
                    {tasks.filter(t => t.completed).map((task, index) => (
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
            </motion.div>
          )}

          {activeTab === 'mood' && (
            <motion.div
              key="mood"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h1 className="text-2xl font-bold text-foreground">Mood Tracker</h1>

              <GlassCard className="!p-6">
                <h3 className="font-semibold text-foreground mb-4">Today's Mood</h3>
                <MoodSelector selectedMood={todayMood} onSelect={handleMoodSelect} />
              </GlassCard>

              <div>
                <h3 className="font-semibold text-foreground mb-4">Mood History</h3>
                <div className="space-y-3">
                  {moods.map((entry, index) => (
                    <MoodCard key={entry.id} entry={entry} index={index} />
                  ))}
                </div>
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
              className="space-y-6"
            >
              <h1 className="text-2xl font-bold text-foreground">Journal</h1>
              
              <GlassCard className="!p-6">
                <h3 className="font-semibold text-foreground mb-4">Quick Note</h3>
                <textarea
                  placeholder="What's on your mind today?"
                  className="w-full h-32 px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 glass-button-primary w-full"
                >
                  Save Entry
                </motion.button>
              </GlassCard>

              <div className="text-center py-8 text-muted-foreground">
                <p>Your journal entries will appear here</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>

              <GlassCard className="!p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Notifications</h3>
                    <p className="text-sm text-muted-foreground">Daily reminders</p>
                  </div>
                  <div className="w-12 h-7 bg-primary rounded-full relative cursor-pointer">
                    <motion.div 
                      className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full shadow-md"
                      layout
                    />
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="!p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Animations</h3>
                    <p className="text-sm text-muted-foreground">Smooth transitions</p>
                  </div>
                  <div className="w-12 h-7 bg-primary rounded-full relative cursor-pointer">
                    <motion.div 
                      className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full shadow-md"
                      layout
                    />
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="!p-5">
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    Your Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 rounded-xl bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{totalPoints}</p>
                      <p className="text-xs text-muted-foreground">Total Points</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{streak}</p>
                      <p className="text-xs text-muted-foreground">Day Streak</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{tasks.filter(t => t.completed).length}</p>
                      <p className="text-xs text-muted-foreground">Tasks Done</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{moods.length}</p>
                      <p className="text-xs text-muted-foreground">Mood Entries</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
