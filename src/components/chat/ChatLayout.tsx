import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatLayoutProps {
  sidebar: ReactNode;
  main: ReactNode;
  showSidebar: boolean;
  onToggleSidebar?: () => void;
}

export function ChatLayout({
  sidebar,
  main,
  showSidebar,
  onToggleSidebar,
}: ChatLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Sidebar - Hidden on mobile unless toggled */}
      <AnimatePresence mode="wait">
        {showSidebar && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "border-r bg-card",
              "w-full md:w-80 lg:w-96",
              "absolute md:relative z-20 h-full"
            )}
          >
            {sidebar}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden">{main}</main>

      {/* Overlay for mobile when sidebar is open */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={onToggleSidebar}
        />
      )}
    </div>
  );
}
