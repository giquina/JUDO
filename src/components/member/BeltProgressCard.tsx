import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import BeltBadge from "@/components/BeltBadge";
import type { BeltRank } from "@/components/BeltBadge";
import { TrendingUp, CheckCircle2, Circle, Award } from "lucide-react";

interface BeltProgressCardProps {
  currentBelt: BeltRank;
  nextBelt: BeltRank;
  progress: number;
  requirements: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
  }[];
  estimatedDate?: number;
  onViewDetails?: () => void;
}

export default function BeltProgressCard({
  currentBelt,
  nextBelt,
  progress,
  requirements,
  estimatedDate,
  onViewDetails,
}: BeltProgressCardProps) {
  const completedCount = requirements.filter(r => r.completed).length;
  const totalCount = requirements.length;

  const formatEstimatedDate = (timestamp?: number) => {
    if (!timestamp) return "Date TBD";
    return new Date(timestamp).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Belt Progression
            </CardTitle>
            <CardDescription>Your journey to the next rank</CardDescription>
          </div>
          {onViewDetails && (
            <Button size="sm" variant="outline" onClick={onViewDetails}>
              Full Details
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current to Next Belt */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-2">Current Rank</p>
            <BeltBadge rank={currentBelt} showTooltip={false} className="text-base py-1.5 px-4" />
          </div>

          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <TrendingUp className="h-6 w-6 text-primary" />
          </motion.div>

          <div className="flex-1 text-right">
            <p className="text-xs text-muted-foreground mb-2">Next Rank</p>
            <BeltBadge rank={nextBelt} showTooltip={false} className="text-base py-1.5 px-4" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-muted-foreground">
            {completedCount} of {totalCount} requirements completed
          </p>
        </div>

        {/* Estimated Grading Date */}
        {estimatedDate && (
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Estimated Grading</p>
                <p className="text-xs text-muted-foreground">
                  {formatEstimatedDate(estimatedDate)}
                </p>
              </div>
              <Badge variant="default">On Track</Badge>
            </div>
          </div>
        )}

        {/* Requirements Accordion */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="requirements" className="border-none">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-2">
              View Requirements ({completedCount}/{totalCount})
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {requirements.map((req, index) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                      req.completed
                        ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50"
                        : "bg-muted/30"
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {req.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{req.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {req.description}
                      </p>
                    </div>
                    {req.completed && (
                      <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                        Done
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Motivational Message */}
        <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg">
          <p className="text-sm font-medium">
            {progress >= 80
              ? "You're almost there! Keep up the great work!"
              : progress >= 50
              ? "Great progress! You're halfway to your next belt!"
              : "Every session brings you closer to your goal!"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
