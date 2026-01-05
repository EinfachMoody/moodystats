import { motion } from 'framer-motion';
import { MoodType, MOOD_EMOJIS } from '@/types';
import { cn } from '@/lib/utils';

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onSelect: (mood: MoodType) => void;
  t?: (key: string) => string;
}

const moodGradients: Record<MoodType, string> = {
  amazing: 'from-emerald-400 to-teal-400',
  good: 'from-sky-400 to-blue-400',
  okay: 'from-amber-400 to-yellow-400',
  bad: 'from-orange-400 to-amber-500',
  terrible: 'from-rose-400 to-pink-400',
};

// Default fallback labels (used if t is not provided)
const fallbackLabels: Record<MoodType, string> = {
  amazing: 'Amazing',
  good: 'Good',
  okay: 'Okay',
  bad: 'Bad',
  terrible: 'Terrible',
};

const moods: MoodType[] = ['terrible', 'bad', 'okay', 'good', 'amazing'];

export const MoodSelector = ({ selectedMood, onSelect, t }: MoodSelectorProps) => {
  const getMoodLabel = (mood: MoodType) => {
    if (t) return t(mood);
    return fallbackLabels[mood];
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {moods.map((mood, index) => (
        <motion.button
          key={mood}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          whileHover={{ scale: 1.15, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(mood)}
          className={cn(
            'relative flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300',
            selectedMood === mood
              ? `bg-gradient-to-br ${moodGradients[mood]} shadow-lg shadow-${mood === 'amazing' ? 'emerald' : mood === 'good' ? 'sky' : mood === 'okay' ? 'amber' : mood === 'bad' ? 'orange' : 'rose'}-500/30`
              : 'glass-card hover:shadow-glass-lg'
          )}
        >
          <span className="text-3xl">{MOOD_EMOJIS[mood]}</span>
          <span className={cn(
            'text-xs font-medium',
            selectedMood === mood ? 'text-white' : 'text-muted-foreground'
          )}>
            {getMoodLabel(mood)}
          </span>
          
          {selectedMood === mood && (
            <motion.div
              layoutId="mood-indicator"
              className="absolute -bottom-1 w-2 h-2 rounded-full bg-white"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};
