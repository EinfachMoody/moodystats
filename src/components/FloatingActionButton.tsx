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
      transition={{ delay: 0.35, type: 'spring', stiffness: 400, damping: 22 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className={cn(
        "fab-button",
        isRTL ? "left-4 bottom-24" : "right-4 bottom-24"
      )}
    >
      <motion.div
        whileHover={{ rotate: 90 }}
        transition={{ duration: 0.25 }}
      >
        <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
      </motion.div>
      
      {/* Subtle pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-[1.25rem]"
        animate={{
          boxShadow: [
            '0 0 0 0px hsl(211 100% 50% / 0.25)',
            '0 0 0 6px hsl(211 100% 50% / 0)',
          ],
        }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
      />
    </motion.button>
  );
};
