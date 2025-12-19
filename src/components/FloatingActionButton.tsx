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
      transition={{ delay: 0.5, type: 'spring', stiffness: 400, damping: 20 }}
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={cn(
        "fixed bottom-28 z-50 w-14 h-14 rounded-2xl flex items-center justify-center",
        isRTL ? "left-5" : "right-5"
      )}
      style={{
        background: 'linear-gradient(135deg, hsl(199 100% 50%), hsl(262 83% 55%))',
        boxShadow: '0 8px 32px hsl(199 100% 50% / 0.4), 0 4px 16px hsl(262 83% 55% / 0.3), inset 0 1px 1px hsl(0 0% 100% / 0.3)',
      }}
    >
      <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          boxShadow: [
            '0 0 20px hsl(199 100% 50% / 0.3)',
            '0 0 40px hsl(199 100% 50% / 0.5)',
            '0 0 20px hsl(199 100% 50% / 0.3)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.button>
  );
};
