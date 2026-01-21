import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, CheckCircle2, Clock, TrendingUp } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  unit: string;
  deadline?: number;
  priority: "low" | "medium" | "high";
  category: "attendance" | "technique" | "fitness" | "competition";
}

interface GoalsTrackerProps {
  goals: Goal[];
  compact?: boolean;
  onAddGoal?: () => void;
  onViewGoal?: (goalId: string) => void;
}

const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const CATEGORY_ICONS = {
  attendance: "📅",
  technique: "🥋",
  fitness: "💪",
  competition: "🏆",
};

export default function GoalsTracker({
  goals,
  compact = false,
  onAddGoal,
  onViewGoal,
}: GoalsTrackerProps) {
  const getDaysRemaining = (deadline?: number) => {
    if (!deadline) return null;
    const days = Math.ceil((deadline - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const sortedGoals = [...goals].sort((a, b) => {
    // Sort by progress (incomplete first), then by priority
    if (a.progress === a.target && b.progress !== b.target) return 1;
    if (a.progress !== a.target && b.progress === b.target) return -1;

    const priorityWeight = { high: 3, medium: 2, low: 1 };
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });

  const displayGoals = compact ? sortedGoals.slice(0, 3) : sortedGoals;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Goals Tracker
            </CardTitle>
            <CardDescription>Your training objectives</CardDescription>
          </div>
          {onAddGoal && (
            <Button size="sm" variant="outline" onClick={onAddGoal}>
              <Plus className="h-4 w-4 mr-1" />
              Add Goal
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayGoals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                No goals set yet
              </p>
              {onAddGoal && (
                <Button size="sm" onClick={onAddGoal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Set Your First Goal
                </Button>
              )}
            </div>
          ) : (
            displayGoals.map((goal, index) => {
              const progressPercentage = (goal.progress / goal.target) * 100;
              const isCompleted = goal.progress >= goal.target;
              const daysRemaining = getDaysRemaining(goal.deadline);

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                    isCompleted
                      ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50"
                      : "bg-card hover:bg-muted/30"
                  }`}
                  onClick={() => onViewGoal?.(goal.id)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">
                        {CATEGORY_ICONS[goal.category]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate flex items-center gap-2">
                          {goal.title}
                          {isCompleted && (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          )}
                        </h4>
                        {!compact && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {goal.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={`text-xs ${PRIORITY_COLORS[goal.priority]} flex-shrink-0`}
                    >
                      {goal.priority}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">
                        {goal.progress} / {goal.target} {goal.unit}
                      </span>
                    </div>
                    <Progress
                      value={progressPercentage}
                      className={isCompleted ? "bg-green-100" : ""}
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{Math.round(progressPercentage)}% complete</span>
                      {daysRemaining !== null && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {daysRemaining > 0
                            ? `${daysRemaining} days left`
                            : "Deadline passed"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* On Track Indicator */}
                  {!isCompleted && daysRemaining && daysRemaining > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-xs">
                      {progressPercentage >= 50 ? (
                        <>
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-green-600 dark:text-green-400">
                            On track
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-3 w-3 text-orange-600 rotate-180" />
                          <span className="text-orange-600 dark:text-orange-400">
                            Needs attention
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>

        {compact && goals.length > 3 && (
          <div className="mt-4 pt-4 border-t">
            <Button variant="ghost" className="w-full" size="sm">
              View All Goals ({goals.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
