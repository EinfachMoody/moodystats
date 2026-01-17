import { useState, useEffect, useMemo } from 'react';

/**
 * Hook to detect user's reduced motion preference.
 * Combines system preference with manual app setting.
 * Returns true if the user prefers reduced motion.
 */
export const useReducedMotion = (manualSetting?: boolean): boolean => {
  const [systemPrefersReducedMotion, setSystemPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    return undefined;
  }, []);

  // Manual setting overrides system preference
  return manualSetting ?? systemPrefersReducedMotion;
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

/**
 * Get animation transition based on reduced motion.
 */
export const getTransition = (prefersReducedMotion: boolean, normalDuration = 0.2) => 
  prefersReducedMotion 
    ? { duration: 0 } 
    : { duration: normalDuration, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };
