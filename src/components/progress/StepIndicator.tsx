import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number; // 1-indexed
  variant?: "default" | "compact";
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export default function StepIndicator({
  steps,
  currentStep,
  variant = "default",
  orientation = "horizontal",
  className = "",
}: StepIndicatorProps) {
  const isHorizontal = orientation === "horizontal";
  const isCompact = variant === "compact";

  return (
    <div className={cn("w-full", className)}>
      {isCompact && (
        <div className="text-center mb-4">
          <span className="text-sm font-medium">
            Step {currentStep} of {steps.length}
          </span>
        </div>
      )}
      <ol
        className={cn(
          "flex",
          isHorizontal ? "flex-row items-center" : "flex-col space-y-4"
        )}
      >
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <li
              key={index}
              className={cn(
                "flex items-center",
                isHorizontal ? "flex-1" : "flex-row gap-3"
              )}
            >
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative flex items-center justify-center rounded-full border-2 transition-all",
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCurrent
                      ? "border-primary bg-background text-primary shadow-lg shadow-primary/25"
                      : "border-muted-foreground/30 bg-background text-muted-foreground",
                    isCompact ? "w-8 h-8" : "w-10 h-10"
                  )}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <span className={cn("font-semibold", isCompact ? "text-xs" : "text-sm")}>
                      {stepNumber}
                    </span>
                  )}

                  {/* Pulsing ring for current step */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 1.3, opacity: 0 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  )}
                </motion.div>

                {/* Step Label - Below circle for horizontal, to the right for vertical */}
                {!isCompact && (
                  <div
                    className={cn(
                      "mt-2",
                      isHorizontal ? "text-center w-full" : "ml-3"
                    )}
                  >
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isCurrent ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </p>
                    {step.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.description}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "bg-muted-foreground/30 transition-all",
                    isHorizontal
                      ? "h-0.5 flex-1 mx-2"
                      : "w-0.5 h-8 ml-[1.15rem]",
                    isCompleted && "bg-primary"
                  )}
                >
                  {isCompleted && (
                    <motion.div
                      className={cn(
                        "bg-primary",
                        isHorizontal ? "h-full" : "w-full"
                      )}
                      initial={isHorizontal ? { width: 0 } : { height: 0 }}
                      animate={isHorizontal ? { width: "100%" } : { height: "100%" }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
