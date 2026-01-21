import * as React from "react";
import { FormInput, type FormInputProps } from "./FormInput";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";

export interface EmailInputProps extends Omit<FormInputProps, "type"> {
  showSuggestions?: boolean;
  onSuggestionClick?: (email: string) => void;
}

const commonDomains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "protonmail.com",
];

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function getEmailSuggestions(email: string): string[] {
  if (!email.includes("@")) return [];

  const [localPart, domain] = email.split("@");
  if (!domain) return [];

  const suggestions: string[] = [];

  // Suggest common domains if the domain is incomplete or potentially misspelled
  for (const commonDomain of commonDomains) {
    if (
      domain.length > 0 &&
      commonDomain.toLowerCase().startsWith(domain.toLowerCase()) &&
      commonDomain !== domain
    ) {
      suggestions.push(`${localPart}@${commonDomain}`);
    }
  }

  return suggestions.slice(0, 3); // Limit to 3 suggestions
}

export const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  (
    {
      showSuggestions = true,
      onSuggestionClick,
      value,
      onChange,
      error,
      success,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [suggestions, setSuggestions] = React.useState<string[]>([]);

    const emailValue = typeof value === "string" ? value : "";
    const isValid = emailValue ? isValidEmail(emailValue) : false;
    const hasValue = emailValue.length > 0;

    React.useEffect(() => {
      if (showSuggestions && hasValue && isFocused && !isValid) {
        const newSuggestions = getEmailSuggestions(emailValue);
        setSuggestions(newSuggestions);
      } else {
        setSuggestions([]);
      }
    }, [emailValue, isFocused, isValid, showSuggestions, hasValue]);

    const handleSuggestionClick = (suggestion: string) => {
      if (onChange) {
        onChange({
          target: { value: suggestion },
        } as React.ChangeEvent<HTMLInputElement>);
      }
      if (onSuggestionClick) {
        onSuggestionClick(suggestion);
      }
      setSuggestions([]);
    };

    return (
      <div className="relative">
        <FormInput
          ref={ref}
          type="email"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay to allow clicking suggestions
            setTimeout(() => setIsFocused(false), 200);
          }}
          error={error}
          success={success || (hasValue && isValid && !error)}
          {...props}
        />

        <AnimatePresence>
          {hasValue && isValid && !error && (
            <motion.div
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Check className="w-5 h-5 text-green-500" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hasValue && !isValid && isFocused && !error && (
            <motion.div
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-2 space-y-1">
                <p className="text-xs text-muted-foreground px-2 py-1">
                  Did you mean?
                </p>
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

EmailInput.displayName = "EmailInput";
