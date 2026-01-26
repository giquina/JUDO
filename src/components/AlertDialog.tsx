import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

/**
 * AlertDialog - A dialog specifically for destructive/dangerous actions
 * Always displays with a warning icon and red confirm button
 */
export function AlertDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
}: AlertDialogProps) {
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
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-destructive/20 bg-card p-6 shadow-lg"
                initial={{ opacity: 0, scale: 0.95, y: "-48%" }}
                animate={{ opacity: 1, scale: 1, y: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, y: "-48%" }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <Dialog.Title className="text-lg font-semibold text-foreground">
                      {title}
                    </Dialog.Title>
                    <Dialog.Description className="mt-2 text-sm text-muted-foreground">
                      {message}
                    </Dialog.Description>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    {cancelLabel}
                  </Button>
                  <Button
                    variant="destructive"
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
interface AlertOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}

interface AlertState extends AlertOptions {
  open: boolean
  isLoading: boolean
  resolve: ((value: boolean) => void) | null
}

const initialState: AlertState = {
  open: false,
  isLoading: false,
  title: "",
  message: "",
  resolve: null,
}

// Context for programmatic usage
const AlertDialogContext = React.createContext<{
  alert: (options: AlertOptions) => Promise<boolean>
} | null>(null)

export function AlertDialogProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AlertState>(initialState)

  const alert = React.useCallback((options: AlertOptions): Promise<boolean> => {
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
    <AlertDialogContext.Provider value={{ alert }}>
      {children}
      <AlertDialog
        open={state.open}
        onOpenChange={handleOpenChange}
        title={state.title}
        message={state.message}
        confirmLabel={state.confirmLabel}
        cancelLabel={state.cancelLabel}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isLoading={state.isLoading}
      />
    </AlertDialogContext.Provider>
  )
}

export function useAlertDialog() {
  const context = React.useContext(AlertDialogContext)
  if (!context) {
    throw new Error("useAlertDialog must be used within an AlertDialogProvider")
  }
  return context
}
