# Gamification System Documentation

A comprehensive achievements, badges, streaks, and goals tracking system for the JUDO Club App.

## 📁 File Structure

```
src/
├── components/
│   └── dashboard/
│       ├── AchievementsCard.tsx      # Achievements display with progress
│       ├── AchievementsGallery.tsx   # Full-screen achievement gallery
│       ├── TrainingStreak.tsx        # Streak tracker with calendar
│       ├── GoalsTracker.tsx          # Personal goals management
│       └── GamificationDemo.tsx      # Demo/integration example
└── lib/
    └── mockAchievementsData.ts       # Mock data and types
```

## 🎯 Components

### 1. AchievementsCard

Displays recently unlocked achievements, next achievements to unlock, and user level/XP.

**Features:**
- Level and XP progress bar
- Recently unlocked achievements (last 3)
- Next achievements with progress tracking
- Stats summary (unlocked, points, completion %)
- Confetti animation for new achievements
- Click achievements for detailed view
- "View All" button to open gallery

**Props:**
```tsx
interface AchievementsCardProps {
  onViewAll?: () => void;  // Callback to open achievements gallery
}
```

**Usage:**
```tsx
import AchievementsCard from '@/components/dashboard/AchievementsCard';

<AchievementsCard onViewAll={() => setShowGallery(true)} />
```

---

### 2. TrainingStreak

Displays current training streak with calendar visualization and milestones.

**Features:**
- Animated flame that grows with streak
- Current streak counter with motivational messages
- Last 30 days calendar visualization
- Best streak record
- Streak freeze feature (1 per month)
- Streak milestones (7, 14, 30, 60 days)
- Animated flame effects based on streak length

**Props:**
```tsx
// No props required
```

**Usage:**
```tsx
import TrainingStreak from '@/components/dashboard/TrainingStreak';

<TrainingStreak />
```

---

### 3. GoalsTracker

Personal goals management system with creation, editing, and completion tracking.

**Features:**
- Create custom goals with different types
- Progress visualization for each goal
- Deadline tracking with days remaining
- Edit and delete goals
- Goal completion celebration animation
- Suggested goals based on user level
- Separate active and completed goals sections
- Goal types: attendance, belt, technique, competition, streak

**Props:**
```tsx
// No props required
```

**Usage:**
```tsx
import GoalsTracker from '@/components/dashboard/GoalsTracker';

<GoalsTracker />
```

---

### 4. AchievementsGallery

Full-screen modal displaying all achievements with filters and search.

**Features:**
- Search achievements by name/description
- Filter by category (attendance, streaks, social, etc.)
- Filter by rarity (common, rare, epic, legendary)
- Show locked-only toggle
- Grid layout with locked/unlocked states
- Detailed achievement view on click
- Share unlocked achievements
- Progress stats (X of Y unlocked, percentage)
- "How to unlock" hints for locked achievements

**Props:**
```tsx
interface AchievementsGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

**Usage:**
```tsx
import AchievementsGallery from '@/components/dashboard/AchievementsGallery';

const [showGallery, setShowGallery] = useState(false);

<AchievementsGallery
  open={showGallery}
  onOpenChange={setShowGallery}
