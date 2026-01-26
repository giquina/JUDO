import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "default" | "danger"
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-card p-6 shadow-lg"
                initial={{ opacity: 0, scale: 0.95, y: "-48%" }}
                animate={{ opacity: 1, scale: 1, y: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, y: "-48%" }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <Dialog.Title className="text-lg font-semibold text-foreground">
                  {title}
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-muted-foreground">
                  {message}
                </Dialog.Description>

                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    {cancelLabel}
                  </Button>
                  <Button
                    variant={variant === "danger" ? "destructive" : "default"}
                    onClick={handleConfirm}
                    isLoading={isLoading}
                  >
                    {confirmLabel}
                  </Button>
                </div>

                <Dialog.Close asChild>
                  <button
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                    aria-label="Close"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

// Types for the hook
interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "default" | "danger"
}

interface ConfirmState extends ConfirmOptions {
  open: boolean
  isLoading: boolean
  resolve: ((value: boolean) => void) | null
}

const initialState: ConfirmState = {
  open: false,
  isLoading: false,
  title: "",
  message: "",
  resolve: null,
}

// Context for programmatic usage
const ConfirmDialogContext = React.createContext<{
  confirm: (options: ConfirmOptions) => Promise<boolean>
} | null>(null)

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ConfirmState>(initialState)

  const confirm = React.useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        ...options,
        open: true,
        isLoading: false,
        resolve,
      })
    })
  }, [])

  const handleOpenChange = (open: boolean) => {
    if (!open && state.resolve) {
      state.resolve(false)
    }
    setState((prev) => ({ ...prev, open }))
  }

  const handleConfirm = async () => {
    if (state.resolve) {
      state.resolve(true)
    }
  }

  const handleCancel = () => {
    if (state.resolve) {
      state.resolve(false)
    }
  }

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        open={state.open}
        onOpenChange={handleOpenChange}
        title={state.title}
        message={state.message}
        confirmLabel={state.confirmLabel}
        cancelLabel={state.cancelLabel}
        variant={state.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isLoading={state.isLoading}
      />
    </ConfirmDialogContext.Provider>
  )
}

export function useConfirmDialog() {
  const context = React.useContext(ConfirmDialogContext)
  if (!context) {
    throw new Error("useConfirmDialog must be used within a ConfirmDialogProvider")
  }
  return context
}
