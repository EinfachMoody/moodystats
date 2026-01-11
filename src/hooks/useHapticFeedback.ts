/**
 * Haptic Feedback Hook for iOS-native feel
 * Uses the Vibration API with fallback for unsupported browsers
 */

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

const vibrationPatterns: Record<HapticStyle, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 10],
  warning: [20, 40, 20],
  error: [30, 50, 30, 50, 30],
};

export const useHapticFeedback = () => {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const trigger = (style: HapticStyle = 'light') => {
    if (!isSupported) return;
    
    try {
      const pattern = vibrationPatterns[style];
      navigator.vibrate(pattern);
    } catch (e) {
      // Silently fail if vibration is not available
    }
  };

  const light = () => trigger('light');
  const medium = () => trigger('medium');
  const heavy = () => trigger('heavy');
  const success = () => trigger('success');
  const warning = () => trigger('warning');
  const error = () => trigger('error');

  return {
    trigger,
    light,
    medium,
    heavy,
    success,
    warning,
    error,
    isSupported,
  };
};

// Standalone function for use outside React components
export const triggerHaptic = (style: HapticStyle = 'light') => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(vibrationPatterns[style]);
    } catch (e) {
      // Silently fail
    }
  }
};
