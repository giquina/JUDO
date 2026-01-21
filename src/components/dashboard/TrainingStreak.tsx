import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Award, Snowflake, Info, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  userStats,
  generateStreakHistory,
  type StreakDay,
} from '@/lib/mockAchievementsData';
import { cn } from '@/lib/utils';

export default function TrainingStreak() {
  const [streakHistory] = useState<StreakDay[]>(generateStreakHistory());
  const [showFreezeInfo, setShowFreezeInfo] = useState(false);
  const [usedStreakFreeze, setUsedStreakFreeze] = useState(false);

  const { currentStreak, longestStreak, streakFreezeAvailable } = userStats;

  // Calculate flame size based on streak
  const getFlameScale = () => {
    if (currentStreak >= 30) return 1.5;
    if (currentStreak >= 14) return 1.3;
    if (currentStreak >= 7) return 1.1;
    return 1;
  };

  // Get motivational message based on streak
  const getMotivationalMessage = () => {
    if (currentStreak >= 30) return "Unstoppable! You're on fire! 🚀";
    if (currentStreak >= 14) return "Two weeks strong! Keep it up! 💪";
    if (currentStreak >= 7) return "One week streak! You're building momentum! ⚡";
    if (currentStreak >= 3) return "Nice streak! Keep training! 🎯";
    return "Start your streak today! 🌟";
  };

  // Get flame color based on streak
  const getFlameColor = () => {
    if (currentStreak >= 30) return 'text-purple-500';
    if (currentStreak >= 14) return 'text-orange-500';
    if (currentStreak >= 7) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Format date for calendar
  const formatDate = (date: Date) => {
    return date.getDate();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleStreakFreeze = () => {
    if (streakFreezeAvailable && !usedStreakFreeze) {
      setUsedStreakFreeze(true);
      // In real app, this would make an API call
    }
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5 pointer-events-none" />

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Flame className={cn('w-6 h-6', getFlameColor())} />
            </motion.div>
            <CardTitle className="text-xl">Training Streak</CardTitle>
          </div>
          {streakFreezeAvailable && !usedStreakFreeze && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStreakFreeze}
              className="gap-1"
            >
              <Snowflake className="w-3 h-3" />
              Freeze
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative">
        {/* Current Streak Display */}
        <div className="text-center space-y-3">
          <motion.div
            animate={{ scale: getFlameScale() }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-block"
          >
            <div className="relative">
              {/* Glow effect */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={cn(
                  'absolute inset-0 blur-xl',
                  currentStreak >= 7 ? 'bg-orange-500' : 'bg-gray-500'
                )}
              />
              <div className="relative text-6xl mb-2">🔥</div>
            </div>
          </motion.div>
          <div>
            <div className="text-4xl font-bold mb-1">{currentStreak} Days</div>
            <p className="text-sm text-muted-foreground">{getMotivationalMessage()}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium text-muted-foreground">Best Streak</span>
            </div>
            <div className="text-2xl font-bold">{longestStreak} days</div>
            {currentStreak === longestStreak && currentStreak > 0 && (
              <Badge variant="secondary" className="mt-2 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                Personal Best!
              </Badge>
            )}
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Snowflake className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium text-muted-foreground">Streak Freeze</span>
            </div>
            <div className="text-2xl font-bold">
              {streakFreezeAvailable && !usedStreakFreeze ? '1' : '0'}
            </div>
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowFreezeInfo(!showFreezeInfo)}
              className="p-0 h-auto text-xs mt-1"
            >
              <Info className="w-3 h-3 mr-1" />
              What's this?
            </Button>
          </div>
        </div>

        {/* Streak Freeze Info */}
        <AnimatePresence>
          {showFreezeInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-muted-foreground">
                  Use a Streak Freeze to protect your streak if you miss a day. You get one freeze
                  per month. Use it wisely!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Calendar Visualization */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Last 30 Days</h4>
          <div className="grid grid-cols-7 gap-1">
            {/* Day names */}
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-center text-xs text-muted-foreground font-medium">
                {day}
              </div>
            ))}
            {/* Calendar days */}
            {streakHistory.map((day, index) => {
              const today = isToday(day.date);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={cn(
                    'aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all relative group',
                    day.attended
                      ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20'
                      : 'bg-muted/50 text-muted-foreground',
                    today && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                  )}
                >
                  {formatDate(day.date)}
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover border rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  {/* Flame emoji for attended days */}
                  {day.attended && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-1 -right-1 text-xs"
                    >
                      🔥
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Streak Milestones */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Streak Milestones</h4>
          <div className="space-y-2">
            {[
              { days: 7, label: 'Week Warrior', icon: '⚡' },
              { days: 14, label: 'Fortnight Fighter', icon: '💪' },
              { days: 30, label: 'Monthly Marathon', icon: '🌟' },
              { days: 60, label: 'Unstoppable Force', icon: '🚀' },
            ].map((milestone) => {
              const achieved = currentStreak >= milestone.days || longestStreak >= milestone.days;
              const progress = Math.min((currentStreak / milestone.days) * 100, 100);

              return (
                <div
                  key={milestone.days}
                  className={cn(
                    'p-3 rounded-lg border transition-all',
                    achieved
                      ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20'
                      : 'bg-muted/50 border-border'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{milestone.icon}</span>
                      <div>
                        <div className="text-sm font-medium">{milestone.label}</div>
                        <div className="text-xs text-muted-foreground">{milestone.days} days</div>
                      </div>
                    </div>
                    {achieved && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-300">
                        Achieved!
                      </Badge>
                    )}
                  </div>
                  {!achieved && (
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
