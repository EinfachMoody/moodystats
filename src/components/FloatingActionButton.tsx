import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  isRTL?: boolean;
  customPosition?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

export const FloatingActionButton = ({ onClick, isRTL = false, customPosition }: FloatingActionButtonProps) => {
  const getStyle = (): React.CSSProperties => {
    if (customPosition) {
      return {
        top: customPosition.top,
        bottom: customPosition.bottom,
        left: customPosition.left,
        right: customPosition.right,
        background: 'var(--gradient-primary)',
        boxShadow: '0 6px 24px hsl(211 100% 50% / 0.35)',
      };
    }
    return {
      bottom: 96,
      ...(isRTL ? { left: 16 } : { right: 16 }),
      background: 'var(--gradient-primary)',
      boxShadow: '0 6px 24px hsl(211 100% 50% / 0.35)',
    };
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.35, type: 'spring', stiffness: 400, damping: 22 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className="fixed z-50 w-14 h-14 rounded-[1.25rem] flex items-center justify-center shadow-lg"
      style={getStyle()}
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
