import { motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-b border-amber-500/20"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="body-small text-amber-900 dark:text-amber-100 font-medium">
                <span className="font-semibold">Demo Mode:</span> You're viewing simulated data.
                <span className="hidden sm:inline"> Real data will be available after Convex integration.</span>
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 hover:bg-amber-500/10 h-8 w-8 p-0"
            aria-label="Dismiss demo banner"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
