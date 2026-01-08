import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Plus,
  Circle,
  Square
} from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isToday,
  addDays
} from 'date-fns';
import { de, enUS, fr, es, it, nl } from 'date-fns/locale';
import { GlassCard } from './GlassCard';
import { EventDetailSheet, CalendarEvent } from './EventDetailSheet';
import { Task, CATEGORY_LABELS } from '@/types';
import { Language } from '@/i18n/translations';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  tasks: Task[];
  events: CalendarEvent[];
  language: Language;
  t: (key: string) => string;
  onAddTask: () => void;
  onSelectTask: (task: Task) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
}

type ViewMode = 'month' | 'week' | 'day';

const locales: Record<string, typeof enUS> = {
  de,
  en: enUS,
  fr,
  es,
  it,
  nl,
};

export const CalendarView = ({ 
  tasks,
  events,
  language, 
  t, 
  onAddTask,
  onSelectTask,
  onUpdateEvent,
  onDeleteEvent
}: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);

  const locale = locales[language] || enUS;
  const isRTL = false; // RTL disabled for now

  const days = useMemo(() => {
    if (viewMode === 'month') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
      const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
      return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    } else if (viewMode === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    }
    return [currentDate];
  }, [currentDate, viewMode]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end: addDays(start, 6) }).map(d => 
      format(d, 'EEEEE', { locale })
    );
  }, [locale]);

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(new Date(task.dueDate), date));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const selectedDateTasks = getTasksForDate(selectedDate);
  const selectedDateEvents = getEventsForDate(selectedDate);

  const navigate = (direction: 'prev' | 'next') => {
    if (viewMode === 'month') {
      setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    } else {
      setCurrentDate(direction === 'next' ? addDays(currentDate, 1) : addDays(currentDate, -1));
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      work: 'bg-purple-500',
      personal: 'bg-primary',
      health: 'bg-accent',
      other: 'bg-muted-foreground',
    };
    return colors[category] || colors.other;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <h1 className="text-2xl font-bold text-foreground">{t('calendar')}</h1>

      {/* View Mode Selector */}
      <div className="flex gap-2">
        {(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
          <motion.button
            key={mode}
            whileTap={{ scale: 0.96 }}
            onClick={() => setViewMode(mode)}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px]',
              viewMode === mode
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground'
            )}
          >
            {t(`${mode}View`)}
          </motion.button>
        ))}
      </div>

      {/* Calendar Header */}
      <GlassCard className="!p-4">
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate('prev')}
            className="p-2.5 rounded-xl hover:bg-muted/50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ChevronLeft className={cn("w-5 h-5 text-foreground", isRTL && "rotate-180")} />
          </motion.button>
          
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">
              {viewMode === 'day' 
                ? format(currentDate, 'EEEE, d MMMM yyyy', { locale })
                : format(currentDate, 'MMMM yyyy', { locale })
              }
            </h2>
            {/* Today Button */}
            {!isToday(currentDate) && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCurrentDate(new Date());
                  setSelectedDate(new Date());
                }}
                className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-lg"
              >
                {t('today')}
              </motion.button>
            )}
          </div>
          
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate('next')}
            className="p-2.5 rounded-xl hover:bg-muted/50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ChevronRight className={cn("w-5 h-5 text-foreground", isRTL && "rotate-180")} />
          </motion.button>
        </div>

        {/* Week Days Header */}
        {viewMode !== 'day' && (
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((day, i) => (
              <div key={i} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
        )}

        {/* Calendar Grid */}
        <AnimatePresence mode="wait">
          {viewMode === 'month' && (
            <motion.div
              key="month"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-7 gap-1"
            >
              {days.map((day, index) => {
                const dayTasks = getTasksForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isSelected = isSameDay(day, selectedDate);
                const isTodayDate = isToday(day);

                return (
                  <motion.button
                    key={index}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      'relative aspect-square p-1 rounded-xl transition-colors flex flex-col items-center justify-start min-h-[40px]',
                      !isCurrentMonth && 'opacity-30',
                      isSelected && 'bg-primary text-primary-foreground',
                      !isSelected && isTodayDate && 'bg-primary/20',
                      !isSelected && !isTodayDate && 'hover:bg-muted/50'
                    )}
                  >
                    <span className={cn(
                      'text-sm font-medium',
                      isSelected ? 'text-primary-foreground' : 'text-foreground'
                    )}>
                      {format(day, 'd')}
                    </span>
                    {dayTasks.length > 0 && (
                      <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                        {dayTasks.slice(0, 3).map((task, i) => (
                          <div
                            key={i}
                            className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              isSelected ? 'bg-primary-foreground/70' : getCategoryColor(task.category)
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {viewMode === 'week' && (
            <motion.div
              key="week"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-7 gap-2"
            >
              {days.map((day, index) => {
                const dayTasks = getTasksForDate(day);
                const isSelected = isSameDay(day, selectedDate);
                const isTodayDate = isToday(day);

                return (
                  <motion.button
                    key={index}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      'p-2 rounded-xl transition-all flex flex-col items-center min-h-[80px]',
                      isSelected && 'bg-primary text-primary-foreground',
                      !isSelected && isTodayDate && 'bg-primary/20',
                      !isSelected && !isTodayDate && 'hover:bg-muted/50'
                    )}
                  >
                    <span className="text-xs text-muted-foreground mb-1">
                      {format(day, 'EEE', { locale })}
                    </span>
                    <span className={cn(
                      'text-lg font-semibold',
                      isSelected ? 'text-primary-foreground' : 'text-foreground'
                    )}>
                      {format(day, 'd')}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className={cn(
                        'mt-1 text-xs px-2 py-0.5 rounded-full',
                        isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary/20 text-primary'
                      )}>
                        {dayTasks.length}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* Selected Date Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-primary" />
            {format(selectedDate, 'EEEE, d MMMM', { locale })}
          </h3>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onAddTask}
            className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            <Plus className="w-4 h-4 text-primary" />
          </motion.button>
        </div>

        {/* Events */}
        {selectedDateEvents.length > 0 && (
          <div className="space-y-2 mb-3">
            {selectedDateEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.04, duration: 0.18, ease: 'easeOut' }}
              >
                <GlassCard 
                  className="!p-3 cursor-pointer border-l-4 border-primary"
                  onClick={() => { setSelectedEvent(event); setShowEventDetail(true); }}
                >
                  <div className="flex items-center gap-3">
                    <Circle className="w-3 h-3 text-primary fill-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.isAllDay ? t('allDay') : `${event.startTime || ''} - ${event.endTime || ''}`}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tasks */}
        {selectedDateTasks.length > 0 ? (
          <div className="space-y-2">
            {selectedDateTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.04, duration: 0.18, ease: 'easeOut' }}
              >
                <GlassCard 
                  className="!p-3 cursor-pointer"
                  onClick={() => onSelectTask(task)}
                >
                  <div className="flex items-center gap-3">
                    <Square className="w-3 h-3 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'font-medium text-sm text-foreground truncate',
                        task.completed && 'line-through opacity-60'
                      )}>
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {task.dueTime || format(new Date(task.dueDate), 'HH:mm')}
                      </p>
                    </div>
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-lg',
                      task.priority === 'high' && 'bg-destructive/20 text-destructive',
                      task.priority === 'medium' && 'bg-secondary/20 text-secondary',
                      task.priority === 'low' && 'bg-accent/20 text-accent'
                    )}>
                      {task.priority}
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : selectedDateEvents.length === 0 && (
          <GlassCard className="!p-6 text-center">
            <CalendarIcon className="w-10 h-10 mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">{t('noEventsToday')}</p>
          </GlassCard>
        )}
      </div>

      {/* Event Detail Sheet */}
      <EventDetailSheet
        event={selectedEvent}
        isOpen={showEventDetail}
        onClose={() => { setShowEventDetail(false); setSelectedEvent(null); }}
        onSave={(updatedEvent) => { onUpdateEvent(updatedEvent); setShowEventDetail(false); setSelectedEvent(null); }}
        onDelete={(id) => { onDeleteEvent(id); setShowEventDetail(false); setSelectedEvent(null); }}
        t={t}
      />
    </motion.div>
  );
};
