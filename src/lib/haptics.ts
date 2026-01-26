// Haptic feedback utilities for mobile devices

type HapticPattern = "light" | "medium" | "heavy" | "success" | "warning" | "error" | "selection";

const patterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 20],
  warning: [20, 50, 20, 50, 20],
  error: [50, 100, 50],
  selection: 5,
};

/**
 * Trigger haptic feedback on supported devices
 * Falls back gracefully on unsupported devices
 */
export function haptic(pattern: HapticPattern = "light"): void {
  if (!navigator.vibrate) return;

  try {
    const vibration = patterns[pattern];
    navigator.vibrate(vibration);
  } catch {
    // Silently fail on unsupported devices
  }
}

/**
 * Check if haptic feedback is supported
 */
export function isHapticSupported(): boolean {
  return "vibrate" in navigator;
}

/**
 * React hook for haptic feedback
 */
export function useHaptic() {
  const trigger = (pattern: HapticPattern = "light") => {
    haptic(pattern);
  };

  const light = () => trigger("light");
  const medium = () => trigger("medium");
  const heavy = () => trigger("heavy");
  const success = () => trigger("success");
  const warning = () => trigger("warning");
  const error = () => trigger("error");
  const selection = () => trigger("selection");

  return {
    trigger,
    light,
    medium,
    heavy,
    success,
    warning,
    error,
    selection,
    isSupported: isHapticSupported(),
  };
}

/**
 * Higher-order function to add haptic feedback to click handlers
 */
export function withHaptic<T extends (...args: unknown[]) => void>(
  handler: T,
  pattern: HapticPattern = "light"
): T {
  return ((...args: unknown[]) => {
    haptic(pattern);
    return handler(...args);
  }) as T;
}
