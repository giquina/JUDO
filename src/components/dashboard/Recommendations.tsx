import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  TrendingUp,
  Award,
  Users,
  Target,
  Play,
  Trophy,
  Flag,
  Info,
  X,
  Bookmark,
  Calendar,
  MessageSquare,
  Video,
  CheckCircle2,
  Lightbulb,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockCalendarData, type Recommendation } from "@/lib/mockCalendarData";

const iconMap = {
  TrendingUp,
  Award,
  Users,
  Target,
  Play,
  Trophy,
  Flag,
  Calendar,
  MessageSquare,
  Video,
  Sparkles,
};

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState(
    mockCalendarData.recommendations
  );
  const [savedRecommendations, setSavedRecommendations] = useState<string[]>([]);

  // Get icon component
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent || Lightbulb;
  };

  // Priority colors
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-500/5";
      case "medium":
        return "border-yellow-500 bg-yellow-500/5";
      case "low":
        return "border-blue-500 bg-blue-500/5";
      default:
        return "";
    }
  };

  // Priority badge variant
  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  // Handle dismiss recommendation
  const handleDismiss = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, dismissed: true } : rec))
    );
    toast.info("Recommendation dismissed", {
      description: "You won't see this again.",
      action: {
        label: "Undo",
        onClick: () => {
          setRecommendations((prev) =>
            prev.map((rec) => (rec.id === id ? { ...rec, dismissed: false } : rec))
          );
        },
      },
    });
  };

  // Handle save recommendation
  const handleSave = (id: string) => {
    if (savedRecommendations.includes(id)) {
      setSavedRecommendations((prev) => prev.filter((recId) => recId !== id));
      toast.info("Removed from saved");
    } else {
      setSavedRecommendations((prev) => [...prev, id]);
      toast.success("Saved for later", {
        description: "View saved recommendations in your profile.",
      });
    }
  };

  // Handle action click
  const handleAction = (rec: Recommendation) => {
    toast.success("Action triggered!", {
      description: `Opening: ${rec.title}`,
    });
  };

  // Filter out dismissed recommendations
  const activeRecommendations = recommendations.filter((rec) => !rec.dismissed);

  // Group recommendations by priority
  const highPriority = activeRecommendations.filter((rec) => rec.priority === "high");
  const mediumPriority = activeRecommendations.filter((rec) => rec.priority === "medium");
  const lowPriority = activeRecommendations.filter((rec) => rec.priority === "low");

  // Daily tip (rotates based on day)
  const dailyTips = [
    "Remember to hydrate before and after training!",
    "Focus on perfecting one technique at a time.",
    "Proper breakfalls prevent injuries - practice them regularly.",
    "Respect your training partners and they'll help you improve.",
    "Consistency beats intensity. Show up regularly!",
    "Watch competition footage to learn new strategies.",
    "Recovery is as important as training. Rest well!",
  ];
  const dailyTip = dailyTips[new Date().getDay()];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  // Render recommendation card
  const renderRecommendationCard = (rec: Recommendation) => {
    const Icon = getIcon(rec.icon);
    const isSaved = savedRecommendations.includes(rec.id);

    return (
      <motion.div
        key={rec.id}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, x: -100 }}
        layout
      >
        <Card
          className={cn(
            "relative overflow-hidden border-l-4 transition-all hover:shadow-lg",
            getPriorityColor(rec.priority)
          )}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-base">{rec.title}</CardTitle>
                    <Badge
                      variant={getPriorityBadgeVariant(rec.priority) as any}
                      className="text-xs capitalize"
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {rec.description}
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleSave(rec.id)}
                      >
                        <Bookmark
                          className={cn(
                            "w-4 h-4",
                            isSaved && "fill-current text-primary"
                          )}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isSaved ? "Remove from saved" : "Save for later"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDismiss(rec.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Dismiss</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex items-center justify-between gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-start gap-2 text-xs text-muted-foreground cursor-help flex-1">
                      <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{rec.reason}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">{rec.reason}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                size="sm"
                onClick={() => handleAction(rec)}
                className="flex-shrink-0"
              >
                {rec.actionLabel}
              </Button>
            </div>
          </CardContent>

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-2xl mb-2">
                <Sparkles className="w-6 h-6 text-primary" />
                For You
              </CardTitle>
              <CardDescription className="text-base">
                Personalized recommendations to help you reach your judo goals
              </CardDescription>
            </div>

            {savedRecommendations.length > 0 && (
              <Badge variant="secondary" className="text-sm">
                {savedRecommendations.length} saved
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Daily Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-l-4 border-l-blue-500 bg-blue-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Lightbulb className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Daily Tip</h3>
                <p className="text-sm text-muted-foreground">{dailyTip}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* High Priority Recommendations */}
      {highPriority.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Priority Actions
          </h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {highPriority.map((rec) => renderRecommendationCard(rec))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Medium Priority Recommendations */}
      {mediumPriority.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-500" />
            Suggested For You
          </h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {mediumPriority.map((rec) => renderRecommendationCard(rec))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Low Priority Recommendations */}
      {lowPriority.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-500" />
            Worth Exploring
          </h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {lowPriority.map((rec) => renderRecommendationCard(rec))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Empty state */}
      {activeRecommendations.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 rounded-full bg-muted">
                  <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">All caught up!</h3>
                <p className="text-muted-foreground max-w-md">
                  You've reviewed all your recommendations. Keep training and check back
                  later for new personalized suggestions.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() =>
                    setRecommendations(mockCalendarData.recommendations)
                  }
                >
                  Refresh Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Info card */}
      {activeRecommendations.length > 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                Recommendations are personalized based on your attendance, belt level,
                goals, and training patterns. Save recommendations to review later or
                dismiss them if they're not relevant.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
