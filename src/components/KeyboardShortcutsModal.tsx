import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard, Command, ArrowUp, ArrowDown, CornerDownLeft } from "lucide-react";
import type { ReactNode } from "react";

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  windows?: string[];
  icon?: ReactNode;
}

const shortcuts: Array<{ category: string; items: ShortcutItem[] }> = [
  {
    category: "General",
    items: [
      {
        keys: ["⌘", "K"],
        description: "Open command palette",
        windows: ["Ctrl", "K"],
      },
      {
        keys: ["Esc"],
        description: "Close dialogs/modals",
      },
      {
        keys: ["⌘", "\\"],
        description: "Toggle sidebar",
        windows: ["Ctrl", "\\"],
      },
    ],
  },
  {
    category: "Navigation",
    items: [
      {
        keys: ["G", "D"],
        description: "Go to Dashboard",
      },
      {
        keys: ["G", "C"],
        description: "Go to Chat",
      },
      {
        keys: ["G", "M"],
        description: "Go to Members",
      },
      {
        keys: ["G", "P"],
        description: "Go to Payments",
      },
    ],
  },
  {
    category: "Command Palette",
    items: [
      {
        keys: ["↑", "↓"],
        description: "Navigate commands",
        icon: <><ArrowUp className="w-4 h-4" /><ArrowDown className="w-4 h-4" /></>,
      },
      {
        keys: ["↵"],
        description: "Execute command",
        icon: <CornerDownLeft className="w-4 h-4" />,
      },
      {
        keys: ["Esc"],
        description: "Close palette",
      },
    ],
  },
  {
    category: "Quick Actions",
    items: [
      {
        keys: ["N"],
        description: "New member (from members page)",
      },
      {
        keys: ["A"],
        description: "New announcement (from content page)",
      },
      {
        keys: ["E"],
        description: "New event (from content page)",
      },
    ],
  },
];

export default function KeyboardShortcutsModal({ open, onClose }: KeyboardShortcutsModalProps) {
  // Detect OS
  const isMac = typeof window !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/50 px-6 py-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                    <Keyboard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
                    <p className="text-sm text-muted-foreground">
                      Master these shortcuts to navigate faster
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {shortcuts.map((category) => (
                    <div key={category.category} className="space-y-3">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        {category.category}
                      </h3>
                      <div className="space-y-2">
                        {category.items.map((item, index) => {
                          const displayKeys = !isMac && item.windows ? item.windows : item.keys;
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                              <span className="text-sm">{item.description}</span>
                              <div className="flex items-center gap-1">
                                {item.icon ? (
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    {item.icon as ReactNode}
                                  </div>
                                ) : (
                                  displayKeys?.map((key: string, keyIndex: number) => (
                                    <kbd
                                      key={keyIndex}
                                      className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded bg-background border border-border font-mono text-xs font-medium"
                                    >
                                      {key === "⌘" ? (
                                        <Command className="w-3 h-3" />
                                      ) : (
                                        key
                                      )}
                                    </kbd>
                                  ))
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Platform Info */}
                <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <Command className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Platform Detected</p>
                      <p className="text-sm text-muted-foreground">
                        You're on <strong>{isMac ? "macOS" : "Windows/Linux"}</strong>.{" "}
                        {isMac
                          ? "Use ⌘ (Command) key for shortcuts."
                          : "Use Ctrl key for shortcuts."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pro Tip */}
                <div className="mt-4 p-4 rounded-xl bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Pro tip:</strong> Most shortcuts work
                    contextually. Try pressing <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-background border border-border font-mono text-xs">N</kbd> on different pages to
                    create relevant items!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
