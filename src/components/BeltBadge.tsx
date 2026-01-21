import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface BeltBadgeProps {
  belt: "white" | "yellow" | "orange" | "green" | "blue" | "brown" | "black";
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
}

const beltConfig = {
  white: {
    bg: "bg-gray-100 dark:bg-gray-200",
    text: "text-gray-900",
    border: "border-gray-300",
    label: "White Belt",
  },
  yellow: {
    bg: "bg-yellow-400",
    text: "text-gray-900",
    border: "border-yellow-500",
    label: "Yellow Belt",
  },
  orange: {
    bg: "bg-orange-500",
    text: "text-white",
    border: "border-orange-600",
    label: "Orange Belt",
  },
  green: {
    bg: "bg-green-600",
    text: "text-white",
    border: "border-green-700",
    label: "Green Belt",
  },
  blue: {
    bg: "bg-blue-700",
    text: "text-white",
    border: "border-blue-800",
    label: "Blue Belt",
  },
  brown: {
    bg: "bg-amber-800",
    text: "text-white",
    border: "border-amber-900",
    label: "Brown Belt",
  },
  black: {
    bg: "bg-gray-900",
    text: "text-white",
    border: "border-gray-950",
    label: "Black Belt",
  },
};

export default function BeltBadge({
  belt,
  size = "md",
  className,
  showIcon = false,
}: BeltBadgeProps) {
  const config = beltConfig[belt];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <Badge
      className={cn(
        config.bg,
        config.text,
        `border ${config.border}`,
        sizeClasses[size],
        "font-semibold rounded-full elevation-1",
        className
      )}
    >
      {showIcon && (
        <span className="mr-1.5">
          <svg
            className="w-3 h-3 inline-block"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z" />
          </svg>
        </span>
      )}
      {config.label}
    </Badge>
  );
}
