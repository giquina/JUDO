import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DashboardSkeletonProps {
  className?: string;
}

export function DashboardSkeleton({ className }: DashboardSkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Quick Actions Skeleton */}
      <div className="border-b pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[...Array(8)].map((_, i) => (
            <SkeletonBox key={i} className="min-w-[80px] h-16" delay={i * 0.05} />
          ))}
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <SkeletonBox key={i} className="h-48" delay={i * 0.1} />
        ))}
      </div>
    </div>
  );
}

export function WidgetSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border bg-card p-6 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <SkeletonBox className="h-5 w-32" />
        <SkeletonBox className="h-8 w-8 rounded-full" />
      </div>
      <SkeletonBox className="h-12 w-24" />
      <SkeletonBox className="h-2 w-full" />
      <div className="flex gap-2">
        <SkeletonBox className="h-4 w-16" />
        <SkeletonBox className="h-4 w-20" />
      </div>
    </div>
  );
}

export function SkeletonBox({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0.4 }}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      className={cn("bg-muted rounded-lg", className)}
    />
  );
}
