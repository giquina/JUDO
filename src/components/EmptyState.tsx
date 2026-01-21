import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  CreditCard,
  Search,
  FileText,
  Inbox,
  AlertCircle,
  CheckCircle,
  FolderOpen,
  Clock,
} from "lucide-react";

// Pre-built illustration variants
const illustrations: Record<string, { icon: typeof Users; color: string; bgColor: string }> = {
  members: { icon: Users, color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-950" },
  calendar: { icon: Calendar, color: "text-purple-500", bgColor: "bg-purple-100 dark:bg-purple-950" },
  payments: { icon: CreditCard, color: "text-green-500", bgColor: "bg-green-100 dark:bg-green-950" },
  search: { icon: Search, color: "text-orange-500", bgColor: "bg-orange-100 dark:bg-orange-950" },
  documents: { icon: FileText, color: "text-cyan-500", bgColor: "bg-cyan-100 dark:bg-cyan-950" },
  inbox: { icon: Inbox, color: "text-pink-500", bgColor: "bg-pink-100 dark:bg-pink-950" },
  error: { icon: AlertCircle, color: "text-red-500", bgColor: "bg-red-100 dark:bg-red-950" },
  success: { icon: CheckCircle, color: "text-green-500", bgColor: "bg-green-100 dark:bg-green-950" },
  folder: { icon: FolderOpen, color: "text-amber-500", bgColor: "bg-amber-100 dark:bg-amber-950" },
  schedule: { icon: Clock, color: "text-indigo-500", bgColor: "bg-indigo-100 dark:bg-indigo-950" },
};

interface EmptyStateProps {
  icon?: ReactNode;
  illustration?: keyof typeof illustrations;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 20,
    },
  },
};

// Animated illustration component
function AnimatedIllustration({
  illustration,
  icon,
  size,
}: {
  illustration?: keyof typeof illustrations;
  icon?: ReactNode;
  size: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: { container: "w-16 h-16", icon: "h-8 w-8" },
    md: { container: "w-24 h-24", icon: "h-12 w-12" },
    lg: { container: "w-32 h-32", icon: "h-16 w-16" },
  };

  if (icon) {
    return (
      <motion.div
        variants={iconVariants}
        className="mb-4"
      >
        <div className="text-6xl opacity-50">
          {icon}
        </div>
      </motion.div>
    );
  }

  if (illustration && illustrations[illustration]) {
    const { icon: Icon, color, bgColor } = illustrations[illustration];
    return (
      <motion.div
        variants={iconVariants}
        className={`${sizeClasses[size].container} ${bgColor} rounded-full flex items-center justify-center mb-6 relative`}
      >
        {/* Pulsing ring */}
        <motion.div
          className={`absolute inset-0 ${bgColor} rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" as const,
          }}
        />
        {/* Floating dots decoration */}
        <motion.div
          className={`absolute -top-2 -right-2 w-3 h-3 ${color.replace('text-', 'bg-')} rounded-full opacity-60`}
          animate={{
            y: [0, -5, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.2,
          }}
        />
        <motion.div
          className={`absolute -bottom-1 -left-1 w-2 h-2 ${color.replace('text-', 'bg-')} rounded-full opacity-40`}
          animate={{
            y: [0, 5, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: 0.5,
          }}
        />
        <Icon className={`${sizeClasses[size].icon} ${color} relative z-10`} />
      </motion.div>
    );
  }

  // Default illustration
  return (
    <motion.div
      variants={iconVariants}
      className={`${sizeClasses[size].container} bg-muted rounded-full flex items-center justify-center mb-6`}
    >
      <Inbox className={`${sizeClasses[size].icon} text-muted-foreground`} />
    </motion.div>
  );
}

export default function EmptyState({
  icon,
  illustration,
  title,
  description,
  action,
  secondaryAction,
  size = "md",
  animate = true,
}: EmptyStateProps) {
  const paddingClasses = {
    sm: "py-8 px-4",
    md: "py-12 px-4",
    lg: "py-16 px-6",
  };

  const titleClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  const Container = animate ? motion.div : "div";
  const Item = animate ? motion.div : "div";

  const containerProps = animate
    ? { variants: containerVariants, initial: "hidden", animate: "visible" }
    : {};

  const itemProps = animate ? { variants: itemVariants } : {};

  return (
    <Container
      {...containerProps}
      className={`flex flex-col items-center justify-center ${paddingClasses[size]} text-center`}
    >
      <AnimatedIllustration illustration={illustration} icon={icon} size={size} />

      <Item {...itemProps}>
        <h3 className={`${titleClasses[size]} font-semibold mb-2`}>{title}</h3>
      </Item>

      <Item {...itemProps}>
        <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      </Item>

      {(action || secondaryAction) && (
        <Item {...itemProps} className="flex flex-col sm:flex-row items-center gap-3">
          {action && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={action.onClick}
                variant={action.variant || "default"}
                className="min-w-[140px]"
              >
                {action.label}
              </Button>
            </motion.div>
          )}
          {secondaryAction && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={secondaryAction.onClick}
                variant="ghost"
              >
                {secondaryAction.label}
              </Button>
            </motion.div>
          )}
        </Item>
      )}
    </Container>
  );
}

// Preset empty states for common use cases
export function NoMembersEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      illustration="members"
      title="No members yet"
      description="Start by adding your first member to the club roster."
      action={onAction ? { label: "Add Member", onClick: onAction } : undefined}
    />
  );
}

export function NoResultsEmptyState({ query, onClear }: { query?: string; onClear?: () => void }) {
  return (
    <EmptyState
      illustration="search"
      title="No results found"
      description={query ? `No results for "${query}". Try adjusting your search.` : "Try adjusting your filters or search terms."}
      action={onClear ? { label: "Clear Search", onClick: onClear, variant: "outline" } : undefined}
    />
  );
}

export function NoPaymentsEmptyState() {
  return (
    <EmptyState
      illustration="payments"
      title="No payments yet"
      description="Payment history will appear here once members make their first payment."
    />
  );
}

export function NoClassesEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      illustration="calendar"
      title="No classes scheduled"
      description="Create your first class to start managing attendance."
      action={onAction ? { label: "Create Class", onClick: onAction } : undefined}
    />
  );
}

export function ErrorEmptyState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      illustration="error"
      title="Something went wrong"
      description="We encountered an error loading this content. Please try again."
      action={onRetry ? { label: "Try Again", onClick: onRetry } : undefined}
    />
  );
}
