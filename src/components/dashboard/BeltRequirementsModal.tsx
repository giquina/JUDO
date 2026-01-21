import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Clock,
  Award,
  Calendar,
  User,
  Video,
  FileText,
  Share2,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  beltRequirements,
  techniquesList,
  nextBelt,
  currentBelt,
  type Technique,
} from "@/lib/mockProgressData";
import { cn } from "@/lib/utils";

interface BeltRequirementsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BeltRequirementsModal({ open, onOpenChange }: BeltRequirementsModalProps) {
  const [senseiNotes, setSenseiNotes] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["throws"]);

  const overallProgress =
    beltRequirements.reduce((acc, req) => acc + (req.current / req.required) * 100, 0) /
    beltRequirements.length;

  const techniquesByCategory = techniquesList.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, Technique[]>);

  const getCategoryProgress = (category: string) => {
    const techniques = techniquesByCategory[category] || [];
    const completed = techniques.filter((t) => t.completed).length;
    return (completed / techniques.length) * 100;
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleShareProgress = () => {
    console.log("Sharing progress with coach...");
  };

  const handleDownloadReport = () => {
    console.log("Downloading progress report...");
  };

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

  const categoryIcons = {
    throws: "🥋",
    pins: "📌",
    chokes: "🤜",
    armlocks: "💪",
    kata: "📜",
  };

  const categoryNames = {
    throws: "Throwing Techniques (Nage-waza)",
    pins: "Pinning Techniques (Osaekomi-waza)",
    chokes: "Choking Techniques (Shime-waza)",
    armlocks: "Armlock Techniques (Kansetsu-waza)",
    kata: "Forms (Kata)",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full"
              style={{
                background: nextBelt.color,
                border: "3px solid currentColor",
              }}
            />
            Requirements for {nextBelt.name} Belt
          </DialogTitle>
          <DialogDescription>
            Track your progress and complete all requirements for your next grading
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Overall Progress */}
          <Card className="p-6 bg-gradient-to-br from-primary/10 via-purple-500/5 to-blue-500/5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Overall Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    From {currentBelt.name} to {nextBelt.name} Belt
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-primary">
                    {overallProgress.toFixed(0)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
          </Card>

          <Tabs defaultValue="requirements" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="techniques">Techniques</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            {/* Requirements Tab */}
            <TabsContent value="requirements" className="space-y-4 mt-6">
              {beltRequirements.map((req, index) => {
                const Icon = getRequirementIcon(req.category);
                const percentage = (req.current / req.required) * 100;

                return (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div
                              className={cn(
                                "p-3 rounded-lg",
                                req.completed ? "bg-green-500/10" : "bg-primary/10"
                              )}
                            >
                              <Icon
                                className={cn(
                                  "w-6 h-6",
                                  req.completed ? "text-green-500" : "text-primary"
                                )}
                              />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-semibold">{req.title}</h4>
                                {req.completed && (
                                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Completed
                                  </Badge>
                                )}
                              </div>

                              <div className="text-sm text-muted-foreground mb-4">
                                Progress: {req.current} / {req.required} {req.unit}
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    {percentage.toFixed(0)}% complete
                                  </span>
                                  <span className="font-semibold">
                                    {req.required - req.current} {req.unit} remaining
                                  </span>
                                </div>
                                <Progress value={percentage} className="h-2" />
                              </div>

                              {/* Additional info based on category */}
                              {req.category === "hours" && (
                                <div className="mt-4 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                                  <p className="text-sm text-muted-foreground">
                                    At your current rate of 2.8 sessions/week, you'll reach
                                    this goal in approximately {Math.ceil((req.required - req.current) / 4.2)}{" "}
                                    weeks.
                                  </p>
                                </div>
                              )}

                              {req.category === "recommendation" && (
                                <div className="mt-4 p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                                  <p className="text-sm text-muted-foreground">
                                    Your sensei will review your progress before grading.
                                    Keep demonstrating good technique and attitude.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-3xl font-bold text-primary">
                            {percentage.toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </TabsContent>

            {/* Techniques Tab */}
            <TabsContent value="techniques" className="space-y-4 mt-6">
              {Object.entries(techniquesByCategory).map(([category, techniques]) => {
                const completed = techniques.filter((t) => t.completed).length;
                const progress = getCategoryProgress(category);
                const isExpanded = expandedCategories.includes(category);

                return (
                  <Card key={category} className="overflow-hidden">
                    <Collapsible
                      open={isExpanded}
                      onOpenChange={() => toggleCategory(category)}
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="p-6 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="text-3xl">
                                {categoryIcons[category as keyof typeof categoryIcons]}
                              </div>
                              <div className="text-left flex-1">
                                <h4 className="text-lg font-semibold">
                                  {categoryNames[category as keyof typeof categoryNames]}
                                </h4>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-sm text-muted-foreground">
                                    {completed} / {techniques.length} completed
                                  </span>
                                  <Progress value={progress} className="h-2 flex-1 max-w-xs" />
                                  <span className="text-sm font-semibold">
                                    {progress.toFixed(0)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="px-6 pb-6 space-y-2">
                          {techniques.map((technique, index) => (
                            <motion.div
                              key={technique.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={cn(
                                "flex items-center justify-between p-3 rounded-lg border transition-all hover:shadow-md",
                                technique.completed
                                  ? "bg-green-500/5 border-green-500/20"
                                  : "bg-muted/30"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                {technique.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                  <Circle className="w-5 h-5 text-muted-foreground" />
                                )}
                                <span
                                  className={cn(
                                    "font-medium",
                                    technique.completed && "text-green-600 dark:text-green-400"
                                  )}
                                >
                                  {technique.name}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Video className="w-4 h-4 mr-1" />
                                  Tutorial
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                );
              })}
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-4 mt-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-purple-500/10">
                      <FileText className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Sensei Notes</h4>
                      <p className="text-sm text-muted-foreground">
                        Feedback and recommendations from your instructor
                      </p>
                    </div>
                  </div>

                  <Textarea
                    placeholder="Your sensei will add notes and feedback here..."
                    value={senseiNotes}
                    onChange={(e) => setSenseiNotes(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />

                  <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <h5 className="font-semibold mb-2">Tips for Success</h5>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>Attend classes regularly and maintain consistency</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>Practice techniques with different training partners</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>Ask your sensei for feedback on specific techniques</span>
                              </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>Watch video tutorials to understand proper form</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>Focus on quality of technique rather than speed</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Previous Feedback */}
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Previous Feedback</h4>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Sensei Tanaka</span>
                      <span className="text-sm text-muted-foreground">2 weeks ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Excellent progress on your throwing techniques. Your uchi-mata is
                      improving significantly. Focus more on your newaza transitions for
                      the next grading."
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Sensei Yamamoto</span>
                      <span className="text-sm text-muted-foreground">1 month ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Good attendance and positive attitude. Work on your kata precision
                      and timing. You're on track for blue belt grading."
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleShareProgress} className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share Progress with Coach
            </Button>
            <Button onClick={handleDownloadReport} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