/>
```

---

## 📊 Mock Data

All components use mock data from `/src/lib/mockAchievementsData.ts`.

### Achievement Structure

```tsx
interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'attendance' | 'streaks' | 'social' | 'competition' | 'milestones' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;           // Emoji
  requirement: number;    // Number needed to unlock
  points: number;         // XP awarded
}
```

### Achievement Categories

1. **Attendance** - Session participation (10, 25, 50, 100, 250)
2. **Streaks** - Consecutive training days (7, 14, 30, 60, 100)
3. **Social** - Referrals and helping others (3, 5, 10 referrals)
4. **Competition** - Tournament participation and medals
5. **Milestones** - Membership duration and belt ranks
6. **Special** - Unique achievements (perfect month, early bird, etc.)

### Rarity System

- **Common** (Gray) - 50-100 XP
- **Rare** (Blue) - 150-250 XP
- **Epic** (Purple) - 300-600 XP
- **Legendary** (Gold) - 750-1500 XP

### User Stats

```tsx
interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  rank: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master' | 'Grand Master';
  streakFreezeAvailable: boolean;
  totalPoints: number;
}
```

### Goal Structure

```tsx
interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'attendance' | 'belt' | 'technique' | 'competition' | 'streak';
  targetValue: number;
  currentValue: number;
  deadline?: Date;
  completed: boolean;
  completedAt?: Date;
}
```

---

## 🎨 Animations & Effects

### Confetti Animation
- Triggers when new achievements are unlocked
- 20 particles with random trajectories
- Auto-dismisses after 3 seconds

### Flame Animation
- Scales based on streak length
- Pulsing glow effect
- Changes color (red → yellow → orange → purple)

### Streak Calendar
- Staggered entrance animation
- Hover tooltips with dates
- Fire emoji on attended days
- Ring highlight for today

### Goal Completion
- Full-screen celebration overlay
- Trophy emoji with rotation
- Confetti particles burst
- +100 XP badge animation
- Auto-dismisses after 3 seconds

### Achievement Cards
- Hover scale and lift effect
- Shimmer effect on hover (unlocked only)
- Locked achievements are grayscale with blur
- Click for detailed popup view

---

## 🔧 Integration

### Quick Start (All Components)

```tsx
import GamificationDemo from '@/components/dashboard/GamificationDemo';

function Dashboard() {
  return (
    <div className="container py-6">
      <GamificationDemo />
    </div>
  );
}
```

### Custom Layout

```tsx
import { useState } from 'react';
import AchievementsCard from '@/components/dashboard/AchievementsCard';
import TrainingStreak from '@/components/dashboard/TrainingStreak';
import GoalsTracker from '@/components/dashboard/GoalsTracker';
import AchievementsGallery from '@/components/dashboard/AchievementsGallery';

function Dashboard() {
  const [showGallery, setShowGallery] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Row: Achievements & Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AchievementsCard onViewAll={() => setShowGallery(true)} />
        <TrainingStreak />
      </div>

      {/* Bottom Row: Goals */}
      <GoalsTracker />

      {/* Gallery Modal */}
      <AchievementsGallery
        open={showGallery}
        onOpenChange={setShowGallery}
      />
    </div>
  );
}
```

---

## 🔄 Replacing Mock Data with Real Data

When integrating with Convex (or your real backend):

1. **Replace imports in components:**
   ```tsx
   // Before
   import { achievements, userAchievements } from '@/lib/mockAchievementsData';

   // After
   import { useQuery } from 'convex/react';
   import { api } from '@/convex/_generated/api';

   const achievements = useQuery(api.achievements.list);
   const userAchievements = useQuery(api.achievements.getUserAchievements);
   ```

2. **Create Convex schemas:**
   ```typescript
   // convex/schema.ts
   achievements: defineTable({
     name: v.string(),
     description: v.string(),
     category: v.union(
       v.literal('attendance'),
       v.literal('streaks'),
       v.literal('social'),
       v.literal('competition'),
       v.literal('milestones'),
       v.literal('special')
     ),
     rarity: v.union(
       v.literal('common'),
       v.literal('rare'),
       v.literal('epic'),
       v.literal('legendary')
     ),
     icon: v.string(),
     requirement: v.number(),
     points: v.number(),
   }),

   userAchievements: defineTable({
     userId: v.id('users'),
     achievementId: v.id('achievements'),
     unlockedAt: v.number(),
     progress: v.number(),
     isNew: v.optional(v.boolean()),
   }),

   goals: defineTable({
     userId: v.id('users'),
     title: v.string(),
     description: v.string(),
     type: v.union(
       v.literal('attendance'),
       v.literal('belt'),
       v.literal('technique'),
       v.literal('competition'),
       v.literal('streak')
     ),
     targetValue: v.number(),
     currentValue: v.number(),
     deadline: v.optional(v.number()),
     completed: v.boolean(),
     completedAt: v.optional(v.number()),
   }),

   userStats: defineTable({
     userId: v.id('users'),
     currentStreak: v.number(),
     longestStreak: v.number(),
     totalSessions: v.number(),
     level: v.number(),
     xp: v.number(),
     rank: v.string(),
     streakFreezeAvailable: v.boolean(),
     lastStreakFreezeUsed: v.optional(v.number()),
     totalPoints: v.number(),
   }),
   ```

3. **Update component logic:**
   - Add loading states
   - Add error handling
   - Add mutations for creating/updating goals
   - Add mutations for unlocking achievements
   - Add real-time subscriptions for updates

---

## 🎨 Customization

### Colors

Rarity colors are defined in `mockAchievementsData.ts`:

```tsx
export const rarityColors: Record<AchievementRarity, { bg: string; text: string; border: string }> = {
  common: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-300 dark:border-gray-600',
  },
  // ... modify as needed
};
```

### Achievement Icons

Icons use emojis by default. To use custom SVGs or icon libraries:

```tsx
// In Achievement type
icon: string;  // Change to ReactNode or string path

