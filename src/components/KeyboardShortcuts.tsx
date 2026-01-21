import * as React from "react";
import { X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyboardKey, getModifierKey } from "./KeyboardKey";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface Shortcut {
  keys: string[];
  description: string;
  category: "Global" | "Navigation" | "Actions" | "Search";
}

const shortcuts: Shortcut[] = [
  // Global
  { keys: [getModifierKey(), "K"], description: "Open command palette", category: "Global" },
  { keys: ["Escape"], description: "Close dialog/modal", category: "Global" },
  { keys: ["?"], description: "Show keyboard shortcuts", category: "Global" },

  // Navigation
  { keys: ["G", "M"], description: "Go to Members", category: "Navigation" },
  { keys: ["G", "C"], description: "Go to Chat", category: "Navigation" },
  { keys: ["G", "D"], description: "Go to Dashboard", category: "Navigation" },

  // Actions
  { keys: ["N"], description: "New member/item", category: "Actions" },
  { keys: ["I"], description: "Check-in", category: "Actions" },
  { keys: [getModifierKey(), "S"], description: "Save changes", category: "Actions" },
  { keys: [getModifierKey(), "Enter"], description: "Submit form", category: "Actions" },

  // Search
  { keys: ["/"], description: "Focus search", category: "Search" },
  { keys: [getModifierKey(), "F"], description: "Find on page", category: "Search" },
];

export interface KeyboardShortcutsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcuts({ open, onOpenChange }: KeyboardShortcutsProps) {
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Filter shortcuts by search
  const filteredShortcuts = React.useMemo(() => {
    if (!search) return shortcuts;
    const query = search.toLowerCase();
    return shortcuts.filter(
      (shortcut) =>
        shortcut.description.toLowerCase().includes(query) ||
        shortcut.keys.some((key) => key.toLowerCase().includes(query))
    );
  }, [search]);

  // Group by category
  const groupedShortcuts = React.useMemo(() => {
    const groups: Record<string, Shortcut[]> = {};
    filteredShortcuts.forEach((shortcut) => {
      if (!groups[shortcut.category]) {
        groups[shortcut.category] = [];
      }
      groups[shortcut.category].push(shortcut);
    });
    return groups;
  }, [filteredShortcuts]);

  // Focus search input when opened
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearch("");
    }
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className={cn(
                "relative w-full max-w-2xl max-h-[85vh] bg-background rounded-lg shadow-lg border overflow-hidden",
                "flex flex-col"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-4 border-b">
                <div>
                  <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Quick access to common actions
                  </p>
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </button>
              </div>

              {/* Search */}
              <div className="p-6 pb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search shortcuts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Shortcuts List */}
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                {Object.keys(groupedShortcuts).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No shortcuts found
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                      <div key={category}>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          {category}
                        </h3>
                        <div className="space-y-2">
                          {categoryShortcuts.map((shortcut, index) => (
                            <motion.div
                              key={`${category}-${index}`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent/50 transition-colors"
                            >
                              <span className="text-sm">{shortcut.description}</span>
                              <div className="flex items-center gap-1">
                                {shortcut.keys.map((key, keyIndex) => (
                                  <React.Fragment key={keyIndex}>
                                    {keyIndex > 0 && (
                                      <span className="text-muted-foreground text-xs mx-0.5">
                                        then
                                      </span>
                                    )}
                                    <KeyboardKey>{key}</KeyboardKey>
                                  </React.Fragment>
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-muted/30 text-center text-xs text-muted-foreground">
                Press <KeyboardKey>Esc</KeyboardKey> to close
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to handle keyboard shortcuts
export function useKeyboardShortcuts(
  onOpenShortcuts?: () => void,
  customHandlers?: Record<string, () => void>
) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show shortcuts on ?
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        const target = e.target as HTMLElement;
        // Don't trigger if user is typing in an input
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
          return;
        }
        e.preventDefault();
        onOpenShortcuts?.();
        return;
      }

      // Handle custom shortcuts
      if (customHandlers) {
        const modKey = e.metaKey || e.ctrlKey;
        const key = e.key.toLowerCase();

        for (const [shortcut, handler] of Object.entries(customHandlers)) {
          const [mod, ...keys] = shortcut.split("+");
          const needsMod = mod === "mod";
          const shortcutKey = keys.join("+") || mod;

          if (needsMod && modKey && key === shortcutKey.toLowerCase()) {
            e.preventDefault();
            handler();
            return;
          }

          if (!needsMod && !modKey && key === shortcut.toLowerCase()) {
            const target = e.target as HTMLElement;
            // Don't trigger if user is typing in an input
            if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
              return;
            }
            e.preventDefault();
            handler();
            return;
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenShortcuts, customHandlers]);
}
