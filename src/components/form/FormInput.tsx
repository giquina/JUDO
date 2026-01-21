import * as React from "react";
import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface FormInputProps extends InputProps {
  error?: boolean;
  success?: boolean;
  onClear?: () => void;
  showClearButton?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      className,
      error,
      success,
      onClear,
      showClearButton = false,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = Boolean(value && String(value).length > 0);

    return (
      <div className="relative">
        <Input
          ref={ref}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "transition-all duration-200",
            error &&
              "border-destructive focus-visible:ring-destructive pr-10",
            success &&
              "border-green-500 focus-visible:ring-green-500 pr-10",
            showClearButton && hasValue && "pr-10",
            className
          )}
          {...props}
        />
        <AnimatePresence>
          {showClearButton && hasValue && !props.disabled && (
            <motion.button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (onClear) {
                  onClear();
                }
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isFocused && (
            <motion.div
              className={cn(
                "absolute inset-0 rounded-md pointer-events-none",
                error && "ring-2 ring-destructive/20",
                success && "ring-2 ring-green-500/20",
                !error && !success && "ring-2 ring-ring/20"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
