import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Skeleton, CardSkeleton, TableRowSkeleton } from "@/components/ui/skeleton";

interface LoadingProps {
  variant?: "spinner" | "skeleton" | "page" | "inline";
  text?: string;
  className?: string;
}

// Main loading component with variants
export default function Loading({ variant = "spinner", text, className }: LoadingProps) {
  if (variant === "spinner") {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 py-12 ${className || ""}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-8 w-8 text-primary" />
        </motion.div>
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground"
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <span className={`inline-flex items-center gap-2 ${className || ""}`}>
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        {text && <span className="text-sm text-muted-foreground">{text}</span>}
      </span>
    );
  }

  if (variant === "page") {
    return <PageLoadingSkeleton />;
  }

  return <DashboardSkeleton />;
}

// Full page loading skeleton
export function PageLoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6"
    >
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Table */}
      <TableSkeleton rows={5} />
    </motion.div>
  );
}

// Dashboard skeleton with stats and charts
export function DashboardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Recent activity */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <Skeleton className="h-5 w-32" />
        {[...Array(3)].map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>
    </motion.div>
  );
}

// Table skeleton with configurable rows
export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b bg-muted/30">
        {[...Array(columns)].map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" style={{ maxWidth: i === 0 ? "150px" : "100px" }} />
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b last:border-0">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          {[...Array(columns - 1)].map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" style={{ maxWidth: j === 0 ? "120px" : "80px" }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// Chart placeholder skeleton
export function ChartSkeleton() {
  // Generate random heights once using useState with lazy initializer
  const [barHeights] = useState(() =>
    [...Array(7)].map(() => 30 + Math.random() * 70)
  );

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="h-48 flex items-end gap-2">
        {barHeights.map((height, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// Class card skeleton
export function ClassCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-32" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

// Member card skeleton
export function MemberCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

// Progress skeleton for belt progress
export function ProgressSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-3 w-full rounded-full" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
