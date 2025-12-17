import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, Trash2 } from 'lucide-react';
import { Task, CATEGORY_LABELS } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  index?: number;
}

const priorityColors = {
  high: 'border-l-destructive',
  medium: 'border-l-secondary',
  low: 'border-l-accent',
};

const categoryStyles = {
  work: 'category-work',
  personal: 'category-personal',
  health: 'category-health',
  other: 'category-other',
};

export const TaskCard = ({ task, onComplete, onDelete, index = 0 }: TaskCardProps) => {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        layout
        initial={{ opacity: 0, x: -20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
        transition={{ 
          duration: 0.4, 
          delay: index * 0.05,
          ease: [0.4, 0, 0.2, 1] 
        }}
        className={cn(
          'glass-card p-4 border-l-4 group',
          priorityColors[task.priority],
          task.completed && 'opacity-60'
        )}
      >
        <div className="flex items-start gap-3">
          {/* Completion Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onComplete(task.id)}
            className={cn(
              'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300',
              task.completed
                ? 'bg-accent border-accent text-accent-foreground'
                : 'border-muted-foreground/30 hover:border-accent hover:bg-accent/10'
            )}
          >
            {task.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Check className="w-3.5 h-3.5" />
              </motion.div>
            )}
          </motion.button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              'font-medium text-foreground transition-all duration-300',
              task.completed && 'line-through text-muted-foreground'
            )}>
              {task.title}
            </h4>
            
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-2 mt-3">
              <span className={cn(
                'text-xs px-2.5 py-1 rounded-full font-medium',
                categoryStyles[task.category]
              )}>
                {CATEGORY_LABELS[task.category]}
              </span>
              
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {format(task.dueDate, 'MMM d')}
              </span>

              {!task.completed && (
                <span className="text-xs font-medium text-primary ml-auto">
                  +{task.points} pts
                </span>
              )}
            </div>
          </div>

          {/* Delete Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(task.id)}
            className="flex-shrink-0 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
