import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTableProps {
  className?: string;
  rows?: number;
  columns?: number;
}

export function SkeletonTable({
  className,
  rows = 5,
  columns = 4,
}: SkeletonTableProps) {
  return (
    <div className={cn("w-full space-y-2", className)}>
      {/* Table Header */}
      <div className="flex items-center gap-4 p-4 border-b bg-muted/30">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-4",
              i === 0 && "w-1/4",
              i === 1 && "w-1/3 flex-1",
              i === 2 && "w-1/6",
              i === 3 && "w-20"
            )}
          />
        ))}
      </div>

      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-4 p-4 border-b relative overflow-hidden hover:bg-muted/20 transition-colors"
        >
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {Array.from({ length: columns }).map((_, colIndex) => {
            if (colIndex === 0) {
              return (
                <div key={colIndex} className="flex items-center gap-3 w-1/4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              );
            }
            return (
              <Skeleton
                key={colIndex}
                className={cn(
                  "h-4",
                  colIndex === 1 && "w-1/3 flex-1",
                  colIndex === 2 && "w-1/6",
                  colIndex === 3 && "w-20"
                )}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function SkeletonTableRow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 border-b relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
    </div>
  );
}
