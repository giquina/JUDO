import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Calendar,
  QrCode,
  Trophy,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  path: string;
  label: string;
  icon: typeof Home;
}

const navItems: NavItem[] = [
  { path: "/member", label: "Dashboard", icon: Home },
  { path: "/member/classes", label: "Classes", icon: Calendar },
  { path: "/member/checkin", label: "Check-in", icon: QrCode },
  { path: "/member/progress", label: "Progress", icon: Trophy },
  { path: "/member/profile", label: "Profile", icon: User },
];

export default function MemberSidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActivePath = (itemPath: string) => {
    if (itemPath === "/member") {
      return location.pathname === "/member";
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <motion.aside
      className={cn(
        "hidden md:flex flex-col fixed left-0 top-0 h-screen z-40",
        "bg-background border-r border-border",
        "transition-all duration-300 ease-in-out"
      )}
      initial={false}
      animate={{ width: isCollapsed ? 64 : 256 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className="font-semibold text-lg text-foreground">My Dojo</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-2 rounded-lg hover:bg-accent transition-colors",
            "text-muted-foreground hover:text-foreground",
            isCollapsed && "mx-auto"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = isActivePath(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                "transition-all duration-200 group relative",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <motion.div
                  layoutId="memberActiveIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-foreground rounded-r-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              <Icon
                className={cn(
                  "w-5 h-5 flex-shrink-0 transition-transform",
                  !isActive && "group-hover:scale-110"
                )}
              />

              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div
                  className={cn(
                    "absolute left-full ml-2 px-2 py-1 rounded-md",
                    "bg-popover text-popover-foreground text-sm font-medium",
                    "opacity-0 pointer-events-none group-hover:opacity-100",
                    "transition-opacity duration-200 shadow-lg border border-border",
                    "whitespace-nowrap z-50"
                  )}
                >
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-muted-foreground text-center"
            >
              Judo Club Manager
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
