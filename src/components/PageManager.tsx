import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  X, 
  Check, 
  Trash2, 
  Edit3,
  Folder,
  ChevronRight
} from 'lucide-react';
import { TaskPage, PAGE_COLORS } from '@/types';
import { cn } from '@/lib/utils';

interface PageManagerProps {
  pages: TaskPage[];
  selectedPageId: string | null;
  onSelectPage: (id: string | null) => void;
  onAddPage: (page: Omit<TaskPage, 'id' | 'createdAt' | 'order'>) => void;
  onUpdatePage: (page: TaskPage) => void;
  onDeletePage: (id: string) => void;
  t: (key: string) => string;
}

export const PageManager = ({
  pages,
  selectedPageId,
  onSelectPage,
  onAddPage,
  onUpdatePage,
  onDeletePage,
  t,
}: PageManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PAGE_COLORS[0]);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

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

  return (
    <div className="space-y-3">
      {/* All Tasks Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectPage(null)}
        className={cn(
          "w-full p-3.5 rounded-2xl flex items-center gap-3 transition-all",
          selectedPageId === null
            ? "bg-primary text-primary-foreground shadow-lg"
            : "glass-card"
        )}
      >
        <Folder className="w-5 h-5" />
        <span className="font-medium flex-1 text-left">{t('allTasks')}</span>
        <ChevronRight className={cn(
          "w-4 h-4 transition-transform",
          selectedPageId === null && "rotate-90"
        )} />
      </motion.button>

      {/* Custom Pages */}
      <AnimatePresence mode="popLayout">
        {pages.map((page) => (
          <motion.div
            key={page.id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative"
          >
            {editingId === page.id ? (
              <div className="glass-card p-3 space-y-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="glass-input"
                  autoFocus
                />
                <div className="flex gap-1.5 flex-wrap">
                  {PAGE_COLORS.map((color) => (
                    <motion.button
                      key={color}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditColor(color)}
                      className={cn(
                        "w-7 h-7 rounded-full transition-all",
                        editColor === color && "ring-2 ring-offset-2 ring-foreground"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditingId(null)}
                    className="glass-button-secondary flex-1 py-2"
                  >
                    {t('cancel')}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveEdit}
                    className="glass-button-primary flex-1 py-2"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    {t('save')}
                  </motion.button>
                </div>
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectPage(page.id)}
                className={cn(
                  "w-full p-3.5 rounded-2xl flex items-center gap-3 transition-all group",
                  selectedPageId === page.id
                    ? "text-white shadow-lg"
                    : "glass-card"
                )}
                style={{
                  backgroundColor: selectedPageId === page.id ? page.accentColor : undefined,
                }}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: selectedPageId === page.id ? 'white' : page.accentColor 
                  }}
                />
                <span className="font-medium flex-1 text-left">{page.name}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(page);
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/20"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePage(page.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/20 text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add New Page */}
      <AnimatePresence>
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-3 space-y-3 overflow-hidden"
          >
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPage()}
              className="glass-input"
              placeholder={t('pageName')}
              autoFocus
            />
            <div className="flex gap-1.5 flex-wrap">
              {PAGE_COLORS.map((color) => (
                <motion.button
                  key={color}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setNewColor(color)}
                  className={cn(
                    "w-7 h-7 rounded-full transition-all",
                    newColor === color && "ring-2 ring-offset-2 ring-foreground"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAdding(false)}
                className="glass-button-secondary flex-1 py-2"
              >
                <X className="w-4 h-4 mr-1" />
                {t('cancel')}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddPage}
                className="glass-button-primary flex-1 py-2"
                disabled={!newName.trim()}
              >
                <Check className="w-4 h-4 mr-1" />
                {t('add')}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAdding(true)}
            className="w-full p-3.5 rounded-2xl glass-card flex items-center gap-3 text-primary"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">{t('addPage')}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
