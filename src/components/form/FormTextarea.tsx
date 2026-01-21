import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  success?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
}

export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FormTextareaProps
>(
  (
    {
      className,
      error,
      success,
      maxLength,
      showCharCount = true,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const charCount = value ? String(value).length : 0;
    const isNearLimit = maxLength ? charCount / maxLength > 0.8 : false;
    const isAtLimit = maxLength ? charCount >= maxLength : false;

    return (
      <div className="relative">
        <Textarea
          ref={ref}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
          className={cn(
            "transition-all duration-200 resize-none",
            error && "border-destructive focus-visible:ring-destructive",
            success && "border-green-500 focus-visible:ring-green-500",
            showCharCount && maxLength && "pb-8",
            className
          )}
          {...props}
        />
        <AnimatePresence>
          {showCharCount && maxLength && (
            <motion.div
              className={cn(
                "absolute bottom-2 right-3 text-xs font-medium transition-colors",
                isAtLimit && "text-destructive",
                isNearLimit && !isAtLimit && "text-yellow-500",
                !isNearLimit && "text-muted-foreground"
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {charCount} / {maxLength}
            </motion.div>
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

FormTextarea.displayName = "FormTextarea";
