import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff, RefreshCw, CloudOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NetworkStatusProps {
  showOnlineConfirmation?: boolean;
}

export default function NetworkStatus({ showOnlineConfirmation = true }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnlineBanner, setShowOnlineBanner] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline && showOnlineConfirmation) {
        setShowOnlineBanner(true);
        setTimeout(() => setShowOnlineBanner(false), 3000);
      }
      setWasOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [wasOffline, showOnlineConfirmation]);

  return (
    <>
      {/* Offline Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-[100] bg-destructive text-destructive-foreground"
          >
            <div className="flex items-center justify-center gap-3 px-4 py-3">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">You're offline</span>
              <span className="text-xs opacity-80">Some features may be unavailable</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Online Banner */}
      <AnimatePresence>
        {showOnlineBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-[100] bg-green-600 text-white"
          >
            <div className="flex items-center justify-center gap-3 px-4 py-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <Check className="h-4 w-4" />
              </motion.div>
              <span className="text-sm font-medium">Back online</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Hook to check network status
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check connection quality if available
    const connection = (navigator as Navigator & { connection?: { effectiveType: string } }).connection;
    if (connection) {
      queueMicrotask(() => {
        setIsSlowConnection(connection.effectiveType === "slow-2g" || connection.effectiveType === "2g");
      });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, isSlowConnection };
}

// Offline fallback component
export function OfflineFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6"
      >
        <CloudOff className="w-10 h-10 text-muted-foreground" />
      </motion.div>

      <h2 className="text-xl font-semibold mb-2">No Connection</h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        It looks like you're offline. Check your connection and try again.
      </p>

      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}

      <div className="mt-8 p-4 rounded-lg bg-muted/50 max-w-sm">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Wifi className="h-4 w-4" />
          <span>Waiting for connection...</span>
        </div>
      </div>
    </motion.div>
  );
}

// Sync indicator for showing pending changes
export function SyncIndicator({ pendingCount = 0 }: { pendingCount?: number }) {
  if (pendingCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-24 right-4 md:bottom-4 z-50"
    >
      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-amber-500 text-white text-sm shadow-lg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="h-4 w-4" />
        </motion.div>
        <span>{pendingCount} pending</span>
      </div>
    </motion.div>
  );
}
