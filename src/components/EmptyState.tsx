import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Users,
  CreditCard,
  Search,
  FileText,
  Inbox,
  AlertCircle,
  CheckCircle,
  FolderOpen,
  Clock,
  UserPlus,
  CalendarPlus,
  Wallet,
  ClipboardList,
  UserCheck,
  Award,
  Trophy,
} from "lucide-react";

// Illustration type for simple icon-based illustrations
type SimpleIllustration = {
  type: "simple";
  icon: typeof Users;
  color: string;
  bgColor: string;
};

// Illustration type for rich composed illustrations
type RichIllustration = {
  type: "rich";
  component: React.FC<{ size: "sm" | "md" | "lg" }>;
};

type IllustrationConfig = SimpleIllustration | RichIllustration;

// Rich illustration: No Members Found
function NoMembersIllustration({ size }: { size: "sm" | "md" | "lg" }) {
  const scale = size === "sm" ? 0.7 : size === "md" ? 1 : 1.3;

  return (
    <div className="relative" style={{ transform: `scale(${scale})` }}>
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full blur-xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ width: 140, height: 140, left: -10, top: -10 }}
      />

      {/* Main circle with dojo mat pattern */}
      <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-950 dark:to-purple-950 flex items-center justify-center overflow-hidden">
        {/* Tatami pattern lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
          <pattern id="tatami" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-violet-600 dark:text-violet-400" />
          </pattern>
          <rect width="100" height="100" fill="url(#tatami)" />
        </svg>

        {/* Ghost user silhouettes */}
        <motion.div
          className="absolute"
          animate={{ opacity: [0.2, 0.4, 0.2], x: [-5, 0, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Users className="w-10 h-10 text-violet-300 dark:text-violet-700" style={{ transform: "translateX(-20px)" }} />
        </motion.div>

        <motion.div
          className="absolute"
          animate={{ opacity: [0.15, 0.3, 0.15], x: [5, 0, 5] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
        >
          <Users className="w-8 h-8 text-violet-300 dark:text-violet-700" style={{ transform: "translateX(25px) translateY(-5px)" }} />
        </motion.div>

        {/* Main user add icon */}
        <motion.div
          className="relative z-10"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="relative">
            <UserPlus className="w-14 h-14 text-violet-600 dark:text-violet-400" />
            {/* Pulsing plus indicator */}
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-white text-xs font-bold">+</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Floating belt decoration */}
      <motion.div
        className="absolute -bottom-2 -right-2"
        animate={{ rotate: [0, 10, 0], y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Award className="w-8 h-8 text-amber-500" />
      </motion.div>
    </div>
  );
}

// Rich illustration: No Classes Scheduled
function NoClassesIllustration({ size }: { size: "sm" | "md" | "lg" }) {
  const scale = size === "sm" ? 0.7 : size === "md" ? 1 : 1.3;

  return (
    <div className="relative" style={{ transform: `scale(${scale})` }}>
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full blur-xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ width: 150, height: 150, left: -15, top: -15 }}
      />

      {/* Main illustration container */}
      <div className="relative w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 flex items-center justify-center overflow-hidden">
        {/* Calendar grid background */}
        <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 100 100">
          {/* Grid lines */}
          {[20, 40, 60, 80].map((pos) => (
            <g key={pos}>
              <line x1={pos} y1="20" x2={pos} y2="100" stroke="currentColor" strokeWidth="1" className="text-purple-600 dark:text-purple-400" />
              <line x1="0" y1={pos} x2="100" y2={pos} stroke="currentColor" strokeWidth="1" className="text-purple-600 dark:text-purple-400" />
            </g>
          ))}
        </svg>

        {/* Empty calendar cells with X marks */}
        <div className="absolute inset-4 grid grid-cols-3 gap-1 opacity-30">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="w-full h-full border border-purple-300 dark:border-purple-700 rounded flex items-center justify-center"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            >
              <span className="text-purple-400 dark:text-purple-600 text-[8px]">-</span>
            </motion.div>
          ))}
        </div>

        {/* Main calendar plus icon */}
        <motion.div
          className="relative z-10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <CalendarPlus className="w-14 h-14 text-purple-600 dark:text-purple-400" />
        </motion.div>

        {/* Clock indicator */}
        <motion.div
          className="absolute top-2 right-2"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <Clock className="w-5 h-5 text-indigo-500" />
        </motion.div>
      </div>

      {/* Floating dojo elements */}
      <motion.div
        className="absolute -top-3 -left-3"
        animate={{ y: [0, -5, 0], rotate: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-lg">
          <span className="text-white text-xs font-bold">道</span>
        </div>
      </motion.div>
    </div>
  );
}

// Rich illustration: No Payments
function NoPaymentsIllustration({ size }: { size: "sm" | "md" | "lg" }) {
  const scale = size === "sm" ? 0.7 : size === "md" ? 1 : 1.3;

  return (
    <div className="relative" style={{ transform: `scale(${scale})` }}>
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity }}
        style={{ width: 145, height: 145, left: -12, top: -12 }}
      />

      {/* Main illustration */}
      <div className="relative w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950 dark:to-teal-950 flex items-center justify-center overflow-hidden">
        {/* Money pattern background */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
          <pattern id="money" patternUnits="userSpaceOnUse" width="25" height="25">
            <circle cx="12.5" cy="12.5" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-emerald-600 dark:text-emerald-400" />
            <text x="12.5" y="16" textAnchor="middle" fontSize="8" fill="currentColor" className="text-emerald-600 dark:text-emerald-400">£</text>
          </pattern>
          <rect width="100" height="100" fill="url(#money)" />
        </svg>

        {/* Floating coins */}
        {[
          { x: -25, y: -15, delay: 0, size: 6 },
          { x: 30, y: -20, delay: 0.5, size: 5 },
          { x: -30, y: 20, delay: 1, size: 4 },
        ].map((coin, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `calc(50% + ${coin.x}px)`, top: `calc(50% + ${coin.y}px)` }}
            animate={{
              y: [0, -8, 0],
              opacity: [0.3, 0.5, 0.3],
              rotateY: [0, 180, 360]
            }}
            transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: coin.delay }}
          >
            <div
              className="rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md"
              style={{ width: coin.size * 4, height: coin.size * 4 }}
            >
              <span className="text-amber-800 font-bold" style={{ fontSize: coin.size * 2 }}>£</span>
            </div>
          </motion.div>
        ))}

        {/* Main wallet icon */}
        <motion.div
          className="relative z-10"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Wallet className="w-14 h-14 text-emerald-600 dark:text-emerald-400" />
          {/* Empty indicator */}
          <motion.div
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-slate-500 dark:text-slate-400 text-xs">0</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Credit card floating */}
      <motion.div
        className="absolute -bottom-3 -right-4"
        animate={{ rotate: [-10, 0, -10], y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <CreditCard className="w-10 h-10 text-teal-500" />
      </motion.div>
    </div>
  );
}

