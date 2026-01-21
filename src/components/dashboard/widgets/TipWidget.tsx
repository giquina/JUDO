import * as React from "react";
import { Lightbulb, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TrainingTip {
  id: string;
  title: string;
  content: string;
  category: "technique" | "fitness" | "mindset" | "nutrition";
  difficulty?: "beginner" | "intermediate" | "advanced";
}

export interface TipWidgetProps {
  tip: TrainingTip;
  onNext?: () => void;
  onDismiss?: () => void;
  className?: string;
}

const categoryColors = {
  technique: "text-blue-500 bg-blue-500/10",
  fitness: "text-green-500 bg-green-500/10",
  mindset: "text-purple-500 bg-purple-500/10",
  nutrition: "text-orange-500 bg-orange-500/10",
};

export function TipWidget({ tip, onNext, onDismiss, className }: TipWidgetProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-gradient-to-br from-yellow-500/5 to-orange-500/5 p-6",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            <Lightbulb className="h-5 w-5 text-yellow-500" />
          </motion.div>
          <div>
            <span className="text-xs font-medium text-muted-foreground">
              Daily Tip
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  categoryColors[tip.category]
                )}
              >
                {tip.category}
              </span>
              {tip.difficulty && (
                <span className="text-xs text-muted-foreground">
                  {tip.difficulty}
                </span>
              )}
            </div>
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-accent rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="font-semibold text-base">{tip.title}</h3>

        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-muted-foreground"
            >
              {tip.content}
            </motion.p>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-muted-foreground line-clamp-2"
            >
              {tip.content}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium text-primary hover:underline"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>

        {onNext && (
          <button
            onClick={onNext}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Next tip</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
