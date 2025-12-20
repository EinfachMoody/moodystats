import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Zap, 
  Flame, 
  CheckCircle2,
  Calendar,
  Clock
} from 'lucide-react';
import { format, startOfWeek, eachDayOfInterval, subDays, isToday } from 'date-fns';
import { GlassCard } from './GlassCard';
import { Task, MoodEntry, MoodType, MOOD_EMOJIS } from '@/types';
import { cn } from '@/lib/utils';
import { Locale } from 'date-fns';

interface StatsPageProps {
  tasks: Task[];
  moods: MoodEntry[];
  totalPoints: number;
  streak: number;
  t: (key: string) => string;
  locale: Locale;
  isRTL?: boolean;
}

export const StatsPage = ({ 
  tasks, 
  moods, 
  totalPoints, 
  streak, 
  t, 
  locale,
  isRTL = false 
}: StatsPageProps) => {
  // Calculate stats
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  
  // Weekly data
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: today });
  
  // Tasks per day this week
  const weeklyData = weekDays.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const completed = completedTasks.filter(t => 
      format(new Date(t.completedAt || t.dueDate), 'yyyy-MM-dd') === dayStr
    ).length;
    return {
      day: format(day, 'EEE', { locale }),
      date: day,
      completed,
      isToday: isToday(day),
    };
  });

  const maxCompleted = Math.max(...weeklyData.map(d => d.completed), 1);

  // Mood distribution
  const moodCounts: Record<MoodType, number> = {
    amazing: 0,
    good: 0,
    okay: 0,
    bad: 0,
    terrible: 0,
  };
  
  moods.slice(0, 30).forEach(m => {
    moodCounts[m.mood]++;
  });

  const totalMoods = Object.values(moodCounts).reduce((a, b) => a + b, 0);

  // Category distribution
  const categoryStats = {
    work: completedTasks.filter(t => t.category === 'work').length,
    personal: completedTasks.filter(t => t.category === 'personal').length,
    health: completedTasks.filter(t => t.category === 'health').length,
    other: completedTasks.filter(t => t.category === 'other').length,
  };

  const totalCategoryTasks = Object.values(categoryStats).reduce((a, b) => a + b, 0) || 1;

  // Productivity score (simple algorithm)
  const productivityScore = Math.min(100, Math.round(
    (completedTasks.length / Math.max(tasks.length, 1)) * 50 +
    (streak * 5) +
    (totalPoints / 100)
  ));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      key="stats"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
      variants={containerVariants}
      className="space-y-5"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <motion.h1 
        variants={itemVariants}
        className="text-2xl font-bold text-foreground flex items-center gap-2"
      >
        <BarChart3 className="w-6 h-6 text-primary" />
        {t('statistics')}
      </motion.h1>

      {/* Main Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
        <GlassCard className="!p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-blue-600">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalPoints}</p>
              <p className="text-xs text-muted-foreground">{t('totalPoints')}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-secondary to-rose-500">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{streak}</p>
              <p className="text-xs text-muted-foreground">{t('dayStreak')}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent to-emerald-500">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{completedTasks.length}</p>
              <p className="text-xs text-muted-foreground">{t('tasksCompleted')}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{productivityScore}%</p>
              <p className="text-xs text-muted-foreground">{t('productivity')}</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Weekly Chart */}
      <motion.div variants={itemVariants}>
        <GlassCard className="!p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">{t('thisWeek')}</h3>
          </div>
          
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyData.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div className="flex-1 w-full flex items-end justify-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.completed / maxCompleted) * 100}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.6, ease: 'easeOut' }}
                    className={cn(
                      "w-full max-w-[28px] rounded-lg min-h-[4px]",
                      day.isToday 
                        ? "bg-gradient-to-t from-primary to-primary/70" 
                        : "bg-muted-foreground/20"
                    )}
                    style={{ 
                      boxShadow: day.isToday ? '0 4px 12px hsl(var(--primary) / 0.3)' : 'none' 
                    }}
                  />
                </div>
                <span className={cn(
                  "text-[10px] font-medium",
                  day.isToday ? "text-primary" : "text-muted-foreground"
                )}>
                  {day.day}
                </span>
                {day.completed > 0 && (
                  <span className="text-[10px] text-muted-foreground">
                    {day.completed}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Mood Distribution */}
      {totalMoods > 0 && (
        <motion.div variants={itemVariants}>
          <GlassCard className="!p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">😊</span>
              <h3 className="font-semibold text-foreground text-sm">{t('moodOverview')}</h3>
            </div>
            
            <div className="space-y-3">
              {(Object.entries(moodCounts) as [MoodType, number][])
                .filter(([_, count]) => count > 0)
                .sort((a, b) => b[1] - a[1])
                .map(([mood, count]) => (
                  <div key={mood} className="flex items-center gap-3">
                    <span className="text-xl w-8">{MOOD_EMOJIS[mood]}</span>
                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / totalMoods) * 100}%` }}
                          transition={{ delay: 0.5, duration: 0.6 }}
                          className={cn(
                            "h-full rounded-full",
                            mood === 'amazing' && "bg-gradient-to-r from-accent to-emerald-400",
                            mood === 'good' && "bg-gradient-to-r from-primary to-blue-400",
                            mood === 'okay' && "bg-gradient-to-r from-yellow-500 to-amber-400",
                            mood === 'bad' && "bg-gradient-to-r from-secondary to-orange-400",
                            mood === 'terrible' && "bg-gradient-to-r from-destructive to-rose-400"
                          )}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground w-8 text-right">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Category Distribution */}
      {completedTasks.length > 0 && (
        <motion.div variants={itemVariants}>
          <GlassCard className="!p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">{t('byCategory')}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div 
                  key={category}
                  className={cn(
                    "p-3 rounded-xl",
                    category === 'work' && "bg-purple-500/10",
                    category === 'personal' && "bg-primary/10",
                    category === 'health' && "bg-accent/10",
                    category === 'other' && "bg-muted"
                  )}
                >
                  <p className="text-lg font-bold text-foreground">{count}</p>
                  <p className="text-xs text-muted-foreground capitalize">{t(category)}</p>
                  <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / totalCategoryTasks) * 100}%` }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className={cn(
                        "h-full rounded-full",
                        category === 'work' && "bg-purple-500",
                        category === 'personal' && "bg-primary",
                        category === 'health' && "bg-accent",
                        category === 'other' && "bg-muted-foreground"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && moods.length === 0 && (
        <motion.div variants={itemVariants}>
          <GlassCard className="!p-8 text-center">
            <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">{t('noDataYet')}</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              {t('startTracking')}
            </p>
          </GlassCard>
        </motion.div>
      )}
    </motion.div>
  );
};