import { motion, AnimatePresence } from 'framer-motion';
import { DURATION, EASING } from '@/lib/motion';

interface PointsAnimationProps {
  points: number;
  show: boolean;
  onComplete?: () => void;
}

export const PointsAnimation = ({ points, show, onComplete }: PointsAnimationProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: DURATION.normal, ease: EASING.smooth }}
          onAnimationComplete={onComplete}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="glass-card px-6 py-4 flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              +{points} points!
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
