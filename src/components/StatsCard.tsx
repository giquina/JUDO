import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  trend?: {
    value: number; // Percentage change (e.g., 12 for +12%, -5 for -5%)
    label?: string; // Optional label (e.g., "from last month")
  };
  sparklineData?: number[]; // Simple array of numbers for mini chart
  variant?: "default" | "success" | "warning" | "danger";
  onClick?: () => void;
  className?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  sparklineData,
  variant = "default",
  onClick,
  className = "",
}: StatsCardProps) {
  const isClickable = !!onClick;

  // Determine trend direction
  const trendDirection =
    trend && trend.value > 0 ? "up" : trend && trend.value < 0 ? "down" : "neutral";

  const TrendIcon =
    trendDirection === "up"
      ? TrendingUp
      : trendDirection === "down"
      ? TrendingDown
      : Minus;

  const trendColor =
    trendDirection === "up"
      ? "text-green-600 dark:text-green-400"
      : trendDirection === "down"
      ? "text-red-600 dark:text-red-400"
      : "text-muted-foreground";

  const variantClasses = {
    default: "border-primary/20",
    success: "border-green-500/20 bg-green-500/5",
    warning: "border-yellow-500/20 bg-yellow-500/5",
    danger: "border-red-500/20 bg-red-500/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={isClickable ? { scale: 1.02, y: -4 } : {}}
      className={cn(className)}
    >
      <Card
        className={cn(
          "relative overflow-hidden transition-all",
          variantClasses[variant],
          isClickable && "cursor-pointer hover:shadow-lg"
        )}
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
            <span>{title}</span>
            {Icon && (
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="w-4 h-4 text-primary" />
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Main Value */}
            <motion.p
              className="text-2xl font-bold"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              {value}
            </motion.p>

            {/* Description or Trend */}
            <div className="flex items-center justify-between">
              {trend ? (
                <motion.div
                  className={cn("flex items-center gap-1 text-xs font-medium", trendColor)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <TrendIcon className="w-3.5 h-3.5" />
                  <span>
                    {Math.abs(trend.value)}% {trend.label || ""}
                  </span>
                </motion.div>
              ) : description ? (
                <p className="text-xs text-muted-foreground">{description}</p>
              ) : null}

              {sparklineData && sparklineData.length > 0 && (
                <Sparkline data={sparklineData} variant={variant} />
              )}
            </div>
          </div>
        </CardContent>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      </Card>
    </motion.div>
  );
}

// Simple sparkline component
function Sparkline({
  data,
  variant,
}: {
  data: number[];
  variant: "default" | "success" | "warning" | "danger";
}) {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const variantColors = {
    default: "stroke-primary",
    success: "stroke-green-500",
    warning: "stroke-yellow-500",
    danger: "stroke-red-500",
  };

  // Calculate points for SVG polyline
  const width = 60;
  const height = 24;
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <motion.svg
      width={width}
      height={height}
      className="opacity-70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      transition={{ delay: 0.3 }}
    >
      <motion.polyline
        points={points}
        fill="none"
        className={cn(variantColors[variant])}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}
      />
    </motion.svg>
  );
}
