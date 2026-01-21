import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";
import { SimpleTooltip } from "@/components/ui/tooltip";

export interface FormFieldProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  success?: boolean;
  className?: string;
  htmlFor?: string;
  tooltip?: string;
}

export function FormField({
  children,
  label,
  error,
  helperText,
  required,
  success,
  className,
  htmlFor,
  tooltip,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center gap-2">
          <Label htmlFor={htmlFor} className="flex items-center gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
          </Label>
          {tooltip && (
            <SimpleTooltip content={tooltip} side="right">
              <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
            </SimpleTooltip>
          )}
        </div>
      )}
      <div className="relative">
        {children}
        {success && !error && (
          <motion.div
            className="absolute right-3 top-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </motion.div>
        )}
      </div>
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 text-sm text-destructive"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
        {!error && helperText && (
          <motion.p
            key="helper"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-muted-foreground"
          >
            {helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
