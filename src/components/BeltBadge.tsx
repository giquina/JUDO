import { Badge } from "@/components/ui/badge";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type BeltRank =
  | "white"
  | "yellow"
  | "orange"
  | "green"
  | "blue"
  | "brown"
  | "black";

interface BeltBadgeProps {
  rank: BeltRank;
  showTooltip?: boolean;
  className?: string;
}

const beltConfig: Record<
  BeltRank,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    requirements: string[];
  }
> = {
  white: {
    label: "White Belt",
    color: "text-slate-800 dark:text-slate-200",
    bgColor: "bg-slate-100 dark:bg-slate-800",
    borderColor: "border-slate-300 dark:border-slate-600",
    requirements: [
      "Basic breakfalls (ukemi)",
      "Basic grips and posture",
      "Introduction to throws",
    ],
  },
  yellow: {
    label: "Yellow Belt",
    color: "text-yellow-900 dark:text-yellow-100",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/50",
    borderColor: "border-yellow-400 dark:border-yellow-700",
    requirements: [
      "O-goshi (Major hip throw)",
      "De-ashi-barai (Advanced foot sweep)",
      "Kesa-gatame (Scarf hold)",
      "3 months training minimum",
    ],
  },
  orange: {
    label: "Orange Belt",
    color: "text-orange-900 dark:text-orange-100",
    bgColor: "bg-orange-100 dark:bg-orange-900/50",
    borderColor: "border-orange-400 dark:border-orange-700",
    requirements: [
      "Ippon-seoi-nage (One-arm shoulder throw)",
      "Uki-goshi (Floating hip)",
      "Yoko-shiho-gatame (Side four-quarter hold)",
      "6 months training minimum",
    ],
  },
  green: {
    label: "Green Belt",
    color: "text-green-900 dark:text-green-100",
    bgColor: "bg-green-100 dark:bg-green-900/50",
    borderColor: "border-green-400 dark:border-green-700",
    requirements: [
      "Tai-otoshi (Body drop)",
      "Harai-goshi (Sweeping hip throw)",
      "Kami-shiho-gatame (Upper four-quarter hold)",
      "Competition experience",
      "1 year training minimum",
    ],
  },
  blue: {
    label: "Blue Belt",
    color: "text-blue-900 dark:text-blue-100",
    bgColor: "bg-blue-100 dark:bg-blue-900/50",
    borderColor: "border-blue-400 dark:border-blue-700",
    requirements: [
      "Uchi-mata (Inner thigh)",
      "O-uchi-gari (Major inner reap)",
      "Basic groundwork transitions",
      "Kata demonstration",
      "2 years training minimum",
    ],
  },
  brown: {
    label: "Brown Belt",
    color: "text-amber-900 dark:text-amber-100",
    bgColor: "bg-amber-100 dark:bg-amber-900/50",
    borderColor: "border-amber-600 dark:border-amber-700",
    requirements: [
      "Advanced throwing techniques",
      "Complex groundwork combinations",
      "Competition success",
      "Teaching assistant experience",
      "3 years training minimum",
    ],
  },
  black: {
    label: "Black Belt",
    color: "text-white",
    bgColor: "bg-gradient-to-br from-slate-900 to-black",
    borderColor: "border-yellow-400",
    requirements: [
      "Mastery of all kyu techniques",
      "Advanced kata performance",
      "Proven competition record",
      "Teaching capability",
      "5+ years training minimum",
    ],
  },
};

export default function BeltBadge({
  rank,
  showTooltip = true,
  className,
}: BeltBadgeProps) {
  const config = beltConfig[rank];

  const badge = (
    <Badge
      variant="outline"
      className={cn(
        "font-semibold border-2 transition-all hover:scale-105",
        config.color,
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      {config.label}
    </Badge>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <SimpleTooltip
      content={
        <div className="space-y-1 max-w-xs">
          <p className="font-semibold text-sm">{config.label} Requirements:</p>
          <ul className="list-disc list-inside space-y-0.5 text-xs">
            {config.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      }
      side="top"
    >
      {badge}
    </SimpleTooltip>
  );
}
