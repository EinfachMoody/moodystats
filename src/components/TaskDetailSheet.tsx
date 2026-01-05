import { useState, useEffect, useCallback } from 'react';
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
  Star,
  Check,
  Target,
  Copy,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { Task, Subtask, CATEGORY_LABELS, REPEAT_LABELS } from '@/types';
import { cn } from '@/lib/utils';

interface TaskDetailSheetProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (task: Task) => void;
  t: (key: string) => string;
}

export const TaskDetailSheet = ({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete,
  onDuplicate,
  t,
}: TaskDetailSheetProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [isMarked, setIsMarked] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Reset state when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setNotes(task.notes || '');
      setSubtasks(task.subtasks || []);
      setIsMarked(task.marked || false);
      setIsFocus(task.isFocus || false);
      setHasChanges(false);
    }
  }, [task]);

  const markChanged = useCallback(() => {
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!task) return;
    onSave({
      ...task,
      title: title.trim() || task.title,
      description: description.trim(),
      notes: notes.trim(),
      subtasks,
      marked: isMarked,
      isFocus,
    });
  }, [task, title, description, notes, subtasks, isMarked, isFocus, onSave]);

  const handleAddSubtask = useCallback(() => {
    if (!newSubtask.trim()) return;
    const subtask: Subtask = {
      id: `subtask-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: newSubtask.trim(),
      completed: false,
    };
    setSubtasks(prev => [...prev, subtask]);
    setNewSubtask('');
    markChanged();
  }, [newSubtask, markChanged]);

  const handleToggleSubtask = useCallback((id: string) => {
    setSubtasks(prev => prev.map(st => 
      st.id === id ? { ...st, completed: !st.completed } : st
    ));
    markChanged();
  }, [markChanged]);

  const handleDeleteSubtask = useCallback((id: string) => {
    setSubtasks(prev => prev.filter(st => st.id !== id));
    markChanged();
  }, [markChanged]);

  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const progress = subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0;

  const handleClose = useCallback(() => {
    if (hasChanges) {
      handleSave();
    }
    onClose();
  }, [hasChanges, handleSave, onClose]);

  if (!task) return null;

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
                <h2 className="text-lg font-bold text-foreground">{t('taskDetails')}</h2>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setIsFocus(!isFocus); markChanged(); }}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      isFocus ? "bg-accent/20 text-accent" : "bg-muted/50 text-muted-foreground"
                    )}
                  >
                    <Target className={cn("w-5 h-5")} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setIsMarked(!isMarked); markChanged(); }}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      isMarked ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"
                    )}
                  >
                    <Star className={cn("w-5 h-5", isMarked && "fill-current")} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="p-2 rounded-xl bg-muted/50 text-muted-foreground"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
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
                  {task.repeat !== 'none' && (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-medium bg-primary/10 text-primary">
                      <RefreshCw className="w-3 h-3 inline mr-1" />
                      {REPEAT_LABELS[task.repeat]}
                    </span>
                  )}
                </div>

                {/* Subtasks Progress */}
                {subtasks.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">
                        {completedSubtasks} of {subtasks.length} completed
                      </span>
                      <span className="text-xs font-medium text-primary">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      />
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mb-4">
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

                {/* Notes */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {t('notes')}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => { setNotes(e.target.value); markChanged(); }}
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
                    <AnimatePresence mode="popLayout">
                      {subtasks.map((subtask) => (
                        <motion.div
                          key={subtask.id}
                          layout
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -20, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
                        >
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleToggleSubtask(subtask.id)}
                            className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                              subtask.completed
                                ? "bg-accent border-accent text-white"
                                : "border-muted-foreground/30 hover:border-accent"
                            )}
                          >
                            <AnimatePresence>
                              {subtask.completed && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <Check className="w-3 h-3" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.button>
                          <span className={cn(
                            "flex-1 text-sm transition-all",
                            subtask.completed && "line-through text-muted-foreground"
                          )}>
                            {subtask.title}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteSubtask(subtask.id)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
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
                      disabled={!newSubtask.trim()}
                      className="glass-button-primary px-4 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pb-8 pt-4 border-t border-border/30 mt-6">
                  {onDuplicate && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onDuplicate(task);
                        onClose();
                      }}
                      className="glass-button-secondary flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {t('duplicate')}
                    </motion.button>
                  )}
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
