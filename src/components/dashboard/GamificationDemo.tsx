import { useState } from 'react';
import AchievementsCard from './AchievementsCard';
import TrainingStreak from './TrainingStreak';
import GoalsTracker from './GoalsTracker';
import AchievementsGallery from './AchievementsGallery';

/**
 * Gamification Demo Component
 *
 * This component demonstrates how to integrate all the gamification features:
 * - Achievements system with progress tracking
 * - Training streak visualization
 * - Personal goals management
 * - Full achievements gallery
 *
 * Usage in your dashboard:
 *
 * ```tsx
 * import GamificationDemo from '@/components/dashboard/GamificationDemo';
 *
 * function Dashboard() {
 *   return (
 *     <div className="space-y-6">
 *       <GamificationDemo />
 *     </div>
 *   );
 * }
 * ```
 *
 * Or use individual components:
 *
 * ```tsx
 * import AchievementsCard from '@/components/dashboard/AchievementsCard';
 * import TrainingStreak from '@/components/dashboard/TrainingStreak';
 * import GoalsTracker from '@/components/dashboard/GoalsTracker';
 *
 * function Dashboard() {
 *   const [showGallery, setShowGallery] = useState(false);
 *
 *   return (
 *     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 *       <AchievementsCard onViewAll={() => setShowGallery(true)} />
 *       <TrainingStreak />
 *       <div className="lg:col-span-2">
 *         <GoalsTracker />
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export default function GamificationDemo() {
  const [showGallery, setShowGallery] = useState(false);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Gamification System</h2>
          <p className="text-muted-foreground">
            Track your progress, unlock achievements, and reach your training goals
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Achievements Card */}
          <AchievementsCard onViewAll={() => setShowGallery(true)} />

          {/* Training Streak */}
          <TrainingStreak />

          {/* Goals Tracker - Full Width */}
          <div className="lg:col-span-2">
            <GoalsTracker />
          </div>
        </div>
      </div>

      {/* Achievements Gallery Modal */}
      <AchievementsGallery open={showGallery} onOpenChange={setShowGallery} />
    </>
  );
}