// Rich illustration: No Attendance Records
function NoAttendanceIllustration({ size }: { size: "sm" | "md" | "lg" }) {
  const scale = size === "sm" ? 0.7 : size === "md" ? 1 : 1.3;

  return (
    <div className="relative" style={{ transform: `scale(${scale})` }}>
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-full blur-xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity }}
        style={{ width: 150, height: 150, left: -15, top: -15 }}
      />

      {/* Main illustration */}
      <div className="relative w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950 dark:to-violet-950 flex items-center justify-center overflow-hidden">
        {/* Checkbox pattern background */}
        <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 100 100">
          {[15, 40, 65].map((y) => (
            <g key={y}>
              <rect x="10" y={y} width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1" className="text-indigo-600 dark:text-indigo-400" />
              <line x1="30" y1={y + 6} x2="85" y2={y + 6} stroke="currentColor" strokeWidth="2" className="text-indigo-300 dark:text-indigo-700" />
            </g>
          ))}
        </svg>

        {/* Empty checkbox indicators */}
        <div className="absolute inset-4 flex flex-col justify-center gap-2 opacity-40">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            >
              <div className="w-4 h-4 border-2 border-indigo-400 dark:border-indigo-600 rounded" />
              <div className="h-2 bg-indigo-300 dark:bg-indigo-700 rounded flex-1" />
            </motion.div>
          ))}
        </div>

        {/* Main clipboard icon */}
        <motion.div
          className="relative z-10"
          animate={{ y: [0, -3, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <ClipboardList className="w-14 h-14 text-indigo-600 dark:text-indigo-400" />
        </motion.div>

        {/* User check indicator */}
        <motion.div
          className="absolute top-2 right-2"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <UserCheck className="w-5 h-5 text-violet-500" />
        </motion.div>
      </div>

      {/* Trophy decoration */}
      <motion.div
        className="absolute -top-2 -left-3"
        animate={{ rotate: [-5, 5, -5], y: [0, -4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <Trophy className="w-7 h-7 text-amber-500" />
      </motion.div>
    </div>
  );
}

// Pre-built illustration variants
const illustrations: Record<string, IllustrationConfig> = {
  members: { type: "rich", component: NoMembersIllustration },
  calendar: { type: "rich", component: NoClassesIllustration },
  payments: { type: "rich", component: NoPaymentsIllustration },
  attendance: { type: "rich", component: NoAttendanceIllustration },
  search: { type: "simple", icon: Search, color: "text-orange-500", bgColor: "bg-orange-100 dark:bg-orange-950" },
  documents: { type: "simple", icon: FileText, color: "text-cyan-500", bgColor: "bg-cyan-100 dark:bg-cyan-950" },
  inbox: { type: "simple", icon: Inbox, color: "text-pink-500", bgColor: "bg-pink-100 dark:bg-pink-950" },
  error: { type: "simple", icon: AlertCircle, color: "text-red-500", bgColor: "bg-red-100 dark:bg-red-950" },
  success: { type: "simple", icon: CheckCircle, color: "text-green-500", bgColor: "bg-green-100 dark:bg-green-950" },
  folder: { type: "simple", icon: FolderOpen, color: "text-amber-500", bgColor: "bg-amber-100 dark:bg-amber-950" },
  schedule: { type: "simple", icon: Clock, color: "text-indigo-500", bgColor: "bg-indigo-100 dark:bg-indigo-950" },
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
    const config = illustrations[illustration];

    // Rich illustration (custom component)
    if (config.type === "rich") {
      const RichComponent = config.component;
      return (
        <motion.div variants={iconVariants} className="mb-6">
          <RichComponent size={size} />
        </motion.div>
      );
    }

    // Simple illustration (icon-based)
    const { icon: Icon, color, bgColor } = config;
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

export function NoAttendanceEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      illustration="attendance"
      title="No attendance records"
      description="Attendance records will appear here once members start checking in to classes."
      action={onAction ? { label: "View Classes", onClick: onAction } : undefined}
    />
  );
}
