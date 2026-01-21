import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number; // 0-100
  max?: number;
  size?: "sm" | "md" | "lg" | "xl";
  strokeWidth?: number;
  showPercentage?: boolean;
  label?: string;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
  animate?: boolean;
}

const sizeValues = {
  sm: { size: 60, fontSize: "text-xs" },
  md: { size: 100, fontSize: "text-base" },
  lg: { size: 140, fontSize: "text-xl" },
  xl: { size: 180, fontSize: "text-2xl" },
};

const variantColors = {
  default: "stroke-primary",
  success: "stroke-green-500",
  warning: "stroke-yellow-500",
  danger: "stroke-red-500",
};

export default function CircularProgress({
  value,
  max = 100,
  size = "md",
  strokeWidth,
  showPercentage = true,
  label,
  variant = "default",
  className = "",
  animate = true,
}: CircularProgressProps) {
  const { size: svgSize, fontSize } = sizeValues[size];
  const actualStrokeWidth = strokeWidth || svgSize / 10;
  const radius = (svgSize - actualStrokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const offset = circumference - (percentage / 100) * circumference;

  // Auto-determine variant based on percentage if default
  const autoVariant =
    variant === "default"
      ? percentage >= 75
        ? "success"
        : percentage >= 50
        ? "default"
        : percentage >= 25
        ? "warning"
        : "danger"
      : variant;

  return (
    <div className={cn("inline-flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg
          width={svgSize}
          height={svgSize}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            className="stroke-muted"
            strokeWidth={actualStrokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            className={cn(variantColors[autoVariant], "transition-colors")}
            strokeWidth={actualStrokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
            animate={{ strokeDashoffset: offset }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showPercentage && (
            <motion.span
              className={cn("font-bold", fontSize)}
              initial={animate ? { opacity: 0, scale: 0.5 } : {}}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {Math.round(percentage)}%
            </motion.span>
          )}
        </div>
      </div>
      {label && <span className="text-sm font-medium text-center">{label}</span>}
    </div>
  );
}
