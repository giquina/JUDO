import type { ReactNode, KeyboardEvent } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AccessibleCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  role?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  disabled?: boolean;
}

/**
 * AccessibleCard component that adds keyboard navigation support to Card elements
 * Automatically handles Enter and Space key presses
 * Adds proper ARIA attributes and focus management
 * Follows WCAG 2.1 Level AA guidelines
 */
export function AccessibleCard({
  children,
  onClick,
  className,
  role = "button",
  ariaLabel,
  ariaDescribedBy,
  disabled = false,
}: AccessibleCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || !onClick) return;

    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      onClick();
    }
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  // If no onClick handler, render a regular card
  if (!onClick) {
    return <Card className={className}>{children}</Card>;
  }

  return (
    <Card
      role={role}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled}
      className={cn(
        className,
        !disabled && "cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </Card>
  );
}