// In component
<div className="text-5xl">{achievement.icon}</div>
// Change to
<img src={achievement.icon} alt="" />
// or
{achievement.icon}  // if ReactNode
```

### Animations

All animations use Framer Motion. Customize in component files:

```tsx
// Example: Slower confetti
<motion.div
  animate={{ ... }}
  transition={{
    duration: 3,  // Change from 2 to 3
    delay: i * 0.1,  // Change timing
  }}
/>
```

---

## 📱 Responsive Design

All components are fully responsive:

- **Mobile** (< 640px): Single column, stacked cards
- **Tablet** (640px - 1024px): 2 columns for some layouts
- **Desktop** (> 1024px): Full grid layouts

Responsive classes used:
- `grid-cols-1 lg:grid-cols-2`
- `sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`
- `flex-col sm:flex-row`

---

## ♿ Accessibility

- All interactive elements are keyboard navigable
- ARIA labels on icon-only buttons
- Focus indicators on all interactive elements
- Semantic HTML structure
- Screen reader friendly
- Color contrast meets WCAG AA standards

---

## 🚀 Future Enhancements

Potential improvements for production:

1. **Sound Effects**
   - Achievement unlock sound
   - Goal completion fanfare
   - Streak milestone sound
   - Toggle to mute/unmute

2. **Social Features**
   - Share to social media
   - Leaderboards
   - Compare with friends
   - Achievement showcases on profile

3. **Advanced Gamification**
   - Daily challenges
   - Weekly quests
   - Seasonal events
   - Limited-time achievements

4. **Analytics**
   - Achievement completion rates
   - Average time to unlock
   - Popular goals
   - Streak distribution

5. **Notifications**
   - Near milestone reminders
   - Streak freeze expiry warnings
   - New achievement unlocked toasts
   - Goal deadline reminders

---

## 📝 Notes

- All components are production-ready
- TypeScript for type safety
- Optimized animations (hardware-accelerated)
- Dark mode compatible
- Uses existing UI components from shadcn/ui
- Mock data will be replaced with Convex queries later
- Toast notifications use Sonner library

---

## 🐛 Troubleshooting

**Achievements not showing:**
- Check that `userAchievements` data is loaded
- Verify achievement IDs match between definitions and user data

**Animations laggy:**
- Reduce number of confetti particles
- Use `will-change` CSS property sparingly
- Check for excessive re-renders

**Gallery not opening:**
- Ensure Dialog component from shadcn/ui is installed
- Check that `open` state is properly managed
- Verify z-index layering

---

## 📄 License

Part of JUDO Club App - University of London at Birkbeck

---

**Created:** January 2026
**Version:** 1.0.0
