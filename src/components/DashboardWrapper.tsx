import { useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import PullToRefresh from "./PullToRefresh";
import { DashboardSkeleton } from "./Loading";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { haptic } from "@/lib/haptics";

interface DashboardWrapperProps {
  children: ReactNode;
  isLoading?: boolean;
  onRefresh?: () => Promise<void>;
  enableSwipeNavigation?: boolean;
  enablePullToRefresh?: boolean;
  className?: string;
}

/**
 * DashboardWrapper provides consistent UX features for all dashboard pages:
 * - Pull-to-refresh on mobile
 * - Swipe navigation between pages
 * - Loading skeleton during initial load
 * - Haptic feedback on interactions
 */
export default function DashboardWrapper({
  children,
  isLoading = false,
  onRefresh,
  enableSwipeNavigation = true,
  enablePullToRefresh = true,
  className = "",
}: DashboardWrapperProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showContent, setShowContent] = useState(!isLoading);

  // Enable swipe navigation
  useSwipeNavigation({ enabled: enableSwipeNavigation });

  // Handle refresh with haptic feedback
  const handleRefresh = useCallback(async () => {
    if (!onRefresh) {
      // Default refresh behavior - just wait and show toast
      setIsRefreshing(true);
      haptic("medium");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Refreshed!", { duration: 1500 });
      setIsRefreshing(false);
      return;
    }

    setIsRefreshing(true);
    haptic("medium");
    try {
      await onRefresh();
      toast.success("Refreshed!", { duration: 1500 });
      haptic("success");
    } catch (error) {
      toast.error("Failed to refresh");
      haptic("error");
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  // Handle loading state transition
  useEffect(() => {
    if (!isLoading) {
      // Small delay for smooth transition
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    }
    setShowContent(false);
  }, [isLoading]);

  // Show skeleton during initial load
  if (isLoading && !showContent) {
    return (
      <div className={`p-4 md:p-6 ${className}`}>
        <DashboardSkeleton />
      </div>
    );
  }

  // Mobile: wrap with PullToRefresh
  // Desktop: render directly
  const content = (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );

  // Only enable pull-to-refresh on mobile via CSS media query detection
  if (enablePullToRefresh && typeof window !== "undefined" && window.innerWidth < 768) {
    return (
      <PullToRefresh
        onRefresh={handleRefresh}
        disabled={isRefreshing}
        className="min-h-screen"
      >
        {content}
      </PullToRefresh>
    );
  }

  return content;
}

/**
 * Hook for dashboard data fetching with loading state
 */
export function useDashboardData<T>(
  fetchFn: () => Promise<T>,
  initialData: T
): {
  data: T;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
} {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      const result = await fetchFn();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err as Error);
    }
  }, [fetchFn]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await refresh();
      setIsLoading(false);
    };
    load();
  }, [refresh]);

  return { data, isLoading, error, refresh };
}

/**
 * Swipe indicator component - shows hint on first visit
 */
export function SwipeIndicator({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 md:hidden"
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border shadow-lg text-sm">
        <motion.span
          animate={{ x: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          👆
        </motion.span>
        <span className="text-muted-foreground">Swipe to navigate</span>
      </div>
    </motion.div>
  );
}
