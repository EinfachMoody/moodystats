import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  Tag, 
  FileText, 
  CheckSquare,
  Plus,
  Trash2,
  Star
} from 'lucide-react';
import { format } from 'date-fns';
import { Task, Subtask, CATEGORY_LABELS } from '@/types';
import { cn } from '@/lib/utils';

interface TaskDetailSheetProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (id: string) => void;
  t: (key: string) => string;
}

export const TaskDetailSheet = ({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete,
  t,
}: TaskDetailSheetProps) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [notes, setNotes] = useState(task?.notes || '');
  const [subtasks, setSubtasks] = useState<Subtask[]>(task?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [isMarked, setIsMarked] = useState(task?.marked || false);

  const handleSave = () => {
    if (!task) return;
    onSave({
      ...task,
      title,
      description,
      notes,
      subtasks,
      marked: isMarked,
    });
    onClose();
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    const subtask: Subtask = {
      id: Date.now().toString(),
      title: newSubtask.trim(),
      completed: false,
    };
    setSubtasks([...subtasks, subtask]);
    setNewSubtask('');
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(st => 
      st.id === id ? { ...st, completed: !st.completed } : st
    ));
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  const completedSubtasks = subtasks.filter(st => st.completed).length;

  return (
    <AnimatePresence>
      {isOpen && task && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-hidden"
          >
            <div className="glass-card rounded-t-3xl p-6 pb-safe max-h-[85vh] overflow-y-auto">
              {/* Handle */}
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-foreground">{t('taskDetails')}</h2>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMarked(!isMarked)}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      isMarked ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"
                    )}
                  >
                    <Star className={cn("w-5 h-5", isMarked && "fill-current")} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="p-2 rounded-xl bg-muted/50 text-muted-foreground"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Title */}
              <div className="mb-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="glass-input text-lg font-semibold"
                  placeholder={t('taskTitle')}
                />
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-medium',
                  task.category === 'work' && 'category-work',
                  task.category === 'personal' && 'category-personal',
                  task.category === 'health' && 'category-health',
                  task.category === 'other' && 'category-other'
                )}>
                  <Tag className="w-3 h-3 inline mr-1" />
                  {CATEGORY_LABELS[task.category]}
                </span>
                <span className="px-3 py-1.5 rounded-xl text-xs font-medium bg-muted/50 text-muted-foreground">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </span>
                {task.dueTime && (
                  <span className="px-3 py-1.5 rounded-xl text-xs font-medium bg-muted/50 text-muted-foreground">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {task.dueTime}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {t('description')}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="glass-input min-h-[80px] resize-none"
                  placeholder={t('optionalDetails')}
                />
              </div>

              {/* Notes */}
              <div className="mb-4">
                <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {t('notes')}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="glass-input min-h-[60px] resize-none"
                  placeholder={t('addNotes')}
                />
              </div>

              {/* Subtasks */}
              <div className="mb-6">
                <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  {t('subtasks')} {subtasks.length > 0 && `(${completedSubtasks}/${subtasks.length})`}
                </label>
                
                {/* Subtask List */}
                <div className="space-y-2 mb-3">
                  {subtasks.map((subtask) => (
                    <motion.div
                      key={subtask.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
                    >
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleSubtask(subtask.id)}
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                          subtask.completed
                            ? "bg-accent border-accent text-white"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {subtask.completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <CheckSquare className="w-3 h-3" />
                          </motion.div>
                        )}
                      </motion.button>
                      <span className={cn(
                        "flex-1 text-sm",
                        subtask.completed && "line-through text-muted-foreground"
                      )}>
                        {subtask.title}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteSubtask(subtask.id)}
                        className="p-1 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                {/* Add Subtask */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                    className="glass-input flex-1 py-2"
                    placeholder={t('addSubtask')}
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddSubtask}
                    className="glass-button-primary px-4"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onDelete(task.id);
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
