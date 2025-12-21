import { motion, AnimatePresence } from 'framer-motion';
import { Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UndoToastProps {
  show: boolean;
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  undoLabel: string;
}

export const UndoToast = ({ show, message, onUndo, onDismiss, undoLabel }: UndoToastProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className={cn(
            "fixed bottom-28 left-4 right-4 z-[60] max-w-md mx-auto",
            "glass-card !p-4 flex items-center justify-between gap-3"
          )}
        >
          <span className="text-sm text-foreground font-medium">{message}</span>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onUndo}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
            >
              <Undo2 className="w-4 h-4" />
              {undoLabel}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onDismiss}
              className="p-2 rounded-xl text-muted-foreground hover:bg-muted/50 transition-colors"
            >
              ✕
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
