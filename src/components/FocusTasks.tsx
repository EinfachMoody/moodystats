import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, Clock, X } from 'lucide-react';
import { Task } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface FocusTasksProps {
  tasks: Task[];
  onComplete: (taskId: string) => void;
  onRemoveFocus: (taskId: string) => void;
  t: (key: string) => string;
}

export const FocusTasks = ({
  tasks,
  onComplete,
  onRemoveFocus,
  t,
}: FocusTasksProps) => {
  const focusTasks = tasks.filter(task => task.isFocus && !task.completed);
  const maxFocus = 3;

  return (
    <div className="space-y-4">
      {/* Focus Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
          <Star className="w-4 h-4 text-primary fill-primary" />
          {t('dailyFocus')}
        </h3>
        <span className="text-xs text-muted-foreground">
          {focusTasks.length}/{maxFocus}
        </span>
      </div>

      {/* Focus Tasks */}
      <AnimatePresence mode="popLayout">
        {focusTasks.length > 0 ? (
          <div className="space-y-2">
            {focusTasks.map((task, index) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "glass-card p-4 border-l-4 border-l-primary",
                  task.completed && "opacity-60"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Complete Button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onComplete(task.id)}
                    className={cn(
                      "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5",
                      task.completed
                        ? "bg-primary border-primary text-white"
                        : "border-primary/50 hover:bg-primary/10"
                    )}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5" />}
                  </motion.button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium text-foreground",
                      task.completed && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(task.dueDate), 'MMM d')}
                      </span>
                      {!task.completed && (
                        <span className="text-xs font-semibold text-primary">
                          +{task.points}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Remove from Focus */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onRemoveFocus(task.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-6 text-center"
          >
            <Star className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">{t('noFocusTasks')}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              {t('selectFocusTasks')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
