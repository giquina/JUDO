import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Home,
  Calendar,
  QrCode,
  Trophy,
  User,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  Moon,
  Sun,
  LogOut,
  Command,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/components/ThemeProvider";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: typeof Home;
  action: () => void;
  keywords?: string[];
  shortcut?: string;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { role, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  // Build command list based on user role
  const commands: CommandItem[] = useMemo(() => {
    const baseCommands: CommandItem[] = [];

    // Navigation commands based on role
    if (role === "member" || role === "coach" || role === "admin") {
      baseCommands.push(
        {
          id: "member-dashboard",
          label: "Member Dashboard",
          description: "Go to member home",
          icon: Home,
          action: () => navigate("/member"),
          keywords: ["home", "dashboard", "member"],
          shortcut: "G M",
        },
        {
          id: "member-classes",
          label: "Class Schedule",
          description: "View and book classes",
          icon: Calendar,
          action: () => navigate("/member/classes"),
          keywords: ["keiko", "classes", "schedule", "book"],
          shortcut: "G C",
        },
        {
          id: "member-checkin",
          label: "QR Check-in",
          description: "Scan QR to check in",
          icon: QrCode,
          action: () => navigate("/member/checkin"),
          keywords: ["qr", "checkin", "scan", "attendance"],
          shortcut: "G Q",
        },
        {
          id: "member-progress",
          label: "Belt Progress",
          description: "Track your judo journey",
          icon: Trophy,
          action: () => navigate("/member/progress"),
          keywords: ["belt", "progress", "rank", "grade"],
          shortcut: "G P",
        },
        {
          id: "member-profile",
          label: "My Profile",
          description: "View and edit your profile",
          icon: User,
          action: () => navigate("/member/profile"),
          keywords: ["profile", "settings", "account"],
        }
      );
    }

    if (role === "coach" || role === "admin") {
      baseCommands.push(
        {
          id: "coach-dashboard",
          label: "Coach Dashboard",
          description: "Go to coach home",
          icon: Home,
          action: () => navigate("/coach"),
          keywords: ["coach", "dashboard"],
        },
        {
          id: "coach-attendance",
          label: "Take Attendance",
          description: "Scan and track attendance",
          icon: QrCode,
          action: () => navigate("/coach/attendance"),
          keywords: ["attendance", "scan", "register"],
        },
        {
          id: "coach-members",
          label: "View Judoka",
          description: "See all club members",
          icon: Users,
          action: () => navigate("/coach/members"),
          keywords: ["members", "judoka", "students"],
        }
      );
    }

    if (role === "admin") {
      baseCommands.push(
        {
          id: "admin-dashboard",
          label: "Admin Dashboard",
          description: "Go to admin home",
          icon: Home,
          action: () => navigate("/admin"),
          keywords: ["admin", "dashboard", "overview"],
          shortcut: "G A",
        },
        {
          id: "admin-members",
          label: "Manage Members",
          description: "Add, edit, remove members",
          icon: Users,
          action: () => navigate("/admin/members"),
          keywords: ["members", "manage", "users"],
        },
        {
          id: "admin-payments",
          label: "Payments",
          description: "View payment history",
          icon: CreditCard,
          action: () => navigate("/admin/payments"),
          keywords: ["payments", "billing", "subscriptions", "money"],
        },
        {
          id: "admin-analytics",
          label: "Analytics",
          description: "Club statistics and insights",
          icon: BarChart3,
          action: () => navigate("/admin/analytics"),
          keywords: ["analytics", "stats", "charts", "reports"],
        },
        {
          id: "admin-settings",
          label: "Settings",
          description: "System configuration",
          icon: Settings,
          action: () => navigate("/admin/settings"),
          keywords: ["settings", "config", "system"],
        }
      );
    }

    // Theme commands
    baseCommands.push({
      id: "toggle-theme",
      label: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      description: "Toggle dark/light theme",
      icon: theme === "dark" ? Sun : Moon,
      action: () => setTheme(theme === "dark" ? "light" : "dark"),
      keywords: ["theme", "dark", "light", "mode"],
      shortcut: "T",
    });

    // Logout command
    baseCommands.push({
      id: "logout",
      label: "Sign Out",
      description: "Log out of your account",
      icon: LogOut,
      action: async () => {
        await signOut();
        navigate("/login");
      },
      keywords: ["logout", "signout", "exit"],
    });

    return baseCommands;
  }, [role, theme, navigate, signOut, setTheme]);

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands;

    const searchLower = search.toLowerCase();
    return commands.filter((cmd) => {
      const matchLabel = cmd.label.toLowerCase().includes(searchLower);
      const matchDesc = cmd.description?.toLowerCase().includes(searchLower);
      const matchKeywords = cmd.keywords?.some((k) => k.includes(searchLower));
      return matchLabel || matchDesc || matchKeywords;
    });
  }, [commands, search]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      // Escape to close
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Handle navigation within palette
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredCommands[selectedIndex];
        if (selected) {
          selected.action();
          setIsOpen(false);
          setSearch("");
        }
      }
    },
    [filteredCommands, selectedIndex]
  );

  // Close on location change
  useEffect(() => {
    setIsOpen(false);
    setSearch("");
  }, [location.pathname]);

  return (
    <>
      {/* Keyboard shortcut hint - only show on desktop */}
      <div className="hidden md:flex fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border shadow-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-sm"
        >
          <Command className="h-4 w-4" />
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">⌘K</kbd>
        </button>
      </div>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed left-1/2 top-[20%] -translate-x-1/2 z-50 w-full max-w-lg"
            >
              <div className="rounded-xl border bg-card shadow-2xl overflow-hidden">
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 border-b">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search commands..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="flex-1 py-4 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  />
                  <kbd className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs">ESC</kbd>
                </div>

                {/* Commands list */}
                <div className="max-h-80 overflow-y-auto p-2">
                  {filteredCommands.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      No commands found
                    </div>
                  ) : (
                    filteredCommands.map((cmd, index) => {
                      const Icon = cmd.icon;
                      const isSelected = index === selectedIndex;

                      return (
                        <button
                          key={cmd.id}
                          onClick={() => {
                            cmd.action();
                            setIsOpen(false);
                            setSearch("");
                          }}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                            isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-md ${
                              isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{cmd.label}</div>
                            {cmd.description && (
                              <div className="text-sm text-muted-foreground truncate">
                                {cmd.description}
                              </div>
                            )}
                          </div>
                          {cmd.shortcut && (
                            <kbd className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs font-mono">
                              {cmd.shortcut}
                            </kbd>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Footer hint */}
                <div className="px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 rounded bg-muted">↑↓</kbd> navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 rounded bg-muted">↵</kbd> select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 rounded bg-muted">esc</kbd> close
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
