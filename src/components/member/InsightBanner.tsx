import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  TrendingUp,
  Target,
  Award,
  ArrowRight,
  X,
} from "lucide-react";
import { useState } from "react";

interface InsightBannerProps {
  insights: {
    type: "streak" | "upcoming" | "achievement" | "goal";
    title: string;
    message: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  }[];
}

const INSIGHT_ICONS = {
  streak: Sparkles,
  upcoming: TrendingUp,
  achievement: Award,
  goal: Target,
};

const INSIGHT_COLORS = {
  streak: "from-orange-500/20 to-red-500/20 border-orange-500/50",
  upcoming: "from-blue-500/20 to-cyan-500/20 border-blue-500/50",
  achievement: "from-purple-500/20 to-pink-500/20 border-purple-500/50",
  goal: "from-green-500/20 to-emerald-500/20 border-green-500/50",
};

export default function InsightBanner({ insights }: InsightBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || insights.length === 0) return null;

  const currentInsight = insights[currentIndex];
  const Icon = INSIGHT_ICONS[currentInsight.type];

  const handleNext = () => {
    if (currentIndex < insights.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`relative overflow-hidden bg-gradient-to-r ${
          INSIGHT_COLORS[currentInsight.type]
        } border-2`}
      >
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="flex-shrink-0"
            >
              <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
              </div>
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm mb-1">{currentInsight.title}</h3>
              <p className="text-sm text-muted-foreground">
                {currentInsight.message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {currentInsight.action && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={currentInsight.action.onClick}
                  className="shadow-lg"
                >
                  {currentInsight.action.label}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}

              {insights.length > 1 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleNext}
                  className="text-xs"
                >
                  Next ({currentIndex + 1}/{insights.length})
                </Button>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setDismissed(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>

        {/* Progress Indicator */}
        {insights.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/20">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentIndex + 1) / insights.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
      </Card>
    </motion.div>
  );
}
