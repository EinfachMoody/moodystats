import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { Check, Clock, Trash2, Star, CheckSquare, GripVertical, Edit3, Copy, Target } from 'lucide-react';
import { Task, CATEGORY_LABELS, TaskViewMode } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState, useRef } from 'react';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onClick?: () => void;
  onDuplicate?: (task: Task) => void;
  onToggleFocus?: (id: string) => void;
  index?: number;
  viewMode?: TaskViewMode;
  isDraggable?: boolean;
  dragControls?: ReturnType<typeof useDragControls>;
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

export const TaskCard = ({ 
  task, 
  onComplete, 
  onDelete, 
  onClick, 
  onDuplicate,
  onToggleFocus,
  index = 0, 
  viewMode = 'standard',
  isDraggable = false,
  dragControls 
}: TaskCardProps) => {
  const [showActions, setShowActions] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const handleLongPressStart = () => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setShowActions(true);
    }, 400);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleClick = () => {
    if (!isLongPress.current && onClick) {
      onClick();
    }
    isLongPress.current = false;
  };

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
    setShowActions(false);
  };

  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <motion.div
      layout="position"
      layoutId={task.id}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, x: -20 }}
      transition={{ 
        duration: 0.25, 
        delay: index * 0.03,
        ease: [0.4, 0, 0.2, 1],
        layout: { duration: 0.2 }
      }}
      onTouchStart={handleLongPressStart}
      onTouchEnd={handleLongPressEnd}
      onMouseDown={handleLongPressStart}
      onMouseUp={handleLongPressEnd}
      onMouseLeave={handleLongPressEnd}
      onClick={handleClick}
      className={cn(
        'glass-card border-l-[3px] group cursor-pointer relative',
        priorityColors[task.priority],
        task.completed && 'opacity-60',
        task.isFocus && 'ring-2 ring-primary/30',
        viewMode === 'compact' && 'p-2.5',
        viewMode === 'standard' && 'p-3.5',
        viewMode === 'cards' && 'p-4'
      )}
    >
      {/* Quick Actions Overlay */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center gap-3 p-3"
            onClick={(e) => { e.stopPropagation(); setShowActions(false); }}
          >
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.05, type: 'spring', stiffness: 500 }}
              onClick={(e) => handleAction(e, () => onClick?.())}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-primary/10 text-primary"
            >
              <Edit3 className="w-5 h-5" />
              <span className="text-[10px] font-medium">Edit</span>
            </motion.button>
            
            {onDuplicate && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
                onClick={(e) => handleAction(e, () => onDuplicate(task))}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-secondary/10 text-secondary"
              >
                <Copy className="w-5 h-5" />
                <span className="text-[10px] font-medium">Copy</span>
              </motion.button>
            )}
            
            {onToggleFocus && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 500 }}
                onClick={(e) => handleAction(e, () => onToggleFocus(task.id))}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-xl",
                  task.isFocus ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                )}
              >
                <Target className="w-5 h-5" />
                <span className="text-[10px] font-medium">{task.isFocus ? 'Unfocus' : 'Focus'}</span>
              </motion.button>
            )}
            
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
              onClick={(e) => handleAction(e, () => onDelete(task.id))}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-destructive/10 text-destructive"
            >
              <Trash2 className="w-5 h-5" />
              <span className="text-[10px] font-medium">Delete</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn("flex items-start", viewMode === 'compact' ? 'gap-2' : 'gap-3')}>
        {/* Drag Handle */}
        {isDraggable && dragControls && (
          <motion.div
            className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground/50 hover:text-muted-foreground touch-none"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <GripVertical className="w-4 h-4" />
          </motion.div>
        )}

        {/* Completion Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onComplete(task.id); }}
          className={cn(
            'flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-0.5',
            viewMode === 'compact' ? 'w-5 h-5' : 'w-[22px] h-[22px]',
            task.completed
              ? 'bg-accent border-accent text-white'
              : 'border-muted-foreground/25 hover:border-accent hover:bg-accent/10'
          )}
        >
          <AnimatePresence>
            {task.completed && (
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Check className="w-3 h-3" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={cn(
              'font-medium text-foreground transition-all duration-200 leading-snug',
              viewMode === 'compact' ? 'text-xs' : 'text-sm',
              task.completed && 'line-through text-muted-foreground'
            )}>
              {task.title}
            </h4>
            {task.marked && (
              <Star className="w-3 h-3 text-primary fill-primary flex-shrink-0" />
            )}
            {task.isFocus && (
              <Target className="w-3 h-3 text-accent flex-shrink-0" />
            )}
          </div>
          
          {task.description && viewMode !== 'compact' && (
            <p className={cn(
              "text-muted-foreground mt-1 leading-relaxed",
              viewMode === 'cards' ? 'text-sm line-clamp-3' : 'text-xs line-clamp-2'
            )}>
              {task.description}
            </p>
          )}

          <div className={cn("flex items-center gap-2 flex-wrap", viewMode === 'compact' ? 'mt-1.5' : 'mt-2.5')}>
            <span className={cn(
              'px-2 py-0.5 rounded-full font-medium',
              viewMode === 'compact' ? 'text-[9px]' : 'text-[10px]',
              categoryStyles[task.category]
            )}>
              {CATEGORY_LABELS[task.category]}
            </span>
            
            <span className={cn("text-muted-foreground flex items-center gap-1", viewMode === 'compact' ? 'text-[9px]' : 'text-[10px]')}>
              <Clock className="w-3 h-3" />
              {format(task.dueDate, 'MMM d')}
            </span>

            {totalSubtasks > 0 && (
              <span className={cn(
                "text-muted-foreground flex items-center gap-1", 
                viewMode === 'compact' ? 'text-[9px]' : 'text-[10px]',
                completedSubtasks === totalSubtasks && 'text-accent'
              )}>
                <CheckSquare className="w-3 h-3" />
                {completedSubtasks}/{totalSubtasks}
              </span>
            )}

            {!task.completed && (
              <span className="text-[10px] font-semibold text-primary ml-auto">
                +{task.points}
              </span>
            )}
          </div>
        </div>

        {/* Delete Button - visible on hover (desktop) */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          className="flex-shrink-0 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 hidden sm:block"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Draggable Task List Component
interface DraggableTaskListProps {
  tasks: Task[];
  onReorder: (tasks: Task[]) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (task: Task) => void;
  onDuplicate?: (task: Task) => void;
  onToggleFocus?: (id: string) => void;
  viewMode?: TaskViewMode;
}

export const DraggableTaskList = ({
  tasks,
  onReorder,
  onComplete,
  onDelete,
  onClick,
  onDuplicate,
  onToggleFocus,
  viewMode = 'standard'
}: DraggableTaskListProps) => {
  return (
    <Reorder.Group 
      axis="y" 
      values={tasks} 
      onReorder={onReorder}
      className="space-y-2"
      layoutScroll
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <TaskCardDraggable 
            key={task.id}
            task={task}
            index={index}
            onComplete={onComplete}
            onDelete={onDelete}
            onClick={() => onClick(task)}
            onDuplicate={onDuplicate}
            onToggleFocus={onToggleFocus}
            viewMode={viewMode}
          />
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
};

// Wrapper component for draggable task using Reorder.Item
const TaskCardDraggable = ({
  task,
  index,
  onComplete,
  onDelete,
  onClick,
  onDuplicate,
  onToggleFocus,
  viewMode,
}: Omit<TaskCardProps, 'isDraggable' | 'dragControls'>) => {
  const controls = useDragControls();
  
  return (
    <Reorder.Item 
      value={task}
      dragListener={false}
      dragControls={controls}
      className="list-none"
    >
      <TaskCard
        task={task}
        index={index}
        onComplete={onComplete}
        onDelete={onDelete}
        onClick={onClick}
        onDuplicate={onDuplicate}
        onToggleFocus={onToggleFocus}
        viewMode={viewMode}
        isDraggable={true}
        dragControls={controls}
      />
    </Reorder.Item>
  );
};
