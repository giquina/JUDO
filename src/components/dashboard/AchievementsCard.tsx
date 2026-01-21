import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, ChevronRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  achievements,
  userAchievements,
  userStats,
  getAchievementById,
  getNextAchievementInCategory,
  calculateProgress,
  rarityColors,
  type Achievement,
  type AchievementCategory,
} from '@/lib/mockAchievementsData';

interface AchievementsCardProps {
  onViewAll?: () => void;
}

export default function AchievementsCard({ onViewAll }: AchievementsCardProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  // Get recently unlocked achievements (last 3)
  const recentlyUnlocked = userAchievements
    .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
    .slice(0, 3)
    .map((ua) => getAchievementById(ua.achievementId))
    .filter((a): a is Achievement => a !== undefined);

  // Get next achievements to unlock
  const nextAchievements: { category: AchievementCategory; achievement: Achievement; progress: number }[] = [];

  const categories: AchievementCategory[] = ['attendance', 'streaks', 'competition'];
  categories.forEach((category) => {
    const next = getNextAchievementInCategory(category);
    if (next) {
      // Calculate progress based on user stats
      let progress = 0;
      if (category === 'attendance') {
        progress = calculateProgress(userStats.totalSessions, next.requirement);
      } else if (category === 'streaks') {
        progress = calculateProgress(userStats.currentStreak, next.requirement);
      }
      nextAchievements.push({ category, achievement: next, progress });
    }
  });

  // Check for new achievements
  useEffect(() => {
    const hasNewAchievement = userAchievements.some((ua) => ua.isNew);
    if (hasNewAchievement) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, []);

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setTimeout(() => setSelectedAchievement(null), 2000);
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Confetti effect */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-10"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: [0, 1, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.05,
                  ease: 'easeOut',
                }}
                className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <CardTitle className="text-xl">Achievements</CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={onViewAll} className="gap-1">
          View All
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Level and XP Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">
                Level {userStats.level} - {userStats.rank}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {userStats.xp} / {userStats.xpToNextLevel} XP
            </span>
          </div>
          <Progress value={calculateProgress(userStats.xp, userStats.xpToNextLevel)} className="h-2" />
        </div>

        {/* Recently Unlocked */}
        {recentlyUnlocked.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Recently Unlocked
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {recentlyUnlocked.map((achievement) => {
                const isNew = userAchievements.find((ua) => ua.achievementId === achievement.id)?.isNew;
                return (
                  <motion.button
                    key={achievement.id}
                    onClick={() => handleAchievementClick(achievement)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative p-3 rounded-lg border-2 transition-all ${rarityColors[achievement.rarity].bg} ${rarityColors[achievement.rarity].border}`}
                  >
                    {isNew && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background"
                      />
                    )}
                    <div className="text-3xl mb-1">{achievement.icon}</div>
                    <div className="text-xs font-medium line-clamp-1">{achievement.name}</div>
                    <Badge
                      variant="secondary"
                      className={`mt-1 text-xs ${rarityColors[achievement.rarity].text}`}
                    >
                      {achievement.rarity}
                    </Badge>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Next Achievements */}
        {nextAchievements.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Next Achievements</h4>
            <div className="space-y-3">
              {nextAchievements.map(({ achievement, progress }) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl mt-1">{achievement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{achievement.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {achievement.description}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`shrink-0 text-xs ${rarityColors[achievement.rarity].text}`}
                        >
                          +{achievement.points} XP
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1">
                        <Progress value={progress} className="h-1.5" />
                        <p className="text-xs text-muted-foreground text-right">{Math.round(progress)}%</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-500">{userAchievements.length}</div>
            <div className="text-xs text-muted-foreground">Unlocked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">{userStats.totalPoints}</div>
            <div className="text-xs text-muted-foreground">Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {Math.round((userAchievements.length / achievements.length) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        </div>
      </CardContent>

      {/* Achievement Detail Popup */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20 rounded-lg"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className={`p-6 rounded-xl border-2 ${rarityColors[selectedAchievement.rarity].bg} ${rarityColors[selectedAchievement.rarity].border} max-w-sm mx-4`}
            >
              <div className="text-center space-y-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ delay: 0.1 }}
                  className="text-6xl"
                >
                  {selectedAchievement.icon}
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold">{selectedAchievement.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedAchievement.description}</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Badge className={rarityColors[selectedAchievement.rarity].text}>
                    {selectedAchievement.rarity}
                  </Badge>
                  <Badge variant="secondary">+{selectedAchievement.points} XP</Badge>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
