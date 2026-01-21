import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string; // CSS selector for the element to highlight
  position?: "top" | "bottom" | "left" | "right";
  icon?: React.ReactNode;
}

export interface DashboardTourProps {
  steps: TourStep[];
  open: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const defaultSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Your Dashboard!",
    content:
      "Let's take a quick tour to help you get the most out of your JUDO app experience.",
    icon: <Sparkles className="h-6 w-6 text-yellow-500" />,
  },
  {
    id: "quick-actions",
    title: "Quick Actions Bar",
    content:
      "Access common actions instantly. Each action has a keyboard shortcut for faster navigation.",
    target: "[data-tour='quick-actions']",
    position: "bottom",
    icon: <Zap className="h-6 w-6 text-blue-500" />,
  },
  {
    id: "streak",
    title: "Track Your Progress",
    content:
      "Monitor your training streak and stay motivated to maintain consistency.",
    target: "[data-tour='streak']",
    position: "top",
    icon: <Target className="h-6 w-6 text-orange-500" />,
  },
  {
    id: "goals",
    title: "Set and Achieve Goals",
    content:
      "Create personal goals and track your progress towards achieving them.",
    target: "[data-tour='goals']",
    position: "top",
  },
  {
    id: "customize",
    title: "Customize Your View",
    content:
      "Click the settings icon to customize which widgets you see and their order.",
    position: "bottom",
  },
];

export function DashboardTour({
  steps = defaultSteps,
  open,
  onComplete,
  onSkip,
}: DashboardTourProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [highlightedElement, setHighlightedElement] =
    React.useState<HTMLElement | null>(null);

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  // Highlight target element
  React.useEffect(() => {
    if (open && step.target) {
      const element = document.querySelector(step.target) as HTMLElement;
      setHighlightedElement(element);

      // Scroll element into view
      element?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      setHighlightedElement(null);
    }
  }, [open, step.target]);

  // Get position for tooltip
  const getTooltipPosition = () => {
    if (!highlightedElement) return { top: "50%", left: "50%" };

    const rect = highlightedElement.getBoundingClientRect();
    const position = step.position || "bottom";

    switch (position) {
      case "top":
        return {
          top: `${rect.top - 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: "translate(-50%, -100%)",
        };
      case "bottom":
        return {
          top: `${rect.bottom + 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: "translate(-50%, 0)",
        };
      case "left":
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.left - 20}px`,
          transform: "translate(-100%, -50%)",
        };
      case "right":
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + 20}px`,
          transform: "translate(0, -50%)",
        };
      default:
        return {
          top: `${rect.bottom + 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: "translate(-50%, 0)",
        };
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleComplete = () => {
    localStorage.setItem("dashboardTourCompleted", "true");
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem("dashboardTourCompleted", "true");
    onSkip();
  };

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, currentStep]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop with spotlight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80"
          >
            {/* Spotlight on highlighted element */}
            {highlightedElement && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: "absolute",
                  top: highlightedElement.getBoundingClientRect().top - 8,
                  left: highlightedElement.getBoundingClientRect().left - 8,
                  width: highlightedElement.offsetWidth + 16,
                  height: highlightedElement.offsetHeight + 16,
                  borderRadius: "12px",
                  boxShadow:
                    "0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.8)",
                  pointerEvents: "none",
                }}
              />
            )}
          </motion.div>

          {/* Tour content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={
              highlightedElement
                ? getTooltipPosition()
                : {
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }
            }
            className={cn(
              "fixed z-50 w-full max-w-md bg-background rounded-xl shadow-2xl border p-6",
              highlightedElement ? "absolute" : "fixed"
            )}
          >
            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-1 hover:bg-accent rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Icon */}
            {step.icon && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="mb-4"
              >
                {step.icon}
              </motion.div>
            )}

            {/* Content */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">{step.title}</h2>
              <p className="text-sm text-muted-foreground">{step.content}</p>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === currentStep
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground"
              >
                Skip Tour
              </Button>

              <div className="flex items-center gap-2">
                {!isFirstStep && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}

                <Button size="sm" onClick={handleNext}>
                  {isLastStep ? (
                    "Get Started"
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Keyboard hints */}
            <div className="mt-4 pt-4 border-t text-xs text-muted-foreground text-center">
              Use arrow keys to navigate • ESC to skip
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to manage tour state
export function useDashboardTour() {
  const [showTour, setShowTour] = React.useState(() => {
    const completed = localStorage.getItem("dashboardTourCompleted");
    return !completed;
  });

  const startTour = () => setShowTour(true);
  const completeTour = () => setShowTour(false);
  const skipTour = () => setShowTour(false);

  return {
    showTour,
    startTour,
    completeTour,
    skipTour,
  };
}
