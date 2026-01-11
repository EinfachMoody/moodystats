import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Repeat } from 'lucide-react';
import { Task, TaskCategory, TaskPriority, RepeatType } from '@/types';
import { Language } from '@/i18n/translations';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface AddTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'completed' | 'completedAt'>) => void;
  t: (key: string) => string;
  language: Language;
}

const categories: TaskCategory[] = ['work', 'personal', 'health', 'other'];
const priorities: TaskPriority[] = ['high', 'medium', 'low'];
const repeatOptions: RepeatType[] = ['none', 'daily', 'weekly', 'monthly'];

const categoryStyles: Record<TaskCategory, string> = {
  work: 'bg-purple-500',
  personal: 'bg-primary',
  health: 'bg-accent',
  other: 'bg-muted-foreground',
};

const priorityPoints: Record<TaskPriority, number> = {
  high: 30,
  medium: 20,
  low: 10,
};

export const AddTaskDialog = ({ isOpen, onClose, onAdd, t, language }: AddTaskDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('personal');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dueTime, setDueTime] = useState('');
  const [repeat, setRepeat] = useState<RepeatType>('none');
  const [isSaving, setIsSaving] = useState(false);

  const isRTL = false; // RTL disabled for now

  const getCategoryLabel = (cat: TaskCategory) => {
    const labels: Record<TaskCategory, string> = {
      work: t('work'),
      personal: t('personal'),
      health: t('health'),
      other: t('other'),
    };
    return labels[cat];
  };

  const getPriorityLabel = (p: TaskPriority) => {
    const labels: Record<TaskPriority, string> = {
      high: t('high'),
      medium: t('medium'),
      low: t('low'),
    };
    return labels[p];
  };

  const getRepeatLabel = (r: RepeatType) => {
    const labels: Record<RepeatType, string> = {
      none: t('never'),
      daily: t('daily'),
      weekly: t('weekly'),
      monthly: t('monthly'),
    };
    return labels[r];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSaving(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));

    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      dueDate: new Date(dueDate),
      dueTime: dueTime || undefined,
      repeat,
      points: priorityPoints[priority],
    });

    setTitle('');
    setDescription('');
    setCategory('personal');
    setPriority('medium');
    setDueDate(format(new Date(), 'yyyy-MM-dd'));
    setDueTime('');
    setRepeat('none');
    setIsSaving(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-md z-50"
          />

          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto",
              isSaving && "animate-pulse"
            )}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <motion.div 
              className="glass-card rounded-t-3xl rounded-b-none px-5 pt-5 pb-[calc(env(safe-area-inset-bottom)+6rem)]"
              animate={isSaving ? { scale: [1, 1.02, 0.98, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
              
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">{t('addNewTask')}</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {t('taskTitle')}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('whatNeedsToBeDone')}
                    className="w-full px-4 py-3.5 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground text-base"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {t('description')}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('optionalDetails')}
                    rows={2}
                    className="w-full px-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {t('category')}
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((cat) => (
                      <motion.button
                        key={cat}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCategory(cat)}
                        className={cn(
                          'px-4 py-2.5 rounded-2xl text-sm font-medium transition-all',
                          category === cat
                            ? `${categoryStyles[cat]} text-white shadow-lg`
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        )}
                      >
                        {getCategoryLabel(cat)}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {t('priority')}
                  </label>
                  <div className="flex gap-2">
                    {priorities.map((p) => (
                      <motion.button
                        key={p}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPriority(p)}
                        className={cn(
                          'flex-1 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all',
                          priority === p
                            ? 'bg-primary text-primary-foreground shadow-lg'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        )}
                      >
                        {getPriorityLabel(p)}
                        <span className="block text-xs opacity-70 mt-0.5">
                          +{priorityPoints[p]} pts
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {t('dueDate')}
                    </label>
                    <div className="relative">
                      <Calendar className={cn(
                        "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                        isRTL ? "right-4" : "left-4"
                      )} />
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className={cn(
                          "w-full py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground text-sm",
                          isRTL ? "pr-11 pl-3" : "pl-11 pr-3"
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {t('dueTime')}
                    </label>
                    <div className="relative">
                      <Clock className={cn(
                        "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                        isRTL ? "right-4" : "left-4"
                      )} />
                      <input
                        type="time"
                        value={dueTime}
                        onChange={(e) => setDueTime(e.target.value)}
                        className={cn(
                          "w-full py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground text-sm",
                          isRTL ? "pr-11 pl-3" : "pl-11 pr-3"
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Repeat className="w-4 h-4" />
                    {t('repeat')}
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {repeatOptions.map((r) => (
                      <motion.button
                        key={r}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setRepeat(r)}
                        className={cn(
                          'px-4 py-2 rounded-2xl text-sm font-medium transition-all',
                          repeat === r
                            ? 'bg-secondary text-secondary-foreground shadow-lg'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        )}
                      >
                        {getRepeatLabel(r)}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSaving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full glass-button-primary flex items-center justify-center gap-2 py-4 text-base font-semibold"
                >
                  {isSaving ? '...' : t('addTask')}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
