import * as React from "react";
import { cn } from "@/lib/utils";

export interface KeyboardKeyProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

const KeyboardKey = React.forwardRef<HTMLSpanElement, KeyboardKeyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center min-w-[1.5rem] px-1.5 py-0.5 text-xs font-medium rounded border border-border bg-muted shadow-sm",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

KeyboardKey.displayName = "KeyboardKey";

// Auto-detect OS and return appropriate modifier key
export function getModifierKey(): string {
  const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  return isMac ? "⌘" : "Ctrl";
}

// Component that automatically shows the right modifier key
export const ModifierKey = () => {
  const [modKey, setModKey] = React.useState<string>("Ctrl");

  React.useEffect(() => {
    setModKey(getModifierKey());
  }, []);

  return <KeyboardKey>{modKey}</KeyboardKey>;
};

export { KeyboardKey };
