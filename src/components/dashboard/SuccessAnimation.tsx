import * as React from "react";
import { CheckCircle2, Trophy, Flame, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type AnimationType = "checkmark" | "trophy" | "flame" | "belt";

export interface SuccessAnimationProps {
  type: AnimationType;
  show: boolean;
  onComplete?: () => void;
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-12 w-12",
  md: "h-20 w-20",
  lg: "h-32 w-32",
};

const iconSizes = {
  sm: "h-6 w-6",
  md: "h-10 w-10",
  lg: "h-16 w-16",
};

export function SuccessAnimation({
  type,
  show,
  onComplete,
  message,
  size = "md",
  className,
}: SuccessAnimationProps) {
  React.useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  const renderIcon = () => {
    const iconClass = iconSizes[size];

    switch (type) {
      case "checkmark":
        return <CheckCircle2 className={cn(iconClass, "text-green-500")} />;
      case "trophy":
        return <Trophy className={cn(iconClass, "text-yellow-500")} />;
      case "flame":
        return <Flame className={cn(iconClass, "text-orange-500")} />;
      case "belt":
        return <Award className={cn(iconClass, "text-purple-500")} />;
      default:
        return <CheckCircle2 className={cn(iconClass, "text-green-500")} />;
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
            className
          )}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: [0, 1.2, 1],
              rotate: 0,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="flex flex-col items-center gap-4"
          >
            {/* Icon with pulse effect */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
              }}
              className={cn(
                "flex items-center justify-center rounded-full bg-background shadow-2xl",
                sizeClasses[size]
              )}
            >
              {renderIcon()}
            </motion.div>

            {/* Message */}
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-semibold text-white text-center px-4"
              >
                {message}
              </motion.p>
            )}

            {/* Ripple effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{
                    scale: 3,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.3,
                    repeat: Infinity,
                  }}
                  className={cn(
                    "absolute rounded-full border-4",
                    type === "checkmark" && "border-green-500",
                    type === "trophy" && "border-yellow-500",
                    type === "flame" && "border-orange-500",
                    type === "belt" && "border-purple-500",
                    sizeClasses[size]
                  )}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Checkmark animation
export function CheckmarkAnimation({
  show,
  onComplete,
  message = "Success!",
}: Omit<SuccessAnimationProps, "type">) {
  return (
    <SuccessAnimation
      type="checkmark"
      show={show}
      onComplete={onComplete}
      message={message}
    />
  );
}

// Trophy animation
export function TrophyAnimation({
  show,
  onComplete,
  message = "Achievement Unlocked!",
}: Omit<SuccessAnimationProps, "type">) {
  return (
    <SuccessAnimation
      type="trophy"
      show={show}
      onComplete={onComplete}
      message={message}
    />
  );
}

// Flame animation (for streaks)
export function FlameAnimation({
  show,
  onComplete,
  message = "Streak Milestone!",
}: Omit<SuccessAnimationProps, "type">) {
  return (
    <SuccessAnimation
      type="flame"
      show={show}
      onComplete={onComplete}
      message={message}
    />
  );
}

// Belt upgrade animation
export function BeltUpgradeAnimation({
  show,
  onComplete,
  message = "Belt Promotion!",
}: Omit<SuccessAnimationProps, "type">) {
  return (
    <SuccessAnimation
      type="belt"
      show={show}
      onComplete={onComplete}
      message={message}
      size="lg"
    />
  );
}
