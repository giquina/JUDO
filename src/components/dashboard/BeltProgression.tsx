import { useState } from "react";
import { motion } from "framer-motion";
import { Award, Calendar, CheckCircle2, Clock, TrendingUp, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BELT_LEVELS,
  currentBelt,
  nextBelt,
  beltRequirements,
  beltHistory,
  nextGradingDates,
  estimatedDaysToNextBelt,
  techniquesList,
} from "@/lib/mockProgressData";
import { BeltRequirementsModal } from "./BeltRequirementsModal";
import { cn } from "@/lib/utils";

export function BeltProgression() {
  const [showRequirementsModal, setShowRequirementsModal] = useState(false);

  const overallProgress =
    beltRequirements.reduce((acc, req) => acc + (req.current / req.required) * 100, 0) /
    beltRequirements.length;

  const completedTechniques = techniquesList.filter((t) => t.completed).length;
  const techniqueProgress = (completedTechniques / techniquesList.length) * 100;

  const nextGradingDate = nextGradingDates[0];
  const daysUntilGrading = Math.floor(
    (nextGradingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const getRequirementIcon = (category: string) => {
    switch (category) {
      case "hours":
        return Clock;
      case "techniques":
        return Award;
      case "time":
        return Calendar;
      case "recommendation":
        return User;
      default:
        return CheckCircle2;
    }
  };

  const getRequirementColor = (percentage: number) => {
    if (percentage >= 100) return "text-green-500";
    if (percentage >= 70) return "text-blue-500";
    if (percentage >= 40) return "text-yellow-500";
    return "text-orange-500";
  };

  return (
    <div className="space-y-6">
      {/* Belt Journey Visualization */}
      <Card className="p-6 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Your Belt Journey</h3>
              <p className="text-muted-foreground mt-1">
                Progress towards {nextBelt.name} Belt
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-3xl font-bold">{overallProgress.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - overallProgress / 100)}`}
                    className="text-primary transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Belt Levels Timeline */}
          <div className="relative">
            <div className="flex items-center justify-between gap-2">
              {BELT_LEVELS.map((belt, index) => {
                const isCurrent = belt.rank === currentBelt.rank;
                const isPassed = belt.rank < currentBelt.rank;
                const isNext = belt.rank === nextBelt.rank;

                return (
                  <motion.div
                    key={belt.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div className="relative">
                      <motion.div
                        className={cn(
                          "w-16 h-16 rounded-full border-4 transition-all",
                          isCurrent
                            ? "border-primary shadow-lg shadow-primary/50 scale-110"
                            : isPassed
                            ? "border-green-500"
                            : "border-muted"
                        )}
                        style={{
                          background:
                            belt.name === "White"
                              ? "#FFFFFF"
                              : `linear-gradient(135deg, ${belt.color} 0%, ${belt.color}dd 100%)`,
                        }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {isPassed && (
                          <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-full">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                          </div>
                        )}
                        {isCurrent && (
                          <div className="absolute -top-2 -right-2">
                            <Badge className="bg-primary text-primary-foreground">You</Badge>
                          </div>
                        )}
                        {isNext && (
                          <div className="absolute -top-2 -right-2">
                            <Badge variant="outline" className="bg-background">Next</Badge>
                          </div>
                        )}
                      </motion.div>
                    </div>
                    <div className="text-center">
                      <div
                        className={cn(
                          "text-sm font-semibold",
                          isCurrent ? "text-primary" : isPassed ? "text-green-500" : "text-muted-foreground"
                        )}
                      >
                        {belt.name}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Progress line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-muted -z-10">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-primary"
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentBelt.rank - 1 + overallProgress / 100) / (BELT_LEVELS.length - 1)) * 100}%`,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Requirements Progress */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Requirements for {nextBelt.name} Belt</h3>
            <Button onClick={() => setShowRequirementsModal(true)} variant="outline" size="sm">
              View Details
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {beltRequirements.map((req, index) => {
              const percentage = (req.current / req.required) * 100;
              const Icon = getRequirementIcon(req.category);

              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "p-2 rounded-lg",
                              req.completed ? "bg-green-500/10" : "bg-primary/10"
                            )}
                          >
                            <Icon
                              className={cn(
                                "w-5 h-5",
                                req.completed ? "text-green-500" : "text-primary"
                              )}
                            />
                          </div>
                          <div>
                            <div className="font-semibold">{req.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {req.current} / {req.required} {req.unit}
                            </div>
                          </div>
                        </div>
                        <div className={cn("text-2xl font-bold", getRequirementColor(percentage))}>
                          {percentage.toFixed(0)}%
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Progress value={percentage} className="h-2" />
                        {req.completed && (
                          <div className="flex items-center gap-1 text-green-500 text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Grading Information */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="font-semibold">Next Grading Date</div>
                <div className="text-sm text-muted-foreground">
                  {nextGradingDate.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <div className="text-sm text-muted-foreground mb-1">Days until grading</div>
              <div className="text-3xl font-bold text-blue-500">{daysUntilGrading}</div>
            </div>

            <Button className="w-full" size="lg">
              <Calendar className="w-4 h-4 mr-2" />
              Book Grading
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <div className="font-semibold">Estimated Readiness</div>
                <div className="text-sm text-muted-foreground">Based on current progress</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
              <div className="text-sm text-muted-foreground mb-1">Days to complete requirements</div>
              <div className="text-3xl font-bold text-purple-500">{estimatedDaysToNextBelt}</div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-sm">
                {overallProgress >= 100 ? (
                  <span className="text-green-500 font-semibold">✓ Ready for grading!</span>
                ) : overallProgress >= 80 ? (
                  <span className="text-blue-500">Almost there! Keep up the great work.</span>
                ) : (
                  <span className="text-muted-foreground">Continue training consistently.</span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Belt History Timeline */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-6">Belt History</h3>
        <div className="relative space-y-4">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-purple-500 to-green-500" />

          {beltHistory.slice().reverse().map((history, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-12"
            >
              <div className="absolute left-0 w-8 h-8 rounded-full border-4 border-background bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>

              <Card className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{
                          background:
                            history.belt === "White"
                              ? "#FFFFFF"
                              : BELT_LEVELS.find((b) => b.name === history.belt)?.color || "#666",
                          border: "2px solid currentColor",
                        }}
                      />
                      <div>
                        <div className="font-bold text-lg">{history.belt} Belt</div>
                        <div className="text-sm text-muted-foreground">
                          {history.dateAwarded.toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>

                    {history.gradingScore && (
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Score: <span className="font-semibold text-foreground">{history.gradingScore}/100</span>
                        </span>
                        {history.examiner && (
                          <span className="text-muted-foreground">
                            Examiner: <span className="font-semibold text-foreground">{history.examiner}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Techniques Progress */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Technique Mastery</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {completedTechniques} of {techniquesList.length} techniques mastered
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{techniqueProgress.toFixed(0)}%</div>
            </div>
          </div>

          <Progress value={techniqueProgress} className="h-3" />

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {Object.entries(
              techniquesList.reduce((acc, tech) => {
                if (!acc[tech.category]) acc[tech.category] = { total: 0, completed: 0 };
                acc[tech.category].total++;
                if (tech.completed) acc[tech.category].completed++;
                return acc;
              }, {} as Record<string, { total: number; completed: number }>)
            ).map(([category, stats]) => (
              <Card key={category} className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold capitalize">{category}</span>
                    <span className="text-sm text-muted-foreground">
                      {stats.completed}/{stats.total}
                    </span>
                  </div>
                  <Progress value={(stats.completed / stats.total) * 100} className="h-2" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      <BeltRequirementsModal
        open={showRequirementsModal}
        onOpenChange={setShowRequirementsModal}
      />
    </div>
  );
}
