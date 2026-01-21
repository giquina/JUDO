import * as React from "react";
import { Check, X, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface InlineEditSelectProps {
  value: string;
  options: SelectOption[];
  onSave: (value: string) => Promise<void> | void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  displayValue?: (value: string) => React.ReactNode; // Custom display for non-editing state
}

export function InlineEditSelect({
  value,
  options,
  onSave,
  placeholder,
  className,
  disabled = false,
  displayValue,
}: InlineEditSelectProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(value);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Update edit value when prop value changes
  React.useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
    }
  }, [value, isEditing]);

  const handleSave = async () => {
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

  const getCurrentLabel = () => {
    const option = options.find((opt) => opt.value === value);
    return option?.label || value || placeholder || "Select...";
  };

  if (isEditing) {
    return (
      <div className={cn("space-y-1", className)}>
        <div className="flex items-center gap-2">
          <Select
            value={editValue}
            onValueChange={setEditValue}
            disabled={isLoading || disabled}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
      <span>{displayValue ? displayValue(value) : getCurrentLabel()}</span>
      <ChevronDown className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
    </button>
  );
}
