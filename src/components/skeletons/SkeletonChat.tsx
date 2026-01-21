import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonChatProps {
  className?: string;
  count?: number;
}

export function SkeletonChatMessage({
  className,
  isOwn = false,
}: {
  className?: string;
  isOwn?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex gap-3",
        isOwn ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      {!isOwn && <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />}
      <div
        className={cn(
          "space-y-2 max-w-[70%]",
          isOwn && "items-end"
        )}
      >
        {!isOwn && <Skeleton className="h-3 w-20" />}
        <div
          className={cn(
            "rounded-lg p-3 space-y-2 relative overflow-hidden",
            isOwn ? "bg-primary/10 ml-auto" : "bg-muted"
          )}
        >
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function SkeletonChatThread({ className, count = 8 }: SkeletonChatProps) {
  return (
    <div className={cn("space-y-4 p-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonChatMessage
          key={i}
          isOwn={i % 3 === 0} // Alternate between own and other messages
        />
      ))}
    </div>
  );
}

export function SkeletonGroupItem({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg relative overflow-hidden hover:bg-muted/50 transition-colors",
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-3 w-3/4" />
      </div>
      <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
    </div>
  );
}

export function SkeletonGroupList({ className, count = 5 }: SkeletonChatProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonGroupItem key={i} />
      ))}
    </div>
  );
}

export function SkeletonChatLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="p-2">
          <SkeletonGroupList count={6} />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <SkeletonChatThread count={8} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-card">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
