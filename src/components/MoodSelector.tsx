import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodType, MOOD_EMOJIS, Task } from '@/types';
import { cn } from '@/lib/utils';
import { FileText, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { triggerHaptic } from '@/hooks/useHapticFeedback';

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onSelect: (mood: MoodType, note?: string, completedTaskIds?: string[]) => void;
  t?: (key: string) => string;
  completedTodayTasks?: Task[];
}

const moodGradients: Record<MoodType, string> = {
  amazing: 'from-emerald-400 to-teal-400',
  good: 'from-sky-400 to-blue-400',
  okay: 'from-amber-400 to-yellow-400',
  bad: 'from-orange-400 to-amber-500',
  terrible: 'from-rose-400 to-pink-400',
};

const fallbackLabels: Record<MoodType, string> = {
  amazing: 'Amazing',
  good: 'Good',
  okay: 'Okay',
  bad: 'Bad',
  terrible: 'Terrible',
};

const moods: MoodType[] = ['terrible', 'bad', 'okay', 'good', 'amazing'];

export const MoodSelector = ({ selectedMood, onSelect, t, completedTodayTasks = [] }: MoodSelectorProps) => {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState('');
  const [pendingMood, setPendingMood] = useState<MoodType | null>(null);
  const [showTasks, setShowTasks] = useState(false);

  const getMoodLabel = (mood: MoodType) => {
    if (t) return t(mood);
    return fallbackLabels[mood];
  };

  const handleMoodClick = (mood: MoodType) => {
    if (selectedMood === mood) {
      // Toggle note input if same mood clicked again
      setShowNoteInput(!showNoteInput);
      setPendingMood(mood);
    } else {
      setPendingMood(mood);
      setShowNoteInput(true);
    }
  };

  const handleConfirm = () => {
    if (pendingMood) {
      const completedIds = completedTodayTasks.map(task => task.id);
      onSelect(pendingMood, note.trim() || undefined, completedIds.length > 0 ? completedIds : undefined);
      setNote('');
      setShowNoteInput(false);
      setPendingMood(null);
    }
  };

  const handleQuickSelect = (mood: MoodType) => {
    triggerHaptic('light');
    if (!showNoteInput) {
      const completedIds = completedTodayTasks.map(task => task.id);
      onSelect(mood, undefined, completedIds.length > 0 ? completedIds : undefined);
    } else {
      handleMoodClick(mood);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-3">
        {moods.map((mood) => (
          <motion.button
            key={mood}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickSelect(mood)}
            onDoubleClick={() => handleMoodClick(mood)}
            className={cn(
              'relative flex flex-col items-center gap-2 p-3 rounded-2xl transition-colors duration-200',
              (selectedMood === mood || pendingMood === mood)
                ? `bg-gradient-to-br ${moodGradients[mood]} shadow-lg`
                : 'glass-card hover:shadow-glass-lg'
            )}
          >
            <span className="text-3xl">{MOOD_EMOJIS[mood]}</span>
            <span className={cn(
              'text-xs font-medium',
              (selectedMood === mood || pendingMood === mood) ? 'text-white' : 'text-muted-foreground'
            )}>
              {getMoodLabel(mood)}
            </span>
            
            {(selectedMood === mood || pendingMood === mood) && (
              <motion.div
                layoutId="mood-indicator"
                className="absolute -bottom-1 w-2 h-2 rounded-full bg-white"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Note Input Section */}
      <AnimatePresence>
        {showNoteInput && pendingMood && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 rounded-2xl bg-muted/30 space-y-3">
              {/* Note Input */}
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-muted-foreground mt-2.5" />
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t ? t('moodNote') : 'Add a note about how you feel...'}
                  className="glass-input flex-1 min-h-[60px] resize-none text-sm"
                />
              </div>

              {/* Completed Tasks Today */}
              {completedTodayTasks.length > 0 && (
                <div>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowTasks(!showTasks)}
                    className="flex items-center gap-2 text-xs text-muted-foreground w-full"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                    <span>{completedTodayTasks.length} {t ? t('tasksCompletedToday') : 'tasks completed today'}</span>
                    {showTasks ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
                  </motion.button>
                  
                  <AnimatePresence>
                    {showTasks && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 space-y-1 overflow-hidden"
                      >
                        {completedTodayTasks.slice(0, 5).map((task) => (
                          <div key={task.id} className="flex items-center gap-2 text-xs text-muted-foreground pl-5">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span className="truncate">{task.title}</span>
                          </div>
                        ))}
                        {completedTodayTasks.length > 5 && (
                          <div className="text-xs text-muted-foreground pl-5">
                            +{completedTodayTasks.length - 5} {t ? t('more') : 'more'}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Confirm Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirm}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
              >
                {t ? t('saveMood') : 'Save Mood'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
