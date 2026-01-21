import { useEffect, useRef } from "react";

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description?: string;
  callback: () => void;
  preventDefault?: boolean;
}

interface SequentialShortcut {
  sequence: string[];
  description?: string;
  callback: () => void;
  timeout?: number; // ms to wait between keys (default: 1000)
}

/**
 * Hook for registering global keyboard shortcuts
 * Supports modifier keys (Ctrl/Cmd, Shift, Alt)
 * @param shortcuts - Array of keyboard shortcuts to register
 * @param enabled - Whether shortcuts are enabled
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const {
          key,
          ctrl = false,
          shift = false,
          alt = false,
          meta = false,
          callback,
          preventDefault = true,
        } = shortcut;

        // Check if the key matches
        const keyMatches = event.key.toLowerCase() === key.toLowerCase();

        // Check if modifiers match
        const ctrlMatches = ctrl === (event.ctrlKey || event.metaKey); // Cmd on Mac = Ctrl on Windows
        const shiftMatches = shift === event.shiftKey;
        const altMatches = alt === event.altKey;
        const metaMatches = meta === event.metaKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches) {
          if (preventDefault) {
            event.preventDefault();
          }
          callback();
          break; // Only trigger one shortcut per keypress
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

/**
 * Hook for registering sequential keyboard shortcuts (e.g., "G then M")
 * Useful for Gmail-style shortcuts
 * @param shortcuts - Array of sequential shortcuts
 * @param enabled - Whether shortcuts are enabled
 */
export function useSequentialShortcuts(
  shortcuts: SequentialShortcut[],
  enabled: boolean = true
) {
  const sequenceRef = useRef<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Add key to sequence
      sequenceRef.current.push(event.key.toLowerCase());

      // Check if any shortcut matches
      for (const shortcut of shortcuts) {
        const { sequence, callback, timeout = 1000 } = shortcut;

        // Check if current sequence matches
        if (sequencesMatch(sequenceRef.current, sequence)) {
          event.preventDefault();
          callback();
          sequenceRef.current = []; // Reset sequence
          return;
        }

        // Check if current sequence is a partial match
        if (isPartialMatch(sequenceRef.current, sequence)) {
          // Set timeout to reset sequence
          timeoutRef.current = setTimeout(() => {
            sequenceRef.current = [];
          }, timeout);
          return;
        }
      }

      // No match found, reset sequence
      sequenceRef.current = [];
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [shortcuts, enabled]);
}

/**
 * Check if two sequences match exactly
 */
function sequencesMatch(current: string[], target: string[]): boolean {
  if (current.length !== target.length) return false;
  return current.every((key, index) => key === target[index].toLowerCase());
}

/**
 * Check if current sequence is a partial match of target
 */
function isPartialMatch(current: string[], target: string[]): boolean {
  if (current.length >= target.length) return false;
  return current.every((key, index) => key === target[index].toLowerCase());
}

/**
 * Hook for a single keyboard shortcut
 * Convenience wrapper around useKeyboardShortcuts
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
    enabled?: boolean;
    preventDefault?: boolean;
  } = {}
) {
  const {
    ctrl = false,
    shift = false,
    alt = false,
    meta = false,
    enabled = true,
    preventDefault = true,
  } = options;

  const shortcuts: KeyboardShortcut[] = [
    {
      key,
      ctrl,
      shift,
      alt,
      meta,
      callback,
      preventDefault,
    },
  ];

  useKeyboardShortcuts(shortcuts, enabled);
}

/**
 * Hook for common application shortcuts
 * Provides standard shortcuts like Cmd+K for search, Cmd+/ for help, etc.
 */
export function useCommonShortcuts(handlers: {
  onSearch?: () => void;
  onHelp?: () => void;
  onSettings?: () => void;
  onHome?: () => void;
  onEscape?: () => void;
  onRefresh?: () => void;
}) {
  const shortcuts: KeyboardShortcut[] = [];

  if (handlers.onSearch) {
    shortcuts.push({
      key: 'k',
      ctrl: true,
      description: 'Search',
      callback: handlers.onSearch,
    });
  }

  if (handlers.onHelp) {
    shortcuts.push({
      key: '?',
      shift: true,
      description: 'Help',
      callback: handlers.onHelp,
    });
  }

  if (handlers.onSettings) {
    shortcuts.push({
      key: ',',
      ctrl: true,
      description: 'Settings',
      callback: handlers.onSettings,
    });
  }

  if (handlers.onHome) {
    shortcuts.push({
      key: 'h',
      ctrl: true,
      description: 'Home',
      callback: handlers.onHome,
    });
  }

  if (handlers.onEscape) {
    shortcuts.push({
      key: 'Escape',
      description: 'Close/Cancel',
      callback: handlers.onEscape,
    });
  }

  if (handlers.onRefresh) {
    shortcuts.push({
      key: 'r',
      ctrl: true,
      description: 'Refresh',
      callback: handlers.onRefresh,
      preventDefault: false, // Allow browser refresh
    });
  }

  useKeyboardShortcuts(shortcuts);
}

/**
 * Hook that returns whether Cmd (Mac) or Ctrl (Windows/Linux) is pressed
 * Useful for displaying correct modifier key in UI
 */
export function useIsMac(): boolean {
  return typeof window !== 'undefined' && /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
}

/**
 * Get the correct modifier key symbol for the current platform
 */
export function getModifierSymbol(): string {
  const isMac = typeof window !== 'undefined' && /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
  return isMac ? '⌘' : 'Ctrl';
}

/**
 * Format a keyboard shortcut for display
 */
export function formatShortcut(shortcut: Omit<KeyboardShortcut, 'callback'>): string {
  const parts: string[] = [];
  const isMac = typeof window !== 'undefined' && /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

  if (shortcut.ctrl) {
    parts.push(isMac ? '⌘' : 'Ctrl');
  }
  if (shortcut.shift) {
    parts.push(isMac ? '⇧' : 'Shift');
  }
  if (shortcut.alt) {
    parts.push(isMac ? '⌥' : 'Alt');
  }
  if (shortcut.meta && !isMac) {
    parts.push('Meta');
  }

  parts.push(shortcut.key.toUpperCase());

  return parts.join(isMac ? '' : '+');
}
