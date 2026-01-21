import { Target, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export interface Goal {
  id: string;
  title: string;
  description?: string;
  progress: number;
  target: number;
  unit: string;
  deadline?: Date;
  color?: string;
}

export interface GoalWidgetProps {
  goal: Goal;
  onClick?: () => void;
  className?: string;
}

export function GoalWidget({ goal, onClick, className }: GoalWidgetProps) {
  const percentage = Math.min((goal.progress / goal.target) * 100, 100);
  const isComplete = percentage >= 100;

  const daysLeft = goal.deadline
    ? Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-6 cursor-pointer transition-shadow hover:shadow-lg",
        isComplete && "border-green-500/50 bg-green-500/5",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "p-2 rounded-lg",
              goal.color || "bg-blue-500/10 text-blue-500"
            )}
          >
            {isComplete ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Target className="h-5 w-5" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm">{goal.title}</h3>
            {goal.description && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {goal.description}
              </p>
            )}
          </div>
        </div>

        {daysLeft !== null && !isComplete && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{daysLeft}d</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold">
            {goal.progress}
            <span className="text-sm text-muted-foreground ml-1">
              / {goal.target} {goal.unit}
            </span>
          </span>
          <motion.span
            key={percentage}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "text-sm font-semibold",
              isComplete ? "text-green-500" : "text-muted-foreground"
            )}
          >
            {Math.round(percentage)}%
          </motion.span>
        </div>

        <Progress value={percentage} className="h-2" />
      </div>

      {/* Status message */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-xs text-green-600 font-medium"
        >
          Goal completed!
        </motion.div>
      )}
    </motion.div>
  );
}
