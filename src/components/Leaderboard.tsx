import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Clock, Target } from "lucide-react";
import {
  leaderboardAttendance,
  leaderboardStreak,
  leaderboardMatTime,
  leaderboardAllTime,
  CURRENT_USER_ID,
  currentUserStats,
  type LeaderboardEntry,
} from "@/data/gamificationMockData";

const BELT_COLORS: Record<string, string> = {
  white: "bg-gray-100 text-gray-800",
  yellow: "bg-yellow-100 text-yellow-800",
  orange: "bg-orange-100 text-orange-800",
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-600 text-white",
  brown: "bg-amber-800 text-white",
  black: "bg-gray-900 text-white",
};

const MEDAL_EMOJIS: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

interface LeaderboardProps {
  className?: string;
}

type LeaderboardType = "attendance" | "streak" | "matTime" | "allTime";

const leaderboardData: Record<LeaderboardType, LeaderboardEntry[]> = {
  attendance: leaderboardAttendance,
  streak: leaderboardStreak,
  matTime: leaderboardMatTime,
  allTime: leaderboardAllTime,
};

const leaderboardConfig = {
  attendance: {
    title: "Attendance This Month",
    icon: Target,
    emoji: "🔥",
    suffix: " sessions",
  },
  streak: {
    title: "Current Streak",
    icon: Flame,
    emoji: "⚡",
    suffix: " days",
  },
  matTime: {
    title: "Total Mat Time",
    icon: Clock,
    emoji: "⏱️",
    suffix: " hrs",
  },
  allTime: {
    title: "All-Time Sessions",
    icon: Trophy,
    emoji: "🏆",
    suffix: " total",
  },
};

export default function Leaderboard({ className }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<LeaderboardType>("attendance");

  const currentData = leaderboardData[activeTab];
  const userRank = currentUserStats.rank[activeTab];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
        <CardDescription>See how you rank against other members</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as LeaderboardType)}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="attendance" className="text-xs md:text-sm">
              <span className="mr-1">🔥</span>
              <span className="hidden sm:inline">Attendance</span>
              <span className="sm:hidden">Month</span>
            </TabsTrigger>
            <TabsTrigger value="streak" className="text-xs md:text-sm">
              <span className="mr-1">⚡</span>
              <span className="hidden sm:inline">Streak</span>
              <span className="sm:hidden">Streak</span>
            </TabsTrigger>
            <TabsTrigger value="matTime" className="text-xs md:text-sm">
              <span className="mr-1">⏱️</span>
              <span className="hidden sm:inline">Mat Time</span>
              <span className="sm:hidden">Time</span>
            </TabsTrigger>
            <TabsTrigger value="allTime" className="text-xs md:text-sm">
              <span className="mr-1">🏆</span>
              <span className="hidden sm:inline">All-Time</span>
              <span className="sm:hidden">Total</span>
            </TabsTrigger>
          </TabsList>

          {(["attendance", "streak", "matTime", "allTime"] as LeaderboardType[]).map((type) => (
            <TabsContent key={type} value={type} className="mt-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  {/* User Rank Banner */}
                  {userRank <= 10 ? (
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="mb-4 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800 rounded-lg"
                    >
                      <p className="text-sm font-medium text-center">
                        <span className="text-blue-600 dark:text-blue-400">You're ranked #{userRank}</span>{" "}
                        in {leaderboardConfig[type].title.toLowerCase()}!
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="mb-4 p-3 bg-muted/50 border rounded-lg"
                    >
                      <p className="text-sm text-muted-foreground text-center">
                        You're ranked #{userRank} overall - keep training to reach the top 10!
                      </p>
                    </motion.div>
                  )}

                  {/* Leaderboard Entries */}
                  {currentData.map((entry, index) => {
                    const isCurrentUser = entry.id === CURRENT_USER_ID;
                    const rank = index + 1;

                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                          isCurrentUser
                            ? "bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700 shadow-md"
                            : "bg-card hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {/* Rank */}
                          <div className="w-8 text-center">
                            {MEDAL_EMOJIS[rank] ? (
                              <span className="text-2xl">{MEDAL_EMOJIS[rank]}</span>
                            ) : (
                              <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
                            )}
                          </div>

                          {/* Avatar/Initial */}
                          <div
                            className={`w-10 h-10 rounded-full ${
                              isCurrentUser
                                ? "bg-gradient-to-br from-blue-500 to-purple-600"
                                : "bg-gradient-to-br from-gray-400 to-gray-600"
                            } flex items-center justify-center text-white font-bold shadow-md`}
                          >
                            {entry.name.charAt(0)}
                          </div>

                          {/* Name and Belt */}
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${isCurrentUser ? "text-blue-700 dark:text-blue-300" : ""}`}>
                              {entry.name}
                              {isCurrentUser && <span className="ml-2 text-sm">(You)</span>}
                            </p>
                            <Badge className={`${BELT_COLORS[entry.beltRank]} text-xs mt-1`}>
                              {entry.beltRank}
                            </Badge>
                          </div>
                        </div>

                        {/* Score */}
                        <div className="text-right">
                          <motion.p
                            key={`${entry.id}-${entry.value}`}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className={`text-2xl font-bold ${
                              isCurrentUser
                                ? "text-blue-700 dark:text-blue-400"
                                : "text-foreground"
                            }`}
                          >
                            {entry.value}
                          </motion.p>
                          <p className="text-xs text-muted-foreground">
                            {leaderboardConfig[type].suffix.trim()}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
