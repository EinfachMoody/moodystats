import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  FileText, 
  Trash2,
  MapPin,
  Bell
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  isAllDay?: boolean;
  location?: string;
  reminder?: number;
  color?: string;
}

interface EventDetailSheetProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
  t: (key: string) => string;
}

export const EventDetailSheet = ({
  event,
  isOpen,
  onClose,
  onSave,
  onDelete,
  t,
}: EventDetailSheetProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [location, setLocation] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setStartTime(event.startTime || '');
      setEndTime(event.endTime || '');
      setIsAllDay(event.isAllDay || false);
      setLocation(event.location || '');
      setHasChanges(false);
    }
  }, [event]);

  const markChanged = useCallback(() => {
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!event) return;
    onSave({
      ...event,
      title: title.trim() || event.title,
      description: description.trim(),
      startTime: isAllDay ? undefined : startTime,
      endTime: isAllDay ? undefined : endTime,
      isAllDay,
      location: location.trim(),
    });
  }, [event, title, description, startTime, endTime, isAllDay, location, onSave]);

  const handleClose = useCallback(() => {
    if (hasChanges) {
      handleSave();
    }
    onClose();
  }, [hasChanges, handleSave, onClose]);

  if (!event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 28, 
              stiffness: 350,
              mass: 0.8
            }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 100px)' }}
          >
            <div className="glass-card rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Handle */}
              <div className="flex-shrink-0 pt-3 pb-2">
                <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto" />
              </div>
              
              {/* Header */}
              <div className="flex-shrink-0 px-6 pb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">{t('eventDetails')}</h2>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="p-2 rounded-xl bg-muted/50 text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 pb-safe overscroll-contain">
                {/* Title */}
                <div className="mb-4">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); markChanged(); }}
                    className="glass-input text-lg font-semibold"
                    placeholder={t('eventTitle')}
                  />
                </div>

                {/* Date Info */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1.5 rounded-xl text-xs font-medium bg-primary/10 text-primary">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {format(new Date(event.date), 'EEEE, d MMMM yyyy')}
                  </span>
                </div>

                {/* All Day Toggle */}
                <div className="mb-4 flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <span className="text-sm font-medium text-foreground">{t('allDay')}</span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setIsAllDay(!isAllDay); markChanged(); }}
                    className={cn(
                      "w-12 h-7 rounded-full transition-colors relative",
                      isAllDay ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <motion.div
                      animate={{ x: isAllDay ? 22 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
                    />
                  </motion.button>
                </div>

                {/* Time Selection */}
                {!isAllDay && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">{t('startTime')}</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => { setStartTime(e.target.value); markChanged(); }}
                          className="glass-input pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">{t('endTime')}</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => { setEndTime(e.target.value); markChanged(); }}
                          className="glass-input pl-10"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Location */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {t('location')}
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => { setLocation(e.target.value); markChanged(); }}
                    className="glass-input"
                    placeholder={t('addLocation')}
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {t('description')}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); markChanged(); }}
                    className="glass-input min-h-[80px] resize-none"
                    placeholder={t('optionalDetails')}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pb-8 pt-4 border-t border-border/30 mt-6">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onDelete(event.id);
                      onClose();
                    }}
                    className="glass-button-destructive flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('delete')}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="glass-button-primary flex-1"
                  >
                    {t('save')}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
