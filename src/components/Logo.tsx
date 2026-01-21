import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ variant = "full", size = "md", className }: LogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  };

  if (variant === "icon") {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 elevation-2",
          size === "sm" && "w-8 h-8",
          size === "md" && "w-10 h-10",
          size === "lg" && "w-12 h-12",
          className
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            size === "sm" && "w-5 h-5",
            size === "md" && "w-6 h-6",
            size === "lg" && "w-7 h-7"
          )}
        >
          {/* Martial arts inspired icon - stylized "J" with belt wrap */}
          <path
            d="M12 2C12 2 8 4 8 8V16C8 18.2 9.8 20 12 20C14.2 20 16 18.2 16 16V8C16 4 12 2 12 2Z"
            fill="currentColor"
            className="text-primary-foreground"
            opacity="0.9"
          />
          <path
            d="M8 12H16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-primary-foreground/60"
          />
          <path
            d="M12 20C12 20 10 21 10 22H14C14 21 12 20 12 20Z"
            fill="currentColor"
            className="text-primary-foreground/80"
          />
          <circle
            cx="12"
            cy="8"
            r="2"
            fill="currentColor"
            className="text-primary-foreground"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Icon */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 elevation-2",
          size === "sm" && "w-8 h-8",
          size === "md" && "w-10 h-10",
          size === "lg" && "w-12 h-12"
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            size === "sm" && "w-5 h-5",
            size === "md" && "w-6 h-6",
            size === "lg" && "w-7 h-7"
          )}
        >
          <path
            d="M12 2C12 2 8 4 8 8V16C8 18.2 9.8 20 12 20C14.2 20 16 18.2 16 16V8C16 4 12 2 12 2Z"
            fill="currentColor"
            className="text-primary-foreground"
            opacity="0.9"
          />
          <path
            d="M8 12H16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-primary-foreground/60"
          />
          <path
            d="M12 20C12 20 10 21 10 22H14C14 21 12 20 12 20Z"
            fill="currentColor"
            className="text-primary-foreground/80"
          />
          <circle
            cx="12"
            cy="8"
            r="2"
            fill="currentColor"
            className="text-primary-foreground"
          />
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span
          className={cn(
            "font-bold leading-tight tracking-tight",
            size === "sm" && "text-base",
            size === "md" && "text-lg",
            size === "lg" && "text-xl"
          )}
        >
          Judo Club
        </span>
        <span
          className={cn(
            "text-muted-foreground font-medium uppercase tracking-widest leading-tight",
            size === "sm" && "text-[9px]",
            size === "md" && "text-[10px]",
            size === "lg" && "text-xs"
          )}
        >
          Management
        </span>
      </div>
    </div>
  );
}
