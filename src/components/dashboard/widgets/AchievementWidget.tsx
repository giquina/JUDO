import { Trophy, Star, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: "trophy" | "star" | "award" | "zap";
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt: Date;
  points?: number;
}

export interface AchievementWidgetProps {
  achievement: Achievement;
  onClick?: () => void;
  className?: string;
}

const icons = {
  trophy: Trophy,
  star: Star,
  award: Award,
  zap: Zap,
};

const rarityStyles = {
  common: {
    border: "border-gray-500/30",
    bg: "bg-gray-500/10",
    text: "text-gray-500",
    gradient: "from-gray-500/20 to-gray-600/20",
  },
  rare: {
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    gradient: "from-blue-500/20 to-blue-600/20",
  },
  epic: {
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    text: "text-purple-500",
    gradient: "from-purple-500/20 to-purple-600/20",
  },
  legendary: {
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/10",
    text: "text-yellow-500",
    gradient: "from-yellow-500/20 to-yellow-600/20",
  },
};

export function AchievementWidget({
  achievement,
  onClick,
  className,
}: AchievementWidgetProps) {
  const Icon = icons[achievement.icon || "trophy"];
  const styles = rarityStyles[achievement.rarity];

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-xl border p-6 cursor-pointer transition-shadow hover:shadow-lg",
        styles.border,
        `bg-gradient-to-br ${styles.gradient}`,
        className
      )}
    >
      {/* Shine effect */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      {/* Content */}
      <div className="relative">
        {/* Icon */}
        <div className="flex items-center justify-between mb-4">
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className={cn("p-3 rounded-lg", styles.bg)}
          >
            <Icon className={cn("h-6 w-6", styles.text)} />
          </motion.div>

          <span
            className={cn(
              "text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider",
              styles.bg,
              styles.text
            )}
          >
            {achievement.rarity}
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2 mb-4">
          <h3 className="font-bold text-lg">{achievement.title}</h3>
          <p className="text-sm text-muted-foreground">
            {achievement.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Unlocked {achievement.unlockedAt.toLocaleDateString()}
          </span>
          {achievement.points && (
            <span className="font-semibold">+{achievement.points} XP</span>
          )}
        </div>
      </div>

      {/* Particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "100%", x: `${Math.random() * 100}%`, opacity: 0 }}
            animate={{
              y: "-100%",
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear",
            }}
            className={cn("absolute w-1 h-1 rounded-full", styles.bg)}
          />
        ))}
      </div>
    </motion.div>
  );
}
