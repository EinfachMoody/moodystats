import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Task } from '@/types';
import { cn } from '@/lib/utils';

interface TaskSearchProps {
  tasks: Task[];
  onSearch: (filteredTasks: Task[]) => void;
  onClear: () => void;
  t: (key: string) => string;
  isRTL?: boolean;
}

interface HighlightedTextProps {
  text: string;
  query: string;
}

export const HighlightedText = ({ text, query }: HighlightedTextProps) => {
  if (!query.trim()) return <>{text}</>;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-primary/30 text-foreground rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};

export const TaskSearch = ({ tasks, onSearch, onClear, t, isRTL = false }: TaskSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isActive, setIsActive] = useState(false);

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;

    const query = searchQuery.toLowerCase().trim();
    return tasks.filter(task => {
      // Search in title
      if (task.title.toLowerCase().includes(query)) return true;
      // Search in description
      if (task.description?.toLowerCase().includes(query)) return true;
      // Search in notes
      if (task.notes?.toLowerCase().includes(query)) return true;
      // Search in subtasks
      if (task.subtasks?.some(st => st.title.toLowerCase().includes(query))) return true;
      return false;
    });
  }, [tasks, searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      onSearch(filteredTasks);
    } else {
      onClear();
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setIsActive(false);
    onClear();
  };

  return (
    <div className="relative">
      <motion.div
        initial={false}
        animate={{ width: isActive ? '100%' : '100%' }}
        className="relative"
      >
        <Search 
          className={cn(
            "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors",
            isActive && "text-primary",
            isRTL ? "right-4" : "left-4"
          )} 
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => setIsActive(true)}
          onBlur={() => !searchQuery && setIsActive(false)}
          placeholder={t('searchTasks')}
          className={cn(
            "w-full py-2.5 rounded-xl bg-muted/50 border border-border",
            "focus:border-primary focus:ring-2 focus:ring-primary/20",
            "outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm",
            isRTL ? "pr-11 pl-10" : "pl-11 pr-10"
          )}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        <AnimatePresence>
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 p-1 rounded-full",
                "hover:bg-muted transition-colors",
                isRTL ? "left-3" : "right-3"
              )}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Search Results Count */}
      <AnimatePresence>
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-2 text-xs text-muted-foreground"
          >
            {filteredTasks.length} {t('resultsFound')}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const useTaskSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const filterTasks = (tasks: Task[], query: string): Task[] => {
    if (!query.trim()) return tasks;

    const lowerQuery = query.toLowerCase().trim();
    return tasks.filter(task => {
      if (task.title.toLowerCase().includes(lowerQuery)) return true;
      if (task.description?.toLowerCase().includes(lowerQuery)) return true;
      if (task.notes?.toLowerCase().includes(lowerQuery)) return true;
      if (task.subtasks?.some(st => st.title.toLowerCase().includes(lowerQuery))) return true;
      return false;
    });
  };

  return {
    searchQuery,
    setSearchQuery,
    isSearchActive,
    setIsSearchActive,
    filterTasks,
  };
};
