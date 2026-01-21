import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
  success?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  error,
  success,
  disabled,
  className,
}: FormSelectProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className="relative">
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          className={cn(
            "transition-all duration-200",
            error && "border-destructive focus:ring-destructive",
            success && "border-green-500 focus:ring-green-500",
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
