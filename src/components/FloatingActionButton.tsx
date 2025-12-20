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
      transition={{ delay: 0.4, type: 'spring', stiffness: 400, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className={cn(
        "fab-button",
        isRTL ? "left-5 bottom-28" : "right-5 bottom-28"
      )}
    >
      <motion.div
        animate={{ rotate: [0, 0, 0] }}
        whileHover={{ rotate: 90 }}
        transition={{ duration: 0.3 }}
      >
        <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
      </motion.div>
      
      {/* Animated glow ring */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        animate={{
          boxShadow: [
            '0 0 0 0px hsl(199 100% 50% / 0.3)',
            '0 0 0 8px hsl(199 100% 50% / 0)',
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.button>
  );
};