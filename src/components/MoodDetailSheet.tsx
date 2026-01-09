import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle2, Calendar } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';
import { enUS, Locale } from 'date-fns/locale';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { GlassCard } from './GlassCard';
import { MoodEntry, MoodType, MOOD_EMOJIS, Task } from '@/types';
import { cn } from '@/lib/utils';

interface MoodDetailSheetProps {
  moods: MoodEntry[];
  tasks: Task[];
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
  locale?: Locale;
}

const moodValues: Record<MoodType, number> = {
  amazing: 5,
  good: 4,
  okay: 3,
  bad: 2,
  terrible: 1,
};

const moodColors: Record<MoodType, string> = {
  amazing: 'from-emerald-500 to-emerald-300',
  good: 'from-sky-500 to-sky-300',
  okay: 'from-amber-500 to-amber-300',
  bad: 'from-orange-500 to-orange-300',
  terrible: 'from-rose-500 to-rose-300',
};

export const MoodDetailSheet = ({ 
  moods, 
  tasks, 
  isOpen, 
  onClose, 
  t, 
  locale = enUS 
}: MoodDetailSheetProps) => {
  // Calculate 30-day mood data
  const last30DaysData = useMemo(() => {
    const data: { date: Date; mood: MoodType | null; value: number; tasksCompleted: number }[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const moodEntry = moods.find(m => isSameDay(new Date(m.date), date));
      const tasksOnDay = tasks.filter(t => 
        t.completed && t.completedAt && isSameDay(new Date(t.completedAt), date)
      ).length;

      data.push({
        date,
        mood: moodEntry?.mood || null,
        value: moodEntry ? moodValues[moodEntry.mood] : 0,
        tasksCompleted: tasksOnDay,
      });
    }

    return data;
  }, [moods, tasks]);

  // Calculate average mood
  const averageMood = useMemo(() => {
    const moodsWithData = last30DaysData.filter(d => d.mood !== null);
    if (moodsWithData.length === 0) return 0;
    const sum = moodsWithData.reduce((acc, d) => acc + d.value, 0);
    return sum / moodsWithData.length;
  }, [last30DaysData]);

  // Days tracked
  const daysTracked = useMemo(() => {
    return last30DaysData.filter(d => d.mood !== null).length;
  }, [last30DaysData]);

  // Mood frequency
  const moodFrequency = useMemo(() => {
    const freq: Record<MoodType, number> = {
      amazing: 0,
      good: 0,
      okay: 0,
      bad: 0,
      terrible: 0,
    };
    moods.slice(0, 30).forEach(m => {
      freq[m.mood]++;
    });
    return freq;
  }, [moods]);

  // Get tasks linked to moods
  const getMoodTasks = (moodEntry: MoodEntry) => {
    if (!moodEntry.completedTaskIds?.length) return [];
    return tasks.filter(t => moodEntry.completedTaskIds?.includes(t.id));
  };

  const getMoodLabel = (mood: MoodType) => t(mood);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="bottom" 
        className="h-[90vh] overflow-y-auto rounded-t-3xl border-t border-border/50 bg-background/95 backdrop-blur-xl"
      >
        <SheetHeader className="mb-4">
          <SheetTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            {t('moodInsights')}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {/* 30-Day Trend Chart */}
          <GlassCard className="!p-4">
            <h3 className="font-semibold text-foreground mb-3 text-sm">{t('last30Days')}</h3>
            <div className="flex items-end justify-between gap-0.5 h-24">
              {last30DaysData.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: day.mood ? `${(day.value / 5) * 100}%` : '8px' }}
                  transition={{ delay: index * 0.015, duration: 0.3, ease: 'easeOut' }}
                  className={cn(
                    "flex-1 rounded-sm min-h-[4px]",
                    day.mood 
                      ? `bg-gradient-to-t ${moodColors[day.mood]}` 
                      : "bg-muted/30"
                  )}
                  title={format(day.date, 'MMM d', { locale })}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
              <span>{format(subDays(new Date(), 29), 'MMM d', { locale })}</span>
              <span>{t('today')}</span>
            </div>
          </GlassCard>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2">
            <GlassCard className="!p-3 text-center">
              <p className="text-lg font-bold text-foreground">{daysTracked}</p>
              <p className="text-[9px] text-muted-foreground">{t('daysTracked')}</p>
            </GlassCard>
            <GlassCard className="!p-3 text-center">
              <p className="text-lg font-bold text-foreground">{averageMood.toFixed(1)}</p>
              <p className="text-[9px] text-muted-foreground">{t('averageMood')}</p>
            </GlassCard>
            <GlassCard className="!p-3 text-center">
              <p className="text-lg font-bold text-foreground">
                {Math.round((daysTracked / 30) * 100)}%
              </p>
              <p className="text-[9px] text-muted-foreground">{t('consistency')}</p>
            </GlassCard>
          </div>

          {/* Mood Frequency */}
          <GlassCard className="!p-4">
            <h3 className="font-semibold text-foreground mb-3 text-sm">{t('moodDistribution')}</h3>
            <div className="space-y-2">
              {(Object.keys(moodFrequency) as MoodType[]).map((mood) => (
                <div key={mood} className="flex items-center gap-3">
                  <span className="text-lg">{MOOD_EMOJIS[mood]}</span>
                  <span className="text-sm text-foreground flex-1">{getMoodLabel(mood)}</span>
                  <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(moodFrequency[mood] / Math.max(daysTracked, 1)) * 100}%` }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className={`h-full bg-gradient-to-r ${moodColors[mood]} rounded-full`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">
                    {moodFrequency[mood]}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Recent Moods with Connected Tasks */}
          <GlassCard className="!p-4">
            <h3 className="font-semibold text-foreground mb-3 text-sm">{t('recentMoodsWithTasks')}</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {moods.slice(0, 10).map((entry, index) => {
                const linkedTasks = getMoodTasks(entry);
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "p-3 rounded-xl",
                      `bg-gradient-to-r ${moodColors[entry.mood]}/20`
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{MOOD_EMOJIS[entry.mood]}</span>
                      <span className="font-medium text-sm text-foreground">
                        {getMoodLabel(entry.mood)}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-auto flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(entry.date), 'MMM d', { locale })}
                      </span>
                    </div>
                    
                    {entry.note && (
                      <p className="text-xs text-foreground/70 mb-2 line-clamp-2">
                        {entry.note}
                      </p>
                    )}

                    {linkedTasks.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {linkedTasks.slice(0, 3).map((task) => (
                          <div 
                            key={task.id} 
                            className="flex items-center gap-2 text-xs text-foreground/60"
                          >
                            <CheckCircle2 className="w-3 h-3 text-primary" />
                            <span className="truncate">{task.title}</span>
                          </div>
                        ))}
                        {linkedTasks.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{linkedTasks.length - 3} {t('more')}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </SheetContent>
    </Sheet>
  );
};
