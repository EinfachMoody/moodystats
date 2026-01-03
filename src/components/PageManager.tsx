import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Plus, 
  X, 
  Check, 
  Trash2, 
  Edit3,
  GripVertical,
  ArrowUp,
  ArrowDown,
  ChevronRight
} from 'lucide-react';
import { TaskPage, PAGE_COLORS } from '@/types';
import { cn } from '@/lib/utils';

interface PageManagerProps {
  pages: TaskPage[];
  isOpen: boolean;
  onClose: () => void;
  onAddPage: (page: Omit<TaskPage, 'id' | 'createdAt' | 'order'>) => void;
  onUpdatePage: (page: TaskPage) => void;
  onDeletePage: (id: string) => void;
  onReorderPages?: (pages: TaskPage[]) => void;
  t: (key: string) => string;
}

export const PageManager = ({
  pages,
  isOpen,
  onClose,
  onAddPage,
  onUpdatePage,
  onDeletePage,
  onReorderPages,
  t,
}: PageManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PAGE_COLORS[0]);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const sortedPages = [...pages].sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleAddPage = () => {
    if (!newName.trim()) return;
    onAddPage({
      name: newName.trim(),
      accentColor: newColor,
    });
    setNewName('');
    setNewColor(PAGE_COLORS[0]);
    setIsAdding(false);
  };

  const handleStartEdit = (page: TaskPage) => {
    setEditingId(page.id);
    setEditName(page.name);
    setEditColor(page.accentColor);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editName.trim()) return;
    const page = pages.find(p => p.id === editingId);
    if (page) {
      onUpdatePage({
        ...page,
        name: editName.trim(),
        accentColor: editColor,
      });
    }
    setEditingId(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0 || !onReorderPages) return;
    const newPages = [...sortedPages];
    [newPages[index - 1], newPages[index]] = [newPages[index], newPages[index - 1]];
    onReorderPages(newPages.map((p, i) => ({ ...p, order: i })));
  };

  const handleMoveDown = (index: number) => {
    if (index === sortedPages.length - 1 || !onReorderPages) return;
    const newPages = [...sortedPages];
    [newPages[index], newPages[index + 1]] = [newPages[index + 1], newPages[index]];
    onReorderPages(newPages.map((p, i) => ({ ...p, order: i })));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed inset-0 z-50 flex items-center justify-center px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+6.5rem)]"
      >
        <div className="glass-card p-5 rounded-3xl w-full max-w-md max-h-full overflow-y-auto overscroll-contain">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-foreground">{t('pages')}</h3>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2.5 rounded-xl bg-muted/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          </div>

          {/* Info Text */}
          <p className="text-xs text-muted-foreground mb-4">
            {t('pages')} • {sortedPages.length} {sortedPages.length === 1 ? 'page' : 'pages'}
          </p>
          
          <div className="space-y-2">
            {/* Sorted Pages List */}
            <AnimatePresence mode="popLayout">
              {sortedPages.map((page, index) => (
                <motion.div
                  key={page.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="relative"
                >
                  {editingId === page.id ? (
                    <div className="bg-muted/30 p-4 rounded-xl space-y-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="glass-input text-base"
                        autoFocus
                      />
                      <div className="flex gap-2 flex-wrap">
                        {PAGE_COLORS.map((color) => (
                          <motion.button
                            key={color}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setEditColor(color)}
                            className={cn(
                              "w-8 h-8 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center",
                              editColor === color && "ring-2 ring-offset-2 ring-foreground"
                            )}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2 pt-1">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEditingId(null)}
                          className="glass-button-secondary flex-1 py-3 min-h-[48px]"
                        >
                          {t('cancel')}
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSaveEdit}
                          className="glass-button-primary flex-1 py-3 min-h-[48px] flex items-center justify-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          {t('save')}
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full p-4 rounded-2xl flex items-center gap-3 transition-all glass-card">
                      {/* Drag Handle & Color */}
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                        <div 
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: page.accentColor }}
                        />
                      </div>

                      {/* Name */}
                      <span className="font-medium flex-1 text-left truncate">{page.name}</span>

                      {/* Order Controls */}
                      <div className="flex items-center gap-1">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className={cn(
                            "p-2 rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center",
                            index === 0 ? "opacity-30" : "hover:bg-muted/50"
                          )}
                        >
                          <ArrowUp className="w-4 h-4 text-muted-foreground" />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleMoveDown(index)}
                          disabled={index === sortedPages.length - 1}
                          className={cn(
                            "p-2 rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center",
                            index === sortedPages.length - 1 ? "opacity-30" : "hover:bg-muted/50"
                          )}
                        >
                          <ArrowDown className="w-4 h-4 text-muted-foreground" />
                        </motion.button>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 border-l border-border/30 pl-2 ml-1">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleStartEdit(page)}
                          className="p-2 rounded-lg hover:bg-muted/50 min-h-[40px] min-w-[40px] flex items-center justify-center"
                        >
                          <Edit3 className="w-4 h-4 text-muted-foreground" />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDeletePage(page.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-destructive min-h-[40px] min-w-[40px] flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty State */}
            {sortedPages.length === 0 && !isAdding && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-6 text-muted-foreground"
              >
                <p className="text-sm">{t('noTasksYet')}</p>
                <p className="text-xs mt-1">Create pages to organize your tasks</p>
              </motion.div>
            )}

            {/* Add New Page */}
            <AnimatePresence>
              {isAdding ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="bg-muted/30 p-4 rounded-xl space-y-3 overflow-hidden"
                >
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddPage()}
                    className="glass-input text-base"
                    placeholder={t('pageName')}
                    autoFocus
                  />
                  <div className="flex gap-2 flex-wrap">
                    {PAGE_COLORS.map((color) => (
                      <motion.button
                        key={color}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setNewColor(color)}
                        className={cn(
                          "w-8 h-8 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center",
                          newColor === color && "ring-2 ring-offset-2 ring-foreground"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsAdding(false)}
                      className="glass-button-secondary flex-1 py-3 min-h-[48px] flex items-center justify-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      {t('cancel')}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddPage}
                      className="glass-button-primary flex-1 py-3 min-h-[48px] flex items-center justify-center gap-1"
                      disabled={!newName.trim()}
                    >
                      <Check className="w-4 h-4" />
                      {t('add')}
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsAdding(true)}
                  className="w-full p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 flex items-center gap-3 text-primary transition-colors min-h-[56px]"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">{t('addPage')}</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
