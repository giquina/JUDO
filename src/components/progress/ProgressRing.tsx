import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number; // Current value
  max: number; // Maximum value
  size?: "sm" | "md" | "lg" | "xl";
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  variant?: "default" | "success" | "warning" | "danger";
  showValue?: boolean;
  className?: string;
  animate?: boolean;
}

const sizeValues = {
  sm: { size: 80, fontSize: "text-sm", subFontSize: "text-xs" },
  md: { size: 120, fontSize: "text-xl", subFontSize: "text-sm" },
  lg: { size: 160, fontSize: "text-2xl", subFontSize: "text-base" },
  xl: { size: 200, fontSize: "text-3xl", subFontSize: "text-lg" },
};

const variantColors = {
  default: "stroke-primary",
  success: "stroke-green-500",
  warning: "stroke-yellow-500",
  danger: "stroke-red-500",
};

const variantBgColors = {
  default: "bg-primary/10",
  success: "bg-green-500/10",
  warning: "bg-yellow-500/10",
  danger: "bg-red-500/10",
};

export default function ProgressRing({
  value,
  max,
  size = "md",
  strokeWidth,
  label,
  sublabel,
  variant = "default",
  showValue = true,
  className = "",
  animate = true,
}: ProgressRingProps) {
  const { size: svgSize, fontSize, subFontSize } = sizeValues[size];
  const actualStrokeWidth = strokeWidth || svgSize / 8;
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
      <div
        className={cn(
          "relative rounded-full p-2",
          variantBgColors[autoVariant]
        )}
        style={{ width: svgSize + 16, height: svgSize + 16 }}
      >
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
            className="stroke-muted/50"
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
              duration: 1.2,
              ease: "easeInOut",
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          {showValue && (
            <motion.div
              className="text-center"
              initial={animate ? { opacity: 0, scale: 0.5 } : {}}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className={cn("font-bold leading-tight", fontSize)}>
                {value}
                <span className="text-muted-foreground">/{max}</span>
              </div>
              {sublabel && (
                <div className={cn("text-muted-foreground mt-0.5", subFontSize)}>
                  {sublabel}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
      {label && (
        <span className="text-sm font-medium text-center max-w-full px-2">
          {label}
        </span>
      )}
    </div>
  );
}
