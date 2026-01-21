import { motion } from "framer-motion";
import {
  AlertTriangle,
  WifiOff,
  ShieldOff,
  FileQuestion,
  RefreshCw,
  MessageSquare,
  Home,
  ServerCrash,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type ErrorType =
  | "network"
  | "permission"
  | "not-found"
  | "server"
  | "unknown";

interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onReportIssue?: () => void;
  onGoHome?: () => void;
  error?: Error;
}

const errorConfig = {
  network: {
    icon: WifiOff,
    defaultTitle: "Connection Lost",
    defaultMessage:
      "Unable to connect to the server. Please check your internet connection and try again.",
    iconColor: "text-orange-500",
    bgGradient: "from-orange-500/20 via-red-500/20 to-pink-500/20",
    iconBg: "from-orange-500/10 to-red-500/10",
    borderColor: "border-orange-500/20",
  },
  permission: {
    icon: ShieldOff,
    defaultTitle: "Access Denied",
    defaultMessage:
      "You don't have permission to access this resource. Please contact your administrator.",
    iconColor: "text-red-500",
    bgGradient: "from-red-500/20 via-rose-500/20 to-pink-500/20",
    iconBg: "from-red-500/10 to-rose-500/10",
    borderColor: "border-red-500/20",
  },
  "not-found": {
    icon: FileQuestion,
    defaultTitle: "Page Not Found",
    defaultMessage:
      "The page you're looking for doesn't exist or has been moved.",
    iconColor: "text-blue-500",
    bgGradient: "from-blue-500/20 via-indigo-500/20 to-purple-500/20",
    iconBg: "from-blue-500/10 to-indigo-500/10",
    borderColor: "border-blue-500/20",
  },
  server: {
    icon: ServerCrash,
    defaultTitle: "Server Error",
    defaultMessage:
      "Something went wrong on our end. We're working to fix it. Please try again later.",
    iconColor: "text-purple-500",
    bgGradient: "from-purple-500/20 via-violet-500/20 to-indigo-500/20",
    iconBg: "from-purple-500/10 to-violet-500/10",
    borderColor: "border-purple-500/20",
  },
  unknown: {
    icon: AlertTriangle,
    defaultTitle: "Something Went Wrong",
    defaultMessage:
      "An unexpected error occurred. Please try again or contact support if the problem persists.",
    iconColor: "text-yellow-500",
    bgGradient: "from-yellow-500/20 via-amber-500/20 to-orange-500/20",
    iconBg: "from-yellow-500/10 to-amber-500/10",
    borderColor: "border-yellow-500/20",
  },
};

export function ErrorState({
  type = "unknown",
  title,
  message,
  onRetry,
  onReportIssue,
  onGoHome,
  error,
}: ErrorStateProps) {
  const config = errorConfig[type];
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {/* Animated Error Icon */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
        }}
        className="relative mb-8"
      >
        {/* Gradient Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} rounded-full blur-2xl`}
        />

        {/* Icon Container */}
        <div
          className={`relative bg-gradient-to-br ${config.iconBg} p-8 rounded-full border ${config.borderColor}`}
        >
          <Icon className={`w-16 h-16 ${config.iconColor}`} />

          {/* Error Indicator Animation */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute inset-0 rounded-full border-2 ${config.borderColor}`}
          />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3 mb-8 max-w-md"
      >
        <h3 className="text-2xl font-bold text-foreground">{displayTitle}</h3>
        <p className="text-muted-foreground">{displayMessage}</p>

        {/* Error Details (Development) */}
        {error && process.env.NODE_ENV === "development" && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
              Error Details
            </summary>
            <pre className="mt-2 p-4 rounded-lg bg-muted text-xs overflow-auto max-h-40">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        {onRetry && (
          <Button onClick={onRetry} size="lg" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
        {onGoHome && (
          <Button onClick={onGoHome} variant="outline" size="lg" className="gap-2">
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        )}
        {onReportIssue && (
          <Button
            onClick={onReportIssue}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Report Issue
          </Button>
        )}
      </motion.div>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 max-w-md"
      >
        <div className="p-4 rounded-lg bg-muted/30 border border-muted">
          <p className="text-xs text-muted-foreground">
            {type === "network" &&
              "💡 Tip: Check your WiFi or mobile data connection"}
            {type === "permission" &&
              "💡 Tip: Contact your club administrator for access"}
            {type === "not-found" &&
              "💡 Tip: The URL may be incorrect or the page was removed"}
            {type === "server" &&
              "💡 Tip: This is temporary - we're fixing it"}
            {type === "unknown" &&
              "💡 Tip: Refreshing the page often solves the issue"}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Convenience components for specific error types
export function NetworkError(props: Omit<ErrorStateProps, "type">) {
  return <ErrorState type="network" {...props} />;
}

export function PermissionError(props: Omit<ErrorStateProps, "type">) {
  return <ErrorState type="permission" {...props} />;
}

export function NotFoundError(props: Omit<ErrorStateProps, "type">) {
  return <ErrorState type="not-found" {...props} />;
}

export function ServerError(props: Omit<ErrorStateProps, "type">) {
  return <ErrorState type="server" {...props} />;
}
