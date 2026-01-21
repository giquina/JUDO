import * as React from "react";
import { Check, X, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export interface InlineEditTextProps {
  value: string;
  onSave: (value: string) => Promise<void> | void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  validateFn?: (value: string) => string | null; // Returns error message or null
  autoFocus?: boolean;
  disabled?: boolean;
}

export function InlineEditText({
  value,
  onSave,
  placeholder,
  className,
  inputClassName,
  validateFn,
  autoFocus = true,
  disabled = false,
}: InlineEditTextProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(value);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Update edit value when prop value changes
  React.useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
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
    // Validate
    if (validateFn) {
      const validationError = validateFn(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Skip if no change
    if (editValue === value) {
      setIsEditing(false);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await onSave(editValue);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={cn("space-y-1", className)}>
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            placeholder={placeholder}
            disabled={isLoading || disabled}
            className={cn("flex-1", error && "border-destructive", inputClassName)}
          />
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
      <span>{value || placeholder || "Click to edit"}</span>
      <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
    </button>
  );
}
