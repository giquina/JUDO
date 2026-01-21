import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

type LoadingVariant = "spinner" | "skeleton" | "pulse";
type LoadingSize = "sm" | "md" | "lg";

interface LoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export default function Loading({
  variant = "spinner",
  size = "md",
  className,
  text,
  fullScreen = false,
}: LoadingProps) {
  const sizeClasses = {
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const containerClasses = cn(
    "flex flex-col items-center justify-center",
    sizeClasses[size],
    fullScreen && "min-h-screen",
    className
  );

  const renderContent = () => {
    switch (variant) {
      case "spinner":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-3"
          >
            <Spinner size={size} className="text-primary" />
            {text && (
              <p className={cn("text-muted-foreground", textSizeClasses[size])}>
                {text}
              </p>
            )}
          </motion.div>
        );

      case "skeleton":
        return (
          <div className="w-full max-w-md space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
          </div>
        );

      case "pulse":
        const pulseSize = {
          sm: "h-8 w-8",
          md: "h-12 w-12",
          lg: "h-16 w-16",
        };

        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={cn(
                "rounded-full bg-primary",
                pulseSize[size]
              )}
            />
            {text && (
              <p className={cn("text-muted-foreground", textSizeClasses[size])}>
                {text}
              </p>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return <div className={containerClasses}>{renderContent()}</div>;
}
