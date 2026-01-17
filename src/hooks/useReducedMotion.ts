import { useState, useEffect } from 'react';

/**
 * Hook to detect user's reduced motion preference.
 * Returns true if the user prefers reduced motion.
 */
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    return undefined;
  }, []);

  return prefersReducedMotion;
};

/**
 * Get motion props based on reduced motion preference.
 * Use this for inline motion configuration.
 */
export const getMotionProps = (prefersReducedMotion: boolean) => ({
  initial: prefersReducedMotion ? false : undefined,
  animate: prefersReducedMotion ? false : undefined,
  transition: prefersReducedMotion ? { duration: 0 } : undefined,
});
