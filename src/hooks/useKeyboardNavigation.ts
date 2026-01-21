import { useEffect, useCallback, useRef } from "react";

/**
 * Hook for handling arrow key navigation in lists
 * @param itemCount - Total number of items in the list
 * @param onNavigate - Callback when arrow key is pressed with new index
 * @param enabled - Whether navigation is enabled
 * @param loop - Whether to loop from end to start (default: true)
 */
export function useArrowNavigation(
  itemCount: number,
  onNavigate: (index: number) => void,
  enabled: boolean = true,
  loop: boolean = true
) {
  const currentIndexRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        return;
      }

      event.preventDefault();

      let newIndex = currentIndexRef.current;

      // Vertical navigation
      if (event.key === 'ArrowDown') {
        newIndex++;
      } else if (event.key === 'ArrowUp') {
        newIndex--;
      }
      // Horizontal navigation
      else if (event.key === 'ArrowRight') {
        newIndex++;
      } else if (event.key === 'ArrowLeft') {
        newIndex--;
      }

      // Handle looping
      if (loop) {
        if (newIndex >= itemCount) {
          newIndex = 0;
        } else if (newIndex < 0) {
          newIndex = itemCount - 1;
        }
      } else {
        // Clamp to valid range
        newIndex = Math.max(0, Math.min(itemCount - 1, newIndex));
      }

      currentIndexRef.current = newIndex;
      onNavigate(newIndex);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, itemCount, onNavigate, loop]);

  // Method to manually set current index
  const setCurrentIndex = useCallback((index: number) => {
    currentIndexRef.current = index;
  }, []);

  return { setCurrentIndex };
}

/**
 * Hook for handling Escape key to close modals/dialogs
 * @param onClose - Callback when Escape is pressed
 * @param enabled - Whether the handler is enabled
 */
export function useEscapeKey(
  onClose: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, enabled]);
}

/**
 * Hook for handling Enter key to submit/activate
 * @param onEnter - Callback when Enter is pressed
 * @param enabled - Whether the handler is enabled
 * @param preventDefault - Whether to prevent default behavior
 */
export function useEnterKey(
  onEnter: () => void,
  enabled: boolean = true,
  preventDefault: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (preventDefault) {
          event.preventDefault();
        }
        onEnter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEnter, enabled, preventDefault]);
}

/**
 * Hook for handling Space key to activate buttons/checkboxes
 * @param onSpace - Callback when Space is pressed
 * @param enabled - Whether the handler is enabled
 */
export function useSpaceKey(
  onSpace: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        onSpace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSpace, enabled]);
}

/**
 * Hook for making an element keyboard accessible
 * Adds role, tabIndex, and keyboard event handlers
 * @param onClick - Click/activation handler
 * @param options - Configuration options
 */
export function useKeyboardAccessible(
  onClick: () => void,
  options: {
    role?: string;
    disabled?: boolean;
    preventDefault?: boolean;
  } = {}
) {
  const {
    role = 'button',
    disabled = false,
    preventDefault = true,
  } = options;

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
        if (preventDefault) {
          event.preventDefault();
        }
        onClick();
      }
    },
    [onClick, disabled, preventDefault]
  );

  return {
    role,
    tabIndex: disabled ? -1 : 0,
    onKeyDown: handleKeyDown,
    onClick: disabled ? undefined : onClick,
    'aria-disabled': disabled,
  };
}

/**
 * Hook for managing focus within a list of items
 * Useful for dropdown menus, listboxes, etc.
 */
export function useListNavigation(itemCount: number) {
  const currentIndexRef = useRef(-1);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      let newIndex = currentIndexRef.current;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          newIndex = Math.min(itemCount - 1, newIndex + 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          newIndex = Math.max(0, newIndex - 1);
          break;
        case 'Home':
          event.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          newIndex = itemCount - 1;
          break;
        default:
          return;
      }

      currentIndexRef.current = newIndex;

      // Focus the element at the new index
      const items = document.querySelectorAll('[role="option"], [role="menuitem"]');
      const item = items[newIndex] as HTMLElement;
      if (item) {
        item.focus();
      }
    },
    [itemCount]
  );

  const setFocusedIndex = useCallback((index: number) => {
    currentIndexRef.current = index;
  }, []);

  return {
    handleKeyDown,
    setFocusedIndex,
    currentIndex: currentIndexRef.current,
  };
}

/**
 * Hook for handling common keyboard patterns on interactive elements
 * Combines Enter, Space, and Escape handlers
 */
export function useInteractiveKeyboard(
  onActivate: () => void,
  onDismiss?: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter':
        case ' ':
        case 'Spacebar':
          event.preventDefault();
          onActivate();
          break;
        case 'Escape':
          if (onDismiss) {
            event.preventDefault();
            onDismiss();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onActivate, onDismiss, enabled]);
}
