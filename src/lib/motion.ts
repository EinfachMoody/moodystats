// Shared motion primitives to keep animations consistent and layout-stable.
// Only opacity-based transitions here to avoid any perceived layout shifting.

export const fadeInOut = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

export const fadeTransition = {
  duration: 0.22,
  ease: 'easeOut',
} as const;
