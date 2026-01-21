import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Star,
  TrendingUp,
  Lock,
  CheckCircle2,
} from "lucide-react";

interface AchievementsGalleryModalProps {
  open: boolean;
  onClose: () => void;
}

const ACHIEVEMENTS = [
  {
    id: "1",
    title: "First Steps",
    description: "Attended your first judo class",
    icon: "👣",
    category: "milestone",
    points: 10,
    unlocked: true,
    unlockedDate: "2025-09-15",
    rarity: "common",
  },
  {
    id: "2",
    title: "Week Warrior",
    description: "Attended 3 classes in one week",
    icon: "💪",
    category: "attendance",
    points: 25,
    unlocked: true,
    unlockedDate: "2025-10-02",
    rarity: "common",
  },
  {
    id: "3",
    title: "Perfect Month",
    description: "100% attendance for a full month",
    icon: "📅",
    category: "attendance",
    points: 100,
    unlocked: true,
    unlockedDate: "2025-11-30",
    rarity: "rare",
  },
  {
    id: "4",
    title: "50 Sessions",
    description: "Completed 50 training sessions",
    icon: "🎯",
    category: "milestone",
    points: 150,
    unlocked: false,
    progress: 47,
    total: 50,
    rarity: "rare",
  },
  {
    id: "5",
    title: "Fire Streak",
    description: "Maintained a 10-day training streak",
    icon: "🔥",
    category: "streak",
    points: 75,
    unlocked: true,
    unlockedDate: "2025-12-10",
    rarity: "uncommon",
  },
  {
    id: "6",
    title: "Belt Promotion",
    description: "Earned your next belt rank",
    icon: "🥋",
    category: "progression",
    points: 200,
    unlocked: true,
    unlockedDate: "2026-01-05",
    rarity: "epic",
  },
  {
    id: "7",
    title: "Competition Ready",
    description: "Participated in your first competition",
    icon: "🏆",
    category: "competition",
    points: 250,
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "8",
    title: "Sensei's Choice",
    description: "Received a special commendation from your coach",
    icon: "⭐",
    category: "special",
    points: 300,
    unlocked: false,
    rarity: "legendary",
  },
  {
    id: "9",
    title: "Iron Will",
    description: "30-day training streak",
    icon: "⚡",
    category: "streak",
    points: 500,
    unlocked: false,
    progress: 12,
    total: 30,
    rarity: "legendary",
  },
];

const RARITY_COLORS = {
  common: "from-gray-400 to-gray-600",
  uncommon: "from-green-400 to-green-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-orange-500",
};

const RARITY_LABELS = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

export default function AchievementsGalleryModal({
  open,
  onClose,
}: AchievementsGalleryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);

  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;
  const totalPoints = ACHIEVEMENTS.filter(a => a.unlocked).reduce(
    (sum, a) => sum + a.points,
    0
  );

  const filteredAchievements =
    selectedCategory === "all"
      ? ACHIEVEMENTS
      : ACHIEVEMENTS.filter(a => a.category === selectedCategory);

  const selected = ACHIEVEMENTS.find(a => a.id === selectedAchievement);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Achievements
          </DialogTitle>
          <DialogDescription>
            Your training milestones and accomplishments
          </DialogDescription>
        </DialogHeader>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-blue-500/5">
            <CardContent className="pt-6">
              <div className="text-center">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-3xl font-bold">{unlockedCount}</p>
                <p className="text-sm text-muted-foreground">
                  / {ACHIEVEMENTS.length} Unlocked
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/5">
            <CardContent className="pt-6">
              <div className="text-center">
                <Star className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-3xl font-bold">{totalPoints}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5">
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-3xl font-bold">
                  {Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">Completion</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="milestone">Milestones</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="streak">Streaks</TabsTrigger>
            <TabsTrigger value="progression">Progression</TabsTrigger>
            <TabsTrigger value="competition">Competition</TabsTrigger>
            <TabsTrigger value="special">Special</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-4">
            <ScrollArea className="max-h-[50vh]">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                {filteredAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all ${
                        achievement.unlocked
                          ? "hover:shadow-lg"
                          : "opacity-60 saturate-0"
                      } ${
                        selectedAchievement === achievement.id
                          ? "ring-2 ring-primary"
                          : ""
                      }`}
                      onClick={() => setSelectedAchievement(achievement.id)}
                    >
                      <CardContent className="pt-6 space-y-3">
                        {/* Icon */}
                        <div className="relative">
                          <div
                            className={`text-5xl text-center mb-2 ${
                              !achievement.unlocked ? "filter grayscale" : ""
                            }`}
                          >
                            {achievement.icon}
                          </div>
                          {!achievement.unlocked && (
                            <div className="absolute top-0 right-0">
                              <Lock className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          {achievement.unlocked && (
                            <div className="absolute top-0 right-0">
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                          )}
                        </div>

                        {/* Title & Description */}
                        <div className="text-center space-y-1">
                          <h3 className="font-bold">{achievement.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {achievement.description}
                          </p>
                        </div>

                        {/* Rarity Badge */}
                        <div className="flex justify-center">
                          <Badge
                            className={`bg-gradient-to-r ${
                              RARITY_COLORS[achievement.rarity as keyof typeof RARITY_COLORS]
                            } text-white text-xs`}
                          >
                            {RARITY_LABELS[achievement.rarity as keyof typeof RARITY_LABELS]}
                          </Badge>
                        </div>

                        {/* Points */}
                        <div className="text-center">
                          <span className="text-sm font-semibold text-primary">
                            +{achievement.points} pts
                          </span>
                        </div>

                        {/* Progress Bar */}
                        {!achievement.unlocked && achievement.progress !== undefined && (
                          <div className="space-y-1">
                            <Progress
                              value={(achievement.progress! / achievement.total!) * 100}
                            />
                            <p className="text-xs text-center text-muted-foreground">
                              {achievement.progress} / {achievement.total}
                            </p>
                          </div>
                        )}

                        {/* Unlock Date */}
                        {achievement.unlocked && achievement.unlockedDate && (
                          <p className="text-xs text-center text-muted-foreground">
                            Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Selected Achievement Detail */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Card className="bg-gradient-to-br from-primary/10 to-blue-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{selected.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{selected.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {selected.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`bg-gradient-to-r ${
                            RARITY_COLORS[selected.rarity as keyof typeof RARITY_COLORS]
                          } text-white`}
                        >
                          {RARITY_LABELS[selected.rarity as keyof typeof RARITY_LABELS]}
                        </Badge>
                        <Badge variant="outline">+{selected.points} points</Badge>
                        {selected.unlocked && (
                          <Badge variant="default">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Unlocked
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
