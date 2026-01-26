import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import MobileNavigation from "@/components/MobileNavigation";
import MemberSidebar from "@/components/MemberSidebar";
import PageTransition from "@/components/PageTransition";
import BeltJourney from "@/components/BeltJourney";
import {
  Trophy,
  Target,
  Flame,
  Clock,
  Calendar,
  Award,
  Star,
  Zap,
  TrendingUp,
  CheckCircle2,
  Medal,
  Dumbbell,
} from "lucide-react";

// Mock member progress data
const mockMember = {
  name: "Alice Chen",
  beltRank: "blue",
  totalSessions: 47,
  currentStreak: 4,
  longestStreak: 8,
  totalTrainingHours: 94,
  daysSincePromotion: 45,
  joinDate: "2024-06-15",
  monthlyGoal: 12,
  monthlyProgress: 8,
};

// Mock achievements
const mockAchievements = [
  {
    _id: "ach-1",
    name: "First Steps",
    description: "Complete your first training session",
    icon: "star",
    earnedAt: "2024-06-15",
    rarity: "common",
  },
  {
    _id: "ach-2",
    name: "Dedicated Judoka",
    description: "Attend 10 training sessions",
    icon: "flame",
    earnedAt: "2024-07-20",
    rarity: "common",
  },
  {
    _id: "ach-3",
    name: "Warrior Spirit",
    description: "Maintain a 4-week streak",
    icon: "zap",
    earnedAt: "2024-09-01",
    rarity: "rare",
  },
  {
    _id: "ach-4",
    name: "Belt Promotion",
    description: "Earn your first belt promotion",
    icon: "award",
    earnedAt: "2024-08-15",
    rarity: "rare",
  },
  {
    _id: "ach-5",
    name: "40 Sessions Club",
    description: "Complete 40 training sessions",
    icon: "trophy",
    earnedAt: "2024-12-10",
    rarity: "epic",
  },
];

// Mock locked achievements
const mockLockedAchievements = [
  {
    _id: "lock-1",
    name: "Century Club",
    description: "Complete 100 training sessions",
    icon: "medal",
    rarity: "legendary",
    progress: 47,
    target: 100,
  },
  {
    _id: "lock-2",
    name: "Iron Will",
    description: "Maintain a 12-week streak",
    icon: "flame",
    rarity: "epic",
    progress: 4,
    target: 12,
  },
  {
    _id: "lock-3",
    name: "Black Belt Journey",
    description: "Earn your black belt",
    icon: "award",
    rarity: "legendary",
    progress: 5,
    target: 7,
  },
];

// Mock goals
const mockGoals = [
  {
    _id: "goal-1",
    title: "Monthly Sessions",
    current: 8,
    target: 12,
    unit: "sessions",
    deadline: "End of January",
  },
  {
    _id: "goal-2",
    title: "Master Seoi-nage",
    current: 3,
    target: 5,
    unit: "successful throws in randori",
    deadline: "February grading",
  },
  {
    _id: "goal-3",
    title: "Competition Ready",
    current: 2,
    target: 4,
    unit: "competition training sessions",
    deadline: "March tournament",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 12 },
  },
};

// Achievement icon mapping
const achievementIcons: Record<string, typeof Trophy> = {
  star: Star,
  flame: Flame,
  zap: Zap,
  award: Award,
  trophy: Trophy,
  medal: Medal,
};

// Rarity colors
const rarityColors = {
  common: "from-gray-400 to-gray-500",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-amber-400 to-orange-500",
};

const rarityBg = {
  common: "bg-gray-100 dark:bg-gray-800 border-gray-300",
  rare: "bg-blue-50 dark:bg-blue-950/30 border-blue-300",
  epic: "bg-purple-50 dark:bg-purple-950/30 border-purple-300",
  legendary: "bg-amber-50 dark:bg-amber-950/30 border-amber-300",
};

// Animated counter hook
function AnimatedValue({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      {value}
    </motion.span>
  );
}

