import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Zap, 
  Flame, 
  CheckCircle2,
  Calendar,
  Clock,
  Award,
  Activity,
  PieChart,
  ArrowUp,
  ArrowDown,
  Timer,
  Repeat,
  Star,
  Brain
} from 'lucide-react';
import { format, startOfWeek, eachDayOfInterval, isToday, subDays, startOfMonth, endOfMonth, isSameDay, differenceInDays, getHours } from 'date-fns';
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
  
  // Today's stats
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const todayCompleted = completedTasks.filter(t => 
    t.completedAt && format(new Date(t.completedAt), 'yyyy-MM-dd') === todayStr
  ).length;
  
  // Weekly data
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: today });
  
  // Tasks per day this week
  const weeklyData = weekDays.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const completed = completedTasks.filter(t => 
      t.completedAt && format(new Date(t.completedAt), 'yyyy-MM-dd') === dayStr
    ).length;
    return {
      day: format(day, 'EEE', { locale }),
      date: day,
      completed,
      isToday: isToday(day),
    };
  });

  const maxCompleted = Math.max(...weeklyData.map(d => d.completed), 1);
  const weeklyTotal = weeklyData.reduce((sum, d) => sum + d.completed, 0);
  const averagePerDay = weeklyData.length > 0 ? (weeklyTotal / weeklyData.length).toFixed(1) : '0';
  
  // Best day this week
  const bestDay = weeklyData.reduce((best, current) => 
    current.completed > best.completed ? current : best
  , weeklyData[0]);

  // Monthly progress
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const monthDays = eachDayOfInterval({ start: monthStart, end: today });
  const monthlyCompleted = completedTasks.filter(t => 
    t.completedAt && new Date(t.completedAt) >= monthStart && new Date(t.completedAt) <= today
  ).length;

  // Completion rate
  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;

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

  // Productivity score (improved algorithm)
  const productivityScore = Math.min(100, Math.round(
    (completionRate * 0.4) +
    (streak * 3) +
    (Math.min(todayCompleted * 5, 20)) +
    (weeklyTotal * 2)
  ));

  // Trend calculation (compare to last week)
  const lastWeekStart = subDays(weekStart, 7);
  const lastWeekCompleted = completedTasks.filter(t => {
    if (!t.completedAt) return false;
    const date = new Date(t.completedAt);
    return date >= lastWeekStart && date < weekStart;
  }).length;
  
  const weeklyTrend = lastWeekCompleted > 0 
    ? Math.round(((weeklyTotal - lastWeekCompleted) / lastWeekCompleted) * 100)
    : weeklyTotal > 0 ? 100 : 0;

  // NEW: Most productive time of day
  const hourlyStats: Record<number, number> = {};
  completedTasks.forEach(t => {
    if (t.completedAt) {
      const hour = getHours(new Date(t.completedAt));
      hourlyStats[hour] = (hourlyStats[hour] || 0) + 1;
    }
  });
  const mostProductiveHour = Object.entries(hourlyStats).sort((a, b) => b[1] - a[1])[0];
  const mostProductiveTime = mostProductiveHour 
    ? `${mostProductiveHour[0].padStart(2, '0')}:00` 
    : '--:--';

  // NEW: Focus task stats
  const focusTasksCompleted = completedTasks.filter(t => t.isFocus).length;

  // NEW: Recurring tasks stats
  const recurringTasks = tasks.filter(t => t.repeat !== 'none');
  const recurringCompleted = completedTasks.filter(t => t.repeat !== 'none').length;

  // NEW: Average task completion time (days from creation to completion)
  const taskDurations = completedTasks
    .filter(t => t.completedAt)
    .map(t => differenceInDays(new Date(t.completedAt!), new Date(t.dueDate)));
  const avgCompletionDays = taskDurations.length > 0
    ? (taskDurations.reduce((a, b) => a + b, 0) / taskDurations.length).toFixed(1)
    : '0';

  // NEW: Tasks overdue vs on-time
  const onTimeTasks = completedTasks.filter(t => 
    t.completedAt && new Date(t.completedAt) <= new Date(t.dueDate)
  ).length;
  const overdueTasks = completedTasks.length - onTimeTasks;
  const onTimeRate = completedTasks.length > 0 
    ? Math.round((onTimeTasks / completedTasks.length) * 100)
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <motion.div
      key="stats"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      variants={containerVariants}
      className="space-y-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <motion.h1 
        variants={itemVariants}
        className="text-2xl font-bold text-foreground flex items-center gap-2"
      >
        <BarChart3 className="w-6 h-6 text-primary" />
        {t('statistics')}
      </motion.h1>

      {/* Main Stats - 2x2 Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
        <GlassCard className="!p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-blue-600">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{totalPoints}</p>
              <p className="text-[10px] text-muted-foreground">{t('totalPoints')}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-secondary to-rose-500">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{streak}</p>
              <p className="text-[10px] text-muted-foreground">{t('dayStreak')}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-accent to-emerald-500">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{completedTasks.length}</p>
              <p className="text-[10px] text-muted-foreground">{t('tasksCompleted')}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <p className="text-xl font-bold text-foreground">{productivityScore}%</p>
              {weeklyTrend !== 0 && (
                <span className={cn(
                  "text-[10px] flex items-center",
                  weeklyTrend > 0 ? "text-accent" : "text-destructive"
                )}>
                  {weeklyTrend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {Math.abs(weeklyTrend)}%
                </span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">{t('productivity')}</p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Extended Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2">
        <GlassCard className="!p-3 text-center">
          <Activity className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{averagePerDay}</p>
          <p className="text-[9px] text-muted-foreground">{t('averagePerDay')}</p>
        </GlassCard>

        <GlassCard className="!p-3 text-center">
          <Award className="w-4 h-4 text-secondary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">
            {bestDay?.day || '-'}
          </p>
          <p className="text-[9px] text-muted-foreground">{t('bestDay')}</p>
        </GlassCard>

        <GlassCard className="!p-3 text-center">
          <PieChart className="w-4 h-4 text-accent mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{completionRate}%</p>
          <p className="text-[9px] text-muted-foreground">{t('completionRate')}</p>
        </GlassCard>
      </motion.div>

      {/* NEW: Extended Stats Row 2 */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2">
        <GlassCard className="!p-3 text-center">
          <Timer className="w-4 h-4 text-purple-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{mostProductiveTime}</p>
          <p className="text-[9px] text-muted-foreground">{t('mostProductiveTime')}</p>
        </GlassCard>

        <GlassCard className="!p-3 text-center">
          <Star className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{focusTasksCompleted}</p>
          <p className="text-[9px] text-muted-foreground">{t('dailyFocus')}</p>
        </GlassCard>

        <GlassCard className="!p-3 text-center">
          <Repeat className="w-4 h-4 text-teal-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{recurringCompleted}/{recurringTasks.length}</p>
          <p className="text-[9px] text-muted-foreground">{t('repeat')}</p>
        </GlassCard>
      </motion.div>

      {/* NEW: On-Time Performance */}
      <motion.div variants={itemVariants}>
        <GlassCard className="!p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-500" />
              <h3 className="font-semibold text-foreground text-sm">On-Time Performance</h3>
            </div>
            <span className="text-xs font-medium text-primary">{onTimeRate}%</span>
          </div>
          <div className="flex gap-2 mb-2">
            <div className="flex-1">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${onTimeRate}%` }}
                  transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-accent to-emerald-400"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>✅ On time: {onTimeTasks}</span>
            <span>⚠️ Overdue: {overdueTasks}</span>
          </div>
        </GlassCard>
      </motion.div>

      {/* Weekly Chart */}
      <motion.div variants={itemVariants}>
        <GlassCard className="!p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">{t('thisWeek')}</h3>
            </div>
            <span className="text-xs text-muted-foreground">
              {weeklyTotal} {t('tasksCompleted').toLowerCase()}
            </span>
          </div>
          
          <div className="flex items-end justify-between gap-2 h-28">
            {weeklyData.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className="flex-1 flex flex-col items-center gap-1.5"
              >
                <div className="flex-1 w-full flex items-end justify-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max((day.completed / maxCompleted) * 100, 4)}%` }}
                    transition={{ delay: 0.3 + index * 0.08, duration: 0.5, ease: 'easeOut' }}
                    className={cn(
                      "w-full max-w-[24px] rounded-lg",
                      day.isToday 
                        ? "bg-gradient-to-t from-primary to-primary/60" 
                        : day.completed > 0 
                        ? "bg-primary/30"
                        : "bg-muted-foreground/15"
                    )}
                    style={{ 
                      boxShadow: day.isToday && day.completed > 0 
                        ? '0 4px 12px hsl(var(--primary) / 0.3)' 
                        : 'none' 
                    }}
                  />
                </div>
                <span className={cn(
                  "text-[10px] font-medium",
                  day.isToday ? "text-primary" : "text-muted-foreground"
                )}>
                  {day.day}
                </span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Monthly Progress */}
      <motion.div variants={itemVariants}>
        <GlassCard className="!p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">{t('monthlyProgress')}</h3>
            </div>
            <span className="text-xs font-medium text-primary">{monthlyCompleted} {t('tasks').toLowerCase()}</span>
          </div>
          
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((monthlyCompleted / Math.max(tasks.length, 1)) * 100, 100)}%` }}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary"
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            {format(monthStart, 'MMMM yyyy', { locale })}
          </p>
        </GlassCard>
      </motion.div>

      {/* Mood Distribution */}
      {totalMoods > 0 && (
        <motion.div variants={itemVariants}>
          <GlassCard className="!p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">😊</span>
              <h3 className="font-semibold text-foreground text-sm">{t('moodOverview')}</h3>
            </div>
            
            <div className="space-y-2.5">
              {(Object.entries(moodCounts) as [MoodType, number][])
                .filter(([_, count]) => count > 0)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4)
                .map(([mood, count]) => (
                  <div key={mood} className="flex items-center gap-2.5">
                    <span className="text-lg w-7">{MOOD_EMOJIS[mood]}</span>
                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / totalMoods) * 100}%` }}
                          transition={{ delay: 0.5, duration: 0.5 }}
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
                    <span className="text-xs font-medium text-muted-foreground w-6 text-right">
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
          <GlassCard className="!p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">{t('byCategory')}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div 
                  key={category}
                  className={cn(
                    "p-2.5 rounded-xl",
                    category === 'work' && "bg-purple-500/10",
                    category === 'personal' && "bg-primary/10",
                    category === 'health' && "bg-accent/10",
                    category === 'other' && "bg-muted"
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs text-muted-foreground capitalize">{t(category)}</p>
                    <p className="text-sm font-bold text-foreground">{count}</p>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / totalCategoryTasks) * 100}%` }}
                      transition={{ delay: 0.6, duration: 0.4 }}
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

      {/* Insights Card */}
      {(completedTasks.length > 5 || streak > 2) && (
        <motion.div variants={itemVariants}>
          <GlassCard className="!p-4 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">{t('insights')}</h3>
            </div>
            <div className="space-y-2">
              {streak >= 3 && (
                <p className="text-xs text-muted-foreground">
                  🔥 {streak} {t('days')} streak! Keep it going!
                </p>
              )}
              {productivityScore >= 70 && (
                <p className="text-xs text-muted-foreground">
                  ⭐ Great productivity score this week!
                </p>
              )}
              {weeklyTrend > 20 && (
                <p className="text-xs text-muted-foreground">
                  📈 {weeklyTrend}% improvement over last week!
                </p>
              )}
              {bestDay && bestDay.completed >= 3 && (
                <p className="text-xs text-muted-foreground">
                  🏆 Best day: {bestDay.day} with {bestDay.completed} tasks!
                </p>
              )}
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
