import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { Achievement } from "@/data/gamificationMockData";

interface AchievementBadgeProps {
  achievement: Achievement;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: {
    container: "w-20 h-24",
    icon: "text-3xl",
    title: "text-xs",
    description: "text-[10px]",
    progress: "h-1",
  },
  md: {
    container: "w-28 h-32",
    icon: "text-4xl",
    title: "text-sm",
    description: "text-xs",
    progress: "h-1.5",
  },
  lg: {
    container: "w-36 h-40",
    icon: "text-5xl",
    title: "text-base",
    description: "text-sm",
    progress: "h-2",
  },
};

export default function AchievementBadge({ achievement, onClick, size = "md" }: AchievementBadgeProps) {
  const classes = sizeClasses[size];
  const progressPercentage = achievement.progress && achievement.maxProgress
    ? (achievement.progress / achievement.maxProgress) * 100
    : 0;

  const showProgress = !achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress !== undefined;

  return (
    <motion.div
      whileHover={achievement.unlocked ? { scale: 1.05, y: -5 } : { scale: 1.02 }}
      whileTap={achievement.unlocked ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={`${classes.container} cursor-pointer`}
    >
      <div
        className={`h-full flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${
          achievement.unlocked
            ? "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-yellow-400 dark:border-yellow-600 shadow-lg"
            : "bg-muted/50 border-muted-foreground/20 grayscale opacity-60"
        }`}
      >
        {/* Icon */}
        <div className="relative mb-2">
          <motion.div
            animate={
              achievement.unlocked
                ? {
                    rotate: [0, -10, 10, -10, 10, 0],
                  }
                : {}
            }
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            className={classes.icon}
          >
            {achievement.icon}
          </motion.div>

          {/* Lock overlay for locked achievements */}
          {!achievement.unlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full backdrop-blur-[1px]">
              <Lock className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Title */}
        <h4 className={`${classes.title} font-bold text-center line-clamp-2 mb-1`}>
          {achievement.title}
        </h4>

        {/* Description */}
        <p className={`${classes.description} text-muted-foreground text-center line-clamp-2`}>
          {achievement.description}
        </p>

        {/* Progress bar for close-to-unlock */}
        {showProgress && (
          <div className="w-full mt-2">
            <div className={`${classes.progress} bg-muted rounded-full overflow-hidden`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
              />
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-1">
              {achievement.progress}/{achievement.maxProgress}
            </p>
          </div>
        )}

        {/* Unlocked date */}
        {achievement.unlocked && achievement.unlockedDate && (
          <p className="text-[10px] text-muted-foreground text-center mt-1">
            {new Date(achievement.unlockedDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </motion.div>
  );
}
