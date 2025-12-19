import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onClick: () => void;
  isRTL?: boolean;
}

export const FloatingActionButton = ({ onClick, isRTL = false }: FloatingActionButtonProps) => {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={cn(
        "fixed bottom-24 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg",
        isRTL ? "left-4" : "right-4"
      )}
      style={{
        background: 'linear-gradient(135deg, hsl(199, 100%, 65%), hsl(262, 83%, 58%))',
        boxShadow: '0 8px 32px hsla(199, 100%, 65%, 0.4)',
      }}
    >
      <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
    </motion.button>
  );
};
