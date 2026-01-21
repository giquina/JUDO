import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Filter,
  Lock,
  Unlock,
  Trophy,
  Star,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  achievements,
  userAchievements,
  isAchievementUnlocked,
  rarityColors,
  categoryNames,
  type Achievement,
  type AchievementCategory,
  type AchievementRarity,
} from '@/lib/mockAchievementsData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AchievementsGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AchievementsGallery({ open, onOpenChange }: AchievementsGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [selectedRarity, setSelectedRarity] = useState<AchievementRarity | 'all'>('all');
  const [showLockedOnly, setShowLockedOnly] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  // Filter achievements
  const filteredAchievements = useMemo(() => {
    return achievements.filter((achievement) => {
      // Search filter
      if (
        searchQuery &&
        !achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !achievement.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && achievement.category !== selectedCategory) {
        return false;
      }

      // Rarity filter
      if (selectedRarity !== 'all' && achievement.rarity !== selectedRarity) {
        return false;
      }

      // Locked filter
      if (showLockedOnly && isAchievementUnlocked(achievement.id)) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedRarity, showLockedOnly]);

  // Group achievements by category
  const achievementsByCategory = useMemo(() => {
    const grouped: Record<AchievementCategory, Achievement[]> = {
      attendance: [],
      streaks: [],
      social: [],
      competition: [],
      milestones: [],
      special: [],
    };

    filteredAchievements.forEach((achievement) => {
      grouped[achievement.category].push(achievement);
    });

    return grouped;
  }, [filteredAchievements]);

  // Stats
  const stats = {
    total: achievements.length,
    unlocked: userAchievements.length,
    locked: achievements.length - userAchievements.length,
    percentage: Math.round((userAchievements.length / achievements.length) * 100),
  };

  const handleShare = (achievement: Achievement) => {
    toast.success(`Shared "${achievement.name}" achievement!`, {
      description: 'Posted to your activity feed',
    });
  };

  const getUnlockHint = (achievement: Achievement): string => {
    switch (achievement.category) {
      case 'attendance':
        return `Attend ${achievement.requirement} training sessions`;
      case 'streaks':
        return `Maintain a ${achievement.requirement}-day training streak`;
      case 'social':
        return `Refer ${achievement.requirement} new members`;
      case 'competition':
        return achievement.description;
      case 'milestones':
        return achievement.description;
      case 'special':
        return achievement.description;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                Achievements Gallery
              </DialogTitle>
              <DialogDescription className="mt-2">
                {stats.unlocked} of {stats.total} achievements unlocked ({stats.percentage}%)
              </DialogDescription>
            </div>
            {/* Stats badges */}
            <div className="flex gap-2">
              <Badge variant="secondary" className="gap-1">
                <Unlock className="w-3 h-3" />
                {stats.unlocked} Unlocked
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Lock className="w-3 h-3" />
                {stats.locked} Locked
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Filters */}
          <div className="px-6 py-4 space-y-4 border-b">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search achievements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="attendance">Attendance</TabsTrigger>
                  <TabsTrigger value="streaks">Streaks</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                  <TabsTrigger value="competition">Competition</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  <TabsTrigger value="special">Special</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Rarity and locked filters */}
            <div className="flex items-center gap-2">
              <Tabs value={selectedRarity} onValueChange={(v) => setSelectedRarity(v as any)}>
                <TabsList className="h-8">
                  <TabsTrigger value="all" className="text-xs">
                    All Rarities
                  </TabsTrigger>
                  <TabsTrigger value="common" className="text-xs">
                    Common
                  </TabsTrigger>
                  <TabsTrigger value="rare" className="text-xs">
                    Rare
                  </TabsTrigger>
                  <TabsTrigger value="epic" className="text-xs">
                    Epic
                  </TabsTrigger>
                  <TabsTrigger value="legendary" className="text-xs">
                    Legendary
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                variant={showLockedOnly ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowLockedOnly(!showLockedOnly)}
                className="gap-1 ml-auto"
              >
                <Lock className="w-3 h-3" />
                Locked Only
              </Button>
            </div>
          </div>

          {/* Achievement Grid */}
          <ScrollArea className="flex-1">
            <div className="px-6 py-6">
              {selectedCategory === 'all' ? (
                // Show by category
                <div className="space-y-8">
                  {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => {
                    if (categoryAchievements.length === 0) return null;
                    return (
                      <div key={category} className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {categoryNames[category as AchievementCategory]}
                          <Badge variant="secondary" className="text-xs">
                            {categoryAchievements.filter((a) => isAchievementUnlocked(a.id)).length} /{' '}
                            {categoryAchievements.length}
                          </Badge>
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {categoryAchievements.map((achievement, index) => (
                            <AchievementCard
                              key={achievement.id}
                              achievement={achievement}
                              index={index}
                              onClick={() => setSelectedAchievement(achievement)}
                              onShare={handleShare}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Show single category
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredAchievements.map((achievement, index) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      index={index}
                      onClick={() => setSelectedAchievement(achievement)}
                      onShare={handleShare}
                    />
                  ))}
                </div>
              )}

              {filteredAchievements.length === 0 && (
                <div className="text-center py-12">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="text-lg font-medium mb-2">No achievements found</h4>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Achievement Detail Modal */}
        <AnimatePresence>
          {selectedAchievement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 rounded-lg"
              onClick={() => setSelectedAchievement(null)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  'relative p-8 rounded-2xl border-2 max-w-md mx-4',
                  rarityColors[selectedAchievement.rarity].bg,
                  rarityColors[selectedAchievement.rarity].border
                )}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAchievement(null)}
                  className="absolute top-4 right-4 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>

                <div className="text-center space-y-4">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="text-8xl mx-auto"
                  >
                    {selectedAchievement.icon}
                  </motion.div>

                  {/* Locked/Unlocked status */}
                  {isAchievementUnlocked(selectedAchievement.id) ? (
                    <Badge className="bg-green-500 text-white gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Unlocked
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Lock className="w-3 h-3" />
                      Locked
                    </Badge>
                  )}

                  {/* Name and description */}
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{selectedAchievement.name}</h3>
                    <p className="text-muted-foreground">{selectedAchievement.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-3">
                    <Badge className={rarityColors[selectedAchievement.rarity].text}>
                      {selectedAchievement.rarity}
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Star className="w-3 h-3" />
                      +{selectedAchievement.points} XP
                    </Badge>
                  </div>

                  {/* How to unlock */}
                  {!isAchievementUnlocked(selectedAchievement.id) && (
                    <div className="p-4 rounded-lg bg-muted/50 border">
                      <p className="text-sm font-medium mb-1">How to unlock:</p>
                      <p className="text-sm text-muted-foreground">
                        {getUnlockHint(selectedAchievement)}
                      </p>
                    </div>
                  )}

                  {/* Share button for unlocked achievements */}
                  {isAchievementUnlocked(selectedAchievement.id) && (
                    <Button
                      onClick={() => handleShare(selectedAchievement)}
                      className="w-full gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Achievement
                    </Button>
                  )}

                  {/* Unlock date */}
                  {isAchievementUnlocked(selectedAchievement.id) && (
                    <p className="text-xs text-muted-foreground">
                      Unlocked{' '}
                      {userAchievements
                        .find((ua) => ua.achievementId === selectedAchievement.id)
                        ?.unlockedAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// Achievement Card Component
interface AchievementCardProps {
  achievement: Achievement;
  index: number;
  onClick: () => void;
  onShare: (achievement: Achievement) => void;
}

function AchievementCard({ achievement, index, onClick, onShare }: AchievementCardProps) {
  const unlocked = isAchievementUnlocked(achievement.id);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.02 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'relative p-4 rounded-lg border-2 transition-all text-center group',
        unlocked
          ? `${rarityColors[achievement.rarity].bg} ${rarityColors[achievement.rarity].border}`
          : 'bg-muted/50 border-muted grayscale opacity-60'
      )}
    >
      {/* Locked icon overlay */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
          <Lock className="w-6 h-6 text-muted-foreground" />
        </div>
      )}

      {/* Icon */}
      <div className={cn('text-5xl mb-2', !unlocked && 'blur-sm')}>{achievement.icon}</div>

      {/* Name */}
      <p className="text-sm font-medium line-clamp-2 mb-2 min-h-[2.5rem]">{achievement.name}</p>

      {/* Rarity badge */}
      <Badge
        variant={unlocked ? 'secondary' : 'outline'}
        className={cn('text-xs', unlocked && rarityColors[achievement.rarity].text)}
      >
        {achievement.rarity}
      </Badge>

      {/* Share button for unlocked */}
      {unlocked && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onShare(achievement);
          }}
          className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Share2 className="w-3 h-3" />
        </Button>
      )}

      {/* XP badge */}
      {unlocked && (
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Badge variant="secondary" className="text-xs">
            +{achievement.points}
          </Badge>
        </div>
      )}

      {/* Shine effect for unlocked */}
      {unlocked && (
        <motion.div
          initial={{ x: '-100%' }}
          whileHover={{ x: '200%' }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
        />
      )}
    </motion.button>
  );
}
