import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Check, Clock, Trash2, ChevronRight } from 'lucide-react';
import { Task, CATEGORY_LABELS } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';

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
  const [dragX, setDragX] = useState(0);

  const handleDragEnd = (e: any, info: PanInfo) => {
    if (info.offset.x < -100) {
      onDelete(task.id);
    } else if (info.offset.x > 100) {
      onComplete(task.id);
    }
    setDragX(0);
  };

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        layout
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
        transition={{ 
          duration: 0.35, 
          delay: index * 0.04,
          ease: [0.4, 0, 0.2, 1] 
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDrag={(e, info) => setDragX(info.offset.x)}
        onDragEnd={handleDragEnd}
        className={cn(
          'glass-card p-3.5 border-l-[3px] group cursor-grab active:cursor-grabbing',
          priorityColors[task.priority],
          task.completed && 'opacity-60'
        )}
        style={{
          backgroundColor: dragX > 50 
            ? `hsl(158 64% 42% / ${Math.min(Math.abs(dragX) / 200, 0.15)})` 
            : dragX < -50 
            ? `hsl(0 72% 51% / ${Math.min(Math.abs(dragX) / 200, 0.15)})`
            : undefined
        }}
      >
        <div className="flex items-start gap-3">
          {/* Completion Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onComplete(task.id); }}
            className={cn(
              'flex-shrink-0 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all duration-300 mt-0.5',
              task.completed
                ? 'bg-accent border-accent text-white'
                : 'border-muted-foreground/25 hover:border-accent hover:bg-accent/10'
            )}
          >
            {task.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Check className="w-3 h-3" />
              </motion.div>
            )}
          </motion.button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              'font-medium text-foreground text-sm transition-all duration-300 leading-snug',
              task.completed && 'line-through text-muted-foreground'
            )}>
              {task.title}
            </h4>
            
            {task.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <span className={cn(
                'text-[10px] px-2 py-0.5 rounded-full font-medium',
                categoryStyles[task.category]
              )}>
                {CATEGORY_LABELS[task.category]}
              </span>
              
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {format(task.dueDate, 'MMM d')}
              </span>

              {!task.completed && (
                <span className="text-[10px] font-semibold text-primary ml-auto">
                  +{task.points}
                </span>
              )}
            </div>
          </div>

          {/* Delete Button - visible on hover */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            className="flex-shrink-0 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
