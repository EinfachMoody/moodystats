// Shared motion primitives for consistent, smooth 60 FPS animations.
// Only animate GPU-accelerated properties (opacity, transform) to avoid repaints.

// === TIMING CONSTANTS ===
export const DURATION = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.22,
  page: 0.3,
  slow: 0.4,
} as const;

// === EASING CURVES ===
export const EASING = {
  // Standard ease-in-out for most interactions
  smooth: [0.4, 0, 0.2, 1] as const,
  // Slightly faster ease for exits
  out: [0, 0, 0.2, 1] as const,
  // For entering elements
  in: [0.4, 0, 1, 1] as const,
  // Spring-like for playful interactions
  bounce: [0.68, -0.05, 0.265, 1.15] as const,
} as const;

// === FADE ANIMATIONS (opacity only - fastest) ===
export const fadeInOut = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

export const fadeTransition = {
  duration: DURATION.fast,
  ease: EASING.smooth,
} as const;

// === PAGE TRANSITIONS (opacity + subtle transform) ===
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

export const pageTransitionConfig = {
  duration: DURATION.page,
  ease: EASING.smooth,
} as const;

// === COMPONENT ANIMATIONS (200-300ms for interactions) ===
export const componentTransition = {
  duration: DURATION.normal,
  ease: EASING.smooth,
} as const;

// === SCALE ANIMATIONS (for buttons, cards) ===
export const scaleOnTap = {
  whileTap: { scale: 0.97 },
  transition: { duration: DURATION.instant, ease: EASING.out },
} as const;

export const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: DURATION.fast, ease: EASING.smooth },
} as const;

// === STAGGER CONFIG (use sparingly) ===
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03, // Very short stagger to prevent jank
      delayChildren: 0,
    },
  },
} as const;

export const staggerItem = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: DURATION.fast, ease: EASING.smooth },
  },
} as const;

// === LIST ITEM ANIMATIONS ===
export const listItemVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, scale: 0.98 },
} as const;

export const listItemTransition = {
  duration: DURATION.normal,
  ease: EASING.smooth,
  layout: { duration: DURATION.fast },
} as const;

// === MODAL/SHEET ANIMATIONS ===
export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

export const modalContent = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
} as const;

export const modalTransition = {
  duration: DURATION.normal,
  ease: EASING.smooth,
} as const;

// === SPRING CONFIGS (for natural motion) ===
export const springConfig = {
  soft: { type: 'spring', stiffness: 300, damping: 30 },
  medium: { type: 'spring', stiffness: 400, damping: 35 },
  stiff: { type: 'spring', stiffness: 500, damping: 40 },
} as const;

// === REDUCED MOTION SUPPORT ===
export const getReducedMotionVariants = () => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
});

export const getReducedMotionTransition = () => ({
  duration: DURATION.instant,
});
