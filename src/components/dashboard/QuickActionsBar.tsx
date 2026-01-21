import * as React from "react";
import {
  QrCode,
  Calendar,
  LayoutGrid,
  MessageSquare,
  Target,
  User,
  CreditCard,
  MoreHorizontal,
  Bell,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { KeyboardKey } from "@/components/KeyboardKey";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  shortcut?: string;
  badge?: number;
  color?: string;
  active?: boolean;
}

export interface QuickActionsBarProps {
  actions?: QuickAction[];
  sticky?: boolean;
  className?: string;
}

const defaultActions: QuickAction[] = [
  {
    id: "check-in",
    label: "Check In",
    icon: <QrCode className="h-5 w-5" />,
    onClick: () => console.log("Check In"),
    shortcut: "C",
    color: "text-blue-500",
  },
  {
    id: "book-class",
    label: "Book Class",
    icon: <Calendar className="h-5 w-5" />,
    onClick: () => console.log("Book Class"),
    shortcut: "B",
    color: "text-green-500",
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: <LayoutGrid className="h-5 w-5" />,
    onClick: () => console.log("Schedule"),
    shortcut: "S",
    color: "text-purple-500",
  },
  {
    id: "messages",
    label: "Messages",
    icon: <MessageSquare className="h-5 w-5" />,
    onClick: () => console.log("Messages"),
    shortcut: "M",
    badge: 3,
    color: "text-orange-500",
  },
  {
    id: "goals",
    label: "Goals",
    icon: <Target className="h-5 w-5" />,
    onClick: () => console.log("Goals"),
    shortcut: "G",
    color: "text-red-500",
  },
  {
    id: "profile",
    label: "Profile",
    icon: <User className="h-5 w-5" />,
    onClick: () => console.log("Profile"),
    shortcut: "P",
    color: "text-indigo-500",
  },
  {
    id: "payments",
    label: "Payments",
    icon: <CreditCard className="h-5 w-5" />,
    onClick: () => console.log("Payments"),
    color: "text-yellow-500",
  },
  {
    id: "more",
    label: "More",
    icon: <MoreHorizontal className="h-5 w-5" />,
    onClick: () => console.log("More"),
    color: "text-gray-500",
  },
];

export function QuickActionsBar({
  actions = defaultActions,
  sticky = false,
  className,
}: QuickActionsBarProps) {
  const [hoveredAction, setHoveredAction] = React.useState<string | null>(null);
  const [isStuck, setIsStuck] = React.useState(false);
  const barRef = React.useRef<HTMLDivElement>(null);

  // Handle sticky behavior
  React.useEffect(() => {
    if (!sticky) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting);
      },
      {
        threshold: [1],
        rootMargin: "-1px 0px 0px 0px",
      }
    );

    const sentinel = document.createElement("div");
    sentinel.style.height = "1px";
    barRef.current?.parentElement?.insertBefore(sentinel, barRef.current);

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, [sticky]);

  // Register keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      // Check if key matches any action shortcut
      const action = actions.find(
        (a) => a.shortcut && a.shortcut.toLowerCase() === e.key.toLowerCase()
      );

      if (action) {
        e.preventDefault();
        action.onClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actions]);

  return (
    <TooltipProvider>
      <motion.div
        ref={barRef}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "bg-background/95 backdrop-blur-sm border-b transition-all duration-200",
          sticky && "sticky top-0 z-40",
          isStuck && "shadow-md",
          className
        )}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
            {/* Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              {actions.map((action, index) => (
                <Tooltip key={action.id}>
                  <TooltipTrigger asChild>
                    <motion.button
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={action.onClick}
                      onMouseEnter={() => setHoveredAction(action.id)}
                      onMouseLeave={() => setHoveredAction(null)}
                      className={cn(
                        "relative flex flex-col items-center justify-center gap-1 px-3 md:px-4 py-2 rounded-lg transition-all",
                        "hover:bg-accent hover:scale-105 active:scale-95",
                        action.active && "bg-accent",
                        hoveredAction === action.id && "shadow-md"
                      )}
                    >
                      {/* Badge */}
                      {action.badge && action.badge > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
                        >
                          {action.badge > 99 ? "99+" : action.badge}
                        </motion.span>
                      )}

                      {/* Icon */}
                      <div className={cn("transition-colors", action.color)}>
                        {action.icon}
                      </div>

                      {/* Label */}
                      <span className="text-xs font-medium hidden md:block">
                        {action.label}
                      </span>

                      {/* Active indicator */}
                      {action.active && (
                        <motion.div
                          layoutId="activeAction"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent className="flex items-center gap-2">
                    <span>{action.label}</span>
                    {action.shortcut && (
                      <div className="flex items-center gap-1">
                        <KeyboardKey>{action.shortcut}</KeyboardKey>
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Notifications indicator (optional) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-lg hover:bg-accent transition-colors md:hidden"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
