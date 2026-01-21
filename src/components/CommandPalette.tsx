import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/lib/auth";
import KeyboardShortcutsModal from "./KeyboardShortcutsModal";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  DollarSign,
  UserPlus,
  QrCode,
  Megaphone,
  Upload,
  Sun,
  Moon,
  Keyboard,
  Search,
  Clock,
  Zap,
  ArrowRight,
  Crown,
  GraduationCap,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: typeof LayoutDashboard;
  action: () => void;
  group: "navigation" | "actions" | "search" | "theme" | "help";
  keywords?: string[];
  requiresRole?: string[];
}

// Recent commands stored in localStorage
const RECENT_COMMANDS_KEY = "judo_recent_commands";
const MAX_RECENT_COMMANDS = 5;

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { role } = useAuth();

  // Load recent commands from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_COMMANDS_KEY);
    if (saved) {
      try {
        setRecentCommands(JSON.parse(saved));
      } catch {
        // Ignore errors
      }
    }
  }, []);

  // Save recent command
  const addRecentCommand = useCallback((commandId: string) => {
    setRecentCommands((prev) => {
      const updated = [commandId, ...prev.filter((id) => id !== commandId)].slice(
        0,
        MAX_RECENT_COMMANDS
      );
      localStorage.setItem(RECENT_COMMANDS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Keyboard shortcut handler
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Define all commands
  const commands: CommandItem[] = [
    // Navigation
    {
      id: "nav-dashboard",
      label: "Go to Dashboard",
      description: "View your training progress",
      icon: LayoutDashboard,
      action: () => navigate("/member"),
      group: "navigation",
      keywords: ["home", "dashboard", "overview"],
    },
    {
      id: "nav-chat",
      label: "Go to Chat",
      description: "Group messages and discussions",
      icon: MessageSquare,
      action: () => navigate("/chat"),
      group: "navigation",
      keywords: ["chat", "messages", "groups"],
    },
    {
      id: "nav-coach",
      label: "Go to Coach Dashboard",
      description: "Manage students and classes",
      icon: GraduationCap,
      action: () => navigate("/coach"),
      group: "navigation",
      keywords: ["coach", "students", "classes"],
      requiresRole: ["coach", "super_admin"],
    },
    {
      id: "nav-treasurer",
      label: "Go to Treasurer Dashboard",
      description: "Financial management",
      icon: DollarSign,
      action: () => navigate("/treasurer"),
      group: "navigation",
      keywords: ["treasurer", "payments", "finance"],
      requiresRole: ["treasurer", "super_admin"],
    },
    {
      id: "nav-content",
      label: "Go to Content Manager",
      description: "Announcements and events",
      icon: Megaphone,
      action: () => navigate("/content"),
      group: "navigation",
      keywords: ["content", "announcements", "events"],
      requiresRole: ["content_manager", "super_admin"],
    },
    {
      id: "nav-admin",
      label: "Go to Admin Panel",
      description: "System administration",
      icon: Crown,
      action: () => navigate("/admin"),
      group: "navigation",
      keywords: ["admin", "settings", "system"],
      requiresRole: ["super_admin"],
    },
    // Actions
    {
      id: "action-new-member",
      label: "Add New Member",
      description: "Register a new club member",
      icon: UserPlus,
      action: () => {
        // TODO: Open new member modal
        console.log("Open new member modal");
      },
      group: "actions",
      keywords: ["new", "member", "register", "add"],
      requiresRole: ["super_admin", "treasurer"],
    },
    {
      id: "action-check-in",
      label: "Check In Member",
      description: "Mark attendance with QR code",
      icon: QrCode,
      action: () => {
        // TODO: Open check-in modal
        console.log("Open check-in modal");
      },
      group: "actions",
      keywords: ["check", "in", "attendance", "qr"],
      requiresRole: ["coach", "super_admin"],
    },
    {
      id: "action-announcement",
      label: "Send Announcement",
      description: "Post a new announcement",
      icon: Megaphone,
      action: () => {
        // TODO: Open announcement modal
        console.log("Open announcement modal");
      },
      group: "actions",
      keywords: ["announcement", "post", "send", "notify"],
      requiresRole: ["content_manager", "super_admin"],
    },
    {
      id: "action-event",
      label: "Create Event",
      description: "Schedule a new event",
      icon: Calendar,
      action: () => {
        // TODO: Open event modal
        console.log("Open event modal");
      },
      group: "actions",
      keywords: ["event", "create", "schedule"],
      requiresRole: ["content_manager", "super_admin"],
    },
    {
      id: "action-media",
      label: "Upload Media",
      description: "Upload photos or videos",
      icon: Upload,
      action: () => {
        // TODO: Open media upload modal
        console.log("Open media upload modal");
      },
      group: "actions",
      keywords: ["media", "upload", "photo", "video"],
      requiresRole: ["content_manager", "super_admin"],
    },
    // Search
    {
      id: "search-members",
      label: "Search Members",
      description: "Find members by name or email",
      icon: Users,
      action: () => {
        // TODO: Open members search
        console.log("Open members search");
      },
      group: "search",
      keywords: ["search", "members", "find", "user"],
    },
    {
      id: "search-classes",
      label: "Search Classes",
      description: "Find training classes",
      icon: Calendar,
      action: () => {
        // TODO: Open classes search
        console.log("Open classes search");
      },
      group: "search",
      keywords: ["search", "classes", "training", "find"],
    },
    {
      id: "search-payments",
      label: "Search Payments",
      description: "Find payment records",
      icon: DollarSign,
      action: () => {
        // TODO: Open payments search
        console.log("Open payments search");
      },
      group: "search",
      keywords: ["search", "payments", "transactions", "find"],
      requiresRole: ["treasurer", "super_admin"],
    },
    // Theme
    {
      id: "theme-toggle",
      label: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      description: `Currently using ${theme === "dark" ? "dark" : "light"} mode`,
      icon: theme === "dark" ? Sun : Moon,
      action: () => setTheme(theme === "dark" ? "light" : "dark"),
      group: "theme",
      keywords: ["theme", "dark", "light", "mode", "appearance"],
    },
    // Help
    {
      id: "help-shortcuts",
      label: "Show Keyboard Shortcuts",
      description: "View all keyboard shortcuts",
      icon: Keyboard,
      action: () => {
        setShortcutsModalOpen(true);
      },
      group: "help",
      keywords: ["help", "shortcuts", "keyboard", "keys"],
    },
  ];

  // Filter commands based on role
  const availableCommands = commands.filter((cmd) => {
    if (!cmd.requiresRole) return true;
    return role && cmd.requiresRole.includes(role);
  });

  // Get recent command items
  const recentItems = recentCommands
    .map((id) => availableCommands.find((cmd) => cmd.id === id))
    .filter(Boolean) as CommandItem[];

  // Handle command selection
  const runCommand = (command: CommandItem) => {
    addRecentCommand(command.id);
    command.action();
    setOpen(false);
    setSearch("");
  };

  // Group labels
  const groupLabels = {
    navigation: "Navigation",
    actions: "Quick Actions",
    search: "Search",
    theme: "Appearance",
    help: "Help",
  };

  // Group icons
  const groupIcons = {
    navigation: LayoutDashboard,
    actions: Zap,
    search: Search,
    theme: theme === "dark" ? Moon : Sun,
    help: Keyboard,
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Command Palette Modal */}
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
              <motion.div
                className="w-full max-w-2xl"
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <Command
                  className="rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                  shouldFilter={true}
                >
                  {/* Search Input */}
                  <div className="flex items-center border-b border-border/50 px-4">
                    <Search className="w-5 h-5 text-muted-foreground mr-3" />
                    <Command.Input
                      value={search}
                      onValueChange={setSearch}
                      placeholder="Type a command or search..."
                      className="flex h-14 w-full bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded bg-muted px-2 font-mono text-xs font-medium text-muted-foreground">
                      ESC
                    </kbd>
                  </div>

                  {/* Command List */}
                  <Command.List className="max-h-[400px] overflow-y-auto p-2">
                    <Command.Empty className="py-12 text-center text-sm text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-10 h-10 text-muted-foreground/30" />
                        <p>No results found.</p>
                      </div>
                    </Command.Empty>

                    {/* Recent Commands */}
                    {!search && recentItems.length > 0 && (
                      <Command.Group
                        heading={
                          <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <Clock className="w-3.5 h-3.5" />
                            Recent
                          </div>
                        }
                      >
                        {recentItems.map((cmd) => {
                          const Icon = cmd.icon;
                          return (
                            <Command.Item
                              key={cmd.id}
                              value={cmd.label}
                              onSelect={() => runCommand(cmd)}
                              className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
                            >
                              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted data-[selected=true]:bg-primary/20">
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{cmd.label}</p>
                                {cmd.description && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    {cmd.description}
                                  </p>
                                )}
                              </div>
                              <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            </Command.Item>
                          );
                        })}
                      </Command.Group>
                    )}

                    {/* Grouped Commands */}
                    {(["navigation", "actions", "search", "theme", "help"] as const).map(
                      (group) => {
                        const groupCommands = availableCommands.filter(
                          (cmd) => cmd.group === group
                        );
                        if (groupCommands.length === 0) return null;

                        const GroupIcon = groupIcons[group];

                        return (
                          <Command.Group
                            key={group}
                            heading={
                              <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <GroupIcon className="w-3.5 h-3.5" />
                                {groupLabels[group]}
                              </div>
                            }
                          >
                            {groupCommands.map((cmd) => {
                              const Icon = cmd.icon;
                              return (
                                <Command.Item
                                  key={cmd.id}
                                  value={cmd.label}
                                  keywords={cmd.keywords}
                                  onSelect={() => runCommand(cmd)}
                                  className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
                                >
                                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted data-[selected=true]:bg-primary/20">
                                    <Icon className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{cmd.label}</p>
                                    {cmd.description && (
                                      <p className="text-xs text-muted-foreground truncate">
                                        {cmd.description}
                                      </p>
                                    )}
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                </Command.Item>
                              );
                            })}
                          </Command.Group>
                        );
                      }
                    )}
                  </Command.List>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-border/50 px-4 py-2.5 text-xs text-muted-foreground bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <kbd className="h-5 min-w-5 inline-flex items-center justify-center rounded bg-background px-1.5 font-mono font-medium border">
                          ↑
                        </kbd>
                        <kbd className="h-5 min-w-5 inline-flex items-center justify-center rounded bg-background px-1.5 font-mono font-medium border">
                          ↓
                        </kbd>
                        <span className="ml-1">Navigate</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <kbd className="h-5 px-2 inline-flex items-center justify-center rounded bg-background font-mono font-medium border">
                          ↵
                        </kbd>
                        <span>Select</span>
                      </div>
                    </div>
                    <div className="hidden sm:block">
                      Press{" "}
                      <kbd className="h-5 px-2 inline-flex items-center justify-center rounded bg-background font-mono font-medium border">
                        ⌘K
                      </kbd>{" "}
                      to open
                    </div>
                  </div>
                </Command>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Action Button - Optional trigger */}
      {/* Floating Action Button - Optional trigger */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline text-sm font-medium">Quick Actions</span>
        <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded bg-primary-foreground/20 px-1.5 font-mono text-[10px] font-medium">
          ⌘K
        </kbd>
      </motion.button>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        open={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />
    </>
  );
}
