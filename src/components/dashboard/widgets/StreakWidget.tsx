import { Flame, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface StreakWidgetProps {
  currentStreak: number;
  longestStreak: number;
  onClick?: () => void;
  className?: string;
}

export function StreakWidget({
  currentStreak,
  longestStreak,
  onClick,
  className,
}: StreakWidgetProps) {
  const isRecord = currentStreak >= longestStreak;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 cursor-pointer transition-shadow hover:shadow-lg",
        className
      )}
    >
      {/* Background flame animation */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-full w-full bg-gradient-to-t from-orange-500 to-red-500"
        />
      </div>

      <div className="relative flex items-center justify-between">
        {/* Streak info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
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
              <Flame className="h-5 w-5 text-orange-500" />
            </motion.div>
            <span className="text-sm font-medium text-muted-foreground">
              Training Streak
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <motion.span
              key={currentStreak}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-bold"
            >
              {currentStreak}
            </motion.span>
            <span className="text-lg text-muted-foreground">days</span>
          </div>

          {/* Record indicator */}
          {isRecord && currentStreak > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 mt-2 text-xs font-medium text-orange-600"
            >
              <TrendingUp className="h-3 w-3" />
              <span>Personal Record!</span>
            </motion.div>
          )}
        </div>

        {/* Longest streak */}
        <div className="text-right">
          <div className="text-xs text-muted-foreground mb-1">Best</div>
          <div className="text-2xl font-bold text-muted-foreground/60">
            {longestStreak}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="relative mt-4">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((currentStreak / 30) * 100, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-orange-500 to-red-500"
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">Keep going!</span>
          <span className="text-xs text-muted-foreground">
            {30 - currentStreak > 0 ? `${30 - currentStreak} to 30 days` : "30+ days!"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
