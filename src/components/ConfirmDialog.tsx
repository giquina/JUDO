import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Info, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type ConfirmVariant = "danger" | "warning" | "info" | "default"

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  onCancel?: () => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmVariant
  showDontAskAgain?: boolean
  onDontAskAgainChange?: (checked: boolean) => void
  isLoading?: boolean
}

const variantConfig = {
  danger: {
    icon: AlertCircle,
    iconClassName: "text-destructive",
    iconBgClassName: "bg-destructive/10",
    confirmVariant: "destructive" as const,
  },
  warning: {
    icon: AlertTriangle,
    iconClassName: "text-yellow-500",
    iconBgClassName: "bg-yellow-500/10",
    confirmVariant: "default" as const,
  },
  info: {
    icon: Info,
    iconClassName: "text-blue-500",
    iconBgClassName: "bg-blue-500/10",
    confirmVariant: "default" as const,
  },
  default: {
    icon: Info,
    iconClassName: "text-muted-foreground",
    iconBgClassName: "bg-muted",
    confirmVariant: "default" as const,
  },
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  showDontAskAgain = false,
  onDontAskAgainChange,
  isLoading = false,
}: ConfirmDialogProps) {
  const [dontAskAgain, setDontAskAgain] = React.useState(false)
  const confirmButtonRef = React.useRef<HTMLButtonElement>(null)

  const config = variantConfig[variant]
  const Icon = config.icon

  // Handle keyboard shortcuts
  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isLoading) {
        e.preventDefault()
        handleConfirm()
      } else if (e.key === "Escape" && !isLoading) {
        e.preventDefault()
        handleCancel()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, isLoading])

  // Focus confirm button when dialog opens (for danger variant)
  React.useEffect(() => {
    if (open && variant === "danger") {
      // Small delay to ensure dialog is rendered
      setTimeout(() => {
        confirmButtonRef.current?.focus()
      }, 100)
    }
  }, [open, variant])

  const handleConfirm = () => {
    if (showDontAskAgain && onDontAskAgainChange) {
      onDontAskAgainChange(dontAskAgain)
    }
    onConfirm()
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <AnimatePresence mode="wait">
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <motion.div
                    className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-full shrink-0",
                      config.iconBgClassName
                    )}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      delay: 0.1,
                    }}
                  >
                    <Icon className={cn("w-6 h-6", config.iconClassName)} />
                  </motion.div>
                  <div className="flex-1 space-y-1 pt-1">
                    <DialogTitle className="text-left">{title}</DialogTitle>
                    {description && (
                      <DialogDescription className="text-left">
                        {description}
                      </DialogDescription>
                    )}
                  </div>
                </div>
              </DialogHeader>

              {showDontAskAgain && (
                <motion.div
                  className="flex items-center space-x-2 mt-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <input
                    type="checkbox"
                    id="dont-ask-again"
                    checked={dontAskAgain}
                    onChange={(e) => setDontAskAgain(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="dont-ask-again"
                    className="text-sm text-muted-foreground cursor-pointer select-none"
                  >
                    Don't ask me again
                  </label>
                </motion.div>
              )}

              <DialogFooter className="mt-6">
                <motion.div
                  className="flex gap-2 w-full sm:w-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 sm:flex-none"
                  >
                    {cancelLabel}
                  </Button>
                  <Button
                    ref={confirmButtonRef}
                    variant={config.confirmVariant}
                    onClick={handleConfirm}
                    disabled={isLoading}
                    isLoading={isLoading}
                    className="flex-1 sm:flex-none"
                  >
                    {confirmLabel}
                  </Button>
                </motion.div>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
