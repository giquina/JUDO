import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { getBeltInfo, type BeltRank } from "@/lib/judoUtils";

interface BeltBadgeProps {
  belt: BeltRank;
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
  showJapanese?: boolean; // Show Japanese name
}

export default function BeltBadge({
  belt,
  size = "md",
  className,
  showIcon = false,
  showJapanese = false,
}: BeltBadgeProps) {
  const beltInfo = getBeltInfo(belt);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  // Determine if text should be dark or light based on belt color
  const isDark = ["#FFFFFF", "#FFD700"].includes(beltInfo.color);
  const textColor = isDark ? "text-gray-900" : "text-white";

  return (
    <Badge
      className={cn(
        "border font-semibold rounded-full elevation-1",
        textColor,
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: beltInfo.color,
        borderColor: beltInfo.color === "#FFFFFF" ? "#E5E7EB" : beltInfo.color,
      }}
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
      {showJapanese ? beltInfo.japaneseName : beltInfo.displayName}
    </Badge>
  );
}

// Helper component for showing just the color with tooltip
export function BeltColorDot({ belt, size = "md" }: { belt: BeltRank; size?: "sm" | "md" | "lg" }) {
  const beltInfo = getBeltInfo(belt);

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <span
      className={cn(
        "inline-block rounded-full border-2",
        sizeClasses[size]
      )}
      style={{
        backgroundColor: beltInfo.color,
        borderColor: beltInfo.color === "#FFFFFF" ? "#E5E7EB" : beltInfo.color,
      }}
      title={beltInfo.displayName}
    />
  );
}
