import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  gradient?: string;
  trend?: {
    value: number;
    label: string;
  };
  extra?: ReactNode;
  onClick?: () => void;
}

export default function MetricsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-primary",
  gradient = "from-blue-500/10 to-blue-600/5",
  trend,
  extra,
  onClick,
}: MetricsCardProps) {
  return (
    <motion.div
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
    >
      <Card
        className={`bg-gradient-to-br ${gradient} border-2 hover:shadow-lg transition-all duration-300 ${
          onClick ? "cursor-pointer" : ""
        }`}
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Icon className={`h-4 w-4 ${iconColor}`} />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {trend && (
            <div className="flex items-center gap-1 text-sm">
              <span
                className={`font-medium ${
                  trend.value > 0
                    ? "text-green-600 dark:text-green-400"
                    : trend.value < 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-muted-foreground"
                }`}
              >
                {trend.value > 0 ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-muted-foreground">{trend.label}</span>
            </div>
          )}

          {extra && <div className="mt-2">{extra}</div>}
        </CardContent>
      </Card>
    </motion.div>
  );
}
