import * as React from "react";
import { Plus, X, UserPlus, LogIn, MessageSquare, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface QuickAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

export interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

export function QuickActions({ actions, className }: QuickActionsProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Close on Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className={cn("fixed bottom-6 right-6 z-40 md:hidden", className)}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              style={{ zIndex: -1 }}
            />

            {/* Action buttons */}
            <div className="absolute bottom-16 right-0 flex flex-col-reverse gap-3">
              {actions.map((action, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0,
                    transition: {
                      delay: (actions.length - index - 1) * 0.05,
                    },
                  }}
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-full shadow-lg bg-background border hover:scale-105 transition-transform",
                    action.color
                  )}
                >
                  {action.icon}
                  <span className="text-sm font-medium whitespace-nowrap">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}

// Default quick actions for the JUDO app
export const defaultJudoActions: QuickAction[] = [
  {
    icon: <LogIn className="h-5 w-5" />,
    label: "Check-in",
    onClick: () => console.log("Check-in"),
  },
  {
    icon: <UserPlus className="h-5 w-5" />,
    label: "New Member",
    onClick: () => console.log("New Member"),
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    label: "Announcement",
    onClick: () => console.log("Announcement"),
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    label: "New Event",
    onClick: () => console.log("New Event"),
  },
];
