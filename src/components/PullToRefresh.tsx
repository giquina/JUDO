import { useState, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { RefreshCw, Check } from "lucide-react";

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
  threshold?: number;
  className?: string;
}

type RefreshState = "idle" | "pulling" | "ready" | "refreshing" | "complete";

export default function PullToRefresh({
  children,
  onRefresh,
  disabled = false,
  threshold = 80,
  className = "",
}: PullToRefreshProps) {
  const [state, setState] = useState<RefreshState>("idle");
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const pullDistance = useMotionValue(0);

  // Transform pull distance to visual feedback
  const indicatorY = useTransform(pullDistance, [0, threshold], [0, threshold]);
  const indicatorOpacity = useTransform(pullDistance, [0, threshold / 2, threshold], [0, 0.5, 1]);
  const indicatorScale = useTransform(pullDistance, [0, threshold], [0.5, 1]);
  const indicatorRotation = useTransform(pullDistance, [0, threshold * 2], [0, 360]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || state === "refreshing") return;

      const container = containerRef.current;
      if (!container) return;

      // Only enable pull-to-refresh when at the top
      if (container.scrollTop <= 0) {
        startY.current = e.touches[0].clientY;
        setState("pulling");
      }
    },
    [disabled, state]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (state !== "pulling" && state !== "ready") return;

      const container = containerRef.current;
      if (!container || container.scrollTop > 0) {
        pullDistance.set(0);
        setState("idle");
        return;
      }

      const currentY = e.touches[0].clientY;
      const diff = Math.max(0, currentY - startY.current);

      // Apply resistance to the pull
      const resistance = 0.5;
      const resistedPull = diff * resistance;

      pullDistance.set(resistedPull);

      if (resistedPull >= threshold) {
        setState("ready");
      } else {
        setState("pulling");
      }
    },
    [state, threshold, pullDistance]
  );

  const handleTouchEnd = useCallback(async () => {
    if (state === "ready") {
      setState("refreshing");
      pullDistance.set(threshold);

      try {
        await onRefresh();
        setState("complete");
        // Show complete state briefly
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Refresh failed:", error);
      }
    }

    // Animate back
    pullDistance.set(0);
    setState("idle");
  }, [state, threshold, onRefresh, pullDistance]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Pull indicator */}
      <AnimatePresence>
        {state !== "idle" && (
          <motion.div
            className="absolute left-0 right-0 flex justify-center z-10 pointer-events-none"
            style={{ y: indicatorY, opacity: indicatorOpacity }}
            initial={{ y: -40 }}
            animate={{ y: indicatorY.get() - 40 }}
            exit={{ y: -40, opacity: 0 }}
          >
            <motion.div
              className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg ${
                state === "complete"
                  ? "bg-green-500"
                  : state === "ready" || state === "refreshing"
                  ? "bg-primary"
                  : "bg-card border"
              }`}
              style={{ scale: indicatorScale }}
            >
              {state === "complete" ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <Check className="w-5 h-5 text-white" />
                </motion.div>
              ) : state === "refreshing" ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-5 h-5 text-primary-foreground" />
                </motion.div>
              ) : (
                <motion.div style={{ rotate: indicatorRotation }}>
                  <RefreshCw
                    className={`w-5 h-5 ${
                      state === "ready" ? "text-primary-foreground" : "text-muted-foreground"
                    }`}
                  />
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pull hint text */}
      <AnimatePresence>
        {(state === "pulling" || state === "ready") && (
          <motion.div
            className="absolute left-0 right-0 text-center z-10 pointer-events-none"
            style={{ y: indicatorY, opacity: indicatorOpacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.p
              className="text-xs text-muted-foreground mt-12"
              animate={{ opacity: state === "ready" ? 1 : 0.7 }}
            >
              {state === "ready" ? "Release to refresh" : "Pull to refresh"}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content container */}
      <motion.div
        ref={containerRef}
        className="h-full overflow-auto overscroll-contain"
        style={{ y: state !== "idle" ? indicatorY : 0 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </motion.div>
    </div>
  );
}
