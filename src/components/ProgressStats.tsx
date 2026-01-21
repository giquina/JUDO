import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Flame, Target, Trophy, TrendingUp } from "lucide-react";
import { currentUserStats, allAchievements } from "@/data/gamificationMockData";

interface ProgressStatsProps {
  className?: string;
}

export default function ProgressStats({ className }: ProgressStatsProps) {
  const unlockedCount = allAchievements.filter((a) => a.unlocked).length;
  const totalCount = allAchievements.length;
  const achievementProgress = (unlockedCount / totalCount) * 100;

  const nextMilestone = currentUserStats.nextMilestone;
  const milestoneProgress = (nextMilestone.progress / nextMilestone.maxProgress) * 100;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Your Progress
        </CardTitle>
        <CardDescription>Track your training journey</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Streak */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Current Streak</p>
                <p className="text-xs text-muted-foreground">Keep it going!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-orange-500">{currentUserStats.currentStreak}</p>
              <p className="text-xs text-muted-foreground">days</p>
            </div>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentUserStats.currentStreak / currentUserStats.longestStreak) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-red-500"
            />
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Best: {currentUserStats.longestStreak} days
          </p>
        </motion.div>

        {/* Total Sessions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Sessions</p>
                <p className="text-xs text-muted-foreground">All-time attendance</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-500">{currentUserStats.totalSessions}</p>
          </div>
        </motion.div>

        {/* Next Milestone */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Target className="h-5 w-5 text-purple-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Next Milestone</p>
              <p className="text-xs text-muted-foreground">{nextMilestone.name}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {nextMilestone.progress}/{nextMilestone.maxProgress}
              </p>
            </div>
          </div>
          <div className="relative h-3 bg-white/50 dark:bg-black/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${milestoneProgress}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
            />
          </div>
          <p className="text-xs text-muted-foreground">{nextMilestone.description}</p>
        </motion.div>

        {/* Achievements Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-950 flex items-center justify-center">
                <span className="text-xl">🏅</span>
              </div>
              <div>
                <p className="text-sm font-medium">Badges Earned</p>
                <p className="text-xs text-muted-foreground">Unlock them all!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {unlockedCount}/{totalCount}
              </p>
            </div>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${achievementProgress}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-500 to-amber-500"
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {totalCount - unlockedCount} more to unlock
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}
