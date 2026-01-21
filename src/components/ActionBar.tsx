import type { ReactNode } from "react"
import { X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface ActionBarProps {
  selectedCount: number
  totalCount?: number
  onClear: () => void
  onSelectAll?: () => void
  actions?: ReactNode
  className?: string
}

export function ActionBar({
  selectedCount,
  totalCount,
  onClear,
  onSelectAll,
  actions,
  className,
}: ActionBarProps) {
  const isVisible = selectedCount > 0

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={cn(
            "fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-lg",
            className
          )}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4 py-3">
              {/* Left: Selection Info */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClear}
                  className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                  aria-label="Clear selection"
                >
                  <X className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-3">
                  <span className="font-semibold">
                    {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
                  </span>

                  {totalCount !== undefined && onSelectAll && selectedCount < totalCount && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onSelectAll}
                      className="h-7 text-primary-foreground hover:bg-primary-foreground/20 gap-1"
                    >
                      <Check className="h-4 w-4" />
                      Select all {totalCount}
                    </Button>
                  )}
                </div>
              </div>

              {/* Right: Actions */}
              {actions && (
                <div className="flex items-center gap-2">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
