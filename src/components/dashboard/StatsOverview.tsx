import { motion } from "framer-motion";
import {
  Clock,
  Activity,
  TrendingUp,
  Calendar,
  Users,
  Award,
  Target,
  BarChart3,
  Zap,
  Heart,
  Trophy,
  Star,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { progressStats } from "@/lib/mockProgressData";
import { cn } from "@/lib/utils";

interface StatCard {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
  progress?: number;
}

export function StatsOverview() {
  const statCards: StatCard[] = [
    {
      id: "total-hours",
      title: "Total Training Hours",
      value: progressStats.totalTrainingHours,
      subtitle: "Lifetime achievement",
      icon: Clock,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
      trend: {
        value: progressStats.previousPeriodComparison.hoursChange,
        label: "vs last period",
        positive: true,
      },
    },
    {
      id: "avg-sessions",
      title: "Average Sessions",
      value: progressStats.averageSessionsPerWeek,
      subtitle: "Per week",
      icon: Activity,
      iconColor: "text-green-500",
      iconBg: "bg-green-500/10",
      trend: {
        value: progressStats.previousPeriodComparison.sessionsChange,
        label: "vs last period",
        positive: true,
      },
    },
    {
      id: "most-attended",
      title: "Most Attended Class",
      value: progressStats.mostAttendedClass,
      subtitle: "Your favorite",
      icon: Star,
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-500/10",
    },
    {
      id: "favorite-day",
      title: "Favorite Training Day",
      value: progressStats.favoriteTrainingDay,
      subtitle: "Most active",
      icon: Calendar,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10",
    },
    {
      id: "training-partners",
      title: "Training Partners",
      value: progressStats.trainingPartnersCount,
      subtitle: "Unique partners",
      icon: Users,
      iconColor: "text-pink-500",
      iconBg: "bg-pink-500/10",
    },
    {
      id: "current-belt",
      title: "Classes at Current Belt",
      value: progressStats.classesAtCurrentBelt,
      subtitle: "Since last grading",
      icon: Award,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-500/10",
    },
    {
      id: "next-belt",
      title: "Days to Next Belt",
      value: progressStats.daysToNextBeltMilestone,
      subtitle: "Estimated",
      icon: Target,
      iconColor: "text-cyan-500",
      iconBg: "bg-cyan-500/10",
    },
    {
      id: "technique-mastery",
      title: "Technique Mastery",
      value: `${progressStats.improvementMetrics.techniqueMastery}%`,
      subtitle: "Overall progress",
      icon: Zap,
      iconColor: "text-indigo-500",
      iconBg: "bg-indigo-500/10",
      progress: progressStats.improvementMetrics.techniqueMastery,
    },
  ];

  const achievementCards = [
    {
      id: "attendance-increase",
      title: "Attendance Growth",
      value: `${progressStats.improvementMetrics.attendanceIncrease}%`,
      description: "Improvement in attendance",
      icon: TrendingUp,
      color: "green",
    },
    {
      id: "competition-wins",
      title: "Competition Wins",
      value: progressStats.improvementMetrics.competitionWins,
      description: "Total victories",
      icon: Trophy,
      color: "yellow",
    },
    {
      id: "injury-free",
      title: "Injury-Free Days",
      value: progressStats.improvementMetrics.injuryFreeDays,
      description: "Consecutive days",
      icon: Heart,
      color: "red",
    },
    {
      id: "technique-progress",
      title: "New Techniques",
      value: progressStats.previousPeriodComparison.techniqueProgress,
      description: "Learned this period",
      icon: BarChart3,
      color: "blue",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "green":
        return {
          bg: "bg-green-500/10",
          text: "text-green-500",
          border: "border-green-500/20",
        };
      case "yellow":
        return {
          bg: "bg-yellow-500/10",
          text: "text-yellow-500",
          border: "border-yellow-500/20",
        };
      case "red":
        return {
          bg: "bg-red-500/10",
          text: "text-red-500",
          border: "border-red-500/20",
        };
      case "blue":
        return {
          bg: "bg-blue-500/10",
          text: "text-blue-500",
          border: "border-blue-500/20",
        };
      default:
        return {
          bg: "bg-primary/10",
          text: "text-primary",
          border: "border-primary/20",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Statistics Overview</h2>
        <p className="text-muted-foreground mt-1">
          Your training performance at a glance
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all hover:scale-105">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className={cn("p-3 rounded-lg", stat.iconBg)}>
                      <Icon className={cn("w-5 h-5", stat.iconColor)} />
                    </div>

                    {stat.trend && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "border",
                          stat.trend.positive
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-red-500/10 text-red-500 border-red-500/20"
                        )}
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.trend.value}%
                      </Badge>
                    )}
                  </div>

                  {/* Value */}
                  <div>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {stat.title}
                    </div>
                    {stat.subtitle && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {stat.subtitle}
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {stat.progress !== undefined && (
                    <div className="space-y-2">
                      <Progress value={stat.progress} className="h-2" />
                      {stat.trend && (
                        <div className="text-xs text-muted-foreground">
                          {stat.trend.label}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Achievement Cards */}
      <div>
        <h3 className="text-xl font-bold mb-4">Recent Achievements</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {achievementCards.map((achievement, index) => {
            const Icon = achievement.icon;
            const colors = getColorClasses(achievement.color);

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <Card
                  className={cn(
                    "p-6 border-2 hover:shadow-xl transition-all hover:scale-105",
                    colors.border
                  )}
                >
                  <div className="space-y-4">
                    <div className={cn("p-3 rounded-lg w-fit", colors.bg)}>
                      <Icon className={cn("w-6 h-6", colors.text)} />
                    </div>

                    <div>
                      <div className={cn("text-4xl font-bold", colors.text)}>
                        {achievement.value}
                      </div>
                      <div className="text-sm font-semibold mt-2">
                        {achievement.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detailed Metrics */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-6">Performance Metrics</h3>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Attendance Trend */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Attendance Trend</div>
                <div className="text-sm text-muted-foreground">
                  Consistency score
                </div>
              </div>
              <div className="text-3xl font-bold text-green-500">
                {progressStats.improvementMetrics.attendanceIncrease}%
              </div>
            </div>
            <Progress
              value={progressStats.improvementMetrics.attendanceIncrease}
              className="h-3"
            />
            <div className="flex items-center gap-2 text-sm text-green-500">
              <TrendingUp className="w-4 h-4" />
              <span>Great improvement! Keep it up.</span>
            </div>
          </div>

          {/* Technique Mastery */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Technique Mastery</div>
                <div className="text-sm text-muted-foreground">
                  Overall proficiency
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-500">
                {progressStats.improvementMetrics.techniqueMastery}%
              </div>
            </div>
            <Progress
              value={progressStats.improvementMetrics.techniqueMastery}
              className="h-3"
            />
            <div className="flex items-center gap-2 text-sm text-blue-500">
              <Zap className="w-4 h-4" />
              <span>Excellent progress towards next belt.</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Comparison Period Info */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Period Comparison</h3>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm border">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Hours Change</div>
                  <div className="text-2xl font-bold text-green-500">
                    +{progressStats.previousPeriodComparison.hoursChange}%
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Compared to previous period
              </p>
            </div>

            <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm border">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Sessions Change</div>
                  <div className="text-2xl font-bold text-blue-500">
                    +{progressStats.previousPeriodComparison.sessionsChange}%
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Increased training frequency
              </p>
            </div>

            <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm border">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Zap className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Techniques Learned</div>
                  <div className="text-2xl font-bold text-purple-500">
                    +{progressStats.previousPeriodComparison.techniqueProgress}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                New techniques mastered
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Motivational Summary */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/20">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">Outstanding Performance!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You've been training consistently and showing great improvement across all
              metrics. Your dedication to judo is impressive. Keep up the excellent work
              and you'll be ready for your next belt grading in no time!
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                Consistent Attendance
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30">
                Technique Progress
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30">
                Competition Ready
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
