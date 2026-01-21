import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: boolean;
  success?: boolean;
  showStrengthMeter?: boolean;
  showRequirements?: boolean;
}

interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

function calculatePasswordStrength(password: string): PasswordStrength {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(requirements).filter(Boolean).length;

  let label = "Weak";
  let color = "bg-red-500";

  if (score === 5) {
    label = "Very Strong";
    color = "bg-green-500";
  } else if (score === 4) {
    label = "Strong";
    color = "bg-green-400";
  } else if (score === 3) {
    label = "Medium";
    color = "bg-yellow-500";
  } else if (score === 2) {
    label = "Fair";
    color = "bg-orange-500";
  }

  return {
    score: score as 0 | 1 | 2 | 3 | 4,
    label,
    color,
    requirements,
  };
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(
  (
    {
      className,
      error,
      success,
      showStrengthMeter = false,
      showRequirements = false,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const strength = React.useMemo(() => {
      if (!value || typeof value !== "string") {
        return calculatePasswordStrength("");
      }
      return calculatePasswordStrength(value);
    }, [value]);

    const hasValue = Boolean(value && String(value).length > 0);

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            ref={ref}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "pr-10 transition-all duration-200",
              error && "border-destructive focus-visible:ring-destructive",
              success && "border-green-500 focus-visible:ring-green-500",
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
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

        <AnimatePresence>
          {showStrengthMeter && hasValue && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={cn("h-full rounded-full", strength.color)}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(strength.score / 5) * 100}%`,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground min-w-[80px]">
                  {strength.label}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showRequirements && hasValue && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-1.5 p-3 bg-muted rounded-md"
            >
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Password requirements:
              </p>
              {[
                { key: "length", label: "At least 8 characters" },
                { key: "uppercase", label: "One uppercase letter" },
                { key: "lowercase", label: "One lowercase letter" },
                { key: "number", label: "One number" },
                { key: "special", label: "One special character" },
              ].map(({ key, label }) => {
                const met =
                  strength.requirements[
                    key as keyof typeof strength.requirements
                  ];
                return (
                  <motion.div
                    key={key}
                    className="flex items-center gap-2 text-xs"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {met ? (
                      <Check className="w-3 h-3 text-green-500 shrink-0" />
                    ) : (
                      <X className="w-3 h-3 text-muted-foreground shrink-0" />
                    )}
                    <span
                      className={cn(
                        met ? "text-green-600 dark:text-green-500" : "text-muted-foreground"
                      )}
                    >
                      {label}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
