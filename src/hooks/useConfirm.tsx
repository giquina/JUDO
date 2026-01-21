import * as React from "react";
import {
  ConfirmDialog,
  type ConfirmVariant,
} from "@/components/ConfirmDialog";

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  showDontAskAgain?: boolean;
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = React.createContext<ConfirmContextValue | null>(null);

interface ConfirmState extends ConfirmOptions {
  open: boolean;
  resolve: (value: boolean) => void;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ConfirmState>({
    open: false,
    title: "",
    resolve: () => {},
  });

  const confirm = React.useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({
        ...options,
        open: true,
        resolve,
      });
    });
  }, []);

  const handleConfirm = React.useCallback(() => {
    state.resolve(true);
    setState((prev) => ({ ...prev, open: false }));
  }, [state]);

  const handleCancel = React.useCallback(() => {
    state.resolve(false);
    setState((prev) => ({ ...prev, open: false }));
  }, [state]);

  const handleOpenChange = React.useCallback((open: boolean) => {
    if (!open) {
      state.resolve(false);
    }
    setState((prev) => ({ ...prev, open }));
  }, [state]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        open={state.open}
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title={state.title}
        description={state.description}
        confirmLabel={state.confirmLabel}
        cancelLabel={state.cancelLabel}
        variant={state.variant}
        showDontAskAgain={state.showDontAskAgain}
      />
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = React.useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return context.confirm;
}
