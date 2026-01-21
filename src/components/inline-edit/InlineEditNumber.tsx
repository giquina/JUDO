import * as React from "react";
import { Check, X, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export interface InlineEditNumberProps {
  value: number;
  onSave: (value: number) => Promise<void> | void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string; // e.g., "$", "£"
  suffix?: string; // e.g., "%", "kg"
  autoFocus?: boolean;
  disabled?: boolean;
}

export function InlineEditNumber({
  value,
  onSave,
  placeholder,
  className,
  inputClassName,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  autoFocus = true,
  disabled = false,
}: InlineEditNumberProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(value.toString());
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Update edit value when prop value changes
  React.useEffect(() => {
    if (!isEditing) {
      setEditValue(value.toString());
    }
  }, [value, isEditing]);

  // Focus input when editing starts
  React.useEffect(() => {
    if (isEditing && autoFocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing, autoFocus]);

  const handleSave = async () => {
    const numValue = parseFloat(editValue);

    // Validate number
    if (isNaN(numValue)) {
      setError("Please enter a valid number");
      return;
    }

    if (min !== undefined && numValue < min) {
      setError(`Value must be at least ${min}`);
      return;
    }

    if (max !== undefined && numValue > max) {
      setError(`Value must be at most ${max}`);
      return;
    }

    // Skip if no change
    if (numValue === value) {
      setIsEditing(false);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await onSave(numValue);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value.toString());
    setIsEditing(false);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  const displayValue = `${prefix || ""}${value}${suffix || ""}`;

  if (isEditing) {
    return (
      <div className={cn("space-y-1", className)}>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center">
            {prefix && <span className="text-muted-foreground mr-1">{prefix}</span>}
            <Input
              ref={inputRef}
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              placeholder={placeholder}
              disabled={isLoading || disabled}
              min={min}
              max={max}
              step={step}
              className={cn("flex-1", error && "border-destructive", inputClassName)}
            />
            {suffix && <span className="text-muted-foreground ml-1">{suffix}</span>}
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading || disabled}
            className="p-1 rounded hover:bg-accent text-green-600 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading || disabled}
            className="p-1 rounded hover:bg-accent text-destructive disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-destructive"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => !disabled && setIsEditing(true)}
      disabled={disabled}
      className={cn(
        "group inline-flex items-center gap-2 rounded px-2 py-1 -mx-2 -my-1 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      <span>{displayValue}</span>
      <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
    </button>
  );
}
