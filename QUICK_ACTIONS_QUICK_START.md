# Quick Actions System - Quick Start Guide

**🚀 Get started in 5 minutes**

---

## Installation

Already installed! Dependencies included:
```bash
✅ canvas-confetti
✅ @types/canvas-confetti
```

---

## Basic Usage

### 1. Quick Actions Bar

```tsx
import { QuickActionsBar } from "@/components/dashboard";

<QuickActionsBar
  actions={[
    {
      id: "check-in",
      label: "Check In",
      icon: <QrCode />,
      onClick: () => handleCheckIn(),
      shortcut: "C",
      badge: 3
    }
  ]}
  sticky={true}
/>
```

### 2. Widgets

```tsx
import {
  StreakWidget,
  GoalWidget,
  EventWidget
} from "@/components/dashboard/widgets";

// Streak
<StreakWidget currentStreak={7} longestStreak={14} />

// Goal
<GoalWidget
  goal={{
    title: "Train 3 times",
    progress: 2,
    target: 3,
    unit: "sessions"
  }}
/>

// Event
<EventWidget
  event={{
    title: "Seminar",
    date: new Date(),
    type: "seminar"
  }}
/>
```

### 3. Confetti

```tsx
import { achievementConfetti, streakConfetti } from "@/lib/confetti";

// Achievement
achievementConfetti();

// Streak
streakConfetti(7);

// Belt promotion
beltPromotionConfetti("yellow");
```

### 4. Customization

```tsx
import { CustomizeDashboard, useDashboardPreferences } from "@/components/dashboard";

const { preferences, updatePreferences } = useDashboardPreferences();

<CustomizeDashboard
  open={show}
  onOpenChange={setShow}
  preferences={preferences}
  onSave={updatePreferences}
/>
```

### 5. Tour

```tsx
import { DashboardTour, useDashboardTour } from "@/components/dashboard";

const { showTour, completeTour, skipTour } = useDashboardTour();

<DashboardTour
  steps={tourSteps}
  open={showTour}
  onComplete={completeTour}
  onSkip={skipTour}
/>
```

### 6. Help Widget

```tsx
import { HelpWidget } from "@/components/dashboard";

<HelpWidget
  onStartTour={startTour}
  onContactSupport={handleSupport}
/>
```

---

## Complete Example

```tsx
import {
  QuickActionsBar,
  CustomizeDashboard,
  DashboardTour,
  HelpWidget,
  useDashboardPreferences,
  useDashboardTour
} from "@/components/dashboard";

import { StreakWidget, GoalWidget } from "@/components/dashboard/widgets";
import { achievementConfetti } from "@/lib/confetti";

export function MyDashboard() {
  const { preferences, updatePreferences } = useDashboardPreferences();
  const { showTour, completeTour, skipTour } = useDashboardTour();
  const [showCustomize, setShowCustomize] = useState(false);

  return (
    <div>
      {/* Quick Actions */}
      <QuickActionsBar actions={myActions} sticky />

      {/* Widgets */}
      <div className="grid gap-6 md:grid-cols-2">
        <StreakWidget currentStreak={7} longestStreak={14} />
        <GoalWidget goal={myGoal} />
      </div>

      {/* Interactive Features */}
      <CustomizeDashboard
        open={showCustomize}
        onOpenChange={setShowCustomize}
        preferences={preferences}
        onSave={updatePreferences}
      />

      <DashboardTour
        steps={tourSteps}
        open={showTour}
        onComplete={completeTour}
        onSkip={skipTour}
      />

      <HelpWidget />
    </div>
  );
}
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| C | Check In |
| B | Book Class |
| S | Schedule |
| G | Goals |
| P | Profile |
| ? | Help |

---

## All Widgets

1. **StreakWidget** - Training streak
2. **GoalWidget** - Goal progress
3. **EventWidget** - Upcoming events
4. **PartnerWidget** - Training partners
5. **AchievementWidget** - Achievements
6. **TipWidget** - Daily tips
7. **QuoteWidget** - Motivational quotes
8. **WeatherWidget** - Weather info

---

## All Confetti Functions

- `celebrate()` - Basic
- `achievementConfetti()` - Achievement
- `streakConfetti(days)` - Streak
- `beltPromotionConfetti(color)` - Belt
- `goalConfetti()` - Goal
- `bookingConfetti()` - Booking

---

## File Locations

```
/src/components/dashboard/
  - QuickActionsBar.tsx
  - CustomizeDashboard.tsx
  - DashboardTour.tsx
  - HelpWidget.tsx
  - SuccessAnimation.tsx
  - DashboardSkeleton.tsx
  - DashboardExample.tsx ← FULL DEMO
  - widgets/
    - All 8 widgets

/src/lib/
  - confetti.ts
```

---

## Documentation

- **Full Docs:** `/src/components/dashboard/README.md`
- **Demo:** `/src/components/dashboard/DashboardExample.tsx`
- **Summary:** `/QUICK_ACTIONS_SUMMARY.md`
- **Quick Start:** `/QUICK_ACTIONS_QUICK_START.md` (this file)

---

## Need Help?

1. Check `DashboardExample.tsx` for complete working example
2. Read `README.md` for detailed documentation
3. Use Help Widget in the app (bottom-right corner)

---

**Ready to use!** 🚀
