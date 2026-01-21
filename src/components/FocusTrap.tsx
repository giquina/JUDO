import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface FocusTrapProps {
  children: ReactNode;
  active?: boolean;
  restoreFocus?: boolean;
  className?: string;
}

/**
 * FocusTrap component traps keyboard focus within its children
 * Useful for modals, dialogs, and other overlay components
 * Follows WCAG 2.1 Level AA guidelines for keyboard navigation
 */
export function FocusTrap({
  children,
  active = true,
  restoreFocus = true,
  className,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Store the currently focused element to restore focus later
    previousActiveElement.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    // Get all focusable elements within the container
    const getFocusableElements = (): HTMLElement[] => {
      if (!container) return [];

      const focusableSelectors = [
        'a[href]',
        'area[href]',
        'input:not([disabled]):not([type="hidden"])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'button:not([disabled])',
        'iframe',
        'object',
        'embed',
        '[contenteditable]',
        '[tabindex]:not([tabindex^="-"])',
      ].join(',');

      return Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelectors)
      ).filter((element) => {
        // Filter out hidden elements
        return (
          element.offsetWidth > 0 &&
          element.offsetHeight > 0 &&
          window.getComputedStyle(element).visibility !== 'hidden'
        );
      });
    };

    // Focus the first focusable element
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab: move to previous element (or wrap to last)
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      }
      // Tab: move to next element (or wrap to first)
      else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Add event listener for Tab key
    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);

      // Restore focus to the previously focused element
      if (
        restoreFocus &&
        previousActiveElement.current &&
        typeof previousActiveElement.current.focus === 'function'
      ) {
        previousActiveElement.current.focus();
      }
    };
  }, [active, restoreFocus]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
