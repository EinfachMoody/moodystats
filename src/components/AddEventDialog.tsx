import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Repeat, AlignLeft } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { CalendarEvent, TaskCategory, RepeatType } from '@/types';
import { cn } from '@/lib/utils';

interface AddEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: Omit<CalendarEvent, 'id' | 'type'>) => void;
  t: (key: string) => string;
  initialDate?: Date;
}

export const AddEventDialog = ({ isOpen, onClose, onAdd, t, initialDate }: AddEventDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(initialDate ? initialDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [isAllDay, setIsAllDay] = useState(false);
  const [repeat, setRepeat] = useState<RepeatType>('none');
  const [category, setCategory] = useState<TaskCategory>('personal');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setStartTime('09:00');
    setEndTime('10:00');
    setIsAllDay(false);
    setRepeat('none');
    setCategory('personal');
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      date: new Date(date),
      startTime: isAllDay ? undefined : startTime,
      endTime: isAllDay ? undefined : endTime,
      isAllDay,
      repeat,
      category,
    });
    
    resetForm();
    onClose();
  };

  const categories: TaskCategory[] = ['work', 'personal', 'health', 'other'];
  const repeatOptions: RepeatType[] = ['none', 'daily', 'weekly', 'monthly'];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-lg"
          onClick={e => e.stopPropagation()}
        >
          <GlassCard className="rounded-b-none !p-5 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">{t('addEvent')}</h2>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-muted/50"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            </div>

            {/* Title Input */}
            <div className="mb-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('eventTitle')}
                className="w-full px-4 py-3 bg-muted/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlignLeft className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t('description')}</span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('optionalDetails')}
                rows={2}
                className="w-full px-4 py-3 bg-muted/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            {/* Date */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t('dueDate')}</span>
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-muted/50 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* All Day Toggle */}
            <div className="mb-4">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAllDay(!isAllDay)}
                className={cn(
                  'w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  isAllDay ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground'
                )}
              >
                {t('allDay')}
              </motion.button>
            </div>

            {/* Time Inputs */}
            {!isAllDay && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{t('startTime')}</span>
                  </div>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 bg-muted/50 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{t('endTime')}</span>
                  </div>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 bg-muted/50 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            )}

            {/* Category */}
            <div className="mb-4">
              <span className="text-sm text-muted-foreground mb-2 block">{t('category')}</span>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <motion.button
                    key={cat}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                      category === cat
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground'
                    )}
                  >
                    {t(cat)}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Repeat */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Repeat className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t('repeat')}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {repeatOptions.map((opt) => (
                  <motion.button
                    key={opt}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRepeat(opt)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                      repeat === opt
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground'
                    )}
                  >
                    {t(opt === 'none' ? 'never' : opt)}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-muted/50 text-muted-foreground font-medium"
              >
                {t('cancel')}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!title.trim()}
                className={cn(
                  'flex-1 py-3 rounded-xl font-medium transition-colors',
                  title.trim()
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/30 text-muted-foreground'
                )}
              >
                {t('addEvent')}
              </motion.button>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};