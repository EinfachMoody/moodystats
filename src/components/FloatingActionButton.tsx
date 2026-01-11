import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { triggerHaptic } from '@/hooks/useHapticFeedback';

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
  const handleClick = () => {
    triggerHaptic('medium');
    onClick();
  };
  const getStyle = (): React.CSSProperties => {
    if (customPosition) {
      return {
        top: customPosition.top,
        bottom: customPosition.bottom,
        left: customPosition.left,
        right: customPosition.right,
        background: 'var(--gradient-primary)',
        boxShadow: '0 6px 24px hsl(var(--primary) / 0.35)',
      };
    }
    return {
      bottom: 96,
      ...(isRTL ? { left: 16 } : { right: 16 }),
      background: 'var(--gradient-primary)',
      boxShadow: '0 6px 24px hsl(var(--primary) / 0.35)',
    };
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
      onClick={handleClick}
      className="fixed z-50 w-14 h-14 rounded-[1.25rem] flex items-center justify-center shadow-lg"
      style={getStyle()}
    >
      <Plus className="w-6 h-6 text-primary-foreground" strokeWidth={2.5} />
      
      {/* Subtle pulse ring - GPU accelerated with opacity only */}
      <motion.div
        className="absolute inset-0 rounded-[1.25rem]"
        animate={{
          boxShadow: [
            '0 0 0 0px hsl(var(--primary) / 0.2)',
            '0 0 0 6px hsl(var(--primary) / 0)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
      />
    </motion.button>
  );
};