// Progress Ring Component
function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 8,
  color = "primary",
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const colorClass =
    color === "primary"
      ? "text-primary"
      : color === "green"
      ? "text-green-500"
      : color === "amber"
      ? "text-amber-500"
      : "text-purple-500";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-muted stroke-current"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className={`${colorClass} stroke-current`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-lg font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
    </div>
  );
}

// Stat card component
function StatCard({
  icon: Icon,
  iconColor,
  gradient,
  title,
  value,
  subtitle,
  children,
}: {
  icon: typeof Trophy;
  iconColor: string;
  gradient: string;
  title: string;
  value: string | number;
  subtitle: string;
  children?: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={`${gradient} border-opacity-50 hover:shadow-xl transition-all duration-300 overflow-hidden relative`}>
        <motion.div
          className="absolute inset-0 bg-white/5"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "100%" : "-100%" }}
          transition={{ duration: 0.6 }}
        />
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <motion.div animate={{ rotate: isHovered ? 360 : 0 }} transition={{ duration: 0.5 }}>
              <Icon className={`h-4 w-4 ${iconColor}`} />
            </motion.div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                <AnimatedValue value={typeof value === "number" ? value : 0} />
                {typeof value === "string" && value}
              </p>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            {children}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Achievement Badge Component
function AchievementBadge({
  achievement,
  isLocked = false,
  progress,
  target,
}: {
  achievement: { name: string; description: string; icon: string; rarity: string; earnedAt?: string };
  isLocked?: boolean;
  progress?: number;
  target?: number;
}) {
  const Icon = achievementIcons[achievement.icon] || Trophy;
  const rarity = achievement.rarity as keyof typeof rarityColors;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative p-4 rounded-xl border-2 transition-all ${
        isLocked ? "opacity-60 grayscale" : rarityBg[rarity]
      }`}
    >
      {/* Rarity Glow Effect */}
      {!isLocked && (
        <motion.div
          className={`absolute -inset-0.5 rounded-xl bg-gradient-to-r ${rarityColors[rarity]} opacity-0 blur-sm`}
          whileHover={{ opacity: 0.5 }}
        />
      )}

      <div className="relative flex items-start gap-3">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isLocked ? "bg-gray-200 dark:bg-gray-700" : `bg-gradient-to-br ${rarityColors[rarity]}`
          }`}
        >
          <Icon className={`w-6 h-6 ${isLocked ? "text-gray-400" : "text-white"}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{achievement.name}</h3>
            <Badge variant="outline" className="text-[10px] capitalize">
              {achievement.rarity}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{achievement.description}</p>

          {/* Progress bar for locked achievements */}
          {isLocked && progress !== undefined && target !== undefined && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>
                  {progress}/{target}
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${rarityColors[rarity]}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress / target) * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
          )}

          {/* Earned date */}
          {!isLocked && achievement.earnedAt && (
            <p className="text-xs text-muted-foreground mt-1">
              Earned {new Date(achievement.earnedAt).toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function MemberProgressPage() {
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  // Calculate stats
  const memberSince = useMemo(() => {
    const join = new Date(mockMember.joinDate);
    const now = new Date();
    const months = Math.floor((now.getTime() - join.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return months;
  }, []);

  const monthlyProgress = (mockMember.monthlyProgress / mockMember.monthlyGoal) * 100;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <MemberSidebar />

        <main className="container mx-auto p-4 space-y-6 pb-24 md:ml-64">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">Your Progress</h1>
                  <p className="text-white/80">Track your judo journey and achievements</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  <Dumbbell className="w-3 h-3 mr-1" />
                  {mockMember.totalSessions} sessions
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  <Flame className="w-3 h-3 mr-1" />
                  {mockMember.currentStreak} week streak
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  <Calendar className="w-3 h-3 mr-1" />
                  {memberSince} months training
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 grid-cols-2 lg:grid-cols-4"
          >
            <StatCard
              icon={Flame}
              iconColor="text-orange-500"
              gradient="bg-gradient-to-br from-orange-500/10 to-red-600/5 border-orange-200 dark:border-orange-800"
              title="Current Streak"
              value={mockMember.currentStreak}
              subtitle={`Best: ${mockMember.longestStreak} weeks`}
            />
            <StatCard
              icon={Dumbbell}
              iconColor="text-blue-500"
              gradient="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800"
              title="Total Sessions"
              value={mockMember.totalSessions}
              subtitle="lifetime"
            />
            <StatCard
              icon={Clock}
              iconColor="text-green-500"
              gradient="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800"
              title="Training Hours"
              value={mockMember.totalTrainingHours}
              subtitle="on the mat"
            />
            <StatCard
              icon={Trophy}
              iconColor="text-purple-500"
              gradient="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800"
              title="Achievements"
              value={mockAchievements.length}
              subtitle="unlocked"
            />
          </motion.div>

          {/* Belt Journey */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            <Card className="overflow-hidden">
              <CardContent className="py-6">
                <BeltJourney
                  currentBelt={mockMember.beltRank}
                  totalSessions={mockMember.totalSessions}
                  daysSincePromotion={mockMember.daysSincePromotion}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Goals Section */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Current Goals
                </CardTitle>
                <CardDescription>Track your progress towards your targets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockGoals.map((goal, index) => (
                  <motion.div
                    key={goal._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-4 rounded-xl border bg-card hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">{goal.deadline}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {goal.current}/{goal.target}
                        </p>
                        <p className="text-xs text-muted-foreground">{goal.unit}</p>
                      </div>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                        transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                      />
                    </div>
                    {goal.current >= goal.target && (
                      <Badge className="mt-2 bg-green-500">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Completed!
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements Section */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      Achievements
                    </CardTitle>
                    <CardDescription>
                      {mockAchievements.length} unlocked, {mockLockedAchievements.length} to go
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowAllAchievements(!showAllAchievements)}>
                    {showAllAchievements ? "Show Less" : "Show All"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Earned Achievements */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Unlocked</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(showAllAchievements ? mockAchievements : mockAchievements.slice(0, 4)).map((ach) => (
                        <AchievementBadge key={ach._id} achievement={ach} />
                      ))}
                    </div>
                  </div>

                  {/* Locked Achievements */}
                  <AnimatePresence>
                    {showAllAchievements && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">In Progress</h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {mockLockedAchievements.map((ach) => (
                            <AchievementBadge
                              key={ach._id}
                              achievement={ach}
                              isLocked
                              progress={ach.progress}
                              target={ach.target}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Training Statistics */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Training Statistics
                </CardTitle>
                <CardDescription>Your detailed training breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                  {/* Monthly Goal Progress */}
                  <div className="flex flex-col items-center p-4 rounded-xl bg-muted/30">
                    <ProgressRing progress={monthlyProgress} size={100} strokeWidth={10} color="primary" />
                    <h4 className="font-semibold mt-3">Monthly Goal</h4>
                    <p className="text-sm text-muted-foreground">
                      {mockMember.monthlyProgress}/{mockMember.monthlyGoal} sessions
                    </p>
                  </div>

                  {/* Attendance Rate */}
                  <div className="flex flex-col items-center p-4 rounded-xl bg-muted/30">
                    <ProgressRing progress={85} size={100} strokeWidth={10} color="green" />
                    <h4 className="font-semibold mt-3">Attendance Rate</h4>
                    <p className="text-sm text-muted-foreground">Last 3 months</p>
                  </div>

                  {/* Belt Progress */}
                  <div className="flex flex-col items-center p-4 rounded-xl bg-muted/30">
                    <ProgressRing
                      progress={Math.min(100, (mockMember.daysSincePromotion / 90) * 100)}
                      size={100}
                      strokeWidth={10}
                      color="purple"
                    />
                    <h4 className="font-semibold mt-3">Belt Progress</h4>
                    <p className="text-sm text-muted-foreground">{mockMember.daysSincePromotion} days at current belt</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>

        <MobileNavigation />
      </div>
    </PageTransition>
  );
}
