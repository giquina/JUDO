import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Flame,
  Target,
  BarChart3,
  Calendar,
  Award,
  ArrowRight,
  Sparkles,
  Activity,
  Brain,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockCalendarData, type SmartInsight } from "@/lib/mockCalendarData";

const iconMap = {
  TrendingUp,
  TrendingDown,
  Flame,
  Target,
  BarChart3,
  Calendar,
  Award,
  Activity,
  Brain,
};

export default function SmartInsights() {
  const insights = mockCalendarData.insights;

  // Get icon component
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent || Activity;
  };

  // Get variant styles
  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case "success":
        return {
          border: "border-green-500/30 bg-green-500/5",
          icon: "text-green-500",
          badge: "bg-green-500/10 text-green-700 dark:text-green-400",
        };
      case "warning":
        return {
          border: "border-yellow-500/30 bg-yellow-500/5",
          icon: "text-yellow-500",
          badge: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
        };
      case "danger":
        return {
          border: "border-red-500/30 bg-red-500/5",
          icon: "text-red-500",
          badge: "bg-red-500/10 text-red-700 dark:text-red-400",
        };
      default:
        return {
          border: "border-primary/20 bg-primary/5",
          icon: "text-primary",
          badge: "bg-primary/10 text-primary",
        };
    }
  };

  // Get trend icon
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return TrendingUp;
      case "down":
        return TrendingDown;
      default:
        return null;
    }
  };

  // Handle action click
  const handleAction = (insight: SmartInsight) => {
    toast.success("Action triggered", {
      description: insight.actionLabel,
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  // Group insights by type
  const comparisonInsights = insights.filter((i) => i.type === "comparison");
  const suggestionInsights = insights.filter((i) => i.type === "suggestion");
  const milestoneInsights = insights.filter((i) => i.type === "milestone");

  // Calculate overall progress (example)
  const monthlyGoalProgress = 67; // 10 out of 15 sessions

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl mb-2">
                <Brain className="w-6 h-6 text-primary" />
                Smart Insights
              </CardTitle>
              <CardDescription className="text-base">
                AI-powered analysis of your training patterns and progress
              </CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="w-3 h-3" />
              Updated daily
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                  +20%
                </Badge>
              </div>
              <h3 className="font-semibold text-lg mb-1">Attendance</h3>
              <p className="text-2xl font-bold">12 classes</p>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-orange-500/30 bg-orange-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <Badge className="bg-orange-500/10 text-orange-700 dark:text-orange-400">
                  Active
                </Badge>
              </div>
              <h3 className="font-semibold text-lg mb-1">Streak</h3>
              <p className="text-2xl font-bold">6 weeks</p>
              <p className="text-xs text-muted-foreground mt-1">Keep it going!</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Target className="w-5 h-5 text-blue-500" />
                </div>
                <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                  {monthlyGoalProgress}%
                </Badge>
              </div>
              <h3 className="font-semibold text-lg mb-1">Monthly Goal</h3>
              <p className="text-2xl font-bold">10 / 15</p>
              <Progress value={monthlyGoalProgress} className="h-1.5 mt-2" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Insights Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {insights.map((insight) => {
          const Icon = getIcon(insight.icon);
          const TrendIcon = getTrendIcon(insight.trend);
          const styles = getVariantStyles(insight.variant);

          return (
            <motion.div key={insight.id} variants={itemVariants}>
              <Card
                className={cn(
                  "border-l-4 transition-all hover:shadow-md",
                  styles.border
                )}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={cn("p-2 rounded-lg flex-shrink-0", styles.badge)}>
                      <Icon className={cn("w-5 h-5", styles.icon)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm leading-tight">
                          {insight.message}
                        </h3>
                        {TrendIcon && insight.trendValue && (
                          <Badge variant="outline" className="flex-shrink-0 gap-1 text-xs">
                            <TrendIcon className="w-3 h-3" />
                            {insight.trendValue}%
                          </Badge>
                        )}
                      </div>

                      {insight.details && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {insight.details}
                        </p>
                      )}
                    </div>
                  </div>

                  {insight.actionable && insight.actionLabel && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2 gap-2"
                      onClick={() => handleAction(insight)}
                    >
                      {insight.actionLabel}
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Detailed Insights by Category */}
      <div className="space-y-4">
        {/* Milestones */}
        {milestoneInsights.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="w-5 h-5 text-yellow-500" />
                Milestones & Achievements
              </CardTitle>
              <CardDescription>
                Track your progress toward your next achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestoneInsights.map((insight) => {
                  const Icon = getIcon(insight.icon);
                  const styles = getVariantStyles(insight.variant);

                  return (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.01 }}
                      className={cn(
                        "p-4 rounded-lg border-l-4 cursor-pointer",
                        styles.border
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={cn("p-2 rounded-lg", styles.badge)}>
                            <Icon className={cn("w-4 h-4", styles.icon)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm mb-1">
                              {insight.message}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {insight.details}
                            </p>
                            {/* Progress bar example */}
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-1 text-xs">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">47/50 sessions</span>
                              </div>
                              <Progress value={94} className="h-2" />
                            </div>
                          </div>
                        </div>
                        {insight.actionable && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(insight)}
                          >
                            {insight.actionLabel}
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Training Patterns */}
        {(suggestionInsights.length > 0 || comparisonInsights.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5 text-primary" />
                Training Patterns & Comparisons
              </CardTitle>
              <CardDescription>
                Understand your training habits and how you compare to others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...suggestionInsights, ...comparisonInsights].map((insight) => {
                  const Icon = getIcon(insight.icon);
                  const styles = getVariantStyles(insight.variant);

                  return (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.01 }}
                      className={cn(
                        "p-3 rounded-lg border-l-4 flex items-start gap-3",
                        styles.border
                      )}
                    >
                      <div className={cn("p-1.5 rounded-lg flex-shrink-0", styles.badge)}>
                        <Icon className={cn("w-4 h-4", styles.icon)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm mb-0.5">
                          {insight.message}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {insight.details}
                        </p>
                      </div>
                      {insight.actionable && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAction(insight)}
                          className="flex-shrink-0"
                        >
                          {insight.actionLabel}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Info footer */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="mb-2">
                Smart Insights uses machine learning to analyze your training patterns,
                attendance history, and progress to provide personalized recommendations.
              </p>
              <p className="text-xs">
                Insights are updated daily based on your activity and club data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
