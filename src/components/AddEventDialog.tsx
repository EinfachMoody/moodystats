import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { CalendarEvent } from './EventDetailSheet';
import { cn } from '@/lib/utils';

interface AddEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: Omit<CalendarEvent, 'id'>) => void;
  selectedDate?: Date;
  t: (key: string) => string;
}

export const AddEventDialog = ({ isOpen, onClose, onAdd, selectedDate, t }: AddEventDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(selectedDate || new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [isAllDay, setIsAllDay] = useState(false);
  const [location, setLocation] = useState('');
  const [reminder, setReminder] = useState(15);

  const handleSubmit = () => {
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      startTime: isAllDay ? undefined : startTime,
      endTime: isAllDay ? undefined : endTime,
      isAllDay,
      location: location.trim() || undefined,
      reminder,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDate(selectedDate || new Date());
    setStartTime('09:00');
    setEndTime('10:00');
    setIsAllDay(false);
    setLocation('');
    setReminder(15);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto"
          >
            <div className="bg-background/95 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/30">
                <h2 className="text-lg font-semibold text-foreground">{t('addNewEvent')}</h2>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Title */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    {t('eventTitle')}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('whatIsHappening')}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    {t('description')}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('optionalDetails')}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {t('date')}
                  </label>
                  <input
                    type="date"
                    value={format(date, 'yyyy-MM-dd')}
                    onChange={(e) => setDate(new Date(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground"
                  />
                </div>

                {/* All Day Toggle */}
                <div className="flex items-center justify-between">
                  <label className="text-sm text-foreground">{t('allDay')}</label>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAllDay(!isAllDay)}
                    className={cn(
                      'w-12 h-7 rounded-full transition-colors relative',
                      isAllDay ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <motion.div
                      layout
                      className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
                      animate={{ left: isAllDay ? 26 : 4 }}
                    />
                  </motion.button>
                </div>

                {/* Time */}
                <AnimatePresence>
                  {!isAllDay && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-2 gap-3"
                    >
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          {t('startTime')}
                        </label>
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          {t('endTime')}
                        </label>
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Location */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {t('location')}
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={t('addLocation')}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {/* Reminder */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5" />
                    {t('reminder')}
                  </label>
                  <select
                    value={reminder}
                    onChange={(e) => setReminder(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground"
                  >
                    <option value={0}>{t('noReminder')}</option>
                    <option value={5}>5 {t('minutes')}</option>
                    <option value={10}>10 {t('minutes')}</option>
                    <option value={15}>15 {t('minutes')}</option>
                    <option value={30}>30 {t('minutes')}</option>
                    <option value={60}>1 {t('hour')}</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border/30 flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-muted/50 text-foreground font-medium transition-colors hover:bg-muted"
                >
                  {t('cancel')}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={!title.trim()}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium transition-colors disabled:opacity-50"
                >
                  {t('addEvent')}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
