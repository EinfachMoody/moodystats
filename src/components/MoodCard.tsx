import { motion } from 'framer-motion';
import { MoodEntry, MOOD_EMOJIS, MoodType } from '@/types';
import { format } from 'date-fns';
import { enUS, Locale } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface MoodCardProps {
  entry: MoodEntry;
  index?: number;
  locale?: Locale;
  t?: (key: string) => string;
}

const moodGradients: Record<MoodType, string> = {
  amazing: 'mood-amazing',
  good: 'mood-good',
  okay: 'mood-okay',
  bad: 'mood-bad',
  terrible: 'mood-terrible',
};

// Default fallback labels (used if t is not provided)
const fallbackLabels: Record<MoodType, string> = {
  amazing: 'Amazing',
  good: 'Good',
  okay: 'Okay',
  bad: 'Bad',
  terrible: 'Terrible',
};

export const MoodCard = ({ entry, index = 0, locale = enUS, t }: MoodCardProps) => {
  const getMoodLabel = (mood: MoodType) => {
    if (t) return t(mood);
    return fallbackLabels[mood];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'p-4 rounded-2xl transition-all duration-200 cursor-pointer',
        moodGradients[entry.mood]
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">
          {MOOD_EMOJIS[entry.mood]}
        </span>
        
        <div className="flex-1">
          <p className="font-medium text-foreground/90">
            {getMoodLabel(entry.mood)}
          </p>
          <p className="text-xs text-foreground/60">
            {format(new Date(entry.date), 'EEEE, MMM d', { locale })}
          </p>
        </div>
      </div>
      
      {entry.note && (
        <p className="mt-2 text-sm text-foreground/70 line-clamp-2">
          {entry.note}
        </p>
      )}
    </motion.div>
  );
};
