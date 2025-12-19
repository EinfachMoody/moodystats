import { motion } from 'framer-motion';
import { MoodEntry, MOOD_EMOJIS, MOOD_LABELS } from '@/types';
import { format } from 'date-fns';
import { enUS, Locale } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface MoodCardProps {
  entry: MoodEntry;
  index?: number;
  locale?: Locale;
}

const moodGradients: Record<MoodEntry['mood'], string> = {
  amazing: 'mood-amazing',
  good: 'mood-good',
  okay: 'mood-okay',
  bad: 'mood-bad',
  terrible: 'mood-terrible',
};

export const MoodCard = ({ entry, index = 0, locale = enUS }: MoodCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={cn(
        'p-4 rounded-2xl transition-all duration-300 cursor-pointer',
        moodGradients[entry.mood]
      )}
    >
      <div className="flex items-center gap-3">
        <motion.span 
          className="text-3xl"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        >
          {MOOD_EMOJIS[entry.mood]}
        </motion.span>
        
        <div className="flex-1">
          <p className="font-medium text-foreground/90">
            {MOOD_LABELS[entry.mood]}
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
