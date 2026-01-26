import { useRef, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface SwipeConfig {
  threshold?: number;
  enabled?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

interface NavRoute {
  path: string;
  prev?: string;
  next?: string;
}

// Define navigation order for each role
const memberRoutes: NavRoute[] = [
  { path: "/member", next: "/member/classes" },
  { path: "/member/classes", prev: "/member", next: "/member/checkin" },
  { path: "/member/checkin", prev: "/member/classes", next: "/member/progress" },
  { path: "/member/progress", prev: "/member/checkin", next: "/member/profile" },
  { path: "/member/profile", prev: "/member/progress" },
];

const coachRoutes: NavRoute[] = [
  { path: "/coach", next: "/coach/classes" },
  { path: "/coach/classes", prev: "/coach", next: "/coach/attendance" },
  { path: "/coach/attendance", prev: "/coach/classes", next: "/coach/members" },
  { path: "/coach/members", prev: "/coach/attendance", next: "/coach/profile" },
  { path: "/coach/profile", prev: "/coach/members" },
];

const adminRoutes: NavRoute[] = [
  { path: "/admin", next: "/admin/members" },
  { path: "/admin/members", prev: "/admin", next: "/admin/payments" },
  { path: "/admin/payments", prev: "/admin/members", next: "/admin/analytics" },
  { path: "/admin/analytics", prev: "/admin/payments", next: "/admin/settings" },
  { path: "/admin/settings", prev: "/admin/analytics" },
];

export function useSwipeNavigation(config: SwipeConfig = {}) {
  const { threshold = 75, enabled = true, onSwipeLeft, onSwipeRight } = config;

  const navigate = useNavigate();
  const location = useLocation();
  const touchStart = useRef({ x: 0, y: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });

  const getCurrentRoute = useCallback(() => {
    const path = location.pathname;

    // Find current route in any role's routes
    const allRoutes = [...memberRoutes, ...coachRoutes, ...adminRoutes];
    return allRoutes.find((r) => r.path === path);
  }, [location.pathname]);

  const handleSwipe = useCallback(() => {
    if (!enabled) return;

    const deltaX = touchStart.current.x - touchEnd.current.x;
    const deltaY = touchStart.current.y - touchEnd.current.y;

    // Only handle horizontal swipes (ignore vertical)
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;
    if (Math.abs(deltaX) < threshold) return;

    const currentRoute = getCurrentRoute();
    if (!currentRoute) return;

    if (deltaX > 0 && currentRoute.next) {
      // Swipe left -> go to next page
      if (onSwipeLeft) {
        onSwipeLeft();
      } else {
        navigate(currentRoute.next);
      }
    } else if (deltaX < 0 && currentRoute.prev) {
      // Swipe right -> go to previous page
      if (onSwipeRight) {
        onSwipeRight();
      } else {
        navigate(currentRoute.prev);
      }
    }
  }, [enabled, threshold, getCurrentRoute, navigate, onSwipeLeft, onSwipeRight]);

  const onTouchStart = useCallback((e: TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    touchEnd.current = { ...touchStart.current };
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    touchEnd.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  const onTouchEnd = useCallback(() => {
    handleSwipe();
  }, [handleSwipe]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [enabled, onTouchStart, onTouchMove, onTouchEnd]);

  return { getCurrentRoute };
}

// Hook for pull-to-refresh integration with data refetching
export function usePullToRefresh(refetchFn?: () => Promise<void>) {
  const handleRefresh = useCallback(async () => {
    if (refetchFn) {
      await refetchFn();
    } else {
      // Default: wait 1 second (simulated refresh)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }, [refetchFn]);

  return handleRefresh;
}

// Hook for long-press actions
export function useLongPress(
  callback: () => void,
  options: { threshold?: number; disabled?: boolean } = {}
) {
  const { threshold = 500, disabled = false } = options;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const start = useCallback(() => {
    if (disabled) return;

    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      callback();
      // Haptic feedback would go here
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, threshold);
  }, [callback, threshold, disabled]);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handlers = {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
  };

  return { handlers, isLongPress: () => isLongPress.current };
}
